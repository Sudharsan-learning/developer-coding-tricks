export type CodeSample = { label: string; code: string[]; lang: string };
export type Trick = { eyebrow: string; title: string; note: string; before: CodeSample | null; after: CodeSample };
export type Post = {
  slug: string; date: string; topic: string; series: string | null; title: string; sub: string; intro: string;
  tricks: Trick[]; caption: string; hashtags: string; sources: string[]; alt: string; slides: number;
};
export type Site = {
  name: string; brand: string; url: string; email: string; whatsapp: string; linkedin: string; instagram: string; handle: string;
  services: { title: string; body: string; includes: string[] }[];
  projects: { title: string; body: string; result?: string; link?: string }[];
};
