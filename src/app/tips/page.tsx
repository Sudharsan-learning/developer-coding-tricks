import type { Metadata } from "next";
import TipIndex from "@/components/TipIndex";
import { getPosts, toRows, topicLabel, topics } from "@/lib/posts";

export const metadata: Metadata = {
  title: "All tips",
  description: "Every before-and-after trick from @developer_coding_tricks, with copyable, tested code.",
  alternates: { canonical: "/tips" },
};

export default function TipsPage() {
  const posts = getPosts();
  return (
    <section className="wrap section page-top">
      <h1 className="page-title">All tips</h1>
      <p className="section-lede">Each trick shows the code you can delete and the line that replaces it. Search by function name or filter by topic.</p>
      <TipIndex rows={toRows(posts)} topics={topics(posts).map((t) => ({ id: t, label: topicLabel(t) }))} />
    </section>
  );
}
