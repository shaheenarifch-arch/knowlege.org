import { notFound } from "next/navigation";
import { getGuide, getSub, getSubs, subguides, topics } from "../../../../lib/library";
import { GuideView } from "../../../../components/GuideView";

export function generateStaticParams() {
  return Object.entries(subguides).filter(([topic]) => getGuide(topic))
    .flatMap(([topic, list]) => list.map(s => ({ topic, sub: s.slug })));
}

type Props = { params: Promise<{ topic: string; sub: string }> };

export async function generateMetadata({ params }: Props) {
  const { topic, sub } = await params;
  const g = getSub(topic, sub);
  if (!g) return {};
  return {
    title: g.title, description: g.summary, alternates: { canonical: `/knowledge-hub/${topic}/${g.slug}` },
    openGraph: { title: g.title, description: g.summary, type: "article", images: [{ url: g.photo.src, width: g.photo.width, height: g.photo.height, alt: g.photo.alt }] },
    twitter: { card: "summary_large_image", title: g.title, description: g.summary, images: [g.photo.src] },
  };
}

export default async function Page({ params }: Props) {
  const { topic, sub } = await params;
  const parentGuide = getGuide(topic);
  const g = getSub(topic, sub);
  if (!parentGuide || !g) notFound();
  const topicTitle = topics.find(t => t.slug === topic)?.title ?? parentGuide.title;
  const parentHref = `/knowledge-hub/${topic}`;
  const siblings = getSubs(topic).filter(s => s.slug !== g.slug)
    .map(s => ({ href: `${parentHref}/${s.slug}`, title: s.title, blurb: s.summary }));
  return <GuideView g={g} path={`${parentHref}/${g.slug}`} crumbs={[{ name: topicTitle, path: parentHref }]} mosqueSlug={topic}
    parent={{ title: topicTitle, href: parentHref }} siblings={siblings} />;
}
