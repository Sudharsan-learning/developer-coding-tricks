export type CodeSample = { label: string; code: string[]; lang: string };
export type Trick = { eyebrow: string; title: string; note: string; before: CodeSample | null; after: CodeSample };
export type Post = {
  slug: string; date: string; topic: string; series: string | null; title: string; sub: string; intro: string;
  tricks: Trick[]; caption: string; hashtags: string; sources: string[]; alt: string; slides: number;
};
export type Site = {
  name: string; brand: string; url: string; email: string; whatsapp: string; linkedin: string; github: string; instagram: string; handle: string;
  role: string; roleShort: string; location: string; available: boolean; resume: string; bio: string[];
  skills: { group: string; items: string[] }[];
  services: { title: string; body: string; includes: string[] }[];
  experience: { role: string; company: string; location: string; start: string; end: string; points: string[] }[];
  projects: { title: string; body: string; result?: string; link?: string; tags?: string[] }[];
  education: { degree: string; school: string; years: string } | null;
  languages: string[];
  stats: { label: string; value: string }[];
  achievements: { title: string; detail: string }[];
};
