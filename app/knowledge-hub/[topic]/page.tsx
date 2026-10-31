import Link from "next/link";
import { notFound } from "next/navigation";
import { guides, getGuide, topics, references, plain, AUTHOR, REVIEWER, LAST_REVIEWED, DISCLAIMER } from "../../../lib/library";
import { Cited } from "../../../components/Cited";
import { Photo } from "../../../components/Photo";
import { mosqueFor } from "../../../lib/mosques";

export const dynamicParams = false;
export function generateStaticParams() { return guides.map(g => ({ topic: g.slug })); }

type Props = { params: Promise<{ topic: string }> };
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://knowlege.org";

export async function generateMetadata({ params }: Props) {
  const g = getGuide((await params).topic);
  if (!g) return {};
  return {
    title: g.title, description: g.summary, alternates: { canonical: `/knowledge-hub/${g.slug}` },
    openGraph: { title: g.title, description: g.summary, type: "article", images: [{ url: g.photo.src, width: g.photo.width, height: g.photo.height, alt: g.photo.alt }] },
    twitter: { card: "summary_large_image", title: g.title, description: g.summary, images: [g.photo.src] },
  };
}

const SCHOOLS = [["hanafi", "Hanafi"], ["maliki", "Maliki"], ["shafii", "Shafi'i"], ["hanbali", "Hanbali"]] as const;

export default async function Page({ params }: Props) {
  const g = getGuide((await params).topic);
  if (!g) notFound();
  const refs = references(g);
  const url = `${SITE}/knowledge-hub/${g.slug}`;
  const schema = [
    { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.summary, image: g.photo.src, url,
      author: { "@type": "Organization", name: AUTHOR, url: `${SITE}/about` }, publisher: { "@type": "Organization", name: "Knowlege.org", url: SITE },
      dateModified: LAST_REVIEWED, citation: refs.map(r => r.url) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: g.faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Knowledge Hub", item: `${SITE}/knowledge-hub` },
      { "@type": "ListItem", position: 3, name: g.title, item: url }] },
  ];
  const related = topics.filter(t => t.slug !== g.slug && getGuide(t.slug));
  return <main className="shell page guide">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> › <Link href="/knowledge-hub">Knowledge Hub</Link> › <span>{g.title}</span></nav>
    <span className="tag">Knowledge Hub guide</span>
    <h1>{g.title}</h1>
    <p className="lead">{g.summary}</p>
    <p className="meta">Written by {AUTHOR} · Reviewed by {REVIEWER} · Last reviewed {new Date(LAST_REVIEWED).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
    <Photo photo={g.photo} priority />

    <nav className="toc" aria-label="On this page">
      <strong>On this page</strong>
      <ol>
        {g.agreed.map((s, i) => <li key={i}><a href={`#s${i}`}>{s.heading}</a></li>)}
        <li><a href="#questions">Common questions</a></li>
        <li><a href="#detail">More detail and references</a></li>
      </ol>
    </nav>

    <div className="notice agreed-note">The sections below cover what the Hanafi, Maliki, Shafi'i and Hanbali schools <strong>agree on</strong>. Where they differ, see <a href="#detail">More detail and references</a>.</div>

    <article>
      {g.agreed.map((s, i) => <section className="section prose" id={`s${i}`} key={i}>
        <h2>{s.heading}</h2>
        {s.paragraphs.map((t, j) => <p key={j}><Cited text={t} /></p>)}
        {s.points && <ul>{s.points.map((t, j) => <li key={j}><Cited text={t} /></li>)}</ul>}
      </section>)}

      <section className="section prose" id="questions">
        <h2>Common questions</h2>
        {g.faqs.map((f, i) => <details className="faq" key={i} open={i === 0}>
          <summary>{f.q}</summary>
          <p><Cited text={f.a} /></p>
        </details>)}
      </section>

      <section className="section" id="detail">
        <h2>More detail and references</h2>
        <p className="lead">Where the four schools differ. These are the relied-upon positions of each school; scholars within a school sometimes hold other views, so follow your teacher or local scholar.</p>
        <div className="tablewrap">
          <table className="schools">
            <thead><tr><th scope="col">Question</th>{SCHOOLS.map(([, n]) => <th scope="col" key={n}>{n}</th>)}</tr></thead>
            <tbody>{g.schools.map((s, i) => <tr key={i}><th scope="row">{s.question}</th>{SCHOOLS.map(([k, n]) => <td key={k} data-school={n}><Cited text={s[k]} /></td>)}</tr>)}</tbody>
          </table>
        </div>

        <h3 id="references">References</h3>
        <p className="lead">Every verse and hadith cited on this page. Each link opens the source with its Arabic text.</p>
        <ol className="refs">{refs.map(r => <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.label}</a></li>)}</ol>

        <h3>Further reading</h3>
        <ul className="refs">{g.furtherReading.map(f => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer">{f.name}</a></li>)}</ul>
      </section>
    </article>

    <div className="notice">{DISCLAIMER} <Link href="/contact" style={{ textDecoration: "underline" }}>Report an error</Link></div>

    {(() => { const m = mosqueFor(g.slug); return m && <section className="section">
      <h2>{m.name}</h2>
      <p className="lead">{m.place} — {m.note.replace(/\s*\[[^\]]+\]/g, "")} <a href="/knowledge-hub#mosques" style={{ textDecoration: "underline" }}>See more great mosques</a></p>
      <Photo photo={m.photo} />
    </section>; })()}

    {related.length > 0 && <section className="section">
      <h2>Related guides</h2>
      <div className="grid">{related.map(t => <Link className="card" key={t.slug} href={`/knowledge-hub/${t.slug}`}><h3>{t.title}</h3><p>{t.blurb}</p></Link>)}</div>
    </section>}
    <p><Link href="/knowledge-hub">← All Knowledge Hub topics</Link></p>
  </main>;
}
