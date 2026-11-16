import Link from "next/link";
import { headers } from "next/headers";
import { getById, guestDb, isEditor, STATUS_LABEL, toBlocks, wordCount, type GuestEvent, type GuestPost } from "../../../lib/guest-posts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Guest Posts: Review", robots: { index: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string; msg?: string; show?: string }> }) {
  if (!(await isEditor(await headers()))) return <main className="shell page"><h1>Editors only</h1>
    <div className="notice">Sign in through Cloudflare Access with an editor email to review guest posts. Setup help is in the README, under &quot;Guest posts&quot;.</div></main>;

  const { id, msg, show = "open" } = await searchParams;
  const db = await guestDb();
  const where = show === "all" ? "" : "WHERE status IN ('SUBMITTED','IN_REVIEW','RESUBMITTED')";
  const list = (await db.prepare(`SELECT * FROM guest_posts ${where} ORDER BY updated_at DESC LIMIT 200`).all<GuestPost>()).results;
  const p = id ? await getById(db, id) : null;
  const events = p ? (await db.prepare("SELECT * FROM guest_post_events WHERE post_id=?1 ORDER BY created_at").bind(p.id).all<GuestEvent>()).results : [];

  return <main className="shell page gp">
    <p className="crumbs"><Link href="/admin">Admin</Link> / Guest posts</p>
    <h1>Guest posts</h1>
    {msg && <p className="notice" role="status">{msg}</p>}
    <p className="help"><Link href="/admin/guest-posts">Waiting for review</Link> · <Link href="/admin/guest-posts?show=all">All articles</Link> · Every action emails the writer automatically (except Unpublish).</p>
    <div className="gp-admin">
      <nav aria-label="Articles"><ul className="gp-list">{list.length === 0 && <li className="help">Nothing waiting. 🎉</li>}
        {list.map(x => <li key={x.id} className={x.id === p?.id ? "on" : ""}><Link href={`/admin/guest-posts?id=${x.id}&show=${show}`}><strong>{x.title}</strong><span>{x.name} · {STATUS_LABEL[x.status].label} · {x.updated_at.slice(0, 10)}</span></Link></li>)}</ul></nav>
      <section>{!p ? <p className="help">Pick an article on the left.</p> : <>
        <span className="tag">{STATUS_LABEL[p.status].label}</span> <span className="tag">{p.topic}</span>
        <h2>{p.title}</h2>
        <p className="meta">{p.code} · {p.name} &lt;<a href={`mailto:${p.email}`}>{p.email}</a>&gt; · {wordCount(p.body)} words · sent {p.created_at.slice(0, 10)}</p>
        <p><em>{p.summary}</em></p>
        <div className="gp-preview prose">{toBlocks(p.body).map((b, i) => b.h ? <h3 key={i}>{b.h}</h3> : <p key={i}>{b.p}</p>)}</div>
        <h3>References</h3><pre className="gp-pre">{p.refs}</pre>
        <h3>Bio</h3><p>{p.bio}</p>
        <form className="gp-actions" method="post" action="/api/admin/guest-posts">
          <input type="hidden" name="id" value={p.id} />
          <label>Note to the writer <span className="help">(required for Request changes; optional reason for Decline)</span><textarea className="input" name="note" rows={4} defaultValue={p.editor_note ?? ""} /></label>
          <div className="gp-btns">
            {(p.status === "SUBMITTED" || p.status === "RESUBMITTED") && <button className="btn" name="action" value="review">Start review</button>}
            {p.status !== "PUBLISHED" && <button className="btn primary" name="action" value="publish">Approve &amp; publish</button>}
            {p.status !== "PUBLISHED" && p.status !== "DECLINED" && <button className="btn" name="action" value="changes">Request changes</button>}
            {p.status !== "PUBLISHED" && p.status !== "DECLINED" && <button className="btn gp-danger" name="action" value="decline">Decline</button>}
            {p.status === "PUBLISHED" && <><Link className="btn" href={`/blog/guest/${p.slug}`}>View live</Link><button className="btn gp-danger" name="action" value="unpublish">Unpublish</button></>}
          </div>
          <p className="help">Check every Qur&apos;an and hadith reference before approving: <a href="https://quran.com" target="_blank" rel="noopener">quran.com</a>, <a href="https://sunnah.com" target="_blank" rel="noopener">sunnah.com</a>. Reply to the writer directly by clicking their email above.</p>
        </form>
        <h3>History</h3><ul className="gp-history">{events.map(e => <li key={e.id}>{e.created_at} · {e.event.replace("_", " ").toLowerCase()}{e.note ? `: ${e.note}` : ""}</li>)}</ul>
      </>}</section>
    </div>
  </main>;
}
