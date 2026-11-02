import Link from "next/link";
import { PrayerTimes } from "../../components/PrayerTimes";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://knowlege.org";

export const metadata = {
  title: "Prayer Times Near Me and Qibla Direction",
  description: "Today's Fajr, Dhuhr, Asr, Maghrib and Isha times for your location, the Qibla direction with a live phone compass, and an option to hear the Adhan at each prayer time. Free, private and calculated in your browser.",
  alternates: { canonical: "/prayer-times" },
};

const faqs = [
  { q: "How are prayer times calculated?", a: "Prayer times follow the position of the sun. Dhuhr is just after the sun passes its highest point, Asr is when shadows reach a set length, Maghrib is at sunset, and Fajr and Isha are when the sun is a set angle below the horizon. Calculation methods differ mainly in those Fajr and Isha angles." },
  { q: "Which calculation method should I use?", a: "Use the method your local mosque uses. We choose the most common method for your country automatically: ISNA in the US and Canada, Umm al-Qura in Saudi Arabia, Karachi in Pakistan and South Asia, Moonsighting Committee in the UK and Muslim World League elsewhere, and you can change it." },
  { q: "Why is the Hanafi Asr time later?", a: "In the Hanafi school, Asr begins when an object's shadow is twice its length (plus its noon shadow). The Shafi'i, Maliki and Hanbali schools start Asr when the shadow equals its length, which is earlier. Both are valid views." },
  { q: "How do I find the Qibla direction?", a: "The Qibla is the direction of the Ka'bah in Makkah. This page shows it in degrees clockwise from true north for your location. On a phone, tap \"Use my phone's compass\" and the arrow will point toward the Ka'bah as you turn." },
  { q: "Can the Adhan play when the website is closed?", a: "No. Browsers only allow a website to play sound while it is open in a tab. Keep Knowlege.org open (it can be in a background tab) with the Adhan option switched on, and it will play at each of the five prayer times." },
];

export default function Page() {
  const schema = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Knowlege.org Prayer Times and Qibla", url: `${SITE}/prayer-times`, applicationCategory: "LifestyleApplication", operatingSystem: "Any", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: metadata.description },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  return <main className="shell page ptpage">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <span className="tag">Prayer Times</span>
    <h1>Prayer Times Near You and Qibla Direction</h1>
    <p className="lead">Today's five prayer times for where you are, the direction of the Ka'bah, and the option to hear the Adhan when each prayer begins.</p>
    <PrayerTimes />

    <section className="ptinfo" id="methods">
      <h2>Frequently asked questions</h2>
      {faqs.map(f => <details key={f.q} className="more"><summary>{f.q}</summary><p>{f.a}</p></details>)}
      <div className="notice" style={{ marginTop: 24 }}>
        Calculated times are a close guide. Your local mosque's timetable is the final word, especially for Fajr, Isha and in far northern or southern places. Learn how to pray in our <Link href="/knowledge-hub/salah">prayer guide</Link>, read the words of the <Link href="/#adhan-h">Adhan and their meaning</Link>, or start the <Link href="/new-to-islam">Path to Success</Link> if you are new to Islam.
      </div>
    </section>
  </main>;
}
