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

export default function Page() {
  const haram = mosques[0];
  return <main className="shell page">
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
  </main>;
}
