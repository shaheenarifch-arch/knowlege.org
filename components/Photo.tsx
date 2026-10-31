import type { Photo as P } from "../lib/library";

/** Real, licensed photo with its required credit line. */
export function Photo({ photo, priority = false }: { photo: P; priority?: boolean }) {
  return <figure className="heroimg">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height}
      loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} referrerPolicy="no-referrer" />
    <figcaption>
      Photo: {photo.author}, <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}</a>, via <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>.
    </figcaption>
  </figure>;
}
