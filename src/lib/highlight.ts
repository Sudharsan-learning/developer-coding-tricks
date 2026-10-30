import { createHighlighter, type Highlighter } from "shiki";

const LANGS = ["js", "jsx", "ts", "tsx", "css", "html", "python", "bash", "json"] as const;
let hl: Promise<Highlighter> | null = null;

function get() {
  hl ??= createHighlighter({ themes: ["github-dark"], langs: [...LANGS] });
  return hl;
}

const safeLang = (l: string) => ((LANGS as readonly string[]).includes(l) ? l : "text");

/** Full highlighted <pre> block. */
export async function highlight(code: string[], lang: string) {
  const h = await get();
  return h.codeToHtml(code.join("\n"), { lang: safeLang(lang), theme: "github-dark" });
}

/** One HTML string per line (for the animated hero diff). */
export async function highlightLines(code: string[], lang: string) {
  const h = await get();
  const { tokens } = h.codeToTokens(code.join("\n"), { lang: safeLang(lang) as never, theme: "github-dark" });
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return tokens.map((line) => line.map((t) => `<span style="color:${t.color}">${esc(t.content)}</span>`).join("") || " ");
}
