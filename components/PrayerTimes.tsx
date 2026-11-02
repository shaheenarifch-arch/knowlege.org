"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Prayer times, Qibla direction and optional Adhan playback.
 * Everything is calculated in the visitor's browser with the open-source `adhan` library;
 * the location is kept only in this browser (localStorage) and never sent to Knowlege.org.
 */

type Method = "MuslimWorldLeague" | "NorthAmerica" | "UmmAlQura" | "Karachi" | "Egyptian" | "Dubai" | "Kuwait" | "Qatar" | "Singapore" | "Turkey" | "Tehran" | "MoonsightingCommittee";
type Madhab = "shafi" | "hanafi";
interface Loc { lat: number; lon: number; name: string; tz: string; cc: string }
interface Settings { loc: Loc | null; method: Method; madhab: Madhab; adhan: boolean; auto: boolean }

const KEY = "knowlege.prayer.v1";
const KAABAH = { lat: 21.4225, lon: 39.8262 };
const AUDIO = {
  src: "https://upload.wikimedia.org/wikipedia/commons/7/7d/The_Adhan_-_Muslim_Call_to_Prayer_-_Aaqib_Azeez.mp3",
  credit: "Adhan recording: Aaqib Azeez, uploaded by Atcovi",
  license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  source: "https://commons.wikimedia.org/wiki/File:The_Adhan_-_Muslim_Call_to_Prayer_-_Aaqib_Azeez.mp3",
};
const METHODS: Array<[Method, string]> = [
  ["MuslimWorldLeague", "Muslim World League"], ["NorthAmerica", "ISNA (North America)"], ["UmmAlQura", "Umm al-Qura (Makkah)"],
  ["Karachi", "University of Islamic Sciences, Karachi"], ["Egyptian", "Egyptian General Authority"], ["Dubai", "Dubai"], ["Kuwait", "Kuwait"],
  ["Qatar", "Qatar"], ["Singapore", "Singapore / Malaysia / Indonesia"], ["Turkey", "Diyanet (Turkey)"], ["Tehran", "Tehran"], ["MoonsightingCommittee", "Moonsighting Committee"],
];
const NAMES = [["fajr", "Fajr", "الفجر"], ["sunrise", "Sunrise", "الشروق"], ["dhuhr", "Dhuhr", "الظهر"], ["asr", "Asr", "العصر"], ["maghrib", "Maghrib", "المغرب"], ["isha", "Isha", "العشاء"]] as const;
const ADHAN_PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

function methodFor(cc: string): Method {
  const c = cc.toUpperCase();
  if (["US", "CA"].includes(c)) return "NorthAmerica";
  if (c === "SA") return "UmmAlQura";
  if (["PK", "IN", "BD", "AF"].includes(c)) return "Karachi";
  if (["EG", "SD", "LY", "SY", "LB", "JO", "IQ", "PS"].includes(c)) return "Egyptian";
  if (c === "AE") return "Dubai";
  if (c === "KW") return "Kuwait";
  if (c === "QA") return "Qatar";
  if (["SG", "MY", "ID", "BN"].includes(c)) return "Singapore";
  if (c === "TR") return "Turkey";
  if (c === "IR") return "Tehran";
  if (c === "GB") return "MoonsightingCommittee";
  return "MuslimWorldLeague";
}
const madhabFor = (cc: string): Madhab => ["PK", "IN", "BD", "AF", "TR"].includes(cc.toUpperCase()) ? "hanafi" : "shafi";

function load(): Settings {
  const d: Settings = { loc: null, method: "MuslimWorldLeague", madhab: "shafi", adhan: false, auto: true };
  try { return { ...d, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }; } catch { return d; }
}
function store(s: Settings) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage blocked */ } }

const rad = (d: number) => d * Math.PI / 180;
function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
/** Calendar date of "now" in a time zone, as a local Date at midnight (what adhan expects). */
function dateIn(tz: string, offsetDays = 0) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()).split("-").map(Number);
  return new Date(p[0], p[1] - 1, p[2] + offsetDays);
}

