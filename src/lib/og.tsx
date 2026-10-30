import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

export const ogSize = { width: 1200, height: 630 };

const font = (w: number) =>
  fs.readFile(path.join(process.cwd(), `node_modules/@fontsource/fira-code/files/fira-code-latin-${w}-normal.woff`));

export async function ogImage(opts: { kicker: string; title: string; removed?: number; added?: number }) {
  const [regular, bold] = await Promise.all([font(400), font(700)]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "#0D1117", color: "#E6EDF3", fontFamily: "Fira Code" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#8B949E" }}>
          <span style={{ color: "#58A6FF", fontWeight: 700 }}>$</span>
          <span>developer_coding_tricks</span>
          <span style={{ marginLeft: "auto", color: "#39C5CF" }}>{opts.kicker}</span>
        </div>
        <div style={{ display: "flex", fontSize: opts.title.length > 42 ? 62 : 74, fontWeight: 700, lineHeight: 1.12, letterSpacing: -1.5 }}>{opts.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 34 }}>
          {opts.removed ? <span style={{ color: "#FF7B72", background: "rgba(255,123,114,.12)", padding: "6px 16px", borderRadius: 8 }}>−{opts.removed}</span> : null}
          {opts.added ? <span style={{ color: "#3FB950", background: "rgba(63,185,80,.12)", padding: "6px 16px", borderRadius: 8 }}>+{opts.added}</span> : null}
          <span style={{ marginLeft: "auto", fontSize: 26, color: "#8B949E" }}>tested before-and-after code</span>
        </div>
      </div>
    ),
    { ...ogSize, fonts: [{ name: "Fira Code", data: regular, weight: 400 }, { name: "Fira Code", data: bold, weight: 700 }] }
  );
}
