"use client";
// Ramadan 1448 (2027) sehri and iftar timetable for any city, from the AlAdhan API (no key).
// Sehri ends at Fajr; iftar is at Maghrib. Imsak is a precautionary time ~10 minutes before Fajr.
import { useEffect, useState } from "react";

const YEAR = 1448; // Ramadan 1448 AH: expected to begin around 8 February 2027 (moon sighting may shift it by a day)
const START = new Date("2027-02-08T00:00:00");
const CITIES: Array<[string, string]> = [["Boston", "US"], ["New York", "US"], ["Chicago", "US"], ["Houston", "US"], ["Los Angeles", "US"], ["Toronto", "CA"], ["London", "GB"], ["Lahore", "PK"], ["Karachi", "PK"], ["Islamabad", "PK"], ["Makkah", "SA"], ["Madinah", "SA"]];
const METHODS: Array<[number, string]> = [[2, "ISNA (North America)"], [3, "Muslim World League"], [4, "Umm al-Qura (Makkah)"], [5, "Egyptian General Authority"], [1, "University of Islamic Sciences, Karachi"], [15, "Moonsighting Committee Worldwide"]];

interface Day { day: number; date: string; readable: string; weekday: string; imsak: string; fajr: string; maghrib: string }
const clean = (t: string) => t.replace(/\s*\(.*\)$/, "").trim();
function save(name: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Countdown() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  if (!now) return null;
  const days = Math.ceil((START.getTime() - now.getTime()) / 86400000);
  if (days <= 0) return <p className="rcount">Ramadan Mubarak! Ramadan 1448 is here.</p>;
  return <p className="rcount"><strong>{days}</strong> {days === 1 ? "day" : "days"} until Ramadan 1448 (expected Monday 8 February 2027)</p>;
}

