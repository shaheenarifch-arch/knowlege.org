import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost, cite, anchor } from "../../../lib/posts";

export const dynamicParams = false;
export function generateStaticParams() { return posts.map(p => ({ slug: p.slug })); }

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const p = getPost((await params).slug);
  return p ? { title: `${p.title} | KNOWLEGE.ORG`, description: p.summary } : {};
}

export default async function Page({ params }: Props) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const label = (id: string) => id.startsWith("Q ") ? `Qur'an ${id.slice(2)}` : (() => { const [, c, n] = id.split(" "); const h = p.hadiths.find(x => x.id === id); return `${h?.book ?? c} ${n}`; })();
  return <main className="shell page">
    <span className="tag">{p.theme}</span>
    <h1>{p.title}</h1>
    <p className="lead">{p.summary}</p>
    <p><small>{new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</small></p>
    <article className="section">
      {p.sections.map((s, i) => <div key={i}>
        {s.heading && <h2>{s.heading}</h2>}
        {s.paragraphs.map((t, j) => <p key={j}>{cite(t).map((x, k) => typeof x === "string" ? x : <a key={k} href={`#${anchor(x.id)}`}>[{label(x.id)}]</a>)}</p>)}
      </div>)}
    </article>
    <section className="section">
      <h2>Qur'an verses</h2>
      <div className="grid">{p.ayahs.map(a => <div className="card" id={anchor(a.id)} key={a.id}>
        <h3>Surah {a.surah} ({a.surahNumber}:{a.ayah})</h3>
        <p dir="rtl" lang="ar" style={{ fontSize: "1.4em", lineHeight: 1.9 }}>{a.arabic}</p>
        <p>{a.english}</p>
        <p><small>Translation: {p.translation}. <a href={a.url} target="_blank" rel="noopener noreferrer">Read on quran.com</a></small></p>
      </div>)}</div>
    </section>
    {p.hadiths.length > 0 && <section className="section">
      <h2>Hadith</h2>
      <div className="grid">{p.hadiths.map(h => <div className="card" id={anchor(h.id)} key={h.id}>
        <h3>{h.book} {h.number}</h3>
        {h.section && <p><small>{h.section}</small></p>}
        {h.arabic && <p dir="rtl" lang="ar" style={{ fontSize: "1.25em", lineHeight: 1.9 }}>{h.arabic}</p>}
        <p>{h.english}</p>
        {h.grades.length > 0 && <p><small>Grading: {h.grades.map(g => `${g.grade} (${g.name})`).join("; ")}</small></p>}
        <p><small><a href={h.source} target="_blank" rel="noopener noreferrer">Source record</a> · {p.hadithSource}</small></p>
      </div>)}</div>
    </section>}
    <div className="notice">{p.disclaimer}</div>
    <p><Link href="/blog">← All reflections</Link></p>
  </main>;
}
