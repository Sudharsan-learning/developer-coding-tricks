const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Trick notes may use <b>, <i>, <em>, <strong> and <code> only; everything else is shown as text. */
export function safeNote(html: string) {
  return esc(html).replace(/&lt;(\/?)(b|i|em|strong|code)&gt;/g, "<$1$2>");
}

/** JSON-LD for a <script> tag, with "<" escaped so content can never close the tag early. */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
