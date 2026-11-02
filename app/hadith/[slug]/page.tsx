import Link from "next/link";
import { notFound } from "next/navigation";
import { HADITH_CARDS, getHadithCard } from "../../../lib/hadith-cards";
import { HadithText } from "../../../components/HadithText";

export function generateStaticParams() { return HADITH_CARDS.map(h => ({ slug: h.slug })); }
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const h = getHadithCard((await params).slug);
  if (!h) return {};
  const title = `${h.title} (Sahih al-Bukhari ${h.n})`;
  return { title, description: h.summary, alternates: { canonical: `/hadith/${h.slug}` }, openGraph: { title, description: h.summary, type: "article", url: `/hadith/${h.slug}` } };
}

export default async function Page({ params }: Props) {
  const h = getHadithCard((await params).slug);
  if (!h) notFound();
  const i = HADITH_CARDS.indexOf(h);
  const prev = HADITH_CARDS[i - 1], next = HADITH_CARDS[i + 1];
  return <main className="shell page hdetail">
    <p className="help"><Link href="/hadith">← Hadith Library</Link></p>
    <span className="tag">Sahih al-Bukhari {h.n} · Well-known hadith {i + 1} of {HADITH_CARDS.length}</span>
    <h1>{h.title}</h1>
    <p className="lead">{h.summary}</p>
    <dl className="facts">
      <div><dt>Collection</dt><dd>Sahih al-Bukhari</dd></div>
      <div><dt>Number</dt><dd>{h.n}</dd></div>
      <div><dt>Narrated by</dt><dd>{h.narrator}</dd></div>
      <div><dt>Grade</dt><dd>Sahih (authentic): every hadith in al-Bukhari's Sahih</dd></div>
    </dl>
    <section className="section">
      <h2>The text</h2>
      <HadithText n={h.n} />
      <p><a className="btn" href={`https://sunnah.com/bukhari:${h.n}`} target="_blank" rel="noopener noreferrer">Check it on Sunnah.com ↗</a></p>
    </section>
    <section className="section">
      <h2>Why it matters</h2>
      <p className="lead">{h.matters}</p>
      <div className="notice">This summary is for learning, not a religious ruling (fatwa). For how a hadith applies to your situation, ask a qualified scholar.</div>
      <p className="help">
        {h.related && <><Link href={h.related.href}>{h.related.label}</Link> · </>}
        <Link href="/research?source=bukhari#desk">Search Sahih al-Bukhari on the Research Desk</Link> · <Link href="/about#sources">How we use sources</Link>
      </p>
    </section>
    <nav className="hpager" aria-label="More well-known hadith">
      {prev ? <Link className="btn" href={`/hadith/${prev.slug}`}>← {prev.title}</Link> : <span />}
      {next ? <Link className="btn" href={`/hadith/${next.slug}`}>{next.title} →</Link> : <Link className="btn" href="/hadith">Back to all 12 →</Link>}
    </nav>
  </main>;
}
