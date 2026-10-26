import Link from "next/link";
import { posts } from "../../lib/posts";

export const metadata = { title: "Weekly Qur'an reflections | KNOWLEGE.ORG", description: "A weekly reflection on a Qur'anic theme, with verses and hadith from the six major collections, each cited and linked to its source." };

export default function Page() {
  return <main className="shell page">
    <span className="tag">Weekly</span>
    <h1>Qur'an Reflections</h1>
    <p className="lead">One theme each week, drawn from the Qur'an and explained with hadith from the six major collections. Every verse and hadith is shown in full with its reference.</p>
    <div className="notice">These reflections are for learning. They are not religious rulings; for rulings, ask a qualified scholar.</div>
    <section className="section">
      {posts.length === 0 ? <p>The first reflection is on its way.</p> :
        <div className="grid">{posts.map(p => <div className="card" key={p.slug}>
          <span className="tag">{p.theme}</span>
          <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
          <p>{p.summary}</p>
          <p><small>{new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</small></p>
        </div>)}</div>}
    </section>
  </main>;
}
