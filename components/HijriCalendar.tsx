"use client";
// Islamic (Hijri) calendar side by side with the Gregorian calendar.
// Hijri dates use the Umm al-Qura calculation built into the browser (Intl);
// actual dates of Ramadan and Eid follow local moon sighting and may differ by a day.
import { useEffect, useMemo, useState } from "react";

const HIJRI = "en-u-ca-islamic-umalqura";
const MONTHS_H = ["Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", "Jumada al-Ula", "Jumada al-Akhirah", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qa'dah", "Dhu al-Hijjah"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function hijri(d: Date) {
  const parts = new Intl.DateTimeFormat(HIJRI, { day: "numeric", month: "numeric", year: "numeric", timeZone: "UTC" }).formatToParts(d);
  const n = (t: string) => Number(parts.find(p => p.type === t)?.value?.replace(/\D/g, "") ?? 0);
  return { day: n("day"), month: n("month"), year: n("year") };
}
const utc = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d));
const gLabel = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const hLabel = (h: ReturnType<typeof hijri>) => `${h.day} ${MONTHS_H[h.month - 1]} ${h.year} AH`;

// Key days: [hijri month, day, name]
const KEY_DAYS: Array<[number, number, string]> = [
  [1, 1, "Islamic New Year"], [1, 10, "Day of Ashura"], [9, 1, "Ramadan begins"],
  [10, 1, "Eid al-Fitr"], [12, 9, "Day of Arafah"], [12, 10, "Eid al-Adha"],
];

export function HijriCalendar() {
  const [today, setToday] = useState<Date | null>(null);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  useEffect(() => { const n = new Date(); const t = utc(n.getFullYear(), n.getMonth(), n.getDate()); setToday(t); setView({ y: t.getUTCFullYear(), m: t.getUTCMonth() }); }, []);

  const upcoming = useMemo(() => {
    if (!today) return [];
    const found: Array<{ name: string; g: Date; h: ReturnType<typeof hijri> }> = [];
    for (let i = 0; i < 400 && found.length < KEY_DAYS.length; i++) {
      const d = new Date(today.getTime() + i * 86400000); const h = hijri(d);
      const k = KEY_DAYS.find(([m, dd]) => m === h.month && dd === h.day);
      if (k && !found.some(f => f.name === k[2])) found.push({ name: k[2], g: d, h });
    }
    return found;
  }, [today]);

  if (!today || !view) return <div className="cal"><p className="lead">Loading calendar…</p></div>;
  const first = utc(view.y, view.m, 1);
  const days = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
  const cells: Array<Date | null> = [...Array(first.getUTCDay()).fill(null), ...Array.from({ length: days }, (_, i) => utc(view.y, view.m, i + 1))];
  const hStart = hijri(first), hEnd = hijri(utc(view.y, view.m, days));
  const hRange = hStart.month === hEnd.month ? `${MONTHS_H[hStart.month - 1]} ${hStart.year}` : `${MONTHS_H[hStart.month - 1]} – ${MONTHS_H[hEnd.month - 1]} ${hEnd.year} AH`;
  const move = (k: number) => setView(v => { const d = new Date(Date.UTC(v!.y, v!.m + k, 1)); return { y: d.getUTCFullYear(), m: d.getUTCMonth() }; });

  return <div className="cal">
    <div className="today">
      <div><span className="eyebrow">Today (Gregorian)</span><strong>{gLabel(today)}</strong></div>
      <div><span className="eyebrow">Today (Hijri)</span><strong>{hLabel(hijri(today))}</strong></div>
    </div>
    <div className="calhead">
      <button className="btn" onClick={() => move(-1)} aria-label="Previous month">‹</button>
      <div><strong>{first.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })}</strong><small>{hRange}</small></div>
      <button className="btn" onClick={() => move(1)} aria-label="Next month">›</button>
    </div>
    <div className="calgrid" role="grid">
      {DAYS.map(d => <div className="dow" key={d} role="columnheader">{d}</div>)}
      {cells.map((d, i) => {
        if (!d) return <div key={i} className="cell empty" />;
        const h = hijri(d); const key = KEY_DAYS.find(([m, dd]) => m === h.month && dd === h.day);
        const isToday = d.getTime() === today.getTime();
        return <div key={i} role="gridcell" className={`cell${isToday ? " now" : ""}${key ? " key" : ""}${d.getUTCDay() === 5 ? " fri" : ""}`} title={`${gLabel(d)} · ${hLabel(h)}${key ? ` · ${key[2]}` : ""}`}>
          <span className="g">{d.getUTCDate()}</span>
          <span className="h">{h.day === 1 ? `${h.day} ${MONTHS_H[h.month - 1].split(" ")[0]}` : h.day}</span>
          {key && <span className="k">{key[2]}</span>}
        </div>;
      })}
    </div>
    <h3>Coming up</h3>
    <ul className="upcoming">{upcoming.map(u => <li key={u.name}><strong>{u.name}</strong> — {gLabel(u.g)} <small>({hLabel(u.h)})</small></li>)}</ul>
    <p className="meta">Large numbers are Gregorian dates; small gold numbers are Hijri dates (Umm al-Qura calculation). The start of Ramadan and the Eids depend on local moon sighting and may differ by a day — confirm with your local mosque. <a href="/knowledge-hub/fasting" style={{ textDecoration: "underline" }}>Fasting guide</a></p>
  </div>;
}
