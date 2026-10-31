// Theme Explorer data (CONTENT_GOVERNANCE.md applies).
// Verse and hadith text in content/themes/*.json is copied verbatim from the source
// datasets by a build script: Qur'an = Pickthall (public domain) via AlQuran Cloud,
// hadith = the open hadith-api dataset, with gradings exactly as the dataset lists them.
// Do not edit scripture text by hand.
import mercy from "../content/themes/mercy.json";
import justice from "../content/themes/justice.json";
import knowledge from "../content/themes/knowledge.json";
import family from "../content/themes/family.json";
import charity from "../content/themes/charity.json";
import patience from "../content/themes/patience.json";
import gratitude from "../content/themes/gratitude.json";
import stewardship from "../content/themes/stewardship.json";
import humanDignity from "../content/themes/human-dignity.json";
import citizenship from "../content/themes/responsible-citizenship.json";
import ethics from "../content/themes/ethics.json";

export interface ThemeVerse { ref: string; lines: Array<{ ayah: number; text: string }> }
export interface ThemeHadith { collection: string; number: number; text: string; grades: Array<{ name: string; grade: string }> }
export interface Theme {
  slug: string; title: string; summary: string; intro: string[];
  guides: string[];   // Knowledge Hub guide slugs
  related: string[];  // other theme slugs
  verses: ThemeVerse[]; hadith: ThemeHadith[];
}

export const themeList: Theme[] = [mercy, justice, knowledge, family, charity, patience, gratitude, stewardship, humanDignity, citizenship, ethics] as Theme[];
export const getTheme = (slug: string) => themeList.find(t => t.slug === slug);

const COLLECTIONS: Record<string, string> = {
  bukhari: "Sahih al-Bukhari", abudawud: "Sunan Abi Dawud", nasai: "Sunan an-Nasa'i", ibnmajah: "Sunan Ibn Majah",
};
export const collectionName = (c: string) => COLLECTIONS[c] ?? c;
export const verseUrl = (ref: string) => { const [s, a] = ref.split(":"); return `https://quran.com/${s}/${a.split("-")[0]}`; };
export const hadithUrl = (h: ThemeHadith) => `https://sunnah.com/${h.collection}:${h.number}`;
/** Grading line exactly as the dataset lists it. Bukhari entries carry no grade: the collection itself is sahih. Others with no grade show nothing. */
export function gradeLine(h: ThemeHadith): string | null {
  if (h.grades.length) return h.grades.map(g => `${g.grade} (${g.name})`).join("; ");
  return h.collection === "bukhari" ? "Sahih al-Bukhari" : null;
}

export const THEME_REVIEWED = "2026-10-31";
export const THEME_DISCLAIMER = "This page gathers what the Qur'an and hadith say on a theme for learning and reflection. It is not a religious ruling (fatwa). For your own situation, ask a qualified scholar or your local imam.";
