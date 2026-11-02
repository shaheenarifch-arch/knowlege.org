import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "../../../lib/db";

/** Questions and feedback from the New to Islam "Path to Success" (/new-to-islam). */
const Schema = z.object({
  kind: z.enum(["question", "final"]),
  step: z.string().regex(/^[a-z-]{2,40}$/),
  message: z.string().max(3000).optional().default(""),
  helped: z.string().max(2000).optional().default(""),
  unclear: z.string().max(2000).optional().default(""),
  rating: z.number().int().min(1).max(5).optional(),
  wantsMentor: z.boolean().optional().default(false),
  location: z.string().max(200).optional().default(""),
  email: z.union([z.string().email().max(200), z.literal("")]).optional().default(""),
  completed: z.number().int().min(0).max(20).optional(),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});

let ready = false;
async function ensureTable(sql: ReturnType<typeof db>) {
  if (ready) return;
  await sql`CREATE TABLE IF NOT EXISTS path_feedback(id UUID PRIMARY KEY,kind TEXT NOT NULL,step TEXT NOT NULL,message TEXT,helped TEXT,unclear TEXT,rating INT,wants_mentor BOOLEAN DEFAULT false,location TEXT,email TEXT,completed INT,status TEXT DEFAULT 'NEW',created_at TIMESTAMPTZ DEFAULT now())`;
  ready = true;
}

export async function POST(req: Request) {
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "INVALID_FEEDBACK" }, { status: 400 });
  const d = parsed.data;
  if (d.kind === "question" && d.message.trim().length < 3) return NextResponse.json({ error: "EMPTY_MESSAGE" }, { status: 400 });
  try {
    const sql = db();
    await ensureTable(sql);
    await sql`INSERT INTO path_feedback (id,kind,step,message,helped,unclear,rating,wants_mentor,location,email,completed)
      VALUES (gen_random_uuid(),${d.kind},${d.step},${d.message},${d.helped},${d.unclear},${d.rating ?? null},${d.wantsMentor},${d.location},${d.email.toLowerCase()},${d.completed ?? null})`;
    if (process.env.FEEDBACK_WEBHOOK_URL) {
      await fetch(process.env.FEEDBACK_WEBHOOK_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ event: "path.feedback", ...d, website: undefined }) }).catch(() => undefined);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    // The page falls back to a pre-filled email when this fails.
    return NextResponse.json({ error: e instanceof Error ? e.message : "FEEDBACK_FAILED" }, { status: 503 });
  }
}
