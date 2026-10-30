"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export type PaletteTip = { slug: string; title: string; sub: string; topic: string };
type Item = { id: string; group: "Go to" | "Tips" | "Actions"; label: string; hint: string; keywords: string; run: () => void };

const SECTIONS = [
  { label: "About me", href: "/#about", keywords: "bio who" },
  { label: "Latest tricks", href: "/#tips", keywords: "new recent" },
  { label: "Experience", href: "/#experience", keywords: "work jobs resume cv" },
  { label: "Selected work", href: "/#projects", keywords: "projects portfolio skills" },
  { label: "Hire me", href: "/#hire", keywords: "services freelance quote" },
  { label: "Contact", href: "/#contact", keywords: "email message brief" },
  { label: "All tips", href: "/tips", keywords: "search index browse" },
];

/** Terminal-style search: Ctrl/⌘ K or "/" opens it; arrows move, Enter runs. */
export default function CommandPalette({ tips, email, links }: { tips: PaletteTip[]; email: string; links: { label: string; href: string }[] }) {
  const router = useRouter();
  const dlg = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [note, setNote] = useState("");
  const [mac, setMac] = useState(false);

  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !(e.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open && !d.open) {
      setQ("");
      setActive(0);
      setNote("");
      d.showModal();
      input.current?.focus();
    } else if (!open && d.open) d.close();
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      setOpen(false);
      router.push(href);
    };
    return [
      ...SECTIONS.map((s) => ({ id: s.href, group: "Go to" as const, label: s.label, hint: s.href, keywords: s.keywords, run: go(s.href) })),
      {
        id: "copy-email", group: "Actions", label: "Copy my email address", hint: email, keywords: "mail contact",
        run: () => {
          navigator.clipboard.writeText(email).then(() => setNote(`Copied ${email}`), () => setNote(`Copy failed. The address is ${email}`));
        },
      },
      { id: "mail", group: "Actions", label: "Write me an email", hint: "Opens your mail app", keywords: "contact hire", run: () => { window.location.href = `mailto:${email}`; } },
      ...links.map((l) => ({
        id: l.href, group: "Actions" as const, label: `Open ${l.label}`, hint: l.href.replace(/^https?:\/\/(www\.)?/, ""), keywords: "social profile",
        run: () => { window.open(l.href, "_blank", "noopener,noreferrer"); setOpen(false); },
      })),
      ...tips.map((t) => ({ id: t.slug, group: "Tips" as const, label: t.title, hint: t.topic, keywords: t.sub, run: go(`/tips/${t.slug}`) })),
    ];
  }, [tips, email, links, router]);

  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return items.filter((i) => i.group !== "Tips").concat(items.filter((i) => i.group === "Tips").slice(0, 3));
    return items.filter((i) => {
      const hay = `${i.label} ${i.keywords} ${i.hint}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [items, q]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = shown.length;
      if (n) setActive((a) => (a + (e.key === "ArrowDown" ? 1 : n - 1)) % n);
    } else if (e.key === "Enter" && shown[active]) {
      e.preventDefault();
      shown[active].run();
    }
  };

  let lastGroup = "";
  return (
    <>
      <button type="button" className="cmdk-btn" onClick={() => setOpen(true)} aria-label="Search the site">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <span className="cmdk-label">Search</span>
        <kbd>{mac ? "⌘" : "Ctrl"} K</kbd>
      </button>
      <dialog ref={dlg} className="cmdk" aria-label="Search the site" onClose={() => setOpen(false)} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
        <div className="cmdk-panel">
          <label className="cmdk-input">
            <span className="logo-prompt" aria-hidden="true">$</span>
            <span className="sr-only">Search tips, sections and actions</span>
            <input
              ref={input} value={q} placeholder="search tips, jump to a section, copy my email…" autoComplete="off" spellCheck={false}
              role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-activedescendant={shown[active] ? `cmdk-${active}` : undefined}
              onChange={(e) => { setQ(e.target.value); setActive(0); setNote(""); }} onKeyDown={onKeyDown}
            />
            <kbd>Esc</kbd>
          </label>
          <ul id="cmdk-list" role="listbox" className="cmdk-list">
            {shown.map((it, n) => {
              const head = it.group !== lastGroup ? it.group : null;
              lastGroup = it.group;
              return (
                <li key={it.id} role="presentation">
                  {head && <p className="cmdk-group" aria-hidden="true">{head}</p>}
                  <div
                    id={`cmdk-${n}`} role="option" aria-selected={n === active} className="cmdk-item"
                    onMouseMove={() => n !== active && setActive(n)} onClick={() => it.run()}
                  >
                    <span className="cmdk-name">{it.label}</span>
                    <span className="cmdk-hint">{it.hint}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          {shown.length === 0 && <p className="cmdk-empty">Nothing matches “{q}”. Try a function name like fetch, or a section like experience.</p>}
          <p className="cmdk-foot" aria-live="polite">
            {note || <><kbd>↑</kbd><kbd>↓</kbd> to move <kbd>Enter</kbd> to open</>}
          </p>
        </div>
      </dialog>
    </>
  );
}
