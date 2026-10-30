"use client";
// Free source search for the Research Desk. Runs in the visitor's browser, needs no API key.
//   Qur'an: api.alquran.cloud keyword search, Pickthall's English (1930, public domain)
//   Hadith: the six books from the open hadith-api dataset (fawazahmed0) on jsDelivr,
//           one collection at a time (2.6–4.8 MB each, cached by the browser after the first search).
// Texts are shown exactly as the source returns them, with a reference and a link for each result.
import { useRef, useState } from "react";

const COLLECTIONS: Record<string, string> = {
  bukhari: "Sahih al-Bukhari", muslim: "Sahih Muslim", abudawud: "Sunan Abi Dawud",
  tirmidhi: "Jami' at-Tirmidhi", nasai: "Sunan an-Nasa'i", ibnmajah: "Sunan Ibn Majah"
};
// Sunnah.com numbering matches this dataset for al-Bukhari; other collections are numbered
// differently there, so those link to a Sunnah.com text search instead of a numbered page.
function sunnahLink(source: string, number: number, text: string) {
  if (source === "bukhari") return `https://sunnah.com/bukhari:${number}`;
  return `https://sunnah.com/search?q=${encodeURIComponent(text.split(/\s+/).slice(0, 12).join(" "))}`;
}
const HADITH_API = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";
const MAX = 25;

interface Verse { ref: string; surah: string; surahNumber: number; ayah: number; text: string }
interface HadithHit { number: number; text: string; grades: Array<{ name: string; grade: string }> }
interface HadithFile { hadiths: Array<{ hadithnumber: number; text: string; grades?: Array<{ name: string; grade: string }> }> }

export function FreeSearch() {
  const [q, setQ] = useState("");
  const [source, setSource] = useState("quran");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verses, setVerses] = useState<Verse[] | null>(null);
  const [hadith, setHadith] = useState<HadithHit[] | null>(null);
  const [total, setTotal] = useState(0);
  const [searched, setSearched] = useState<{ q: string; source: string } | null>(null);
  const cache = useRef<Record<string, HadithFile>>({});

  async function run(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (term.length < 3) { setError("Please enter at least 3 letters."); return; }
    setBusy(true); setError(null); setVerses(null); setHadith(null); setTotal(0);
    try {
      if (source === "quran") {
        const r = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(term)}/all/en.pickthall`);
        const j = await r.json() as { code: number; data?: { count: number; matches: Array<{ text: string; numberInSurah: number; surah: { number: number; englishName: string } }> } | string };
        if (j.code === 404 || typeof j.data !== "object" || !j.data) { setVerses([]); }
        else if (j.code !== 200) throw new Error("The Qur'an search service did not respond. Please try again.");
        else {
          setTotal(j.data.count);
          setVerses(j.data.matches.slice(0, MAX).map(m => ({ ref: `${m.surah.number}:${m.numberInSurah}`, surah: m.surah.englishName, surahNumber: m.surah.number, ayah: m.numberInSurah, text: m.text })));
        }
      } else {
        let file = cache.current[source];
        if (!file) {
          const r = await fetch(`${HADITH_API}/eng-${source}.min.json`);
          if (!r.ok) throw new Error("The hadith collection could not be loaded. Please try again.");
          file = await r.json() as HadithFile; cache.current[source] = file;
        }
        const words = term.toLowerCase().split(/\s+/).filter(Boolean);
        const hits = file.hadiths.filter(h => { const t = (h.text || "").toLowerCase(); return t && words.every(w => t.includes(w)); });
        setTotal(hits.length);
        setHadith(hits.slice(0, MAX).map(h => ({ number: h.hadithnumber, text: h.text, grades: h.grades ?? [] })));
      }
      setSearched({ q: term, source });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed. Please try again.");
    } finally { setBusy(false); }
  }

  const label = searched ? (searched.source === "quran" ? "the Qur'an" : COLLECTIONS[searched.source]) : "";
  return <section className="section">
    <form onSubmit={run} className="searchbar" role="search" aria-label="Search the Qur'an and hadith">
      <input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="Search a word or phrase, e.g. patience" aria-label="Search words" />
      <select className="input" value={source} onChange={e => setSource(e.target.value)} aria-label="Source to search">
        <option value="quran">Qur'an (English)</option>
        {Object.entries(COLLECTIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <button className="btn primary" disabled={busy}>{busy ? "Searching…" : "Search"}</button>
    </form>
    <p className="help">
      Search in English. Results contain every word you type. Hadith collections are searched one at a time; the first search
      in a collection takes a few seconds to load it. Qur'an text: Marmaduke Pickthall's translation (1930) via{" "}
      <a href="https://alquran.cloud/api" target="_blank" rel="noopener noreferrer">AlQuran Cloud</a>. Hadith text and grades: the open{" "}
      <a href="https://github.com/fawazahmed0/hadith-api" target="_blank" rel="noopener noreferrer">hadith-api dataset</a>, shown as given.{" "}
      <a href="/about#sources">How we use sources</a>.
    </p>
    {error && <div className="notice" role="alert">{error}</div>}
    <div className="results" aria-live="polite">
      {searched && !busy && !error && (verses?.length === 0 || hadith?.length === 0) &&
        <p>No results for "{searched.q}" in {label}. Try a different word, a simpler form (e.g. "patient" instead of "patiently"), or another source.</p>}
      {searched && total > 0 && <p className="help">Showing {Math.min(total, MAX)} of {total} results for "{searched.q}" in {label}.{total > MAX ? " Add another word to narrow the results." : ""}</p>}
      {verses?.map(v => <div className="row" key={v.ref}>
        <h3>Qur'an {v.ref} · {v.surah}</h3>
        <p>{v.text}</p>
        <p><a href={`https://quran.com/${v.surahNumber}/${v.ayah}`} target="_blank" rel="noopener noreferrer">Read {v.ref} with Arabic on Quran.com</a></p>
      </div>)}
      {searched && hadith?.map(h => <div className="row" key={h.number}>
        <h3>{COLLECTIONS[searched.source]} {h.number}</h3>
        <p>{h.text}</p>
        {h.grades.length > 0 && <p className="help">Grades: {h.grades.map(g => `${g.grade} (${g.name})`).join("; ")}</p>}
        <p><a href={sunnahLink(searched.source, h.number, h.text)} target="_blank" rel="noopener noreferrer">{searched.source === "bukhari" ? `Read al-Bukhari ${h.number} with Arabic on Sunnah.com` : "Find this hadith on Sunnah.com"}</a></p>
      </div>)}
    </div>
  </section>;
}
