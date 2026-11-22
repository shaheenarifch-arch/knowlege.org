import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost, cite, anchor } from "../../../lib/posts";
import { Photo } from "../../../components/Photo";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://knowlege.org";

export function generateStaticParams() { return posts.map(p => ({ slug: p.slug })); }

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const p = getPost((await params).slug);
  if (!p) return {};
  // Editorial guides with a photo also get a canonical URL and a share image.
  return { title: `${p.title} | KNOWLEGE.ORG`, description: p.summary,
    ...(p.photo ? { alternates: { canonical: `/blog/${p.slug}` }, openGraph: { title: p.title, description: p.summary, type: "article", images: [p.photo.src] } } : {}) };
}

export default async function Page({ params }: Props) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const label = (id: string) => id.startsWith("Q ") ? `Qur'an ${id.slice(2)}` : (() => { const [, c, n] = id.split(" "); const h = p.hadiths.find(x => x.id === id); return `${h?.book ?? c} ${n}`; })();
  const url = `${SITE}/blog/${p.slug}`;
  const schema = p.faqs?.length ? [
    { "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.summary, url, datePublished: p.date, image: p.photo?.src,
      author: { "@type": "Organization", name: p.byline ?? "Knowlege.org Editorial", url: `${SITE}/about` }, publisher: { "@type": "Organization", name: "Knowlege.org", url: SITE } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ name: "Home", item: SITE }, { name: "Blog", item: `${SITE}/blog` }, { name: p.title, item: url }].map((t, i) => ({ "@type": "ListItem", position: i + 1, ...t })) },
  ] : null;
  const text = (t: string) => cite(t).map((x, k) => typeof x === "string" ? x : <a key={k} href={`#${anchor(x.id)}`}>[{label(x.id)}]</a>);
  return <main className="shell page">
    {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
    <span className="tag">{p.theme}</span>
    <h1>{p.title}</h1>
    <p className="lead">{p.summary}</p>
    <p><small>{p.byline && <>By {p.byline} · </>}{new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</small></p>
    {p.photo && <Photo photo={p.photo} priority />}
    <article className={p.faqs?.length ? "section prose" : "section"}>
      {p.sections.map((s, i) => <div key={i}>
        {s.heading && <h2>{s.heading}</h2>}
        {s.photo && <Photo photo={s.photo} />}
        {s.paragraphs.map((t, j) => <p key={j}>{text(t)}</p>)}
        {s.points && <ul>{s.points.map((t, j) => <li key={j}>{text(t)}</li>)}</ul>}
        {s.links && <ul aria-label="Go to">{s.links.map(l => <li key={l.href}><Link href={l.href}>{l.label} →</Link></li>)}</ul>}
      </div>)}
      {p.faqs && p.faqs.length > 0 && <div id="questions">
        <h2>Common questions</h2>
        {p.faqs.map((f, i) => <details className="faq" key={i} open={i === 0}><summary>{f.q}</summary><p>{text(f.a)}</p></details>)}
      </div>}
    </article>
    <section className="section">
      <h2>Qur'an verses</h2>
      <div className="grid">{p.ayahs.map(a => <div className="card" id={anchor(a.id)} key={a.id}>
        <h3>Surah {a.surah} ({a.surahNumber}:{a.ayah})</h3>
        <p dir="rtl" lang="ar" style={{ fontSize: "1.4em", lineHeight: 1.9 }}>{a.arabic}</p>
        <p>{a.english}</p>
        <p><small>Translation: {p.translation}. <a className="stretch" href={a.url} target="_blank" rel="noopener noreferrer">Read on quran.com</a></small></p>
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
        <p><small><a className="stretch" href={h.source} target="_blank" rel="noopener noreferrer">Source record</a> · {p.hadithSource}</small></p>
      </div>)}</div>
    </section>}
    <div className="notice">{p.disclaimer}</div>
    <p><Link href="/blog">← All reflections</Link></p>
  </main>;
}
