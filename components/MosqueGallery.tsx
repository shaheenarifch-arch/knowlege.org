import { mosques } from "../lib/mosques";
import { Cited } from "./Cited";

/** Gallery of great mosques of the world, each with its licence credit. */
export function MosqueGallery() {
  return <div className="mosques">
    {mosques.map(m => <figure className="mosque" key={m.name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={m.photo.src} alt={m.photo.alt} width={m.photo.width} height={m.photo.height} loading="lazy" referrerPolicy="no-referrer" />
      <figcaption>
        <strong>{m.name}</strong>
        <span className="place">{m.place}</span>
        <span><Cited text={m.note} /></span>
        <small>Photo: {m.photo.author}, <a href={m.photo.licenseUrl} target="_blank" rel="noopener noreferrer">{m.photo.license}</a>, <a href={m.photo.sourceUrl} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a></small>
      </figcaption>
    </figure>)}
  </div>;
}
