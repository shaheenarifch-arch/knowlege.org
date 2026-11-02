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
    <span className="tag">{surahs.length} surahs · {TOTAL_VERSES.toLocaleString("en-US")} verses</span>
    <h1>Read the Qur'an</h1>
    <p className="lead">Choose a surah to read its Arabic text with an English translation, verse by verse. Every verse links to Quran.com so you can check it at the source.</p>
    <div className="notice">{ATTRIBUTION}. The text is loaded from the source each time and shown exactly as published. A translation conveys meaning only; it is not the Qur'an itself.</div>
    <p className="help">
      How to use: pick a surah below, then scroll through its verses. Use the verse number to share a link to one verse.
      Looking for a word or theme? <Link href="/research">Search the Qur'an</Link>. About this text: <Link href="/about#sources">How we use sources</Link>.
      Meccan and Medinan labels follow the common Tanzil listing; scholars differ on a few surahs.
    </p>
    <dl className="slegend" aria-label="How to read a surah card">
      <div><dt><span className="snum" aria-hidden="true">١</span></dt><dd>Surah number in Arabic numerals (1–114) <span lang="ar" dir="rtl">رقم السورة</span></dd></div>
      <div><dt><span className="schip mk">مكية · Meccan</span></dt><dd>Revealed in Makkah, before the Hijrah <span lang="ar" dir="rtl">نزلت في مكة قبل الهجرة</span></dd></div>
      <div><dt><span className="schip md">مدنية · Medinan</span></dt><dd>Revealed in Madinah, after the Hijrah <span lang="ar" dir="rtl">نزلت في المدينة بعد الهجرة</span></dd></div>
    </dl>
    <section className="section">
      <ol className="grid surahs" aria-label="All surahs">
        {surahs.map(s => {
          const ar = (x: number) => x.toLocaleString("ar-EG");
          const mk = s.type === "Meccan";
          return <li key={s.n}><Link className={`card scard ${mk ? "mk" : "md"}`} href={`/quran/${s.n}`}
            aria-label={`Surah ${s.n}, ${s.name}, ${s.meaning}: ${s.verses} verses, ${s.type}`}>
            <div className="stop">
              <span className="snum" title={`Surah number ${s.n}`}>{ar(s.n)}</span>
              <span className="sar" lang="ar" dir="rtl">سورة {s.ar}</span>
            </div>
            <h3>{s.n}. {s.name}</h3>
            <p className="smean">{s.meaning}</p>
            <div className="schips">
              <span className={`schip ${mk ? "mk" : "md"}`}>{mk ? "مكية" : "مدنية"} · {s.type}</span>
              <span className="schip"><span lang="ar" dir="rtl">عدد الآيات {ar(s.verses)}</span> · {s.verses} verses</span>
            </div>
            <span className="sgo">Read <span lang="ar" dir="rtl">اقرأ</span> →</span>
          </Link></li>;
        })}
      </ol>
    </section>
  </main>;
}
