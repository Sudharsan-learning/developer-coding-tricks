import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Sudharsan A: I help developers write less code";

export default function Image() {
  return ogImage({ kicker: "developer + freelancer", title: "Sudharsan A: I help developers write less code." });
}
