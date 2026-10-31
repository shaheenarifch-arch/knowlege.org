import Link from "next/link";
import { themeList } from "../../lib/themes";

export const metadata = {
  title: "Theme Explorer",
  description: "Explore Qur'anic themes such as mercy, justice, knowledge, family, ethics and stewardship through cited verses and hadith.",
  alternates: { canonical: "/themes" },
};

export default function Page() {
  return <main className="shell page">
    <span className="tag">Explore concepts</span>
    <h1>Theme Explorer</h1>
    <p className="lead">Each theme gathers Qur'anic verses and hadith on one idea, shown exactly as published with a link to the source. New to the site? See <Link href="/about#sources" style={{ textDecoration: "underline" }}>how we use sources</Link>, or search every verse and hadith yourself on the <Link href="/research" style={{ textDecoration: "underline" }}>Research Desk</Link>.</p>
    <div className="grid">{themeList.map(t => <Link className="card" key={t.slug} href={`/themes/${t.slug}`}>
      <h3>{t.title}</h3>
      <p>{t.summary}</p>
      <p><small>{t.verses.length} verses · {t.hadith.length} hadith</small></p>
    </Link>)}</div>
  </main>;
}
