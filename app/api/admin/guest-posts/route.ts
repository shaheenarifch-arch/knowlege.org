import { NextResponse } from "next/server";
import { guestDb, getById, isEditor, logEvent, slugify } from "../../../../lib/guest-posts";
import { mailDecision } from "../../../../lib/guest-mail";

/** Editor actions from /admin/guest-posts: start review, approve and publish, request changes, decline. */
export async function POST(req: Request) {
  if (!(await isEditor(req.headers))) return new NextResponse("Editors only. Sign in through Cloudflare Access.", { status: 403 });
  const f = await req.formData();
  const id = String(f.get("id") ?? ""), action = String(f.get("action") ?? ""), note = String(f.get("note") ?? "").trim().slice(0, 3000);
  const back = (msg: string) => NextResponse.redirect(new URL(`/admin/guest-posts?id=${encodeURIComponent(id)}&msg=${encodeURIComponent(msg)}`, req.url), 303);

  const db = await guestDb();
  const p = await getById(db, id);
  if (!p) return back("Article not found.");

  if (action === "review") {
    await db.prepare("UPDATE guest_posts SET status='IN_REVIEW',updated_at=datetime('now') WHERE id=?1").bind(id).run();
  } else if (action === "publish") {
    let slug = slugify(p.title);
    if (await db.prepare("SELECT 1 FROM guest_posts WHERE slug=?1 AND id<>?2").bind(slug, id).first()) slug = `${slug}-${p.code.slice(3).toLowerCase()}`;
    await db.prepare("UPDATE guest_posts SET status='PUBLISHED',slug=?2,editor_note=NULL,published_at=datetime('now'),updated_at=datetime('now') WHERE id=?1").bind(id, slug).run();
  } else if (action === "changes" || action === "decline") {
    if (action === "changes" && note.length < 5) return back("Please write a note telling the writer what to change.");
    await db.prepare("UPDATE guest_posts SET status=?2,editor_note=?3,updated_at=datetime('now') WHERE id=?1")
      .bind(id, action === "changes" ? "CHANGES_REQUESTED" : "DECLINED", note || null).run();
  } else if (action === "unpublish") {
    await db.prepare("UPDATE guest_posts SET status='IN_REVIEW',updated_at=datetime('now') WHERE id=?1").bind(id).run();
    await logEvent(db, id, "UNPUBLISHED", note || null);
    return back("Taken off the blog and moved back to In review. The writer was not emailed.");
  } else return back("Unknown action.");

  const updated = (await getById(db, id))!;
  await logEvent(db, id, updated.status, note || null);
  const sent = await mailDecision(updated);
  return back(`Saved: ${updated.status.replace("_", " ").toLowerCase()}.${sent ? " The writer has been emailed." : " Email not sent (check RESEND_API_KEY)."}`);
}
