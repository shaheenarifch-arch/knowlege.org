import { sites, ZIYARAT_NOTE } from "../lib/holysites";
import { Cited } from "./Cited";

/** Holy sites of Makkah, Madinah and Jerusalem with real, credited photos. */
export function HolySites({ city }: { city?: "Makkah" | "Madinah" | "Jerusalem" }) {
  const list = city ? sites.filter(s => s.city === city) : sites;
  return <>
    <div className="sites">
      {list.map(s => <figure className="site" id={s.id} key={s.id}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.photo.src} alt={s.photo.alt} width={s.photo.width} height={s.photo.height} loading="lazy" referrerPolicy="no-referrer" />
        <figcaption>
          <span className="place">{s.city} · {s.local}</span>
          <strong>{s.name}</strong>
          <span><Cited text={s.text} /></span>
          <small>Photo: {s.photo.author}, <a href={s.photo.licenseUrl} target="_blank" rel="noopener noreferrer">{s.photo.license}</a>, <a href={s.photo.sourceUrl} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a></small>
        </figcaption>
      </figure>)}
    </div>
    {!city && <p className="meta" style={{ marginTop: 14 }}>{ZIYARAT_NOTE}</p>}
  </>;
}
