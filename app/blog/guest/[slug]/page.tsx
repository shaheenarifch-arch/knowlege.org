import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedBySlug, toBlocks } from "../../../../lib/guest-posts";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const p = await getPublishedBySlug((await params).slug);
  return p ? { title: `${p.title} | KNOWLEGE.ORG`, description: p.summary } : {};
}

export default async function Page({ params }: Props) {
  const p = await getPublishedBySlug((await params).slug);
  if (!p) notFound();
  return <main className="shell page gp">
    <p className="crumbs"><Link href="/blog">Blog</Link> / Guest post</p>
    <span className="tag">{p.topic}</span> <span className="tag">Guest contributor</span>
    <h1>{p.title}</h1>
    <p className="lead">{p.summary}</p>
    <p className="meta">By {p.name} · {new Date(p.published_at ?? p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
    <article className="section prose">{toBlocks(p.body).map((b, i) => b.h ? <h2 key={i}>{b.h}</h2> : <p key={i}>{b.p}</p>)}</article>
    <section className="gp-refs"><h2>References</h2><ul>{p.refs.split(/\n+/).map(r => r.trim()).filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}</ul></section>
    <aside className="gp-author"><strong>About {p.name}</strong><p>{p.bio}</p></aside>
    <div className="notice" style={{ marginTop: 24 }}>Guest articles are for learning and reflect the writer&apos;s understanding. They are not religious rulings; for rulings, ask a qualified scholar. Spotted a wrong reference? <Link href="/contact">Tell us</Link>.</div>
    <p className="help">Have something beneficial to share? <Link href="/write-for-us">Write for Knowlege.org</Link>.</p>
  </main>;
}
