import Link from "next/link";
export const metadata = { title: "About", description: "About Knowlege.org: a free, source-transparent platform for Qur'anic learning, research, ethical reflection, charity and practical service." };
export default function Page() {
  return <main className="shell page legal">
    <span className="tag">About</span>
    <h1>About Knowlege.org</h1>
    <p className="lead">Knowledge for Mankind. Read. Learn. Research. Serve.</p>
    <p>Knowlege.org is a free platform for Qur'anic learning, research, ethical reflection, charity and practical service. Core scripture, source search and learning stay free.</p>
    <h2>What you can do here</h2>
    <ul>
      <li><Link href="/research">Research Desk</Link>: search the Qur'an and the six major hadith collections, with a reference and source link for every result.</li>
      <li><Link href="/blog">Weekly Reflections</Link>: one Qur'anic theme each week, explained with cited verses and hadith.</li>
      <li><Link href="/themes">Themes</Link> and <Link href="/learning">Learning</Link>: explore concepts such as mercy, justice, knowledge and family.</li>
      <li><Link href="/charity">Charity</Link> and <Link href="/help">Help</Link>: directories of reviewed organizations and support services (being verified).</li>
      <li><Link href="/newsletter">Knowlege Letter</Link>: a free newsletter of reflections and research.</li>
    </ul>
    <h2 id="sources">How we use sources</h2>
    <p>Every verse and hadith we show is fetched from a named source and displayed exactly as published, never written by AI. Qur'an English text uses Marmaduke Pickthall's translation (1930, public domain) via <a href="https://alquran.cloud/api" target="_blank" rel="noopener noreferrer">AlQuran Cloud</a>. Hadith come from the six major collections (Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami' at-Tirmidhi, Sunan an-Nasa'i and Sunan Ibn Majah) via the open <a href="https://github.com/fawazahmed0/hadith-api" target="_blank" rel="noopener noreferrer">hadith-api dataset</a>, with gradings shown as given.</p>
    <p>Weekly reflections and Knowledge Hub guides are AI-assisted and written only from the cited texts, which are checked against their sources. Spotted a mistake? Please <Link href="/contact">let us know</Link>.</p>
    <h2 id="editorial">Editorial leadership</h2>
    <p><strong>Editor-in-Chief:</strong> Hafiz Faheem Arif, Michigan, USA</p>
    <h2>Not religious rulings</h2>
    <p>Nothing on this site is a religious ruling (fatwa). For rulings, please ask a qualified scholar.</p>
    <h2>Get in touch</h2>
    <p>Spotted an error in a reference, or want to suggest a source? <Link href="/contact">Contact us</Link>.</p>
    <section className="dedication" id="dedication" aria-labelledby="dedication-h">
      <h2 id="dedication-h">In loving memory</h2>
      <p>This knowledge platform is dedicated, as ongoing charity (sadaqah jariyah), to the late <strong>Mr and Mrs Ch Muhammad Arif</strong>, rahimahumallah.</p>
      <p>Please remember them in your prayers: may Allah forgive them, have mercy on them, grant them peace in their graves and admit them to Jannat al-Firdaws. Ameen.</p>
      <p className="ar" lang="ar" dir="rtl">اللَّهُمَّ اغْفِرْ لَهُمَا وَارْحَمْهُمَا</p>
      <p className="help">"O Allah, forgive them both and have mercy on them both."</p>
    </section>
  </main>;
}
