import { NextResponse } from "next/server";
import { ArticleSchema, guestDb, getByCode, getById, logEvent } from "../../../../lib/guest-posts";
import { mailEditorNew, mailResubmitted } from "../../../../lib/guest-mail";

/** Writer updates an article after "Changes requested", using the private link from their email. */
export async function POST(req: Request) {
  const data = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!data) return NextResponse.json({ error: "Please fill in the form and try again." }, { status: 400 });
  const parsed = ArticleSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check the form." }, { status: 400 });
  const a = parsed.data;

  try {
    const db = await guestDb();
    const p = await getByCode(db, String(data.code ?? ""));
    if (!p || p.edit_token !== String(data.token ?? "")) return NextResponse.json({ error: "This edit link is not valid. Please use the link from your latest email." }, { status: 403 });
    if (p.status !== "CHANGES_REQUESTED") return NextResponse.json({ error: "This article can't be edited right now. Check its status page for details." }, { status: 409 });

    // Email stays the same so notifications keep reaching the writer.
    await db.prepare(`UPDATE guest_posts SET status='RESUBMITTED',name=?2,bio=?3,title=?4,topic=?5,summary=?6,body=?7,refs=?8,updated_at=datetime('now'),last_reminded_at=NULL WHERE id=?1`)
      .bind(p.id, a.name, a.bio, a.title, a.topic, a.summary, a.body, a.refs).run();
    await logEvent(db, p.id, "RESUBMITTED");
    const post = (await getById(db, p.id))!;
    await Promise.all([mailResubmitted(post), mailEditorNew(post, true)]);
    return NextResponse.json({ ok: true, code: p.code });
  } catch (e) {
    console.error("guest post resubmit failed", e);
    return NextResponse.json({ error: "Sorry, we couldn't save your changes just now. Please try again in a few minutes." }, { status: 503 });
  }
}
