"use client";
// Research Room tools: prayer times (with CSV / calendar / print downloads), Qibla direction,
// a zakah calculator and a surah download. All free, no API key, run in the visitor's browser.
//   Prayer times: AlAdhan API (api.aladhan.com), calculated times, not mosque iqamah times.
//   Surah text: AlQuran Cloud (Uthmani Arabic + Pickthall's 1930 English, public domain).
import { useMemo, useState } from "react";
import { surahs, ATTRIBUTION } from "../lib/surahs";

const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const FIVE = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const METHODS: Array<[number, string]> = [
  [2, "ISNA (North America)"], [3, "Muslim World League"], [4, "Umm al-Qura (Makkah)"],
  [5, "Egyptian General Authority"], [1, "University of Islamic Sciences, Karachi"],
  [15, "Moonsighting Committee Worldwide"], [8, "Gulf Region"], [7, "Institute of Geophysics, Tehran"],
];
const KAABA = { lat: 21.4225, lon: 39.8262 };

interface Day { date: string; readable: string; hijri: string; times: Record<string, string> }
interface Month { days: Day[]; tz: string; place: string; method: string; lat: number; lon: number }

const clean = (t: string) => t.replace(/\s*\(.*\)$/, "").trim();
function save(name: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function bearing(lat: number, lon: number) {
  const r = Math.PI / 180, f1 = lat * r, f2 = KAABA.lat * r, dl = (KAABA.lon - lon) * r;
  const y = Math.sin(dl) * Math.cos(f2), x = Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl);
  return (Math.atan2(y, x) / r + 360) % 360;
}
function distanceKm(lat: number, lon: number) {
  const r = Math.PI / 180, a = Math.sin((KAABA.lat - lat) * r / 2) ** 2 + Math.cos(lat * r) * Math.cos(KAABA.lat * r) * Math.sin((KAABA.lon - lon) * r / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
const compass = (d: number) => ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"][Math.round(d / 22.5) % 16];

function locate(): Promise<{ lat: number; lon: number }> {
  return new Promise((res, rej) => {
    if (!navigator.geolocation) return rej(new Error("Your browser does not share location. Type your city instead."));
    navigator.geolocation.getCurrentPosition(p => res({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => rej(new Error("Location permission was not given. Type your city instead.")), { timeout: 10000 });
  });
}

/* ---------------- Prayer times ---------------- */
function PrayerTimes({ onPlace }: { onPlace: (p: { lat: number; lon: number; place: string }) => void }) {
  const now = new Date();
  const [city, setCity] = useState(""); const [country, setCountry] = useState("");
  const [method, setMethod] = useState(2); const [school, setSchool] = useState(0);
  const [ym, setYm] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
  const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Month | null>(null);

  async function load(coords?: { lat: number; lon: number }) {
    setBusy(true); setError(null);
    try {
      const [y, m] = ym.split("-");
      const p = new URLSearchParams({ method: String(method), school: String(school) });
      let url: string, place: string;
      if (coords) { p.set("latitude", String(coords.lat)); p.set("longitude", String(coords.lon)); url = `https://api.aladhan.com/v1/calendar/${y}/${Number(m)}?${p}`; place = "your location"; }
      else {
        if (!city.trim() || !country.trim()) throw new Error("Enter both a city and a country (e.g. Boston, US), or use your location.");
        p.set("city", city.trim()); p.set("country", country.trim()); url = `https://api.aladhan.com/v1/calendarByCity/${y}/${Number(m)}?${p}`; place = `${city.trim()}, ${country.trim()}`;
      }
      const r = await fetch(url); const j = await r.json();
      if (j.code !== 200 || !Array.isArray(j.data) || !j.data.length) throw new Error("Prayer times were not found for that place. Check the spelling or use your location.");
      type D = { timings: Record<string, string>; date: { readable: string; gregorian: { date: string }; hijri: { day: string; month: { en: string }; year: string } }; meta: { timezone: string; latitude: number; longitude: number; method: { name: string } } };
      const rows = j.data as D[]; const meta = rows[0].meta;
      const month: Month = {
        tz: meta.timezone, place, method: meta.method.name, lat: meta.latitude, lon: meta.longitude,
        days: rows.map(d => ({ date: d.date.gregorian.date, readable: d.date.readable, hijri: `${d.date.hijri.day} ${d.date.hijri.month.en} ${d.date.hijri.year}`, times: Object.fromEntries(PRAYERS.map(k => [k, clean(d.timings[k])])) })),
      };
      setData(month); onPlace({ lat: meta.latitude, lon: meta.longitude, place });
    } catch (e) { setError(e instanceof Error ? e.message : "Prayer times could not be loaded. Please try again."); }
    finally { setBusy(false); }
  }
  async function useLocation() { try { await load(await locate()); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }

  const todayKey = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
  const today = data?.days.find(d => d.date === todayKey);
  const fileBase = data ? `prayer-times-${data.place.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${ym}` : "prayer-times";

  function csv() {
    if (!data) return;
    const lines = [["Date", "Hijri", ...PRAYERS].join(","), ...data.days.map(d => [d.readable, d.hijri, ...PRAYERS.map(k => d.times[k])].map(v => `"${v}"`).join(","))];
    save(`${fileBase}.csv`, `﻿${lines.join("\r\n")}\r\n`, "text/csv;charset=utf-8");
  }
  function ics() {
    if (!data) return;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
    const ev = data.days.flatMap(d => {
      const [dd, mm, yyyy] = d.date.split("-");
      return FIVE.map(k => {
        const [hh, mi] = d.times[k].split(":");
        const start = `${yyyy}${mm}${dd}T${hh}${mi}00`;
        return ["BEGIN:VEVENT", `UID:${yyyy}${mm}${dd}-${k}-${fileBase}@knowlege.org`, `DTSTAMP:${stamp}`,
          `DTSTART;TZID=${data.tz}:${start}`, "DURATION:PT15M", `SUMMARY:${k} prayer`,
          `DESCRIPTION:${k} time for ${data.place} (${data.method}). Calculated time; check your local mosque.`,
          "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:Time for ${k}`, "TRIGGER:PT0M", "END:VALARM", "END:VEVENT"].join("\r\n");
      });
    });
    save(`${fileBase}.ics`, ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Knowlege.org//Prayer Times//EN", "CALSCALE:GREGORIAN", `X-WR-CALNAME:Prayer times · ${data.place}`, `X-WR-TIMEZONE:${data.tz}`, ...ev, "END:VCALENDAR"].join("\r\n") + "\r\n", "text/calendar;charset=utf-8");
  }

  return <div className="tool">
    <form className="toolform" onSubmit={e => { e.preventDefault(); load(); }}>
      <label>City<input className="input" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Boston" /></label>
      <label>Country<input className="input" value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. US" /></label>
      <label>Month<input className="input" type="month" value={ym} onChange={e => setYm(e.target.value)} /></label>
      <label>Calculation method<select className="input" value={method} onChange={e => setMethod(Number(e.target.value))}>{METHODS.map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select></label>
      <label>Asr time<select className="input" value={school} onChange={e => setSchool(Number(e.target.value))}><option value={0}>Standard (Shafi'i, Maliki, Hanbali)</option><option value={1}>Hanafi</option></select></label>
      <div className="toolbtns"><button className="btn primary" disabled={busy}>{busy ? "Loading…" : "Show times"}</button><button type="button" className="btn" onClick={useLocation} disabled={busy}>Use my location</button></div>
    </form>
    <p className="help">Times are calculated from your location and the method you choose, so they can differ by a few minutes from your mosque's timetable. Not sure which method? Most North American mosques use ISNA; the Hanafi option only changes Asr. Read the <a href="/knowledge-hub/salah/prayer-times">Prayer Times guide</a> for how each time is set.</p>
    {error && <div className="notice" role="alert">{error}</div>}
    {data && <>
      {today && <div className="today" aria-label="Today's prayer times">
        <p className="help">Today in {data.place} · {today.hijri} AH</p>
        <ol>{PRAYERS.map(k => <li key={k} className={k === "Sunrise" ? "sun" : ""}><span>{k}</span><strong>{today.times[k]}</strong></li>)}</ol>
      </div>}
      <div className="toolbtns dl">
        <button type="button" className="btn primary" onClick={ics}>Add to my calendar (.ics)</button>
        <button type="button" className="btn" onClick={csv}>Download spreadsheet (.csv)</button>
        <button type="button" className="btn" onClick={() => window.print()}>Print / save as PDF</button>
      </div>
      <p className="help">The calendar file adds the five daily prayers for the month to Google Calendar, Apple Calendar or Outlook, each with a reminder at prayer time. Open the file on your phone or import it (<a href="https://support.google.com/calendar/answer/37118" target="_blank" rel="noopener noreferrer">how to import in Google Calendar</a>). For print, choose "Save as PDF" in the print window.</p>
      <div className="tablewrap printable">
        <h3 className="printonly">Prayer times · {data.place} · {ym} · {data.method}</h3>
        <table className="ptable"><caption>Prayer times for {data.place}, {data.method} ({data.tz})</caption>
          <thead><tr><th>Date</th><th>Hijri</th>{PRAYERS.map(k => <th key={k}>{k}</th>)}</tr></thead>
          <tbody>{data.days.map(d => <tr key={d.date} className={d.date === todayKey ? "now" : ""}><td>{d.readable}</td><td>{d.hijri}</td>{PRAYERS.map(k => <td key={k}>{d.times[k]}</td>)}</tr>)}</tbody>
        </table>
        <p className="help">Source: calculated by the <a href="https://aladhan.com/prayer-times-api" target="_blank" rel="noopener noreferrer">AlAdhan prayer times API</a>. Printed from Knowlege.org.</p>
      </div>
    </>}
  </div>;
}

/* ---------------- Qibla ---------------- */
function Qibla({ place }: { place: { lat: number; lon: number; place: string } | null }) {
  const [pos, setPos] = useState<{ lat: number; lon: number; place: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const at = pos ?? place;
  async function go() { setError(null); try { const c = await locate(); setPos({ ...c, place: "your location" }); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }
  const deg = at ? bearing(at.lat, at.lon) : null; const km = at ? distanceKm(at.lat, at.lon) : 0;
  return <div className="tool">
    <div className="toolbtns"><button type="button" className="btn primary" onClick={go}>Find Qibla from my location</button></div>
    <p className="help">Uses your device location once, in your browser; nothing is stored. If you already loaded prayer times above, that place is used. The direction is the great-circle bearing to the Ka'bah, measured clockwise from true north.</p>
    {error && <div className="notice" role="alert">{error}</div>}
    {deg !== null && at && <div className="qibla">
      <div className="dial" aria-hidden="true"><span className="n">N</span><span className="needle" style={{ transform: `rotate(${deg}deg)` }} /></div>
      <div>
        <p className="big">{deg.toFixed(1)}° <small>{compass(deg)}</small></p>
        <p className="help">From {at.place} ({at.lat.toFixed(3)}, {at.lon.toFixed(3)}) · {Math.round(km).toLocaleString()} km / {Math.round(km * 0.621371).toLocaleString()} miles to Makkah.</p>
        <p className="help">To face it, stand with a compass pointing north, then turn {deg.toFixed(0)}° clockwise. Phone compasses read magnetic north, which can be off by a few degrees in some places.</p>
      </div>
    </div>}
  </div>;
}

/* ---------------- Zakah ---------------- */
function Zakah() {
  const fields: Array<[string, string]> = [["cash", "Cash at home and in bank accounts"], ["gold", "Value of gold you own"], ["silver", "Value of silver you own"], ["invest", "Shares, funds and other investments"], ["stock", "Business stock for sale"], ["owed", "Money owed to you that you expect back"], ["debts", "Debts and bills due now (subtracted)"]];
  const [v, setV] = useState<Record<string, string>>({});
  const [basis, setBasis] = useState<"silver" | "gold">("silver"); const [price, setPrice] = useState("");
  const n = (k: string) => Math.max(0, Number(v[k]) || 0);
  const assets = ["cash", "gold", "silver", "invest", "stock", "owed"].reduce((a, k) => a + n(k), 0);
  const net = Math.max(0, assets - n("debts"));
  const nisab = (Number(price) || 0) * (basis === "gold" ? 85 : 595);
  const due = nisab > 0 && net >= nisab ? net * 0.025 : 0;
  const f = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return <div className="tool">
    <div className="toolform">
      {fields.map(([k, l]) => <label key={k}>{l}<input className="input" inputMode="decimal" value={v[k] ?? ""} onChange={e => setV({ ...v, [k]: e.target.value })} placeholder="0" /></label>)}
      <label>Nisab measure<select className="input" value={basis} onChange={e => setBasis(e.target.value as "silver" | "gold")}><option value="silver">Silver: 595 g</option><option value="gold">Gold: 85 g</option></select></label>
      <label>Today's {basis} price per gram<input className="input" inputMode="decimal" value={price} onChange={e => setPrice(e.target.value)} placeholder={basis === "gold" ? "e.g. 85.00" : "e.g. 1.05"} /></label>
    </div>
    <div className="zresult" aria-live="polite">
      <div><span>Zakatable wealth</span><strong>{f(net)}</strong></div>
      <div><span>Nisab</span><strong>{nisab ? f(nisab) : "Enter price"}</strong></div>
      <div className="due"><span>Zakah due (2.5%)</span><strong>{nisab ? f(due) : "—"}</strong></div>
    </div>
    <p className="help">{nisab && net < nisab ? "Your zakatable wealth is below the nisab, so no zakah is due on it. " : ""}Zakah is due on wealth at or above the nisab that you have held for one lunar year. Use any one currency throughout. Many scholars advise the silver measure because it is lower and benefits more people; look up today's price per gram from a bullion dealer or <a href="https://www.kitco.com/" target="_blank" rel="noopener noreferrer">Kitco</a>. Personal home, car and everyday jewellery rules differ between the schools: read the <a href="/knowledge-hub/zakah">Zakah guide</a> and ask a qualified scholar about your case.</p>
  </div>;
}

/* ---------------- Surah download ---------------- */
function SurahDownload() {
  const [n, setN] = useState(1); const [mode, setMode] = useState("both");
  const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null);
  const s = useMemo(() => surahs.find(x => x.n === n)!, [n]);
  async function go() {
    setBusy(true); setError(null);
    try {
      const eds = mode === "ar" ? "quran-uthmani" : mode === "en" ? "en.pickthall" : "quran-uthmani,en.pickthall";
      const j = await (await fetch(`https://api.alquran.cloud/v1/surah/${n}/editions/${eds}`)).json();
      if (j.code !== 200) throw new Error("The surah could not be loaded. Please try again.");
      type E = { edition: { identifier: string }; ayahs: Array<{ numberInSurah: number; text: string }> };
      const list = j.data as E[]; const ar = list.find(e => e.edition.identifier === "quran-uthmani"); const en = list.find(e => e.edition.identifier === "en.pickthall");
      const head = [`Surah ${s.n}: ${s.name} (${s.ar}), "${s.meaning}" · ${s.verses} verses · ${s.type}`, `Source: ${ATTRIBUTION}. Downloaded from Knowlege.org (https://knowlege.org/quran/${s.n}).`, ""];
      const body = (ar ?? en)!.ayahs.map((a, i) => [`[${s.n}:${a.numberInSurah}]`, ar?.ayahs[i]?.text, en?.ayahs[i]?.text, ""].filter(x => x !== undefined).join("\n"));
      save(`surah-${String(s.n).padStart(3, "0")}-${s.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.txt`, `﻿${[...head, ...body].join("\n")}`, "text/plain;charset=utf-8");
    } catch (e) { setError(e instanceof Error ? e.message : "Download failed. Please try again."); }
    finally { setBusy(false); }
  }
  return <div className="tool">
    <div className="toolform">
      <label>Surah<select className="input" value={n} onChange={e => setN(Number(e.target.value))}>{surahs.map(x => <option key={x.n} value={x.n}>{x.n}. {x.name} · {x.meaning}</option>)}</select></label>
      <label>Text<select className="input" value={mode} onChange={e => setMode(e.target.value)}><option value="both">Arabic with English</option><option value="ar">Arabic only</option><option value="en">English only</option></select></label>
      <div className="toolbtns"><button type="button" className="btn primary" onClick={go} disabled={busy}>{busy ? "Preparing…" : "Download (.txt)"}</button></div>
    </div>
    <p className="help">A plain-text file you can read offline, print or copy into notes, with every verse numbered. Arabic: Uthmani script; English: Pickthall (1930, public domain), both via <a href="https://alquran.cloud/api" target="_blank" rel="noopener noreferrer">AlQuran Cloud</a>. To read online with audio, open <a href={`/quran/${n}`}>Surah {s.name}</a> in our Qur'an reader.</p>
    {error && <div className="notice" role="alert">{error}</div>}
  </div>;
}

const TABS = [["prayer", "Prayer times"], ["qibla", "Qibla direction"], ["zakah", "Zakah calculator"], ["surah", "Download a surah"]] as const;
export function ResearchTools() {
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("prayer");
  const [place, setPlace] = useState<{ lat: number; lon: number; place: string } | null>(null);
  return <div className="toolbox">
    <div className="tabs" role="tablist" aria-label="Research Room tools">
      {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
      <a className="tablink" href="/islamic-calendar">Islamic calendar ↗</a>
    </div>
    <div role="tabpanel">
      <div hidden={tab !== "prayer"}><PrayerTimes onPlace={setPlace} /></div>
      {tab === "qibla" && <Qibla place={place} />}
      {tab === "zakah" && <Zakah />}
      {tab === "surah" && <SurahDownload />}
    </div>
  </div>;
}
