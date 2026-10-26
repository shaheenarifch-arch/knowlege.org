// Weekly Qur'an reflections (written by automation/weekly-post.ts, merged after review).
import data from "../content/posts.json";

export interface Ayah { id: string; ref: string; surah: string; surahNumber: number; ayah: number; arabic: string; english: string; url: string }
export interface Hadith { id: string; collection: string; book: string; number: number; arabic: string; english: string; grades: Array<{ name: string; grade: string }>; section: string | null; source: string }
export interface Section { heading: string | null; paragraphs: string[] }
export interface Post { slug: string; date: string; theme: string; title: string; summary: string; sections: Section[]; ayahs: Ayah[]; hadiths: Hadith[]; translation: string; hadithSource: string; model: string; disclaimer: string }

export const posts: Post[] = (data as unknown as Post[]).slice().sort((a, b) => b.date.localeCompare(a.date));
export const getPost = (slug: string) => posts.find(p => p.slug === slug);

// Splits text on citation tokens like [Q 2:153] or [H bukhari 6114].
export const TOKEN = /\[(Q \d{1,3}:\d{1,3}|H [a-z]+ \d{1,5})\]/g;
export function cite(text: string): Array<string | { id: string }> {
  const out: Array<string | { id: string }> = []; let last = 0;
  for (const m of text.matchAll(TOKEN)) { if (m.index! > last) out.push(text.slice(last, m.index)); out.push({ id: m[1] }); last = m.index! + m[0].length; }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
export const anchor = (id: string) => "src-" + id.toLowerCase().replace(/[^a-z0-9]+/g, "-");
