import { NextResponse } from "next/server";
import { z } from "zod";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Subscribers are stored in Cloudflare D1 (binding "NEWSLETTER_DB" in wrangler.jsonc).
// Table: database/d1-newsletter.sql. Help: https://developers.cloudflare.com/d1/
type D1Like = { prepare(q: string): { bind(...v: unknown[]): { run(): Promise<unknown> } } };

const Schema = z.object({
  email: z.string().email(),
  language: z.string().min(2).max(10),
  consent: z.literal("yes"),
});

// A normal form post gets sent back to /newsletter with a status message;
// a fetch() asking for JSON still gets JSON.
function reply(req: Request, status: "ok" | "invalid" | "error", code: number, body: object) {
  if ((req.headers.get("accept") || "").includes("application/json")) {
    return NextResponse.json(body, { status: code });
  }
  return NextResponse.redirect(new URL(`/newsletter?status=${status}`, req.url), 303);
}

export async function POST(req: Request) {
  const f = await req.formData();
  const parsed = Schema.safeParse({
    email: f.get("email"),
    language: f.get("language") ?? "en",
    consent: f.get("consent"),
  });
  if (!parsed.success) return reply(req, "invalid", 400, { error: "INVALID_SUBSCRIPTION" });

  try {
    const { env } = await getCloudflareContext({ async: true });
    const dbBinding = (env as unknown as { NEWSLETTER_DB?: D1Like }).NEWSLETTER_DB;
    if (!dbBinding) throw new Error("NEWSLETTER_DB_NOT_BOUND");
    await dbBinding
      .prepare(
        `INSERT INTO subscribers (id,email,language,consent_at,created_at)
         VALUES (?1,?2,?3,datetime('now'),datetime('now'))
         ON CONFLICT(email) DO UPDATE SET language=excluded.language, unsubscribed_at=NULL`
      )
      .bind(crypto.randomUUID(), parsed.data.email.toLowerCase(), parsed.data.language)
      .run();
    if (process.env.NEWSLETTER_WEBHOOK_URL)
      await fetch(process.env.NEWSLETTER_WEBHOOK_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ event: "subscriber.created", ...parsed.data }),
      });
    return reply(req, "ok", 200, { ok: true, message: "Thank you — you're subscribed to the Knowlege Letter." });
  } catch (e) {
    console.error("newsletter subscribe failed", e);
    return reply(req, "error", 500, { error: "SUBSCRIBE_FAILED" });
  }
}
