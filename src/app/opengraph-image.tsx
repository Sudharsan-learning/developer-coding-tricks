import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Developer Coding Tricks: delete code you didn't need to write";

export default function Image() {
  return ogImage({ kicker: "dev tricks + freelance", title: "Delete code you didn’t need to write." });
}
