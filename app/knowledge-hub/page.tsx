import Link from "next/link";
import { topics, getGuide } from "../../lib/library";
import { KAABAH, NABAWI } from "../../lib/mosques";
import { Photo } from "../../components/Photo";
import { MosqueGallery } from "../../components/MosqueGallery";
import { HijriCalendar } from "../../components/HijriCalendar";
import { HolySites } from "../../components/HolySites";

export const metadata = {
  title: "Knowledge Hub: Islamic Guides with Sources",
  description: "Clear guides to Islamic practice — purity, prayer, fasting, zakah, marriage and more — showing what the four schools agree on, with every point linked to the Qur'an and hadith. Plus a Hijri calendar.",
  alternates: { canonical: "/knowledge-hub" },
  openGraph: { title: "Knowledge Hub | Knowlege.org", images: [{ url: KAABAH.src, width: KAABAH.width, height: KAABAH.height, alt: KAABAH.alt }] },
  twitter: { card: "summary_large_image", images: [KAABAH.src] },
};

export default function Page() {
  return <main className="shell page">
    <span className="tag">Knowledge Hub</span>
    <h1>Knowledge Hub</h1>
    <p className="lead">Islamic practice explained topic by topic. Each guide starts with what the Hanafi, Maliki, Shafi'i and Hanbali schools agree on, then shows where they differ, with every point linked to the Qur'an or hadith it comes from.</p>

    <section className="holy" aria-label="The Two Holy Mosques">
      <div><Photo photo={KAABAH} priority /><p className="cap"><strong>The Ka'bah, Masjid al-Haram, Makkah</strong> — the qiblah every Muslim faces in prayer.</p></div>
      <div><Photo photo={NABAWI} priority /><p className="cap"><strong>Masjid an-Nabawi, Madinah</strong> — the Prophet's Mosque ﷺ.</p></div>
    </section>

    <div className="notice" style={{ marginTop: 28 }}>
      These guides are for learning, not personal rulings (fatwas). For your own situation, ask a qualified scholar.{" "}
      <Link href="/help" style={{ textDecoration: "underline" }}>How to find local help</Link> · <Link href="/about#sources" style={{ textDecoration: "underline" }}>How we use sources</Link>
    </div>

    <section className="section" id="topics">
      <h2>Topics</h2>
      <p className="lead">Guides marked "Coming soon" are being written and reviewed.</p>
      <div className="grid">
        {topics.map(t => getGuide(t.slug)
          ? <Link className="card" key={t.slug} href={`/knowledge-hub/${t.slug}`}><span className="tag">Guide</span><h3>{t.title}</h3><p>{t.blurb}</p></Link>
          : <div className="card soon" key={t.slug} aria-disabled="true"><span className="tag">Coming soon</span><h3>{t.title}</h3><p>{t.blurb}</p></div>)}
      </div>
    </section>

    <section className="section">
      <h2>How to read these guides</h2>
      <div className="grid">
        <div className="card"><h3>Agreed first</h3><p>The main text covers what all four Sunni schools hold — the points you can rely on whichever school you follow.</p></div>
        <div className="card"><h3>Differences in detail</h3><p>Where the schools differ, a side-by-side table under "More detail and references" shows each position.</p></div>
        <div className="card"><h3>Check every source</h3><p>Each reference opens the verse on <a href="https://quran.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Quran.com</a> or the hadith on <a href="https://sunnah.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Sunnah.com</a>, with the Arabic.</p></div>
      </div>
    </section>

    <section className="section" id="holy-sites">
      <h2>Holy sites and ziyarat</h2>
      <p className="lead">The Ka'bah, Hajr-e-Aswad, Maqam-e-Ibrahim, Zamzam, Roza-e-Rasool ﷺ, the resting places of the Sahabah, the caves of Thawr and Hira, and Al-Aqsa. <Link href="/holy-sites" style={{ textDecoration: "underline" }}>Open Holy Sites by city</Link></p>
      <HolySites />
    </section>

    <section className="section" id="calendar">
      <h2>Islamic and Gregorian calendar</h2>
      <p className="lead">Today's date in both calendars, with the key days of the Islamic year. <Link href="/islamic-calendar" style={{ textDecoration: "underline" }}>Open the full calendar</Link></p>
      <HijriCalendar />
    </section>

    <section className="section" id="mosques">
      <h2>Great mosques of the world</h2>
      <p className="lead">The two holy mosques and other great mosques across the Muslim world.</p>
      <MosqueGallery />
    </section>
  </main>;
}
