"use client";
// Qur'an reader for one surah. Runs in the visitor's browser and needs no API key.
//   Arabic: Uthmani text (quran-uthmani); English: Marmaduke Pickthall (1930, public domain),
//   both from api.alquran.cloud. Texts are shown exactly as the source returns them.
import { useEffect, useState } from "react";

interface Ayah { numberInSurah: number; text: string }
interface Edition { edition: { identifier: string }; ayahs: Ayah[] }
interface Row { n: number; ar: string; en: string }

export function SurahReader({ surah }: { surah: number }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    setRows(null); setError(null);
    (async () => {
      try {
        const r = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/editions/quran-uthmani,en.pickthall`);
        const j = await r.json() as { code: number; data?: Edition[] | string };
        if (j.code !== 200 || !Array.isArray(j.data)) throw new Error("The Qur'an text service did not respond. Please try again.");
        const ar = j.data.find(e => e.edition.identifier === "quran-uthmani");
        const en = j.data.find(e => e.edition.identifier === "en.pickthall");
        if (!ar || !en) throw new Error("The Qur'an text could not be loaded. Please try again.");
        const enBy = new Map(en.ayahs.map(a => [a.numberInSurah, a.text]));
        if (live) setRows(ar.ayahs.map(a => ({ n: a.numberInSurah, ar: a.text, en: enBy.get(a.numberInSurah) ?? "" })));
      } catch (err) {
        if (live) setError(err instanceof Error && err.message.startsWith("The Qur'an") ? err.message : "The Qur'an text could not be loaded. Check your connection and try again.");
      }
    })();
    return () => { live = false; };
  }, [surah, attempt]);

  if (error) return <div className="notice" role="alert">
    {error}{" "}
    <button className="btn" onClick={() => setAttempt(a => a + 1)}>Try again</button>{" "}
    <a href={`https://quran.com/${surah}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Read this surah on Quran.com</a>
  </div>;
  if (!rows) return <p className="help" aria-live="polite">Loading the surah text…</p>;
  return <ol className="ayahs" aria-label="Verses">
    {rows.map(v => <li className="row" key={v.n} id={`a${v.n}`}>
      <p className="ayahno"><a href={`#a${v.n}`} aria-label={`Link to verse ${surah}:${v.n}`}>{surah}:{v.n}</a></p>
      <p className="ar" lang="ar" dir="rtl">{v.ar}</p>
      <p lang="en">{v.en}</p>
      <p className="help"><a href={`https://quran.com/${surah}/${v.n}`} target="_blank" rel="noopener noreferrer">Read on Quran.com</a></p>
    </li>)}
  </ol>;
}
