import { ogImage, ogSize } from "@/lib/og";
import { diffStat, getPost, getPosts, topicLabel } from "@/lib/posts";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Before-and-after code trick";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug)!;
  const { removed, added } = diffStat(p);
  return ogImage({ kicker: p.series ?? topicLabel(p.topic), title: p.title, removed, added });
}
