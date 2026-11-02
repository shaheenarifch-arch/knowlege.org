"use client";
// Filterable Help Resource Directory. Data: lib/help-resources.ts (checked against official sites).
import { useMemo, useState } from "react";
import { RESOURCES, NEEDS, KINDS, AREAS, type Need, type Kind } from "../lib/help-resources";

const needLabel = Object.fromEntries(NEEDS) as Record<Need, string>;

export function HelpDirectory() {
  const [need, setNeed] = useState<Need | "all">("all");
  const [area, setArea] = useState<"all" | "US" | "MA">("all");
  const [kind, setKind] = useState<Kind | "all">("all");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return RESOURCES.filter(r => (need === "all" || r.need.includes(need)) && (area === "all" || r.area === area) && (kind === "all" || r.kind === kind)
      && words.every(w => `${r.name} ${r.offers} ${r.who} ${r.languages}`.toLowerCase().includes(w)))
      .sort((a, b) => (a.area === b.area ? 0 : a.area === "MA" ? -1 : 1));
  }, [need, area, kind, q]);

  return <section className="section" aria-labelledby="dir-h">
    <h2 id="dir-h">Find a service</h2>
    <p className="lead">Choose the kind of help you need, then narrow by area or provider. Massachusetts services are listed first.</p>
    <div className="needchips" role="group" aria-label="Type of help">
      <button className={need === "all" ? "on" : ""} onClick={() => setNeed("all")}>All help</button>
      {NEEDS.map(([k, l]) => <button key={k} className={need === k ? "on" : ""} onClick={() => setNeed(k)}>{l}</button>)}
    </div>
    <div className="toolform hfilters">
      <label>Search<input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="e.g. rent, SNAP, Arabic, ESL" /></label>
      <label>Area<select className="input" value={area} onChange={e => setArea(e.target.value as typeof area)}><option value="all">US and Massachusetts</option>{Object.entries(AREAS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label>Provider<select className="input" value={kind} onChange={e => setKind(e.target.value as typeof kind)}><option value="all">All providers</option>{Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
    </div>
    <p className="help" aria-live="polite">{list.length} {list.length === 1 ? "service" : "services"} found. Search also matches languages, so try "Spanish" or "Arabic".</p>
    <div className="hgrid">
      {list.map(r => <article className="hres" key={r.name}>
        <div className="hbadges"><span className={`hb ${r.kind}`}>{KINDS[r.kind]}</span><span className="hb">{r.area === "MA" ? "Massachusetts" : "Nationwide"}</span>{r.need.map(n => <span key={n} className="hb soft">{needLabel[n]}</span>)}</div>
        <h3>{r.name}</h3>
        <p>{r.offers}</p>
        <p className="who"><strong>Who can use it:</strong> {r.who}</p>
        <p className="who"><strong>Languages:</strong> {r.languages}{r.hours ? <> · <strong>Hours:</strong> {r.hours}</> : null}</p>
        {r.note && <p className="help">{r.note}</p>}
        <div className="hact">
          {r.tel && <a className="btn primary" href={`tel:${r.tel}`}>Call {r.phone}</a>}
          {r.text && <a className="btn" href={`sms:${r.text.replace(/\D/g, "")}`}>Text {r.text}</a>}
          <a className="btn" href={r.url} target="_blank" rel="noopener noreferrer">Official website ↗</a>
        </div>
      </article>)}
    </div>
    {list.length === 0 && <div className="notice">Nothing matches those filters. Try "All help", clear the search, or call 211 to be connected to local services.</div>}
  </section>;
}
