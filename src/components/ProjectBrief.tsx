"use client";

import { useState } from "react";

const NEEDS = ["Web app", "Freshworks app", "Integration or migration", "Something else"];
const WHEN = ["As soon as possible", "Within a month", "Flexible"];

/** Builds a project enquiry email from a few choices and shows it live before it opens in the visitor's mail app. */
export default function ProjectBrief({ email, firstName }: { email: string; firstName: string }) {
  const [need, setNeed] = useState(NEEDS[0]);
  const [when, setWhen] = useState(WHEN[2]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const subject = `Project enquiry: ${need}`;
  const body = [
    `Hi ${firstName},`,
    "",
    `I need help with: ${need}`,
    `Timeline: ${when}`,
    "",
    msg.trim() || "[A few lines about the project]",
    "",
    name.trim() ? `Thanks,\n${name.trim()}` : "Thanks",
  ].join("\n");
  const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="brief">
      <form className="brief-form" onSubmit={(e) => { e.preventDefault(); window.location.href = href; }}>
        <fieldset>
          <legend>What do you need?</legend>
          <div className="choice">
            {NEEDS.map((n) => (
              <label key={n}><input type="radio" name="need" checked={need === n} onChange={() => setNeed(n)} /><span>{n}</span></label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>When do you need it?</legend>
          <div className="choice">
            {WHEN.map((w) => (
              <label key={w}><input type="radio" name="when" checked={when === w} onChange={() => setWhen(w)} /><span>{w}</span></label>
            ))}
          </div>
        </fieldset>
        <label className="field">
          <span>About the project</span>
          <textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="What should it do, who uses it, and which tools does it connect to?" />
        </label>
        <label className="field">
          <span>Your name</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <button type="submit" className="btn btn-primary">Open this email in my mail app</button>
      </form>
      <figure className="brief-preview" aria-label="Email preview">
        <div className="bp-head">
          <span><b>To</b>{email}</span>
          <span><b>Subject</b>{subject}</span>
        </div>
        <pre className="bp-body">{body}</pre>
        <figcaption>Nothing is sent from this page. The button opens the draft in your own mail app.</figcaption>
      </figure>
    </div>
  );
}
