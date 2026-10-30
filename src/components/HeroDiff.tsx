"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type DiffDemo = {
  slug: string;
  file: string;
  title: string;
  before: string[]; // highlighted HTML, one per line
  after: string[];
};

type Phase = "idle" | "striking" | "collapsing" | "adding" | "done";

export default function HeroDiff({ demos }: { demos: DiffDemo[] }) {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [struck, setStruck] = useState(0);
  const [added, setAdded] = useState(0);
  const [still, setStill] = useState(false);
  const timers = useRef<number[]>([]);
  const demo = demos[i];

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const play = useCallback(
    (d: DiffDemo) => {
      clear();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setStill(reduce);
      if (reduce) {
        setStruck(d.before.length);
        setAdded(d.after.length);
        setPhase("done");
        return;
      }
      setPhase("idle");
      setStruck(0);
      setAdded(0);
      let t = 900;
      at(t, () => setPhase("striking"));
      d.before.forEach((_, n) => {
        t += 170;
        at(t, () => setStruck(n + 1));
      });
      t += 450;
      at(t, () => setPhase("collapsing"));
      t += 520;
      at(t, () => setPhase("adding"));
      d.after.forEach((_, n) => {
        t += 260;
        at(t, () => setAdded(n + 1));
      });
      t += 200;
      at(t, () => setPhase("done"));
    },
    []
  );

  useEffect(() => {
    play(demos[i]);
    return clear;
  }, [i, demos, play]);

  const next = () => setI((v) => (v + 1) % demos.length);
  const collapsed = !still && (phase === "collapsing" || phase === "adding" || phase === "done");

  return (
    <figure className="hero-diff" aria-label={`Before and after: ${demo.title}`}>
      <div className="hd-bar">
        <span className="hd-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="hd-file">{demo.file}</span>
        <span className="hd-stat" aria-live="polite">
          <span className="del">−{struck}</span> <span className="add">+{added}</span>
        </span>
      </div>
      <div className="hd-body">
        <ol className={`hd-lines before ${collapsed ? "is-collapsed" : ""}`} aria-label="Before">
          {demo.before.map((html, n) => (
            <li key={`${demo.slug}-b${n}`} className={n < struck ? "is-struck" : ""}>
              <span className="sign" aria-hidden="true">−</span>
              <code dangerouslySetInnerHTML={{ __html: html }} />
            </li>
          ))}
        </ol>
        <ol className="hd-lines after" aria-label="After">
          {demo.after.map((html, n) => (
            <li key={`${demo.slug}-a${n}`} className={n < added ? "is-in" : ""}>
              <span className="sign" aria-hidden="true">+</span>
              <code dangerouslySetInnerHTML={{ __html: html }} />
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="hd-foot">
        <Link href={`/tips/${demo.slug}`}>{demo.title}</Link>
        <span className="hd-actions">
          <button type="button" onClick={() => play(demo)} className="ghost">Replay</button>
          <button type="button" onClick={next} className="ghost">Next trick</button>
        </span>
      </figcaption>
    </figure>
  );
}
