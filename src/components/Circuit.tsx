"use client";

import { useEffect, useRef } from "react";

/** The circuit trace down the page: fills as you scroll and lights the node at each section heading (.node-h). */
export default function Circuit() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const board = ref.current?.parentElement;
    if (!board) return;
    const heads = [...board.querySelectorAll<HTMLElement>(".node-h")];
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.6;
      const r = board.getBoundingClientRect();
      board.style.setProperty("--p", Math.min(1, Math.max(0, (line - r.top) / r.height)).toFixed(4));
      for (const h of heads) h.classList.toggle("lit", h.getBoundingClientRect().top < line);
    };
    const onScroll = () => {
      raf ||= requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="trace" aria-hidden="true">
      <i className="trace-fill" />
      <i className="trace-tip" />
    </div>
  );
}
