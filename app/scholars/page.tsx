import Link from "next/link";
import { imams, compilers, type Scholar } from "../../lib/scholars";

export const metadata = {
  title: "Scholar Profiles: The Four Imams and the Six Hadith Compilers",
  description: "Short, sourced profiles of Abu Hanifah, Malik, al-Shafi'i and Ahmad ibn Hanbal, and of al-Bukhari, Muslim, Abu Dawud, al-Tirmidhi, al-Nasa'i and Ibn Majah: dates, teachers, students, major works and why they matter.",
  alternates: { canonical: "/scholars" },
  openGraph: { title: "Scholar Profiles | Knowlege.org", description: "The four imams of Sunni law and the compilers of the six major hadith collections." },
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://knowlege.org";

function Cards({ list }: { list: Scholar[] }) {
  return <div className="grid">{list.map(s => <Link className="card" key={s.slug} href={`/scholars/${s.slug}`}>
    <span className="tag">{Number(s.birthYearCE)}–{Number(s.deathYearCE)} CE</span>
    <h3>{s.name}</h3><p>{s.summary}</p></Link>)}</div>;
}

export default function Page() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Scholar Profiles", url: `${SITE}/scholars`,
    hasPart: [...imams, ...compilers].map(s => ({ "@type": "Person", name: s.name, url: `${SITE}/scholars/${s.slug}` })) };
  return <main className="shell page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <span className="tag">Scholar Profiles</span>
    <h1>Scholar Profiles</h1>
    <p className="lead">Meet the scholars whose work shaped how Sunni Muslims understand Islamic law and the hadith of the Prophet ﷺ. Each profile gives their dates, where they lived, who taught them, who learned from them, what they wrote, and why their work still matters.</p>
    <div className="notice">These are short historical introductions, not religious rulings. Classical sources sometimes disagree on dates, especially birth years; where they do, the profile gives the commonly cited date and says so. Dates on the cards below are approximate CE years. Each profile links to public references for further reading. <Link href="/contact" style={{ textDecoration: "underline" }}>Report an error</Link></div>

    <section className="section" id="imams">
      <h2>The four imams of law</h2>
      <p className="lead">The scholars after whom the Hanafi, Maliki, Shafi'i and Hanbali schools are named. See how the schools agree and differ in the <Link href="/knowledge-hub" style={{ textDecoration: "underline" }}>Knowledge Hub guides</Link>.</p>
      <Cards list={imams} />
    </section>

    <section className="section" id="compilers">
      <h2>The compilers of the six books of hadith</h2>
      <p className="lead">The collections known together as the Six Books (al-Kutub al-Sittah). Search them on the <Link href="/research" style={{ textDecoration: "underline" }}>Research Desk</Link> or browse the <Link href="/hadith" style={{ textDecoration: "underline" }}>Hadith Library</Link>.</p>
      <Cards list={compilers} />
    </section>

    <p className="help">New to these names? The <Link href="/learning">Start learning</Link> page explains where each part of the site fits.</p>
  </main>;
}
