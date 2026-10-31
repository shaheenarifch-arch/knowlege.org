// Knowledge Hub guides (fiqh): original, source-cited topic guides (CONTENT_GOVERNANCE.md applies).
// Each guide leads with what the four Sunni schools agree on; school-by-school
// differences sit in "More detail and references". Text cites sources with
// tokens: [Q 2:183] -> Qur'an 2:183 on quran.com, [H bukhari 1903] -> sunnah.com.
import salah from "../content/library/guides/salah.json";
import purity from "../content/library/guides/purity.json";
import fasting from "../content/library/guides/fasting.json";
import zakah from "../content/library/guides/zakah.json";
import marriage from "../content/library/guides/marriage.json";

export interface Photo { src: string; alt: string; width: number; height: number; author: string; license: string; licenseUrl: string; sourceUrl: string }
export interface Section { heading: string; paragraphs: string[]; points?: string[] }
export interface SchoolView { question: string; hanafi: string; maliki: string; shafii: string; hanbali: string }
export interface Faq { q: string; a: string }
export interface Guide {
  slug: string; title: string; summary: string; photo: Photo;
  agreed: Section[];          // positions the four schools share
  schools: SchoolView[];      // where they differ (More detail)
  faqs: Faq[];
  furtherReading: Array<{ name: string; url: string }>;
}

export const AUTHOR = "Knowlege.org Editorial";
export const REVIEWER = "Knowlege.org Editorial";
export const LAST_REVIEWED = "2026-10-31";
export const DISCLAIMER = "This guide explains what the Qur'an, the Sunnah and the classical schools say. It is for learning, not a personal religious ruling (fatwa). For your own situation, ask a qualified scholar or your local imam.";

export const guides: Guide[] = [salah, purity, fasting, zakah, marriage] as Guide[];
export const getGuide = (slug: string) => guides.find(g => g.slug === slug);

// All Fiqh topics, in the order shown on /fiqh. Topics without a guide yet show "Coming soon".
export const topics: Array<{ slug: string; title: string; blurb: string }> = [
  { slug: "purity", title: "Purity (Taharah)", blurb: "Wudu, ghusl, tayammum and what breaks them." },
  { slug: "salah", title: "Prayer (Salah)", blurb: "The five daily prayers, their conditions and how to pray." },
  { slug: "janazah", title: "Funerals (Janazah)", blurb: "Washing, shrouding, the funeral prayer and burial." },
  { slug: "zakah", title: "Zakah", blurb: "Who pays, on what wealth, how much and to whom." },
  { slug: "fasting", title: "Fasting (Sawm)", blurb: "Ramadan, what breaks a fast, exemptions and make-up days." },
  { slug: "hajj-umrah", title: "Hajj and Umrah", blurb: "Rites of the pilgrimage, ihram and its rules." },
  { slug: "qurbani", title: "Qurbani (Udhiyah)", blurb: "The Eid sacrifice: who, when and which animals." },
  { slug: "finance-trade", title: "Finance and Trade", blurb: "Riba, contracts, partnerships and fair dealing." },
  { slug: "inheritance", title: "Inheritance", blurb: "The Qur'anic shares and how estates are divided." },
  { slug: "halal-haram", title: "Halal and Haram", blurb: "Food, drink and everyday permissibility." },
  { slug: "family", title: "Family and Children", blurb: "Rights of parents, children and relatives." },
  { slug: "marriage", title: "Marriage (Nikah)", blurb: "The contract, consent, guardian, witnesses and mahr." },
  { slug: "divorce", title: "Divorce", blurb: "Talaq, khul', the waiting period and reconciliation." },
  { slug: "creed", title: "Creed (Aqidah)", blurb: "The six articles of faith and core beliefs." },
  { slug: "etiquette", title: "Etiquette (Adab)", blurb: "Manners of greeting, eating, visiting and speech." },
  { slug: "islamic-months", title: "Islamic Months", blurb: "The Hijri calendar and its blessed days." },
];

export const HUB_PHOTO: Photo = {
  src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/People_Praying_Baitul_Mukarram_Mosque_%289%29.jpg/1280px-People_Praying_Baitul_Mukarram_Mosque_%289%29.jpg",
  alt: "Worshippers standing in rows for prayer inside Baitul Mukarram mosque in Dhaka",
  width: 1280, height: 1707, author: "T. Galib", license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:People_Praying_Baitul_Mukarram_Mosque_(9).jpg",
};

// ---- citations
const COLLECTIONS: Record<string, string> = {
  bukhari: "Sahih al-Bukhari", muslim: "Sahih Muslim", abudawud: "Sunan Abi Dawud",
  tirmidhi: "Jami' at-Tirmidhi", nasai: "Sunan an-Nasa'i", ibnmajah: "Sunan Ibn Majah",
  malik: "Muwatta Malik", ahmad: "Musnad Ahmad",
};
export const REF = /\[(Q \d{1,3}:\d{1,3}(?:-\d{1,3})?|H [a-z]+ \d{1,5}[a-z]?)\]/g;
export interface Ref { label: string; url: string }
export function ref(token: string): Ref {
  if (token.startsWith("Q ")) {
    const v = token.slice(2);
    const [s, a] = v.split(":");
    return { label: `Qur'an ${v}`, url: `https://quran.com/${s}/${a.split("-")[0]}` };
  }
  const [, c, n] = token.split(" ");
  return { label: `${COLLECTIONS[c] ?? c} ${n}`, url: `https://sunnah.com/${c}:${n}` };
}
export function split(text: string): Array<string | Ref> {
  const out: Array<string | Ref> = [];
  let last = 0;
  for (const m of text.matchAll(REF)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push(ref(m[1]));
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
/** Every source a guide cites, in first-use order. */
export function references(g: Guide): Ref[] {
  const texts = [
    ...g.agreed.flatMap(s => [...s.paragraphs, ...(s.points ?? [])]),
    ...g.schools.flatMap(s => [s.hanafi, s.maliki, s.shafii, s.hanbali]),
    ...g.faqs.map(f => f.a),
  ];
  const seen = new Map<string, Ref>();
  for (const t of texts) for (const m of t.matchAll(REF)) { const r = ref(m[1]); seen.set(r.url, r); }
  return [...seen.values()];
}
export const plain = (text: string) => text.replace(REF, (_, t) => `(${ref(t).label})`);
