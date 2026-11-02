import Link from "next/link";
import { milestones, PATH_REVIEWED } from "../../lib/path";
import { Photo } from "../../components/Photo";
import { TrailMap } from "../../components/PathClient";
import { mosques } from "../../lib/mosques";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://knowlege.org";

export const metadata = {
  title: "New to Islam? The Path to Success: A Guided Walkthrough",
  description: "A free, step-by-step introduction to Islam in 12 milestones: belief, the Prophet ﷺ, the Qur'an, the Shahadah, prayer, fasting, zakah, Hajj, character and daily life, with history, real examples, quick checkpoints and a place to ask questions.",
  alternates: { canonical: "/new-to-islam" },
};

const hero = mosques.find(m => m.name === "Sheikh Zayed Grand Mosque")!.photo;

export default function Page() {
  const items = milestones.map(m => ({ slug: m.slug, title: m.title, short: m.short }));
  const schema = {
    "@context": "https://schema.org", "@type": "Course", name: "The Path to Success: New to Islam",
    description: metadata.description, url: `${SITE}/new-to-islam`, inLanguage: "en", isAccessibleForFree: true,
    provider: { "@type": "Organization", name: "Knowlege.org", url: SITE }, dateModified: PATH_REVIEWED,
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT3H" },
    syllabusSections: milestones.map((m, i) => ({ "@type": "Syllabus", name: `${i}. ${m.title}`, description: m.short, url: `${SITE}/new-to-islam/${m.slug}` })),
  };
  return <main className="shell page pathhub">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <span className="tag">New to Islam</span>
    <h1 className="pathtitle">The Path to Success</h1>
    <p className="lead">A guided walkthrough of Islam in twelve milestones. Each one tells a piece of history, shows a practice, names a value and gives a real example, then ends with a short checkpoint. Go at your own pace.</p>

    <section className="falahcall" aria-labelledby="falah">
      <p className="ar" lang="ar" dir="rtl">حَيَّ عَلَى الْفَلَاحِ</p>
      <h2 id="falah">"Hayya 'ala al-falah": Come to success</h2>
      <p>Five times a day, from mosques all over the world, the call to prayer (adhan) says these words. In Islam, success (falah) means a good life now and a good ending with God. The Qur'an begins one of its chapters with it: <em>"Successful indeed are the believers"</em> (<a href="https://quran.com/23/1" target="_blank" rel="noopener noreferrer">Qur'an 23:1</a>). This path is built around that call.</p>
    </section>

    <TrailMap items={items} />

    <section className="howitworks" aria-labelledby="how">
      <h2 id="how">How each milestone works</h2>
      <ol className="five">
        <li><b>The Story</b>A short piece of history.</li>
        <li><b>The Practice</b>What Muslims actually do.</li>
        <li><b>The Value</b>What it builds in a person.</li>
        <li><b>Real Example</b>From the Prophet ﷺ, his companions or everyday life.</li>
        <li><b>Checkpoint</b>Two or three quick questions, then on to the next milestone.</li>
      </ol>
      <p className="hint">Every milestone has a box for your questions and comments, and the Finish Line asks for your feedback. Sources are linked so you can check them: Qur'an references open on Quran.com and hadith on Sunnah.com.</p>
    </section>

    <Photo photo={hero} />

    <div className="notice" style={{ marginTop: 28 }}>
      This path is for learning and is written by Knowlege.org Editorial. Where the four Sunni schools agree, we say so first; differences are under "More detail". It is not a personal religious ruling (fatwa). For your own situation, speak to a local imam or see the <Link href="/help">Help Center</Link>. Questions about this page: <Link href="/contact">Contact us</Link>.
    </div>
  </main>;
}
