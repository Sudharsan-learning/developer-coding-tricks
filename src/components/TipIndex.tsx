"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type TipRow = {
  slug: string; title: string; sub: string; topic: string; topicLabel: string; series: string | null;
  date: string; dateLabel: string; removed: number; added: number; search: string;
};

export function TipRows({ rows }: { rows: TipRow[] }) {
  return (
    <ol className="tip-rows">
      {rows.map((r) => (
        <li key={r.slug}>
          <Link href={`/tips/${r.slug}`} className="tip-row">
            <time dateTime={r.date}>{r.dateLabel}</time>
            <span className="tip-main">
              <span className="tip-title">{r.title}</span>
              <span className="tip-sub">{r.sub}</span>
            </span>
            <span className="tip-topic">{r.series ?? r.topicLabel}</span>
            <span className="tip-stat" aria-label={`${r.removed} lines removed, ${r.added} added`}>
              {r.removed > 0 && <span className="del">−{r.removed}</span>}
              <span className="add">+{r.added}</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export default function TipIndex({ rows, topics }: { rows: TipRow[]; topics: { id: string; label: string }[] }) {
  const [topic, setTopic] = useState("all");
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => (topic === "all" || r.topic === topic) && (!needle || r.search.includes(needle)));
  }, [rows, topic, q]);

  return (
    <div className="tip-index">
      <div className="tip-tools">
        <div className="chips" role="group" aria-label="Filter by topic">
          {[{ id: "all", label: "All" }, ...topics].map((t) => (
            <button key={t.id} type="button" aria-pressed={topic === t.id} onClick={() => setTopic(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Search tips</span>
          <input type="search" placeholder="Search: fetch, useId, regex…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      <p className="count" aria-live="polite">{shown.length} of {rows.length} tips</p>
      {shown.length ? (
        <TipRows rows={shown} />
      ) : (
        <p className="empty">No tips match “{q}”. Try a function name like <code>fetch</code> or clear the filter.</p>
      )}
    </div>
  );
}
