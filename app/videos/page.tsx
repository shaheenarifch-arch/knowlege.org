import Link from "next/link";
import { HADITH_CARDS } from "../../lib/hadith-cards";

export const metadata = {
  title: "Video & Podcast Library",
  description: "Knowlege.org's YouTube channel: daily Qur'an recitation (tilawat), short hadith videos and clips, with every reference cited. Channel earnings are spent on spreading Knowlege.org.",
  alternates: { canonical: "/videos" },
};

const SHOWS: Array<[string, string, string]> = [
  ["Tilawat-e-Qur'an", "Daily", "A passage of the Qur'an recited in Arabic, with the English meaning on screen and the surah and verse numbers shown."],
  ["Hadith Shorts", "Daily", "Under-a-minute videos on one authentic hadith, with its collection and number so you can check it yourself."],
  ["Clips and reminders", "Weekly", "Short reflections, Ramadan and Hajj explainers, and highlights from the Knowledge Hub guides."],
];

export default function Page() {
  return <main className="shell page vlib">
    <span className="tag">Video &amp; Podcast Library</span>
    <h1>Video &amp; Podcast Library</h1>
    <p className="lead">Curated, permitted videos, podcasts, lecture series and transcripts. The Knowlege.org YouTube channel will publish new Qur'an recitation, hadith Shorts and clips every day.</p>

    <section className="vmission">
      <h2>Our channel, for the sake of knowledge</h2>
      <p>Every video cites its source: the surah and verse for the Qur'an, and the collection and number for each hadith. Any earnings the channel makes are spent on promoting Knowlege.org, so more people can find free, sourced Islamic knowledge.</p>
      <p className="help">The channel is launching soon. To be told when it goes live, join the <Link href="/newsletter">Knowlege Letter</Link>.</p>
    </section>

    <section className="section" aria-labelledby="shows-h">
      <h2 id="shows-h">What we will publish</h2>
      <div className="grid">{SHOWS.map(([t, f, d]) => <div className="card" key={t}><span className="tag">{f}</span><h3>{t}</h3><p>{d}</p></div>)}</div>
    </section>

    <section className="section" aria-labelledby="first-h">
      <h2 id="first-h">First hadith Shorts</h2>
      <p className="lead">The first Shorts will cover these well-known hadith from Sahih al-Bukhari. Read each one now, with its full text and reference.</p>
      <ul className="vlist">{HADITH_CARDS.map(h => <li key={h.slug}><Link href={`/hadith/${h.slug}`}>{h.title}</Link> <span>Bukhari {h.n}</span></li>)}</ul>
    </section>

    <section className="section" aria-labelledby="rules-h">
      <h2 id="rules-h">Our media rules</h2>
      <ul className="vrules">
        <li>Recitations and footage are used only where the owner's licence allows it, and are credited in each video's description.</li>
        <li>Texts come from named sources (Qur'an: Uthmani Arabic and Pickthall's English; hadith: the six major collections) and are never written by AI.</li>
        <li>Videos teach; they are not religious rulings (fatwas). For rulings, ask a qualified scholar.</li>
      </ul>
      <p className="help">Spotted a mistake in a video, or want to suggest a permitted lecture series or podcast? <Link href="/contact">Contact us</Link>. Read <Link href="/about#sources">how we use sources</Link>.</p>
    </section>
  </main>;
}
