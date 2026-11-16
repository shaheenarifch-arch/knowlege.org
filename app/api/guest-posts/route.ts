import { NextResponse } from "next/server";
import { ArticleSchema, guestDb, getById, logEvent, newCode, newToken, setting } from "../../../lib/guest-posts";
import { mailEditorNew, mailReceived } from "../../../lib/guest-mail";

/** New guest post from /write-for-us. Saves it, then emails the writer and the editor. */
export async function POST(req: Request) {
  const data = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!data) return NextResponse.json({ error: "Please fill in the form and try again." }, { status: 400 });
  if (data.website) return NextResponse.json({ ok: true, code: "KG-THANKS" }); // honeypot: bots fill the hidden field

  if (!(await turnstileOk(String(data.turnstile ?? ""), req)))
    return NextResponse.json({ error: "Please complete the \"I'm not a robot\" check and try again." }, { status: 400 });

  const parsed = ArticleSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check the form." }, { status: 400 });
  const a = parsed.data;

  try {
    const db = await guestDb();
    const recent = await db.prepare("SELECT COUNT(*) AS n FROM guest_posts WHERE email=?1 AND created_at > datetime('now','-1 day')").bind(a.email.toLowerCase()).first<{ n: number }>();
    if ((recent?.n ?? 0) >= 3) return NextResponse.json({ error: "You have sent 3 articles in the last day. Please wait before sending another." }, { status: 429 });

    const id = crypto.randomUUID(), code = newCode();
    await db.prepare(`INSERT INTO guest_posts (id,code,edit_token,status,name,email,bio,title,topic,summary,body,refs)
      VALUES (?1,?2,?3,'SUBMITTED',?4,?5,?6,?7,?8,?9,?10,?11)`)
      .bind(id, code, newToken(), a.name, a.email.toLowerCase(), a.bio, a.title, a.topic, a.summary, a.body, a.refs).run();
    await logEvent(db, id, "SUBMITTED");
    const post = (await getById(db, id))!;
    await Promise.all([mailReceived(post), mailEditorNew(post)]);
    return NextResponse.json({ ok: true, code });
  } catch (e) {
    console.error("guest post submit failed", e);
    return NextResponse.json({ error: "Sorry, we couldn't save your article just now. Please try again in a few minutes, or email it to us from the Contact page." }, { status: 503 });
  }
}

/** Cloudflare Turnstile check. Skipped when TURNSTILE_SECRET_KEY is not set. Help: https://developers.cloudflare.com/turnstile/get-started/ */
async function turnstileOk(token: string, req: Request) {
  const secret = await setting("TURNSTILE_SECRET_KEY");
  if (!secret) return true;
  if (!token) return false;
  const body = new FormData();
  body.append("secret", secret); body.append("response", token);
  const ip = req.headers.get("cf-connecting-ip"); if (ip) body.append("remoteip", ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body }).then(x => x.json() as Promise<{ success: boolean }>).catch(() => ({ success: false }));
  return r.success;
}
