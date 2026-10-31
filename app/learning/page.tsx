import Link from "next/link";
import { guides, getGuide } from "../../lib/library";

export const metadata = {
  title: "Start Learning: A Guide to Studying Islam on Knowlege.org",
  description: "Where to begin: learning paths through the Qur'an, hadith, sourced guides to Islamic practice, themes, weekly reflections, scholar profiles and the Islamic calendar, plus a beginner's path through the five pillars.",
  alternates: { canonical: "/learning" },
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://knowlege.org";

const paths: Array<{ href: string; tag: string; title: string; text: string }> = [
  { href: "/quran", tag: "Read", title: "The Qur'an", text: "Start with the source itself. Every guide on this site points back to the verses it relies on." },
  { href: "/research", tag: "Search", title: "Research Desk", text: "Search the Qur'an and the six major hadith collections for a word or topic, with the exact reference for every result." },
  { href: "/hadith", tag: "Browse", title: "Hadith Library", text: "Look up hadith by collection, book, chapter and number." },
  { href: "/knowledge-hub", tag: "Practice", title: "Knowledge Hub", text: "Guides to worship and daily life that show what the four schools agree on first, then where they differ." },
  { href: "/themes", tag: "Explore", title: "Themes", text: "Follow ideas such as mercy, justice, patience and gratitude across the Qur'an and Sunnah." },
  { href: "/blog", tag: "Weekly", title: "Reflections", text: "One Qur'anic theme each week, with the verses and hadith behind it cited and linked." },
  { href: "/scholars", tag: "History", title: "Scholars", text: "Short profiles of the four imams of law and the six great hadith compilers." },
  { href: "/islamic-calendar", tag: "Calendar", title: "Islamic calendar", text: "Today's Hijri date, the months of the Islamic year and its key days." },
];

/** The five pillars, linked to a live guide where one exists. */
const pillars: Array<{ name: string; text: string; slug?: string; fallback: { href: string; label: string } }> = [
  { name: "Shahadah: the declaration of faith", text: "Bearing witness that there is no god but God and that Muhammad ﷺ is His messenger. It is the foundation of the other four.", slug: "creed", fallback: { href: "/themes", label: "Explore the themes of faith" } },
  { name: "Salah: the five daily prayers", text: "Prayer at set times through the day, preceded by ritual purity (wudu).", slug: "salah", fallback: { href: "/knowledge-hub", label: "Knowledge Hub" } },
  { name: "Zakah: the yearly alms", text: "A set share of qualifying wealth given each year to those in need.", slug: "zakah", fallback: { href: "/knowledge-hub", label: "Knowledge Hub" } },
  { name: "Sawm: fasting in Ramadan", text: "Fasting from dawn to sunset through the month of Ramadan.", slug: "fasting", fallback: { href: "/islamic-calendar", label: "See when Ramadan falls" } },
  { name: "Hajj: the pilgrimage to Makkah", text: "The pilgrimage, once in a lifetime for those who are able to make it.", slug: "hajj-umrah", fallback: { href: "/holy-sites", label: "See the holy sites of Makkah and Madinah" } },
];

export default function Page() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Start learning", url: `${SITE}/learning`,
    hasPart: paths.map(p => ({ "@type": "WebPage", name: p.title, url: `${SITE}${p.href}` })) };
  return <main className="shell page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <span className="tag">Start learning</span>
    <h1>Start learning</h1>
    <p className="lead">Knowlege.org is built so you can always check where something comes from. Begin with whichever path fits you: read the Qur'an, look up a hadith, learn how a part of worship is done, or meet the scholars who preserved this knowledge. Each section links to the next, so you can follow your questions wherever they lead.</p>

    <section className="section" id="beginners">
      <h2>New to Islam? Start here</h2>
      <p className="lead">Islam is often described through five pillars: the core acts of faith and worship that every Muslim shares. Read them in order, and open each guide when you are ready for the detail.</p>
      <div className="grid">
        {pillars.map((p, i) => {
          const g = p.slug ? getGuide(p.slug) : undefined;
          return <div className="card" key={p.name}>
            <span className="tag">Pillar {i + 1}</span>
            <h3>{p.name}</h3>
            <p>{p.text}</p>
            <p className="help">{g
              ? <Link href={`/knowledge-hub/${g.slug}`}>Read the guide: {g.title}</Link>
              : <>Full guide coming soon. Meanwhile: <Link href={p.fallback.href}>{p.fallback.label}</Link></>}</p>
          </div>;
        })}
      </div>
      <p className="help">Tip: prayer depends on purity, so read the <Link href="/knowledge-hub/purity">purity (wudu and ghusl) guide</Link> alongside the prayer guide. If you have just embraced Islam or are thinking about it, a local mosque or imam can help you learn in person; see <Link href="/help">how to find local help</Link>.</p>
    </section>

    <section className="section" id="paths">
      <h2>Learning paths</h2>
      <p className="lead">Every section of the site that is open today.</p>
      <div className="grid">{paths.map(p => <Link className="card" key={p.href} href={p.href}><span className="tag">{p.tag}</span><h3>{p.title}</h3><p>{p.text}</p></Link>)}</div>
    </section>

    <section className="section" id="guides">
      <h2>Knowledge Hub guides</h2>
      <p className="lead">Our published guides. Each starts with what the Hanafi, Maliki, Shafi'i and Hanbali schools agree on and links every point to its source.</p>
      <div className="grid">{guides.map(g => <Link className="card" key={g.slug} href={`/knowledge-hub/${g.slug}`}><span className="tag">Guide</span><h3>{g.title}</h3><p>{g.summary}</p></Link>)}</div>
      <p className="help">More topics are being written and reviewed. <Link href="/knowledge-hub#topics">See all Knowledge Hub topics</Link>.</p>
    </section>

    <div className="notice">Knowlege.org is for learning. It does not give personal religious rulings (fatwas). For your own situation, ask a qualified scholar or your local imam. <Link href="/about#sources" style={{ textDecoration: "underline" }}>How we use sources</Link></div>
  </main>;
}
