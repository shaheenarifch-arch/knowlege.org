import Link from "next/link";
import { surahs, TOTAL_VERSES, ATTRIBUTION } from "../../lib/surahs";

const title = "Read the Qur'an";
const description = "Read all 114 surahs of the Qur'an free online: Uthmani Arabic text with Marmaduke Pickthall's public-domain English translation, verse by verse.";
export const metadata = {
  title, description, alternates: { canonical: "/quran" },
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary", title, description },
};

export default function Page() {
  return <main className="shell page reader">
    <span className="tag">Free · {surahs.length} surahs · {TOTAL_VERSES.toLocaleString("en-US")} verses</span>
    <h1>Read the Qur'an</h1>
    <p className="lead">Choose a surah to read its Arabic text with an English translation, verse by verse. Every verse links to Quran.com so you can check it at the source.</p>
    <div className="notice">{ATTRIBUTION}. The text is loaded from the source each time and shown exactly as published. A translation conveys meaning only; it is not the Qur'an itself.</div>
    <p className="help">
      How to use: pick a surah below, then scroll through its verses. Use the verse number to share a link to one verse.
      Looking for a word or theme? <Link href="/research">Search the Qur'an</Link>. About this text: <Link href="/about#sources">How we use sources</Link>.
      Meccan and Medinan labels follow the common Tanzil listing; scholars differ on a few surahs.
    </p>
    <section className="section">
      <ol className="grid surahs" aria-label="All surahs">
        {surahs.map(s => <li key={s.n}><Link className="card" href={`/quran/${s.n}`}>
          <span className="tag">{s.n}</span>
          <h3>{s.name}</h3>
          <p>{s.meaning}</p>
          <p className="help">{s.verses} verses · {s.type}</p>
        </Link></li>)}
      </ol>
    </section>
  </main>;
}
