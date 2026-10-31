import { notFound } from "next/navigation";
import { guides, getGuide, getSubs, topics } from "../../../lib/library";
import { GuideView } from "../../../components/GuideView";

export function generateStaticParams() { return guides.map(g => ({ topic: g.slug })); }

type Props = { params: Promise<{ topic: string }> };

export async function generateMetadata({ params }: Props) {
  const g = getGuide((await params).topic);
  if (!g) return {};
  return {
    title: g.title, description: g.summary, alternates: { canonical: `/knowledge-hub/${g.slug}` },
    openGraph: { title: g.title, description: g.summary, type: "article", images: [{ url: g.photo.src, width: g.photo.width, height: g.photo.height, alt: g.photo.alt }] },
    twitter: { card: "summary_large_image", title: g.title, description: g.summary, images: [g.photo.src] },
  };
}

export default async function Page({ params }: Props) {
  const g = getGuide((await params).topic);
  if (!g) notFound();
  const topicTitle = topics.find(t => t.slug === g.slug)?.title ?? g.title;
  const related = topics.filter(t => t.slug !== g.slug && getGuide(t.slug))
    .map(t => ({ href: `/knowledge-hub/${t.slug}`, title: t.title, blurb: t.blurb }));
  const subs = getSubs(g.slug).map(s => ({ href: `/knowledge-hub/${g.slug}/${s.slug}`, title: s.title, blurb: s.summary }));
  return <GuideView g={g} path={`/knowledge-hub/${g.slug}`} crumbs={[]} mosqueSlug={g.slug} related={related}
    inTopic={{ title: topicTitle, items: subs }} />;
}
