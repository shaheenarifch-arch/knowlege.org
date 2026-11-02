import Link from "next/link";
import { RamadanTimetable } from "../../components/RamadanTimetable";
import { Photo } from "../../components/Photo";
import { mosques } from "../../lib/mosques";

export const metadata = {
  title: "Ramadan 2027: Sehri and Iftar Times for Your City",
  description: "Ramadan 1448 (2027) sehri and iftar timetable for Boston, New York, London, Lahore, Karachi, Makkah and any city, with calendar reminders, printable PDF, du'as and key dates.",
  alternates: { canonical: "/ramadan" },
};

const DUAS: Array<{ title: string; ar: string; tr: string; en: string; ref: string; url: string }> = [
  { title: "When breaking the fast", ar: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
    tr: "Dhahaba al-zama'u wabtallatil-'uruqu wa thabatal-ajru in sha' Allah", en: "The thirst has gone, the veins are moist, and the reward is assured, if Allah wills.",
    ref: "Sunan Abi Dawud 2357", url: "https://sunnah.com/abudawud:2357" },
  { title: "In the last ten nights (Laylat al-Qadr)", ar: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    tr: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni", en: "O Allah, You are Pardoning and love to pardon, so pardon me.",
    ref: "Jami' at-Tirmidhi 3513", url: "https://sunnah.com/tirmidhi:3513" },
];

export default function Page() {
  const dusk = mosques.find(m => m.name === "Hassan II Mosque") ?? mosques[0];
  return <main className="shell page ramadan">
    <span className="tag">Ramadan 1448 · 2027</span>
    <h1>Ramadan 2027: Sehri and Iftar Times</h1>
    <p className="lead">Ramadan 1448 is expected to begin on Monday 8 February 2027 and end around 9 March 2027, depending on the sighting of the moon. Find the full month's sehri (pre-dawn meal) and iftar (breaking the fast) times for your city, then add them to your phone's calendar or print them.</p>
    <Photo photo={dusk.photo} priority />

    <section className="section" id="timetable" aria-labelledby="tt-h">
      <h2 id="tt-h">Your Ramadan timetable</h2>
      <p className="lead">Tap a city or type your own. Boston is shown first.</p>
      <RamadanTimetable />
    </section>

    <section className="section" aria-labelledby="dates-h">
      <h2 id="dates-h">Key dates (expected)</h2>
      <dl className="facts">
        <div><dt>First fast</dt><dd>Monday 8 February 2027 (1 Ramadan 1448)</dd></div>
        <div><dt>Last ten nights</dt><dd>From about 27 February 2027; Laylat al-Qadr is sought in the odd nights</dd></div>
        <div><dt>Eid al-Fitr</dt><dd>Around Tuesday 9 March 2027 (1 Shawwal 1448)</dd></div>
        <div><dt>Zakat al-Fitr</dt><dd>Paid before the Eid prayer</dd></div>
      </dl>
      <p className="help">Dates follow the Umm al-Qura calculation and may move by a day with local moon sighting. See the <Link href="/islamic-calendar">Islamic Calendar</Link> for the full month view.</p>
    </section>

    <section className="section" aria-labelledby="dua-h">
      <h2 id="dua-h">Du'as for Ramadan</h2>
      <p className="lead">The intention (niyyah) to fast is made in the heart; no special words are required for sehri.</p>
      <div className="grid">{DUAS.map(d => <div className="card rdua" key={d.title}>
        <span className="tag">{d.title}</span>
        <p className="ar" lang="ar" dir="rtl">{d.ar}</p>
        <p><em>{d.tr}</em></p>
        <p>{d.en}</p>
        <p className="help"><a href={d.url} target="_blank" rel="noopener noreferrer">{d.ref} on Sunnah.com ↗</a></p>
      </div>)}</div>
    </section>

    <section className="section" aria-labelledby="more-h">
      <h2 id="more-h">Prepare for Ramadan</h2>
      <div className="grid">
        <div className="card"><h3><Link className="stretch" href="/knowledge-hub/fasting">Fasting (Sawm) guide</Link></h3><p>Who must fast, what breaks the fast, and making up missed days, with the four schools' views.</p></div>
        <div className="card"><h3><Link className="stretch" href="/research#tools">Zakah calculator</Link></h3><p>Many people pay zakah in Ramadan. Work out what you owe in a minute.</p></div>
        <div className="card"><h3><Link className="stretch" href="/quran">Read the Qur'an</Link></h3><p>Ramadan is the month the Qur'an was revealed. Read all 114 surahs with Arabic and English.</p></div>
        <div className="card"><h3><Link className="stretch" href="/charity">Charity</Link></h3><p>Give sadaqah and Zakat al-Fitr through trusted organisations.</p></div>
      </div>
      <div className="notice" style={{ marginTop: 18 }}>This page is for planning and learning, not a religious ruling (fatwa). If you are ill, travelling, pregnant or nursing, ask a qualified scholar about your situation.</div>
    </section>
  </main>;
}
