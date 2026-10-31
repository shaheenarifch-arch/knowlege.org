import Link from "next/link";
import { notFound } from "next/navigation";
import { surahs, getSurah, ATTRIBUTION } from "../../../lib/surahs";
import { SurahReader } from "../../../components/SurahReader";

export function generateStaticParams() { return surahs.map(s => ({ surah: String(s.n) })); }

type Props = { params: Promise<{ surah: string }> };
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://knowlege.org";

export async function generateMetadata({ params }: Props) {
  const s = getSurah((await params).surah);
  if (!s) return {};
  const title = `Surah ${s.name} (${s.meaning}) · Qur'an ${s.n}`;
  const description = `Read Surah ${s.name} (${s.meaning}), surah ${s.n} of the Qur'an: ${s.verses} verses, ${s.type}. Uthmani Arabic with Pickthall's English translation, verse by verse.`;
  return {
    title, description, alternates: { canonical: `/quran/${s.n}` },
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default async function Page({ params }: Props) {
  const s = getSurah((await params).surah);
  if (!s) notFound();
  const prev = getSurah(s.n - 1), next = getSurah(s.n + 1);
  const url = `${SITE}/quran/${s.n}`;
  const schema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE },
    { "@type": "ListItem", position: 2, name: "Qur'an", item: `${SITE}/quran` },
    { "@type": "ListItem", position: 3, name: `Surah ${s.name}`, item: url }] };
  const pager = <nav className="pager" aria-label="Surah navigation">
    {prev ? <Link className="btn" href={`/quran/${prev.n}`}>← {prev.n}. {prev.name}</Link> : <span />}
    <Link className="btn" href="/quran">All surahs</Link>
    {next ? <Link className="btn" href={`/quran/${next.n}`}>{next.n}. {next.name} →</Link> : <span />}
  </nav>;
  return <main className="shell page reader">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> › <Link href="/quran">Qur'an</Link> › <span>Surah {s.name}</span></nav>
    <span className="tag">Surah {s.n} · {s.verses} verses · {s.type}</span>
    <h1>{s.name}</h1>
    <p className="lead">{s.meaning}</p>
    <div className="notice">{ATTRIBUTION}. Shown exactly as the source returns it; a translation conveys meaning only.</div>
    <p className="help">
      Each verse shows the Arabic first, then the English. Tap a verse number to get a link to that verse, or "Read on Quran.com"
      to compare other translations and listen to recitation. <Link href="/research">Search the Qur'an</Link> ·{" "}
      <Link href="/about#sources">How we use sources</Link>
    </p>
    {pager}
    <section className="section"><SurahReader surah={s.n} /></section>
    {pager}
  </main>;
}
