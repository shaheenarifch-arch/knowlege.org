import Link from "next/link";
import { getByCode, guestDb, STATUS_LABEL, type GuestStatus } from "../../../lib/guest-posts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Guest Post Status", description: "Check the review status of your Knowlege.org guest post with your tracking code.", robots: { index: false } };

const ORDER: GuestStatus[] = ["SUBMITTED", "IN_REVIEW", "CHANGES_REQUESTED", "PUBLISHED"];

export default async function Page({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const code = ((await searchParams).code ?? "").trim().toUpperCase();
  let post = null, failed = false;
  if (code) { try { post = await getByCode(await guestDb(), code); } catch (e) { console.error(e); failed = true; } }
  const st = post ? (post.status === "RESUBMITTED" ? "IN_REVIEW" : post.status) : null;
  const reached = st ? ORDER.indexOf(st as GuestStatus) : -1;

  return <main className="shell page gp">
    <p className="crumbs"><Link href="/write-for-us">Write for us</Link> / Status</p>
    <h1>Check your article</h1>
    <p className="lead">Enter the tracking code from your email (it looks like KG-7F3K9Q).</p>
    <form className="gp-lookup" method="get"><input className="input" name="code" defaultValue={code} placeholder="KG-XXXXXX" required aria-label="Tracking code" /><button className="btn primary">Check</button></form>

    {failed && <p className="gp-error" role="alert">We couldn&apos;t check right now. Please try again in a few minutes.</p>}
    {code && !failed && !post && <p className="gp-error" role="alert">No article found with code {code}. Check the code in your email, or <Link href="/contact">contact us</Link>.</p>}
    {post && <section className="section gp-status">
      <h2>{post.title}</h2>
      <p className="meta">Sent {post.created_at.slice(0, 10)} · last update {post.updated_at.slice(0, 10)}</p>
      {post.status !== "DECLINED" && <ol className="gp-track">{ORDER.map((s, i) => <li key={s} className={i < reached ? "done" : i === reached ? "now" : ""}>{STATUS_LABEL[s].label}</li>)}</ol>}
      <div className="notice"><strong>{STATUS_LABEL[post.status].label}.</strong> {STATUS_LABEL[post.status].help}</div>
      {post.editor_note && (post.status === "CHANGES_REQUESTED" || post.status === "DECLINED") && <div className="gp-note"><strong>Editor&apos;s note</strong><p>{post.editor_note}</p></div>}
      {post.status === "CHANGES_REQUESTED" && <p className="help">To make the changes, open the <strong>Edit and resubmit</strong> link in the email we sent to you. It&apos;s private, so it isn&apos;t shown here.</p>}
      {post.status === "PUBLISHED" && post.slug && <p><Link className="btn primary" href={`/blog/guest/${post.slug}`}>Read it live</Link></p>}
    </section>}
    <p className="help">Questions? See the <Link href="/write-for-us#faq">guest post FAQ</Link> or <Link href="/contact">contact us</Link>.</p>
  </main>;
}
