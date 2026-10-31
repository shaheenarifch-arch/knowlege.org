import Link from "next/link";
import { notFound } from "next/navigation";
import { scholars, getScholar } from "../../../lib/scholars";

export function generateStaticParams() { return scholars.map(s => ({ slug: s.slug })); }

type Props = { params: Promise<{ slug: string }> };
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://knowlege.org";

export async function generateMetadata({ params }: Props) {
  const s = getScholar((await params).slug);
  if (!s) return {};
  const title = `${s.name}: Life, Teachers and Works`;
  return {
    title, description: s.summary, alternates: { canonical: `/scholars/${s.slug}` },
    openGraph: { title, description: s.summary, type: "profile" },
    twitter: { card: "summary", title, description: s.summary },
  };
}

export default async function Page({ params }: Props) {
  const s = getScholar((await params).slug);
  if (!s) notFound();
  const url = `${SITE}/scholars/${s.slug}`;
  const schema = [
    { "@context": "https://schema.org", "@type": "Person", name: s.name, alternateName: [s.fullName, s.kunya], url,
      description: s.summary, birthDate: s.birthYearCE, deathDate: s.deathYearCE,
      birthPlace: { "@type": "Place", name: s.birthplace }, deathPlace: { "@type": "Place", name: s.deathplace },
      jobTitle: s.group === "imam" ? "Jurist" : "Hadith scholar",
      sameAs: s.furtherReading.filter(r => !r.url.includes("Kutub_al-Sittah")).slice(0, 2).map(r => r.url) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Scholar Profiles", item: `${SITE}/scholars` },
      { "@type": "ListItem", position: 3, name: s.name, item: url }] },
  ];
  const peers = scholars.filter(p => p.group === s.group && p.slug !== s.slug);
  const facts: Array<[string, string]> = [
    ["Full name", s.fullName], ["Kunya", s.kunya], ["Born", s.born], ["Died", s.died],
    ["Birthplace", s.birthplace], ["Place of death", s.deathplace],
  ];
  return <main className="shell page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> › <Link href="/scholars">Scholar Profiles</Link> › <span>{s.name}</span></nav>
    <span className="tag">{s.group === "imam" ? "Imam of law" : "Hadith compiler"}</span>
    <h1>{s.name}</h1>
    <p className="lead">{s.summary}</p>

    <section className="card" aria-label="Key facts">
      <dl className="facts">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      <p className="help">Dates are Hijri (AH) / Common Era (CE). "Commonly dated" means classical sources differ and the date shown is the one most often cited. A kunya is an honorific name of the form "Abu (father of) ...".</p>
    </section>

    <article>
      <section className="section prose">
        <h2>{s.group === "imam" ? "Contribution to Islamic law" : "Contribution to hadith"}</h2>
        {s.contribution.map((p, i) => <p key={i}>{p}</p>)}
      </section>
      <section className="section prose">
        <h2>Key teachers</h2>
        <ul>{s.teachers.map(t => <li key={t}>{t}</li>)}</ul>
        <h2>Key students</h2>
        <ul>{s.students.map(t => <li key={t}>{t}</li>)}</ul>
      </section>
      <section className="section prose">
        <h2>Major works</h2>
        <ul>{s.works.map(t => <li key={t}>{t}</li>)}</ul>
      </section>
      <section className="section prose">
        <h2>Why they matter</h2>
        {s.whyTheyMatter.map((p, i) => <p key={i}>{p}</p>)}
      </section>
    </article>

    <section className="section">
      <h2>Explore on Knowlege.org</h2>
      <div className="grid">
        {s.group === "compiler" ? <>
          <Link className="card" href="/research"><span className="tag">Search</span><h3>Research Desk</h3><p>Search the Qur'an and the six major hadith collections, with the exact reference for every result.</p></Link>
          <Link className="card" href="/hadith"><span className="tag">Browse</span><h3>Hadith Library</h3><p>Look up hadith by collection, book, chapter and reference number.</p></Link>
        </> : <Link className="card" href="/knowledge-hub"><span className="tag">Guides</span><h3>Knowledge Hub</h3><p>See what the four schools agree on, and where they differ, in sourced guides to prayer, fasting, zakah and more.</p></Link>}
      </div>
    </section>

    <section className="section">
      <h2>Further reading</h2>
      <p className="lead">Public reference articles for a fuller account. External links open in a new tab.</p>
      <ul className="refs">{s.furtherReading.map(r => <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.label}</a></li>)}</ul>
    </section>

    <div className="notice">This profile is a short historical introduction by Knowlege.org Editorial, not a religious ruling. <Link href="/contact" style={{ textDecoration: "underline" }}>Report an error</Link></div>

    <section className="section">
      <h2>{s.group === "imam" ? "The other imams" : "The other compilers"}</h2>
      <div className="grid">{peers.map(p => <Link className="card" key={p.slug} href={`/scholars/${p.slug}`}><h3>{p.name}</h3><p>{p.summary}</p></Link>)}</div>
    </section>
    <p><Link href="/scholars">← All scholar profiles</Link></p>
  </main>;
}
