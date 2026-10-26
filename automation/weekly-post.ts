// Weekly Qur'an reflection for knowlege.org (CONTENT_GOVERNANCE.md applies).
// Every quoted text is FETCHED, never written by the AI:
//   Qur'an: api.alquran.cloud, Uthmani Arabic + Pickthall's English (1930, public domain)
//   Hadith: the six books only (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah)
//           from the open hadith-api dataset (fawazahmed0), Arabic + English, grades as given.
// The AI suggests references, keeps only the fetched texts that fit the theme, and writes a
// reflection that cites them by token ([Q 2:153], [H bukhari 6114]). Code then checks that
// every token is a fetched source and that the text has no quotes, links, rulings or selling.
// No verified sources or a failed check = no post. The post is opened as a PR for review.
// Needs ANTHROPIC_API_KEY. Optional: ANTHROPIC_MODEL, THEME (force a theme).
import fs from "node:fs";

export const THEMES = ["Mercy", "Justice", "Knowledge", "Family", "Charity", "Patience", "Gratitude", "Stewardship", "Human dignity", "Responsible citizenship"];
export const COLLECTIONS: Record<string, string> = {
  bukhari: "Sahih al-Bukhari", muslim: "Sahih Muslim", abudawud: "Sunan Abi Dawud",
  tirmidhi: "Jami' at-Tirmidhi", nasai: "Sunan an-Nasa'i", ibnmajah: "Sunan Ibn Majah"
};
export const TRANSLATION = { edition: "en.pickthall", name: "Marmaduke Pickthall (1930)" };
const POSTS = "content/posts.json";
const HADITH_API = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";
export const DISCLAIMER = "An AI-assisted reflection, written only from the Qur'an verses and hadith shown below and reviewed before publication. It is not a religious ruling (fatwa); for rulings, ask a qualified scholar.";

export interface Ayah { id: string; ref: string; surah: string; surahNumber: number; ayah: number; arabic: string; english: string; url: string }
export interface Hadith { id: string; collection: string; book: string; number: number; arabic: string; english: string; grades: Array<{ name: string; grade: string }>; section: string | null; source: string }
export interface Section { heading: string | null; paragraphs: string[] }
export interface Post { slug: string; date: string; theme: string; title: string; summary: string; sections: Section[]; ayahs: Ayah[]; hadiths: Hadith[]; translation: string; hadithSource: string; model: string; disclaimer: string }

// ---------------- sources ----------------

export async function fetchAyah(ref: string): Promise<Ayah | null> {
  if (!/^\d{1,3}:\d{1,3}$/.test(ref)) return null;
  const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ref}/editions/quran-uthmani,${TRANSLATION.edition}`);
  if (!res.ok) return null;
  const j = await res.json() as { code?: number; data?: Array<{ text: string; numberInSurah: number; surah: { number: number; englishName: string }; edition: { identifier: string } }> };
  const ar = j.data?.find(d => d.edition.identifier === "quran-uthmani"), en = j.data?.find(d => d.edition.identifier === TRANSLATION.edition);
  if (j.code !== 200 || !ar || !en) return null;
  return { id: `Q ${ref}`, ref, surah: ar.surah.englishName, surahNumber: ar.surah.number, ayah: ar.numberInSurah, arabic: ar.text, english: en.text, url: `https://quran.com/${ar.surah.number}/${ar.numberInSurah}` };
}

export async function fetchHadith(collection: string, number: number): Promise<Hadith | null> {
  if (!COLLECTIONS[collection] || !Number.isInteger(number) || number < 1 || number > 10000) return null;
  const get = async (lang: string) => {
    const res = await fetch(`${HADITH_API}/${lang}-${collection}/${number}.min.json`);
    if (!res.ok) return null;
    return await res.json() as { metadata?: { name?: string; section?: Record<string, string> }; hadiths?: Array<{ hadithnumber: number; text: string; grades?: Array<{ name: string; grade: string }> }> };
  };
  const [en, ar] = await Promise.all([get("eng"), get("ara")]);
  const e = en?.hadiths?.[0], a = ar?.hadiths?.[0];
  if (!e || !a || !e.text?.trim() || e.hadithnumber !== number) return null;
  const section = Object.values(en?.metadata?.section || {})[0] || null;
  return { id: `H ${collection} ${number}`, collection, book: COLLECTIONS[collection], number, arabic: a.text.trim(), english: e.text.trim(), grades: (e.grades || []).filter(g => g?.grade), section, source: `${HADITH_API}/eng-${collection}/${number}.json` };
}

// ---------------- AI ----------------

