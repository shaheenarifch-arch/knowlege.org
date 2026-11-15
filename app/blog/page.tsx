import Link from "next/link";
import { posts } from "../../lib/posts";
import { getPublished } from "../../lib/guest-posts";

export const dynamic = "force-dynamic"; // guest posts are published from the database

export const metadata = { title: "Weekly Qur'an Reflections", description: "A weekly reflection on a Qur'anic theme, with verses and hadith from the six major collections, each cited and linked to its source." };

export default async function Page() {
  const guests = await getPublished();
  return <main className="shell page">
    <span className="tag">Weekly</span>
    <h1>Qur'an Reflections</h1>
    <p className="lead">One theme each week, drawn from the Qur'an and explained with hadith from the six major collections. Every verse and hadith is shown in full with its reference.</p>
    <div className="notice">These reflections are for learning. They are not religious rulings; for rulings, ask a qualified scholar.</div>
    <section className="section">
      {posts.length === 0 ? <p>The first reflection is on its way.</p> :
        <div className="grid">{posts.map(p => <div className="card" key={p.slug}>
          <span className="tag">{p.theme}</span>
          <h3><Link className="stretch" href={`/blog/${p.slug}`}>{p.title}</Link></h3>
          <p>{p.summary}</p>
          <p><small>{new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</small></p>
        </div>)}</div>}
    </section>
    <section className="section" aria-labelledby="guest-h">
      <h2 id="guest-h">From our guest writers</h2>
      <p className="lead">Articles by readers and students of knowledge, reviewed by our editors. <Link href="/write-for-us">Write for us</Link>.</p>
      {guests.length === 0 ? <p>No guest articles yet. Yours could be the first. <Link href="/write-for-us">See the guidelines</Link>.</p> :
        <div className="grid">{guests.map(g => <div className="card" key={g.id}>
          <span className="tag">{g.topic}</span>
          <h3><Link className="stretch" href={`/blog/guest/${g.slug}`}>{g.title}</Link></h3>
          <p>{g.summary}</p>
          <p><small>By {g.name} · {new Date(g.published_at ?? g.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</small></p>
        </div>)}</div>}
    </section>
  </main>;
}
