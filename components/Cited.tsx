import { split } from "../lib/library";

/** Text with [Q ..]/[H ..] tokens rendered as source links. */
export function Cited({ text }: { text: string }) {
  return <>{split(text).map((x, i) => typeof x === "string"
    ? x
    : <a key={i} className="cite" href={x.url} target="_blank" rel="noopener noreferrer" title={`Open ${x.label}`}>({x.label})</a>)}</>;
}
