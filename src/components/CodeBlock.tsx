import { highlight } from "@/lib/highlight";
import type { CodeSample } from "@/lib/types";
import CopyButton from "./CopyButton";

export default async function CodeBlock({ kind, sample }: { kind: "before" | "after"; sample: CodeSample }) {
  const html = await highlight(sample.code, sample.lang);
  const n = sample.code.filter((l) => l.trim()).length;
  return (
    <div className={`code ${kind}`}>
      <div className="code-head">
        <span className="code-kind">
          <span className="sign" aria-hidden="true">{kind === "before" ? "−" : "+"}</span>
          {kind === "before" ? "Before" : "After"}
          {sample.label ? <span className="code-label">{sample.label}</span> : null}
        </span>
        <span className="code-meta">
          {n} {n === 1 ? "line" : "lines"}
          {kind === "after" ? <CopyButton text={sample.code.join("\n")} /> : null}
        </span>
      </div>
      <div className="code-body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