async function claude(system: string, prompt: string, maxTokens = 2500): Promise<Record<string, unknown>> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": process.env.ANTHROPIC_API_KEY || "", "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: maxTokens, temperature: 0.3, system, messages: [{ role: "user", content: prompt }] })
  });
  const j = await res.json() as { content?: Array<{ type: string; text?: string }>; error?: { message?: string } };
  if (!res.ok) throw new Error(`Anthropic: ${j.error?.message || res.status}`);
  const text = (j.content || []).filter(c => c.type === "text").map(c => c.text).join("");
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("The AI didn't reply with JSON.");
  return JSON.parse(m[0]);
}

// ---------------- checks ----------------

const TOKEN = /\[(Q \d{1,3}:\d{1,3}|H [a-z]+ \d{1,5})\]/g;
export function checkPost(sections: Section[], ids: Set<string>): string[] {
  const problems: string[] = [];
  const text = sections.map(s => [s.heading || "", ...s.paragraphs].join("\n")).join("\n");
  const used = new Set([...text.matchAll(TOKEN)].map(m => m[1]));
  for (const u of used) if (!ids.has(u)) problems.push(`[${u}] is not one of the fetched sources`);
  if (!used.size) problems.push("no source is cited");
  const bare = text.replace(TOKEN, " ");
  if (/\b\d{1,3}\s*:\s*\d{1,3}\b/.test(bare)) problems.push("a verse reference appears outside a [Q …] token");
  if (/\b(bukhari|muslim|dawud|tirmidhi|nasa'?i|majah)\b[^.\n]{0,20}\d/i.test(bare)) problems.push("a hadith reference appears outside an [H …] token");
  if (/["“][^"”]{40,}["”]/.test(bare)) problems.push("the text quotes a passage; quotes are shown from the sources, not written");
  if (/https?:\/\/|www\./i.test(bare)) problems.push("the text contains a link");
  if (/\b(buy|shop|discount|sale|coupon|affiliate|sponsor(ed)?|promo|order now|price)\b/i.test(bare)) problems.push("the text has commercial words");
  if (/\b(fatwa|haram|halal|it is (obligatory|forbidden)|you must)\b/i.test(bare)) problems.push("the text reads like a ruling");
  if (/\b(sahih|hasan|da'?if|weak|authentic|graded)\b/i.test(bare)) problems.push("the text makes grading claims; grades are shown only from the source");
  return problems;
}

// ---------------- the run ----------------

function slugify(s: string) { return s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 70); }

const WRITE_RULES = `You write a weekly reflection for knowlege.org, a respectful Islamic learning portal. Rules, all strict:
- Use ONLY the Qur'an verses and hadith provided. Do not mention any other verse, hadith, scholar, book or event.
- Cite each source with its token exactly as given, e.g. [Q 2:153] or [H bukhari 6114]. Never write a reference any other way.
- Do not quote the texts; they are shown in full next to your reflection. Paraphrase briefly and explain.
- No religious rulings (nothing is declared obligatory, forbidden, halal or haram), no hadith grading, no claims of consensus.
- No links, no products, no promotion, no calls to buy or donate.
- Humble, clear, warm and scholarly. 600 to 900 words, 3 to 5 short sections with plain headings, one idea per paragraph.
Reply with JSON only: {"title": string (under 70 characters), "summary": string (under 160 characters), "sections": [{"heading": string, "paragraphs": [string]}]}.`;

export async function run(): Promise<Post | null> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("Add the ANTHROPIC_API_KEY secret to this repository.");
  const posts: Post[] = fs.existsSync(POSTS) ? JSON.parse(fs.readFileSync(POSTS, "utf8")) : [];
  const week = Math.floor(Date.now() / (7 * 86400000));
  const theme = process.env.THEME && THEMES.includes(process.env.THEME) ? process.env.THEME : THEMES[week % THEMES.length];
  const usedRefs = posts.flatMap(p => [...p.ayahs.map(a => a.id), ...p.hadiths.map(h => h.id)]).slice(-60);

  // 1. References only (no text).
  const plan = await claude(
    "You are a careful Islamic studies research assistant. Suggest references only, never quote. Suggest only references you are highly confident are correct and on topic. Hadith numbers use the standard numbering of each collection (as on sunnah.com).",
    `Theme: ${theme}. Suggest 5 Qur'an verses (surah:ayah) and 6 hadith from these collections only: ${Object.keys(COLLECTIONS).join(", ")}. Avoid these, used recently: ${usedRefs.join(", ") || "none"}. Reply JSON: {"ayahs": ["2:153"], "hadiths": [{"collection": "bukhari", "number": 6114}]}`, 800);
  const ayahs = (await Promise.all(((plan.ayahs as string[]) || []).slice(0, 6).map(r => fetchAyah(String(r).trim())))).filter((a): a is Ayah => Boolean(a));
  const hadiths = (await Promise.all(((plan.hadiths as Array<{ collection: string; number: number }>) || []).slice(0, 8).map(h => fetchHadith(String(h.collection).toLowerCase(), Number(h.number))))).filter((h): h is Hadith => Boolean(h));

  // 2. Keep only fetched texts that really fit the theme.
  const listing = [...ayahs.map(a => `${a.id}: ${a.english}`), ...hadiths.map(h => `${h.id}: ${h.english.slice(0, 900)}`)].join("\n\n");
  const judged = listing ? await claude("Judge only from the texts given. Be strict.", `Theme: ${theme}.\n\n${listing}\n\nWhich of these texts clearly speak to the theme? Reply JSON: {"keep": ["Q 2:153", "H bukhari 6114"]}`, 600) : { keep: [] };
  const keep = new Set(((judged.keep as string[]) || []).map(String));
  const keptAyahs = ayahs.filter(a => keep.has(a.id)).slice(0, 4), keptHadiths = hadiths.filter(h => keep.has(h.id)).slice(0, 4);
  if (keptAyahs.length < 2 || keptHadiths.length < 1) { console.log(`No post this week: only ${keptAyahs.length} verses and ${keptHadiths.length} hadith were verified for "${theme}".`); return null; }

  // 3. Write from the verified texts, then check; one retry with the problems fed back.
  const ids = new Set([...keptAyahs.map(a => a.id), ...keptHadiths.map(h => h.id)]);
  const sources = [...keptAyahs.map(a => `[${a.id}] (Qur'an, ${a.surah} ${a.ref}, tr. Pickthall): ${a.english}`), ...keptHadiths.map(h => `[${h.id}] (${h.book} ${h.number}): ${h.english.slice(0, 1500)}`)].join("\n\n");
  let draft: Record<string, unknown> = {}, problems: string[] = ["not written"];
  for (let attempt = 0; attempt < 2 && problems.length; attempt++) {
    draft = await claude(WRITE_RULES, `Theme: ${theme}\n\nSources:\n\n${sources}${attempt ? `\n\nYour last draft was rejected for: ${problems.join("; ")}. Fix all of these.` : ""}`, 3000);
    const sections = ((draft.sections as Section[]) || []).map(s => ({ heading: s.heading ? String(s.heading) : null, paragraphs: (s.paragraphs || []).map(String).filter(Boolean) })).filter(s => s.paragraphs.length);
    draft.sections = sections;
    problems = sections.length ? checkPost(sections, ids) : ["no sections"];
    if (!problems.length && checkPost([{ heading: String(draft.title || ""), paragraphs: [String(draft.summary || "")] }], ids).filter(p => !/no source is cited/.test(p)).length) problems = ["the title or summary breaks a rule"];
  }
  if (problems.length) throw new Error(`The reflection failed its checks: ${problems.join("; ")}`);

  const sections = draft.sections as Section[];
  const used = new Set(sections.flatMap(s => s.paragraphs.flatMap(p => [...p.matchAll(TOKEN)].map(m => m[1]))));
  const date = new Date().toISOString().slice(0, 10);
  const title = String(draft.title).slice(0, 90);
  const post: Post = {
    slug: `${slugify(title)}-${date}`, date, theme, title, summary: String(draft.summary).slice(0, 200), sections,
    ayahs: keptAyahs.filter(a => used.has(a.id)), hadiths: keptHadiths.filter(h => used.has(h.id)),
    translation: TRANSLATION.name, hadithSource: "hadith-api by fawazahmed0 (open dataset of the six books)", model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", disclaimer: DISCLAIMER
  };
  fs.mkdirSync("content", { recursive: true });
  fs.writeFileSync(POSTS, JSON.stringify([post, ...posts], null, 2) + "\n");
  fs.writeFileSync(".post-review.md", [
    `Weekly reflection on **${theme}**, written only from the sources below, which were fetched and checked automatically.`,
    "", "**Please check before merging:** each paraphrase is faithful to its source, nothing reads as a ruling, and the tone fits the site.", "",
    "**Qur'an (Pickthall)**", ...post.ayahs.map(a => `- ${a.surah} ${a.ref}: [quran.com](${a.url})`), "",
    "**Hadith**", ...post.hadiths.map(h => `- ${h.book} ${h.number}${h.grades.length ? ` (grade given by source: ${h.grades.map(g => `${g.name}: ${g.grade}`).join("; ")})` : ""}: [source](${h.source})`), "",
    "Merging publishes it at /blog. Closing this PR drops it."
  ].join("\n"));
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `slug=${post.slug}\ntitle=${title.replace(/[\r\n]/g, " ")}\n`);
  console.log(`Wrote "${title}" with ${post.ayahs.length} verses and ${post.hadiths.length} hadith.`);
  return post;
}

if (process.argv[1] && /weekly-post\.ts$/.test(process.argv[1])) run().catch(e => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
