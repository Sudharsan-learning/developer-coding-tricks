"use client";

import { useEffect, useState } from "react";

/** The email address as one big button: click to copy, with a mail-app link beside it. */
export default function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(t);
  }, [state]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
  };
  return (
    <div className="copy-email">
      <button type="button" onClick={copy} className={`email-btn${state === "copied" ? " is-copied" : ""}`}>
        <span className="email-addr">{email}</span>
        <span className="email-state" aria-live="polite">
          {state === "copied" ? "Copied to clipboard" : state === "failed" ? "Select the address to copy it" : "Click to copy"}
        </span>
      </button>
      <a className="btn btn-primary" href={`mailto:${email}?subject=Project%20enquiry`}>Open in mail app</a>
    </div>
  );
}
