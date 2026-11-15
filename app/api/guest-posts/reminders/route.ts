import { NextResponse } from "next/server";
import { guestDb, setting, type GuestPost } from "../../../../lib/guest-posts";
import { mailEditorReminder } from "../../../../lib/guest-mail";

/** Daily reminder to the editor about articles waiting more than 3 days.
 *  Called by .github/workflows/guest-post-reminders.yml with the GUEST_POST_CRON_SECRET header. */
export async function POST(req: Request) {
  const secret = await setting("GUEST_POST_CRON_SECRET");
  if (!secret || req.headers.get("x-cron-secret") !== secret) return new NextResponse("Forbidden", { status: 403 });
  const db = await guestDb();
  const waiting = (await db.prepare(`SELECT * FROM guest_posts WHERE status IN ('SUBMITTED','IN_REVIEW','RESUBMITTED')
    AND updated_at < datetime('now','-3 days') AND (last_reminded_at IS NULL OR last_reminded_at < datetime('now','-1 day'))
    ORDER BY updated_at`).all<GuestPost>()).results;
  if (waiting.length) {
    await mailEditorReminder(waiting);
    for (const p of waiting) await db.prepare("UPDATE guest_posts SET last_reminded_at=datetime('now') WHERE id=?1").bind(p.id).run();
  }
  return NextResponse.json({ ok: true, reminded: waiting.length });
}
