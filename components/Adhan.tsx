import Link from "next/link";

/** The complete call to prayer (adhan), with transliteration and meaning, for the home page. */
const LINES: Array<{ ar: string; tr: string; en: string; times: number; note?: string; falah?: boolean }> = [
  { ar: "اللَّهُ أَكْبَرُ", tr: "Allāhu akbar", en: "God is the Greatest", times: 4 },
  { ar: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ", tr: "Ashhadu an lā ilāha illā-llāh", en: "I bear witness that there is no god but God", times: 2 },
  { ar: "أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ", tr: "Ashhadu anna Muḥammadan rasūlu-llāh", en: "I bear witness that Muhammad is the Messenger of God", times: 2 },
  { ar: "حَيَّ عَلَى الصَّلَاةِ", tr: "Ḥayya ʿala-ṣ-ṣalāh", en: "Come to prayer", times: 2 },
  { ar: "حَيَّ عَلَى الْفَلَاحِ", tr: "Ḥayya ʿala-l-falāḥ", en: "Come to success", times: 2, falah: true },
  { ar: "الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ", tr: "Aṣ-ṣalātu khayrun mina-n-nawm", en: "Prayer is better than sleep", times: 2, note: "Dawn (Fajr) prayer only" },
  { ar: "اللَّهُ أَكْبَرُ", tr: "Allāhu akbar", en: "God is the Greatest", times: 2 },
  { ar: "لَا إِلَٰهَ إِلَّا اللَّهُ", tr: "Lā ilāha illā-llāh", en: "There is no god but God", times: 1 },
];

export function Adhan() {
  return <section className="adhan" aria-labelledby="adhan-h">
    <div className="shell">
      <div className="adhanhead">
        <span className="ar" lang="ar" dir="rtl">الأذان</span>
        <h2 id="adhan-h">The Adhan: the call to prayer</h2>
        <p>Called five times a day from mosques around the world since the time of the Prophet ﷺ, when Bilal ibn Rabah first called it in Madinah (<a href="https://sunnah.com/abudawud:499" target="_blank" rel="noopener noreferrer">Sunan Abi Dawud 499</a>).</p>
      </div>
      <ol className="adhanlines">
        {LINES.map((l, i) => <li key={i} className={l.falah ? "falah" : ""}>
          <span className="times" title={`Said ${l.times === 1 ? "once" : `${l.times} times`}`}>×{l.times}</span>
          <p className="ar" lang="ar" dir="rtl">{l.ar}</p>
          <p className="tr" lang="ar-Latn">{l.tr}</p>
          <p className="en">{l.en}{l.note && <small> · {l.note}</small>}</p>
          {l.falah && <Link className="falahlink" href="/new-to-islam">New to Islam? Walk the Path to Success →</Link>}
        </li>)}
      </ol>
      <p className="hint adhannote">This is the form most widely used today. Some schools say the opening "Allāhu akbar" twice (the Maliki school) or repeat the two testimonies quietly first (the Maliki and Shafi'i schools); all of these are authentic ways. Learn more in our <Link href="/knowledge-hub/salah">prayer guide</Link>.</p>
    </div>
  </section>;
}
