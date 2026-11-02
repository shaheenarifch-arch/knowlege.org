import Link from "next/link";
import { notFound } from "next/navigation";
import { milestones, getMilestone, PATH_REVIEWED } from "../../../lib/path";
import { plain } from "../../../lib/library";
import { Cited } from "../../../components/Cited";
import { Photo } from "../../../components/Photo";
import { StepBar, Checkpoint, AskBox } from "../../../components/PathClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://knowlege.org";

export function generateStaticParams() { return milestones.map(m => ({ step: m.slug })); }
export const dynamicParams = false;

type Props = { params: Promise<{ step: string }> };

export async function generateMetadata({ params }: Props) {
  const m = milestones[getMilestone((await params).step)];
  if (!m) return {};
  const description = `${m.short}. New to Islam: the Path to Success, milestone ${milestones.indexOf(m)} of ${milestones.length - 1}. ${plain(m.falah)}`;
  return {
    title: `${m.title} | New to Islam`, description, alternates: { canonical: `/new-to-islam/${m.slug}` },
    openGraph: { title: m.title, description, type: "article", images: [{ url: m.photo.src, width: m.photo.width, height: m.photo.height, alt: m.photo.alt }] },
  };
}

export default async function Page({ params }: Props) {
  const i = getMilestone((await params).step);
  if (i < 0) notFound();
  const m = milestones[i];
  const prev = milestones[i - 1];
  const next = milestones[i + 1];
  const items = milestones.map(x => ({ slug: x.slug, title: x.title, short: x.short }));
  const url = `${SITE}/new-to-islam/${m.slug}`;
  const schema = [
    { "@context": "https://schema.org", "@type": "LearningResource", name: m.title, description: m.short, url, image: m.photo.src,
      learningResourceType: "lesson", isAccessibleForFree: true, dateModified: PATH_REVIEWED, inLanguage: "en",
      isPartOf: { "@type": "Course", name: "The Path to Success: New to Islam", url: `${SITE}/new-to-islam` },
      author: { "@type": "Organization", name: "Knowlege.org Editorial", url: `${SITE}/about` } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "New to Islam", item: `${SITE}/new-to-islam` },
      { "@type": "ListItem", position: 3, name: m.title, item: url }] },
  ];
  return <>
    <StepBar items={items} current={i} />
    <main className="shell page pathstep">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="crumbs"><Link href="/">Home</Link> › <Link href="/new-to-islam">New to Islam</Link> › Milestone {i}</div>
      <span className="tag">Milestone {i} of {milestones.length - 1}</span>
      <h1>{m.title}</h1>
      <p className="falahline"><span aria-hidden>✦</span> {m.falah}</p>
      <Photo photo={m.photo} priority />

      <section className="block b1"><h2><span>1</span> The Story</h2>{m.story.map((p, k) => <p key={k}><Cited text={p} /></p>)}</section>

      <section className="block b2"><h2><span>2</span> The Practice</h2>
        {m.practice.map((p, k) => <p key={k}><Cited text={p} /></p>)}
        {m.points && <ul>{m.points.map((p, k) => <li key={k}><Cited text={p} /></li>)}</ul>}
      </section>

      <section className="block b3"><h2><span>3</span> The Value</h2><p><Cited text={m.value} /></p></section>

      <section className="block b4"><h2><span>4</span> Real Example: {m.example.title}</h2><p><Cited text={m.example.text} /></p></section>

      <blockquote className="keyverse"><Cited text={m.key} /></blockquote>

      {m.detail && <details className="more"><summary>More detail: what the four schools say</summary><p><Cited text={m.detail} /></p></details>}

      <section className="golinks" aria-labelledby="go">
        <h2 id="go">Go deeper</h2>
        <ul>{m.links.map(l => <li key={l.href}><Link href={l.href}>{l.title} →</Link></li>)}</ul>
      </section>

      <Checkpoint slug={m.slug} quiz={m.quiz}
        nextHref={next ? `/new-to-islam/${next.slug}` : "/new-to-islam/finish"}
        nextLabel={next ? `Milestone ${i + 1}: ${next.title}` : "Finish Line"} />

      <AskBox step={m.slug} title={m.title} />

      <nav className="pager" aria-label="Milestone navigation">
        {prev ? <Link className="btn" href={`/new-to-islam/${prev.slug}`}>← {prev.title}</Link> : <Link className="btn" href="/new-to-islam">← Path overview</Link>}
        {next ? <Link className="btn" href={`/new-to-islam/${next.slug}`}>{next.title} →</Link> : <Link className="btn" href="/new-to-islam/finish">Finish Line →</Link>}
      </nav>

      <p className="hint small">Sources open on Quran.com and Sunnah.com. Written by Knowlege.org Editorial, last reviewed {PATH_REVIEWED}. This is learning material, not a fatwa. <Link href="/contact">Report a correction</Link>.</p>
    </main>
  </>;
}
