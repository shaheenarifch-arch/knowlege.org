import Link from "next/link";
import { HijriCalendar } from "../../components/HijriCalendar";
import { Photo } from "../../components/Photo";
import { mosques } from "../../lib/mosques";

export const metadata = {
  title: "Islamic Calendar: Hijri and Gregorian Dates",
  description: "Today's Hijri date beside the Gregorian date, a month view in both calendars, and upcoming key days: Ramadan, Eid al-Fitr, Day of Arafah, Eid al-Adha, Islamic New Year and Ashura.",
  alternates: { canonical: "/islamic-calendar" },
};

const MONTHS: Array<[string, string]> = [
  ["Muharram", "First month; one of the four sacred months [Q 9:36]. The 10th is the Day of Ashura."],
  ["Safar", "Second month."],
  ["Rabi' al-Awwal", "Third month; the month of the Prophet's ﷺ birth and his migration to Madinah, by most accounts."],
  ["Rabi' al-Thani", "Fourth month."],
  ["Jumada al-Ula", "Fifth month."],
  ["Jumada al-Akhirah", "Sixth month."],
  ["Rajab", "Seventh month; a sacred month."],
  ["Sha'ban", "Eighth month; the Prophet ﷺ fasted much of it."],
  ["Ramadan", "Ninth month; the month of fasting and of the Qur'an's revelation [Q 2:185]."],
  ["Shawwal", "Tenth month; begins with Eid al-Fitr."],
  ["Dhu al-Qa'dah", "Eleventh month; a sacred month."],
  ["Dhu al-Hijjah", "Twelfth month; a sacred month of Hajj, the Day of Arafah and Eid al-Adha."],
];


// Real, licensed photos for the tall side columns (minarets of the Prophet's Mosque, Madinah).
const W = "https://upload.wikimedia.org/wikipedia/commons/thumb/";
const MINARETS = [
  { src: `${W}8/89/Prophet%E2%80%99s_Mosque_Minaret_2021.jpg/960px-Prophet%E2%80%99s_Mosque_Minaret_2021.jpg`,
    alt: "Ornate minaret of the Prophet's Mosque in Madinah against a blue sky with white clouds",
    author: "Saleh Al Hussain", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Prophet%E2%80%99s_Mosque_Minaret_2021.jpg" },
  { src: `${W}7/77/Minaret_on_Haram_in_Madinah.JPG/960px-Minaret_on_Haram_in_Madinah.JPG`,
    alt: "Minaret of the Prophet's Mosque in Madinah with the sun glowing behind it",
    author: "Ammar777", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Minaret_on_Haram_in_Madinah.JPG" },
];

export default function Page() {
  const haram = mosques[0];
  const minaret = (m: typeof MINARETS[number], side: string) => <aside className={`minaret ${side}`} aria-hidden="true">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={m.src} alt="" width={960} height={1280} loading="lazy" referrerPolicy="no-referrer" />
  </aside>;
  return <div className="calframe">{minaret(MINARETS[0], "left")}<main className="shell page">
    <span className="tag">Calendar</span>
    <h1>Islamic Calendar</h1>
    <p className="lead">The Hijri calendar is lunar: each month begins with the new crescent moon, so the Islamic year is about 11 days shorter than the Gregorian year and its dates move through the seasons. It counts from the Prophet's ﷺ migration (Hijrah) to Madinah in 622 CE.</p>
    <section className="section"><HijriCalendar /></section>
    <section className="section">
      <h2>The twelve Islamic months</h2>
      <ol className="months">{MONTHS.map(([n, d]) => <li key={n}><strong>{n}</strong> — {d.replace(/\s*\[[^\]]+\]/g, "")}</li>)}</ol>
      <p className="meta">Sources: <a href="https://quran.com/9/36" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Qur'an 9:36</a> (twelve months, four sacred), <a href="https://quran.com/2/185" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Qur'an 2:185</a> (Ramadan), <a href="https://quran.com/2/189" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Qur'an 2:189</a> (new moons as markers of time). <Link href="/knowledge-hub" style={{ textDecoration: "underline" }}>Knowledge Hub</Link></p>
    </section>
    <Photo photo={haram.photo} />
    <p className="meta mcredit">Minaret photos (side columns), both of the Prophet's Mosque in Madinah: {MINARETS.map((m, i) => <span key={m.sourceUrl}>{i > 0 && "; "}{m.author}, <a href={m.licenseUrl} target="_blank" rel="noopener noreferrer">{m.license}</a>, via <a href={m.sourceUrl} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a></span>)}.</p>
  </main>{minaret(MINARETS[1], "right")}</div>;
}