export function RamadanTimetable() {
  const [city, setCity] = useState("Boston"); const [country, setCountry] = useState("US");
  const [method, setMethod] = useState(2); const [school, setSchool] = useState(0);
  const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<Day[] | null>(null);
  const [meta, setMeta] = useState<{ place: string; tz: string; method: string } | null>(null);

  async function load(c = city, k = country, coords?: { lat: number; lon: number }) {
    setBusy(true); setError(null);
    try {
      const p = new URLSearchParams({ method: String(method), school: String(school) });
      let url: string, place: string;
      if (coords) { p.set("latitude", String(coords.lat)); p.set("longitude", String(coords.lon)); url = `https://api.aladhan.com/v1/hijriCalendar/${YEAR}/9?${p}`; place = "your location"; }
      else {
        if (!c.trim() || !k.trim()) throw new Error("Enter a city and a country (e.g. Boston, US), or use your location.");
        p.set("city", c.trim()); p.set("country", k.trim()); url = `https://api.aladhan.com/v1/hijriCalendarByCity/${YEAR}/9?${p}`; place = `${c.trim()}, ${k.trim()}`;
      }
      const j = await (await fetch(url)).json();
      if (j.code !== 200 || !Array.isArray(j.data) || !j.data.length) throw new Error("Timings were not found for that place. Check the spelling or use your location.");
      type D = { timings: Record<string, string>; date: { readable: string; gregorian: { date: string; weekday: { en: string } }; hijri: { day: string } }; meta: { timezone: string; method: { name: string } } };
      const rows = j.data as D[];
      setDays(rows.map(d => ({ day: Number(d.date.hijri.day), date: d.date.gregorian.date, readable: d.date.readable, weekday: d.date.gregorian.weekday.en.slice(0, 3), imsak: clean(d.timings.Imsak), fajr: clean(d.timings.Fajr), maghrib: clean(d.timings.Maghrib) })));
      setMeta({ place, tz: rows[0].meta.timezone, method: rows[0].meta.method.name });
    } catch (e) { setError(e instanceof Error && !(e instanceof TypeError) ? e.message : "Timings could not be loaded right now. Check your connection and try again."); }
    finally { setBusy(false); }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);
  function useLocation() {
    if (!navigator.geolocation) { setError("Your browser does not share location. Type your city instead."); return; }
    navigator.geolocation.getCurrentPosition(p => load(city, country, { lat: p.coords.latitude, lon: p.coords.longitude }), () => setError("Location permission was not given. Type your city instead."), { timeout: 10000 });
  }

  const base = meta ? `ramadan-2027-${meta.place.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}` : "ramadan-2027";
  function csv() {
    if (!days || !meta) return;
    const lines = [["Ramadan", "Date", "Day", "Imsak", "Sehri ends (Fajr)", "Iftar (Maghrib)"].join(","), ...days.map(d => [d.day, d.readable, d.weekday, d.imsak, d.fajr, d.maghrib].map(v => `"${v}"`).join(","))];
    save(`${base}.csv`, `﻿${lines.join("\r\n")}\r\n`, "text/csv;charset=utf-8");
  }
  function ics() {
    if (!days || !meta) return;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
    const ev = days.flatMap(d => {
      const [dd, mm, yyyy] = d.date.split("-");
      const at = (t: string) => `${yyyy}${mm}${dd}T${t.replace(":", "")}00`;
      const one = (kind: string, t: string, alarm: string, desc: string) => ["BEGIN:VEVENT", `UID:${yyyy}${mm}${dd}-${kind}-${base}@knowlege.org`, `DTSTAMP:${stamp}`, `DTSTART;TZID=${meta.tz}:${at(t)}`, "DURATION:PT15M",
        `SUMMARY:${kind === "sehri" ? `Sehri ends (Ramadan ${d.day})` : `Iftar (Ramadan ${d.day})`}`, `DESCRIPTION:${desc} ${meta.place}, ${meta.method}. Calculated time; follow your local mosque.`,
        "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${kind === "sehri" ? "Sehri ends soon" : "Iftar time"}`, `TRIGGER:${alarm}`, "END:VALARM", "END:VEVENT"].join("\r\n");
      return [one("sehri", d.fajr, "-PT30M", "Fajr: stop eating and drinking."), one("iftar", d.maghrib, "PT0M", "Maghrib: time to break the fast.")];
    });
    save(`${base}.ics`, ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Knowlege.org//Ramadan 2027//EN", "CALSCALE:GREGORIAN", `X-WR-CALNAME:Ramadan 2027 · ${meta.place}`, `X-WR-TIMEZONE:${meta.tz}`, ...ev, "END:VCALENDAR"].join("\r\n") + "\r\n", "text/calendar;charset=utf-8");
  }

  return <div className="toolbox rtool">
    <div className="tool">
      <Countdown />
      <div className="rchips" role="group" aria-label="Quick city">
        {CITIES.map(([c, k]) => <button key={c} className={meta?.place === `${c}, ${k}` ? "on" : ""} onClick={() => { setCity(c); setCountry(k); load(c, k); }}>{c}</button>)}
      </div>
      <form className="toolform" onSubmit={e => { e.preventDefault(); load(); }}>
        <label>City<input className="input" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Medway" /></label>
        <label>Country<input className="input" value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. US" /></label>
        <label>Calculation method<select className="input" value={method} onChange={e => setMethod(Number(e.target.value))}>{METHODS.map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select></label>
        <label>Asr time<select className="input" value={school} onChange={e => setSchool(Number(e.target.value))}><option value={0}>Standard</option><option value={1}>Hanafi</option></select></label>
        <div className="toolbtns"><button className="btn primary" disabled={busy}>{busy ? "Loading…" : "Show timetable"}</button><button type="button" className="btn" onClick={useLocation} disabled={busy}>Use my location</button></div>
      </form>
      <p className="help">Sehri ends at Fajr; Imsak is a cautionary time about 10 minutes earlier that many mosques print. Iftar is at Maghrib (sunset). Times are calculated, so follow your local mosque if it differs, and the first day may move by one day with the moon sighting. Most North American mosques use ISNA; Pakistan commonly uses Karachi; Saudi Arabia uses Umm al-Qura.</p>
      {error && <div className="notice" role="alert">{error}</div>}
      {days && meta && <>
        <div className="toolbtns dl">
          <button type="button" className="btn primary" onClick={ics}>Add sehri &amp; iftar to my calendar (.ics)</button>
          <button type="button" className="btn" onClick={csv}>Download spreadsheet (.csv)</button>
          <button type="button" className="btn" onClick={() => window.print()}>Print / save as PDF</button>
        </div>
        <p className="help">The calendar file adds a sehri reminder 30 minutes before Fajr and an iftar alert at Maghrib for every day of Ramadan. <a href="https://support.google.com/calendar/answer/37118" target="_blank" rel="noopener noreferrer">How to import into Google Calendar</a>.</p>
        <div className="tablewrap printable">
          <h3 className="printonly">Ramadan 1448 / 2027 · {meta.place} · {meta.method} · Knowlege.org</h3>
          <table className="ptable rtable"><caption>Ramadan 2027 sehri and iftar times for {meta.place} ({meta.method}, {meta.tz})</caption>
            <thead><tr><th>Ramadan</th><th>Date</th><th>Day</th><th>Imsak</th><th>Sehri ends (Fajr)</th><th>Iftar (Maghrib)</th></tr></thead>
            <tbody>{days.map(d => <tr key={d.date} className={d.weekday === "Fri" ? "fri" : ""}><td>{d.day}</td><td>{d.readable}</td><td>{d.weekday}</td><td>{d.imsak}</td><td className="se">{d.fajr}</td><td className="if">{d.maghrib}</td></tr>)}</tbody>
          </table>
          <p className="help">Calculated by the <a href="https://aladhan.com/prayer-times-api" target="_blank" rel="noopener noreferrer">AlAdhan prayer times API</a>. Fridays are highlighted.</p>
        </div>
      </>}
    </div>
  </div>;
}
