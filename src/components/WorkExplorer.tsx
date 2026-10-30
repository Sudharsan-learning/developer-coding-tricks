"use client";

import { useState } from "react";
import type { Site } from "@/lib/types";

/** The skills card filters the project grid: pick a skill to see where it was used. */
export default function WorkExplorer({ skills, projects }: { skills: Site["skills"]; projects: Site["projects"] }) {
  const [sel, setSel] = useState<string | null>(null);
  const used = new Set(projects.flatMap((p) => p.tags ?? []));
  const matches = sel ? projects.filter((p) => p.tags?.includes(sel)).length : projects.length;
  const total = skills.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="work">
      <div className="stack spot">
        <div className="stack-head">
          <span>stack.json</span>
          <span aria-live="polite">
            {sel ? `${matches} ${matches === 1 ? "project uses" : "projects use"} ${sel}` : `${total} skills`}
          </span>
        </div>
        <dl className="stack-groups">
          {skills.map((g) => (
            <div key={g.group}>
              <dt>&quot;{g.group}&quot;:</dt>
              <dd>
                <ul>
                  {g.items.map((s) =>
                    used.has(s) ? (
                      <li key={s}>
                        <button type="button" aria-pressed={sel === s} onClick={() => setSel(sel === s ? null : s)}>{s}</button>
                      </li>
                    ) : (
                      <li key={s} className="plain">{s}</li>
                    )
                  )}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
        <p className="stack-hint">{sel ? <button type="button" className="ghost" onClick={() => setSel(null)}>Show all projects</button> : "Pick a highlighted skill to see the projects that use it."}</p>
      </div>
      <div className="project-grid">
        {projects.map((p) => {
          const hit = sel ? p.tags?.includes(sel) : undefined;
          return (
            <article key={p.title} className={`project spot${hit === false ? " is-dim" : ""}${hit ? " is-match" : ""}`}>
              <h3>{p.link ? <a href={p.link} rel="noopener noreferrer" target="_blank">{p.title}</a> : p.title}</h3>
              <p>{p.body}</p>
              {p.result && <p className="result">+ {p.result}</p>}
              {p.tags && <ul className="tags">{p.tags.map((t) => <li key={t} className={t === sel ? "on" : ""}>{t}</li>)}</ul>}
            </article>
          );
        })}
      </div>
    </div>
  );
}