type Times = Record<(typeof NAMES)[number][0], Date>;
type AdhanLib = typeof import("adhan");

export function PrayerTimes({ compact = false }: { compact?: boolean }) {
  const [s, setS] = useState<Settings | null>(null);
  const [lib, setLib] = useState<AdhanLib | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<Loc & { label: string }>>([]);
  const [playing, setPlaying] = useState(false);
  const [heading, setHeading] = useState<number | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const played = useRef<Set<string>>(new Set());

  const update = useCallback((patch: Partial<Settings>) => setS(prev => { const n = { ...(prev ?? load()), ...patch }; store(n); return n; }), []);

  useEffect(() => { setS(load()); import("adhan").then(setLib); }, []);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 15000); return () => clearInterval(t); }, []);

  const setLocation = useCallback((loc: Loc) => {
    setS(prev => { const n = { ...(prev ?? load()), loc, ...((prev?.auto ?? true) ? { method: methodFor(loc.cc), madhab: madhabFor(loc.cc) } : {}) }; store(n); return n; });
    setResults([]); setQuery(""); setStatus("");
  }, []);

  const locate = useCallback(() => {
    if (!navigator.geolocation) { setStatus("Your browser cannot share location. Search for your city instead."); return; }
    setStatus("Finding your location…");
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = +pos.coords.latitude.toFixed(4), lon = +pos.coords.longitude.toFixed(4);
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let name = "Your location", cc = "";
      try {
        const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const j = await r.json();
        name = [j.city || j.locality, j.principalSubdivision, j.countryName].filter(Boolean).join(", ") || name;
        cc = j.countryCode ?? "";
      } catch { /* name lookup is optional */ }
      setLocation({ lat, lon, name, tz, cc });
    }, () => setStatus("Location was not shared. Search for your city instead."), { enableHighAccuracy: false, timeout: 15000, maximumAge: 3600000 });
  }, [setLocation]);

  // Auto-fill: if location permission was granted before and nothing is saved, locate silently.
  useEffect(() => {
    if (!s || s.loc || !navigator.permissions) return;
    navigator.permissions.query({ name: "geolocation" as PermissionName }).then(p => { if (p.state === "granted") locate(); }).catch(() => undefined);
  }, [s, locate]);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setStatus("Searching…");
    try {
      const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`);
      const j = await r.json();
      const list = (j.results ?? []).map((x: { latitude: number; longitude: number; name: string; admin1?: string; country?: string; timezone: string; country_code?: string }) => ({
        lat: x.latitude, lon: x.longitude, tz: x.timezone, cc: x.country_code ?? "",
        name: [x.name, x.admin1, x.country].filter(Boolean).join(", "), label: [x.name, x.admin1, x.country].filter(Boolean).join(", "),
      }));
      setResults(list); setStatus(list.length ? "" : "No place found. Try another spelling, or add the country.");
    } catch { setStatus("Search is unavailable right now. Please try again."); }
  }

  const calc = useMemo(() => {
    if (!lib || !s?.loc) return null;
    const { Coordinates, CalculationMethod, PrayerTimes: PT, HighLatitudeRule, Qibla } = lib;
    const c = new Coordinates(s.loc.lat, s.loc.lon);
    const p = CalculationMethod[s.method]();
    p.madhab = s.madhab;
    p.highLatitudeRule = HighLatitudeRule.recommended(c);
    const day = (o: number) => { const t = new PT(c, dateIn(s.loc!.tz, o), p); return { fajr: t.fajr, sunrise: t.sunrise, dhuhr: t.dhuhr, asr: t.asr, maghrib: t.maghrib, isha: t.isha } as Times; };
    return { today: day(0), tomorrow: day(1), qibla: Qibla(c), km: distanceKm(s.loc, KAABAH) };
    // `now` keeps the day rolling over after midnight
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lib, s?.loc, s?.method, s?.madhab, Math.floor(now / 3600000)]);

  const next = useMemo(() => {
    if (!calc) return null;
    for (const k of ADHAN_PRAYERS) if (calc.today[k].getTime() > now) return { key: k, at: calc.today[k] };
    return { key: "fajr" as const, at: calc.tomorrow.fajr };
  }, [calc, now]);

  // Play the Adhan when a prayer time arrives (while this page is open).
  useEffect(() => {
    if (!s?.adhan || !calc) return;
    for (const k of ADHAN_PRAYERS) {
      const t = calc.today[k].getTime();
      const id = `${calc.today[k].toDateString()}-${k}`;
      if (now >= t && now - t < 90000 && !played.current.has(id)) {
        played.current.add(id);
        audio.current?.play().then(() => setPlaying(true)).catch(() => setStatus("Your browser blocked the sound. Tap \"Test the Adhan\" once to allow it."));
        try { if ("Notification" in window && Notification.permission === "granted") new Notification(`Time for ${NAMES.find(n => n[0] === k)![1]}`, { body: "Hayya 'ala as-salah: come to prayer.", icon: "/icon.svg" }); } catch { /* optional */ }
      }
    }
  }, [now, s?.adhan, calc]);

  async function toggleAdhan(on: boolean) {
    update({ adhan: on });
    if (on && audio.current) {
      // A tap is needed before browsers allow sound later: unlock the audio element silently.
      audio.current.muted = true;
      await audio.current.play().catch(() => undefined);
      audio.current.pause(); audio.current.currentTime = 0; audio.current.muted = false;
      if ("Notification" in window && Notification.permission === "default") Notification.requestPermission().catch(() => undefined);
    }
  }
  function test() { if (!audio.current) return; if (playing) { audio.current.pause(); audio.current.currentTime = 0; setPlaying(false); } else audio.current.play().then(() => setPlaying(true)).catch(() => undefined); }

  async function compass() {
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (DOE?.requestPermission) { try { if (await DOE.requestPermission() !== "granted") return setStatus("Compass permission was not given."); } catch { return; } }
    const on = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      const h = e.webkitCompassHeading ?? (e.absolute && e.alpha !== null ? 360 - e.alpha : null);
      if (h !== null && h !== undefined) setHeading(h);
    };
    window.addEventListener("deviceorientationabsolute" as "deviceorientation", on as EventListener, true);
    window.addEventListener("deviceorientation", on as EventListener, true);
    setStatus("Hold your phone flat, away from metal and magnets.");
  }

  if (!s) return <div className={`pt ${compact ? "compact" : ""}`} aria-busy="true"><p className="hint">Loading prayer times…</p></div>;

  const tz = s.loc?.tz;
  const fmt = (d: Date) => new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", timeZone: tz }).format(d);
  const left = next ? Math.max(0, next.at.getTime() - now) : 0;
  const hh = Math.floor(left / 3600000), mm = Math.floor((left % 3600000) / 60000);
  const arrow = calc ? (heading === null ? calc.qibla : calc.qibla - heading) : 0;

  return <div className={`pt ${compact ? "compact" : ""}`}>
    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
    <audio ref={audio} src={AUDIO.src} preload="none" onEnded={() => setPlaying(false)} onPause={() => setPlaying(false)} />

    <div className="pthead">
      <div>
        <h2>{compact ? "Today's prayer times" : "Prayer times"}</h2>
        <p className="ptloc">{s.loc ? <>📍 {s.loc.name}</> : "Set your location to see today's times."}</p>
      </div>
      <div className="ptlocate">
        <button type="button" className="btn primary" onClick={locate}>{s.loc ? "Update my location" : "Use my location"}</button>
      </div>
    </div>

    <form className="ptsearch" onSubmit={search} role="search">
      <label className="sr" htmlFor={compact ? "pt-q-c" : "pt-q"}>Search for a city</label>
      <input id={compact ? "pt-q-c" : "pt-q"} value={query} onChange={e => setQuery(e.target.value)} placeholder="…or search a city (e.g. Boston, Lahore, London)" maxLength={80} />
      <button className="btn" type="submit">Search</button>
    </form>
    {results.length > 0 && <ul className="ptresults">{results.map((r, i) => <li key={i}><button type="button" onClick={() => setLocation(r)}>{r.label}</button></li>)}</ul>}
    {status && <p className="hint ptstatus" role="status">{status}</p>}

    {calc && next && <>
      <div className="ptnext" aria-live="polite">
        <span>Next: <b>{NAMES.find(n => n[0] === next.key)![1]}</b> at {fmt(next.at)}</span>
        <span className="ptcount">in {hh > 0 ? `${hh} h ` : ""}{mm} min</span>
      </div>
      <ol className="ptlist">
        {NAMES.map(([k, en, ar]) => <li key={k} className={`${next.key === k && next.at === calc.today[k] ? "next" : ""} ${k === "sunrise" ? "sun" : ""}`}>
          <span className="ar" lang="ar" dir="rtl">{ar}</span>
          <b>{en}</b>
          <time dateTime={calc.today[k].toISOString()}>{fmt(calc.today[k])}</time>
        </li>)}
      </ol>
      <p className="hint">Sunrise is shown so you know when the time for Fajr ends; it is not a prayer.</p>

      <div className="ptrow">
        <div className="qibla">
          <h3>Qibla direction</h3>
          <div className="dial" aria-hidden>
            <span className="n">N</span><span className="e">E</span><span className="s">S</span><span className="w">W</span>
            <div className="needle" style={{ transform: `rotate(${arrow}deg)` }}><span>🕋</span></div>
          </div>
          <p><b>{Math.round(calc.qibla)}°</b> from true north{heading !== null ? " (live compass)" : ""}. Makkah is about {Math.round(calc.km).toLocaleString()} km away.</p>
          <button type="button" className="btn" onClick={compass}>Use my phone's compass</button>
          <small className="hint">Without the compass, face {Math.round(calc.qibla)}° clockwise from north. <Link href="/holy-sites">About the Ka'bah</Link></small>
        </div>

        <div className="adhanopt">
          <h3>Hear the Adhan</h3>
          <label className="switch">
            <input type="checkbox" checked={s.adhan} onChange={e => toggleAdhan(e.target.checked)} />
            <span>Play the Adhan at each prayer time</span>
          </label>
          <button type="button" className="btn" onClick={test}>{playing ? "■ Stop" : "▶ Test the Adhan"}</button>
          <small className="hint">Works while Knowlege.org is open in a browser tab (it can be in the background). Browsers do not allow websites to play sound once they are closed. {AUDIO.credit}, <a href={AUDIO.licenseUrl} target="_blank" rel="noopener noreferrer">{AUDIO.license}</a>, via <a href={AUDIO.source} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>.</small>
        </div>
      </div>

      <details className="ptsettings" open={!compact || undefined}>
        <summary>Calculation settings</summary>
        <label>Method
          <select value={s.method} onChange={e => update({ method: e.target.value as Method, auto: false })}>
            {METHODS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label>Asr time
          <select value={s.madhab} onChange={e => update({ madhab: e.target.value as Madhab, auto: false })}>
            <option value="shafi">Standard (Shafi'i, Maliki, Hanbali)</option>
            <option value="hanafi">Hanafi (later Asr)</option>
          </select>
        </label>
        <small className="hint">We pick the method most used in your country; your local mosque's timetable is the final word. <Link href="/prayer-times#methods">How times are calculated</Link></small>
      </details>
    </>}

    {compact && <p className="ptmore"><Link href="/prayer-times">Full prayer times, Qibla and settings →</Link></p>}
    <small className="hint">Your location stays in this browser and is never sent to Knowlege.org. City search and place names are looked up with <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> and <a href="https://www.bigdatacloud.com/" target="_blank" rel="noopener noreferrer">BigDataCloud</a>. <Link href="/privacy">Privacy</Link></small>
  </div>;
}
