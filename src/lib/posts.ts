import fs from "node:fs";
import path from "node:path";
import type { Post, Site } from "./types";
import siteJson from "@content/site.json";

export const site = siteJson as Site;
const DIR = path.join(process.cwd(), "content", "posts");

let cache: Post[] | null = null;

export function getPosts(): Post[] {
  if (cache) return cache;
  cache = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as Post)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
  return cache;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

const lines = (c: string[]) => c.filter((l) => l.trim() !== "").length;

/** Lines removed vs added across all tricks, like a git diff stat. */
export function diffStat(p: Post) {
  let removed = 0, added = 0;
  for (const t of p.tricks) {
    if (t.before) removed += lines(t.before.code);
    added += lines(t.after.code);
  }
  return { removed, added };
}

export function topics(posts: Post[]) {
  return [...new Set(posts.map((p) => p.topic))].sort();
}

export function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const today = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) + "T00:00:00");
  if (d > today) return `On Instagram ${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function topicLabel(t: string) {
  return t === "CSS/Web" ? "CSS & Web" : t === "JS async/Node" ? "Node.js" : t === "Git/DevTools" ? "Git & DevTools" : t;
}

import type { TipRow } from "@/components/TipIndex";

export function toRows(posts: Post[]): TipRow[] {
  return posts.map((p) => {
    const { removed, added } = diffStat(p);
    const text = [p.title, p.sub, p.topic, p.series ?? "", ...p.tricks.flatMap((t) => [t.title, t.eyebrow, ...t.after.code, ...(t.before?.code ?? [])])];
    return {
      slug: p.slug, title: p.title, sub: p.sub, topic: p.topic, topicLabel: topicLabel(p.topic), series: p.series,
      date: p.date, dateLabel: formatDate(p.date), removed, added, search: text.join(" ").toLowerCase(),
    };
  });
}
