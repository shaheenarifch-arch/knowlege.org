import Link from "next/link";
import { notFound } from "next/navigation";
import { themeList, getTheme, collectionName, verseUrl, hadithUrl, gradeLine, THEME_REVIEWED, THEME_DISCLAIMER } from "../../../lib/themes";
import { topics, getGuide, AUTHOR } from "../../../lib/library";

export const dynamicParams = false;
export function generateStaticParams() { return themeList.map(t => ({ slug: t.slug })); }

type Props = { params: Promise<{ slug: string }> };
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://knowlege.org";

export async function generateMetadata({ params }: Props) {
  const t = getTheme((await params).slug);
  if (!t) return {};
  const title = `${t.title} in the Qur'an and Hadith`;
  return {
    title, description: t.summary, alternates: { canonical: `/themes/${t.slug}` },
    openGraph: { title, description: t.summary, type: "article", url: `/themes/${t.slug}` },
    twitter: { card: "summary", title, description: t.summary },
  };
}

export default async function Page({ params }: Props) {
  const t = getTheme((await params).slug);
  if (!t) notFound();
  const url = `${SITE}/themes/${t.slug}`;
  const guides = t.guides.map(s => topics.find(x => x.slug === s)).filter((x): x is (typeof topics)[number] => !!x && !!getGuide(x.slug));
  const related = t.related.map(s => getTheme(s)).filter((x): x is NonNullable<typeof x> => !!x);
  const schema = [
    { "@context": "https://schema.org", "@type": "Article", headline: `${t.title} in the Qur'an and Hadith`, description: t.summary, url,
      author: { "@type": "Organization", name: AUTHOR, url: `${SITE}/about` }, publisher: { "@type": "Organization", name: "Knowlege.org", url: SITE },
      dateModified: THEME_REVIEWED, about: t.title,
      citation: [...t.verses.map(v => verseUrl(v.ref)), ...t.hadith.map(hadithUrl)] },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Themes", item: `${SITE}/themes` },
      { "@type": "ListItem", position: 3, name: t.title, item: url }] },
  ];
  return <main className="shell page theme">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> › <Link href="/themes">Themes</Link> › <span>{t.title}</span></nav>
    <span className="tag">Theme</span>
    <h1>{t.title}</h1>
    <section className="prose" style={{ paddingTop: 0 }}>{t.intro.map((p, i) => <p key={i}>{p}</p>)}</section>

    <nav className="toc" aria-label="On this page">
      <strong>On this page</strong>
      <ol>
        <li><a href="#quran">Qur'anic references</a></li>
        <li><a href="#hadith">Hadith</a></li>
        <li><a href="#related">Related guides and themes</a></li>
        <li><a href="#sources">Sources</a></li>
      </ol>
    </nav>

    <section className="section" id="quran">
      <h2>Qur'anic references</h2>
      <p className="lead">English translation by Marmaduke Pickthall (1930, public domain), shown exactly as published. Each link opens the verse on quran.com with its Arabic text.</p>
      <div className="themelist">{t.verses.map(v => <blockquote className="row" key={v.ref}>
        {v.lines.map(l => <p key={l.ayah}>{v.lines.length > 1 && <sup>{l.ayah} </sup>}{l.text}</p>)}
        <footer><a href={verseUrl(v.ref)} target="_blank" rel="noopener noreferrer">Qur'an {v.ref}</a></footer>
      </blockquote>)}</div>
    </section>

    <section className="section" id="hadith">
      <h2>Hadith</h2>
      <p className="lead">English text exactly as given in the open hadith-api dataset. Gradings are shown as the dataset lists them; we do not add our own. Each link opens the hadith on sunnah.com with its Arabic text and chain.</p>
      <div className="themelist">{t.hadith.map(h => { const g = gradeLine(h); return <blockquote className="row" key={`${h.collection}:${h.number}`}>
        <p>{h.text}</p>
        <footer>
          <a href={hadithUrl(h)} target="_blank" rel="noopener noreferrer">{collectionName(h.collection)} {h.number}</a>
          {g && <small> · Grade: {g}</small>}
        </footer>
      </blockquote>; })}</div>
    </section>

    <section className="section" id="related">
      {guides.length > 0 && <>
        <h2>Related guides</h2>
        <p className="lead">Practical Knowledge Hub guides connected to this theme.</p>
        <div className="grid">{guides.map(x => <Link className="card" key={x.slug} href={`/knowledge-hub/${x.slug}`}><h3>{x.title}</h3><p>{x.blurb}</p></Link>)}</div>
      </>}
      {related.length > 0 && <>
        <h2 style={{ marginTop: 40 }}>Related themes</h2>
        <div className="grid">{related.map(r => <Link className="card" key={r.slug} href={`/themes/${r.slug}`}><h3>{r.title}</h3><p>{r.summary}</p></Link>)}</div>
      </>}
    </section>

    <section className="section prose" id="sources">
      <h2>Sources</h2>
      <p>Qur'an: Marmaduke Pickthall, <em>The Meaning of the Glorious Koran</em> (1930, public domain), via <a href="https://alquran.cloud/api" target="_blank" rel="noopener noreferrer">AlQuran Cloud</a>. Hadith: the open <a href="https://github.com/fawazahmed0/hadith-api" target="_blank" rel="noopener noreferrer">hadith-api dataset</a>, numbered as on sunnah.com. Introduction written by {AUTHOR}; last reviewed {new Date(THEME_REVIEWED).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.</p>
      <p>Help: read <Link href="/about#sources">how we use sources</Link>, or search the full Qur'an and hadith collections on the <Link href="/research">Research Desk</Link>. Spotted a problem? <Link href="/contact">Report an error</Link>.</p>
    </section>

    <div className="notice">{THEME_DISCLAIMER}</div>
    <p><Link href="/themes">← All themes</Link></p>
  </main>;
}
