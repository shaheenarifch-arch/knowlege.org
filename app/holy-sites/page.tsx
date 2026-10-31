import Link from "next/link";
import { HolySites } from "../../components/HolySites";
import { KAABAH } from "../../lib/mosques";
import { ZIYARAT_NOTE } from "../../lib/holysites";

export const metadata = {
  title: "Holy Sites and Ziyarat: Makkah, Madinah and Al-Aqsa",
  description: "The Ka'bah, Hajr-e-Aswad, Maqam-e-Ibrahim, Zamzam, Masjid an-Nabawi, Roza-e-Rasool ﷺ, Jannat al-Baqi', Uhud, Ghar-e-Thawr, Ghar-e-Hira and Al-Aqsa — with their history from the Qur'an and Sunnah.",
  alternates: { canonical: "/holy-sites" },
  openGraph: { images: [{ url: KAABAH.src, width: KAABAH.width, height: KAABAH.height, alt: KAABAH.alt }] },
};

export default function Page() {
  return <main className="shell page">
    <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> › <Link href="/knowledge-hub">Knowledge Hub</Link> › <span>Holy Sites</span></nav>
    <span className="tag">Holy sites and ziyarat</span>
    <h1>Holy Sites of Islam</h1>
    <p className="lead">The sacred places of Makkah, Madinah and Jerusalem, and the sites of ziyarat linked to the Prophet ﷺ and his companions. Each entry links to the verse or hadith behind it.</p>
    <section className="section"><h2>Makkah</h2><HolySites city="Makkah" /></section>
    <section className="section"><h2>Madinah</h2><HolySites city="Madinah" /></section>
    <section className="section"><h2>Jerusalem</h2><HolySites city="Jerusalem" /></section>
    <p className="meta">{ZIYARAT_NOTE}</p>
    <p><Link href="/knowledge-hub">← Knowledge Hub</Link> · <Link href="/islamic-calendar">Islamic calendar</Link></p>
  </main>;
}
