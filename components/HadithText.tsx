"use client";
// Loads one hadith of Sahih al-Bukhari (Arabic + English) at runtime from the open hadith-api
// dataset on jsDelivr, shown exactly as the source gives it. No text is stored in the repo.
import { useEffect, useState } from "react";

const API = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";
type File = { metadata?: { section?: Record<string, string> }; hadiths: Array<{ text: string; reference?: { book: number; hadith: number } }> };

export function HadithText({ n }: { n: number }) {
  const [en, setEn] = useState<string | null>(null);
  const [ar, setAr] = useState<string | null>(null);
  const [book, setBook] = useState<string | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let live = true;
    Promise.all([fetch(`${API}/eng-bukhari/${n}.min.json`), fetch(`${API}/ara-bukhari/${n}.min.json`)])
      .then(async ([a, b]) => { if (!a.ok) throw new Error(); const e = await a.json() as File; const r = b.ok ? await b.json() as File : null; return { e, r }; })
      .then(({ e, r }) => {
        if (!live) return;
        setEn(e.hadiths[0]?.text ?? null); setAr(r?.hadiths[0]?.text ?? null);
        const sec = e.metadata?.section; const name = sec ? Object.values(sec).find(Boolean) : null; setBook(name ?? null);
      })
      .catch(() => live && setError(true));
    return () => { live = false; };
  }, [n]);

  if (error) return <div className="notice" role="alert">The text could not be loaded right now. Read it on <a className="ul" href={`https://sunnah.com/bukhari:${n}`} target="_blank" rel="noopener noreferrer">Sunnah.com (al-Bukhari {n})</a>.</div>;
  if (!en) return <div className="row hloading" aria-busy="true"><p>Loading the text of al-Bukhari {n}…</p></div>;
  return <div className="htext">
    {book && <p className="help">Book: {book}</p>}
    {ar && <p className="ar hadith-ar" lang="ar" dir="rtl">{ar}</p>}
    <p className="hadith-en">{en}</p>
    <p className="help">Arabic and English (Muhsin Khan's translation) from the open <a href="https://github.com/fawazahmed0/hadith-api" target="_blank" rel="noopener noreferrer">hadith-api dataset</a>, shown as given.</p>
  </div>;
}
