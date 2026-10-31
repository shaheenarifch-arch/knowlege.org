import Link from "next/link";
import { references, plain, AUTHOR, REVIEWER, LAST_REVIEWED, DISCLAIMER, type Guide } from "../lib/library";
import { Cited } from "./Cited";
import { Photo } from "./Photo";
import { mosqueFor } from "../lib/mosques";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://knowlege.org";
const SCHOOLS = [["hanafi", "Hanafi"], ["maliki", "Maliki"], ["shafii", "Shafi'i"], ["hanbali", "Hanbali"]] as const;

export interface Crumb { name: string; path: string }
export interface CardLink { href: string; title: string; blurb: string }

/**
 * Shared layout for Knowledge Hub guides: topic pages (/knowledge-hub/[topic])
 * and sub-guides (/knowledge-hub/[topic]/[sub]) render through this component.
 */
export function GuideView({ g, path, crumbs, mosqueSlug, inTopic, parent, siblings, related }: {
  g: Guide;
  path: string;                                  // e.g. /knowledge-hub/salah/jumuah
  crumbs: Crumb[];                               // between "Knowledge Hub" and this page
  mosqueSlug: string;
  inTopic?: { title: string; items: CardLink[] }; // topic page: its sub-guides
  parent?: { title: string; href: string };      // sub page: parent topic
  siblings?: CardLink[];                         // sub page: other sub-guides of the topic
  related?: CardLink[];
}) {
  const refs = references(g);
  const url = `${SITE}${path}`;
  const trail = [{ name: "Home", item: SITE }, { name: "Knowledge Hub", item: `${SITE}/knowledge-hub` },
    ...crumbs.map(c => ({ name: c.name, item: `${SITE}${c.path}` })), { name: g.title, item: url }];
  const schema = [
    { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.summary, image: g.photo.src, url,
      author: { "@type": "Organization", name: AUTHOR, url: `${SITE}/about` }, publisher: { "@type": "Organization", name: "Knowlege.org", url: SITE },
      dateModified: LAST_REVIEWED, citation: refs.map(r => r.url) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: g.faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: t.item })) },
  ];
  const m = mosqueFor(mosqueSlug);
  return <main className="shell page guide">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> › <Link href="/knowledge-hub">Knowledge Hub</Link> › {crumbs.map(c => <span key={c.path}><Link href={c.path}>{c.name}</Link> › </span>)}<span>{g.title}</span></nav>
    <span className="tag">Knowledge Hub guide</span>
    <h1>{g.title}</h1>
    <p className="lead">{g.summary}</p>
    {parent && <p className="meta">Part of the <Link href={parent.href} style={{ textDecoration: "underline" }}>{parent.title}</Link> guide.</p>}
    <p className="meta">Written by {AUTHOR} · Reviewed by {REVIEWER} · Last reviewed {new Date(LAST_REVIEWED).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
    <Photo photo={g.photo} priority />

    <nav className="toc" aria-label="On this page">
      <strong>On this page</strong>
      <ol>
        {g.agreed.map((s, i) => <li key={i}><a href={`#s${i}`}>{s.heading}</a></li>)}
        <li><a href="#questions">Common questions</a></li>
        <li><a href="#detail">More detail and references</a></li>
        {inTopic && inTopic.items.length > 0 && <li><a href="#in-this-topic">In this topic</a></li>}
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

    {inTopic && inTopic.items.length > 0 && <section className="section" id="in-this-topic">
      <h2>In this topic</h2>
      <p className="lead">Detailed guides within {inTopic.title}.</p>
      <div className="grid">{inTopic.items.map(t => <Link className="card" key={t.href} href={t.href}><span className="tag">Guide</span><h3>{t.title}</h3><p>{t.blurb}</p></Link>)}</div>
    </section>}

    {siblings && siblings.length > 0 && parent && <section className="section">
      <h2>More in {parent.title}</h2>
      <div className="grid">{siblings.map(t => <Link className="card" key={t.href} href={t.href}><h3>{t.title}</h3><p>{t.blurb}</p></Link>)}</div>
    </section>}

    {m && <section className="section">
      <h2>{m.name}</h2>
      <p className="lead">{m.place} — {m.note.replace(/\s*\[[^\]]+\]/g, "")} <a href="/knowledge-hub#mosques" style={{ textDecoration: "underline" }}>See more great mosques</a></p>
      <Photo photo={m.photo} />
    </section>}

    {related && related.length > 0 && <section className="section">
      <h2>Related guides</h2>
      <div className="grid">{related.map(t => <Link className="card" key={t.href} href={t.href}><h3>{t.title}</h3><p>{t.blurb}</p></Link>)}</div>
    </section>}
    <p>{parent && <><Link href={parent.href}>← Back to {parent.title}</Link> · </>}<Link href="/knowledge-hub">← All Knowledge Hub topics</Link></p>
  </main>;
}
