import { FreeSearch } from "../../components/FreeSearch";
import { ResearchTools } from "../../components/ResearchTools";

export const metadata = {
  title: "Research Desk",
  description: "A free research room: search the Qur'an and the six major hadith collections with references, plus prayer times you can download, Qibla direction, a zakah calculator and surah downloads.",
  alternates: { canonical: "/research" },
};

// Real, licensed photo (CC BY 2.0): reading room of the al-Qarawiyyin library, Fez.
const HERO = {
  src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Qarawiyine_library_reading_room_%28589089843%29_%28edited%29.jpg/1920px-Qarawiyine_library_reading_room_%28589089843%29_%28edited%29.jpg",
  alt: "Carved wooden reading tables and arched lattice bookcases in the reading room of the al-Qarawiyyin library in Fez, Morocco",
  author: "Maureen from Buffalo, USA (retouched by Robert Prazeres)",
  license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Qarawiyine_library_reading_room_(589089843)_(edited).jpg",
};

const SHELF: Array<[string, string, string, string, string]> = [
  ["quran", "The Qur'an", "القرآن", "114 surahs · 6,236 verses", "The revealed word; searched in Pickthall's English, with Arabic on Quran.com."],
  ["bukhari", "Sahih al-Bukhari", "صحيح البخاري", "Imam al-Bukhari · d. 256 AH", "The most relied-upon hadith collection, gathered with strict conditions."],
  ["muslim", "Sahih Muslim", "صحيح مسلم", "Imam Muslim · d. 261 AH", "The second Sahih, arranged so related narrations sit together."],
  ["abudawud", "Sunan Abi Dawud", "سنن أبي داود", "Abu Dawud · d. 275 AH", "Focused on hadith used for legal rulings (ahkam)."],
  ["tirmidhi", "Jami' at-Tirmidhi", "جامع الترمذي", "At-Tirmidhi · d. 279 AH", "Notes each hadith's grade and how scholars acted on it."],
  ["nasai", "Sunan an-Nasa'i", "سنن النسائي", "An-Nasa'i · d. 303 AH", "Known for careful selection of narrators."],
  ["ibnmajah", "Sunan Ibn Majah", "سنن ابن ماجه", "Ibn Majah · d. 273 AH", "Completes the six books; contains narrations not found elsewhere."],
];
const EXAMPLES: Array<[string, string]> = [["patience", "quran"], ["mercy", "quran"], ["parents", "bukhari"], ["neighbour", "muslim"], ["intention", "bukhari"], ["charity", "tirmidhi"]];

export default function Page() {
  return <main className="rroom">
    <header className="rhero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO.src} alt={HERO.alt} width={1920} height={1405} fetchPriority="high" referrerPolicy="no-referrer" />
      <div className="shell rhero-in">
        <span className="eyebrow">The Reading Room · Free · Citation-first</span>
        <h1>Research Desk</h1>
        <p>Sit down with the sources. Search the Qur'an and the six major hadith collections, see every text with its exact reference, and check it at the source.</p>
        <div className="actions"><a className="btn primary" href="#desk">Start researching</a><a className="btn" href="#tools">Prayer times &amp; tools</a></div>
      </div>
      <p className="credit shell">Photo: the reading room of the al-Qarawiyyin library, Fez. {HERO.author}, <a href={HERO.licenseUrl} target="_blank" rel="noopener noreferrer">{HERO.license}</a>, via <a href={HERO.sourceUrl} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>.</p>
    </header>

    <div className="shell">
      <section className="desk" id="desk" aria-labelledby="desk-h">
        <div className="lamp" aria-hidden="true" />
        <h2 id="desk-h">The desk</h2>
        <p className="lead">Type a word or phrase, choose a source, and search. Results appear below as reference cards.</p>
        <div className="rules"><strong>Reading-room rules.</strong> Results are source texts only, shown exactly as published. This page does not issue religious rulings (fatwas) or explain what a text means for your situation; for rulings, ask a qualified scholar.</div>
        <FreeSearch />
        <p className="help">Try: {EXAMPLES.map(([w, s], i) => <span key={w}>{i > 0 && " · "}<a href={`/research?source=${s}&q=${w}#desk`}>{w}</a></span>)}</p>
      </section>

      <section className="section" aria-labelledby="shelves-h">
        <span className="eyebrow">On the shelves</span>
        <h2 id="shelves-h">Seven sources, one desk</h2>
        <p className="lead">Choose a book to search it. Hadith grades are shown as the dataset gives them; learn more in <a className="ul" href="/about#sources">how we use sources</a>.</p>
        <ul className="shelf">
          {SHELF.map(([k, name, ar, by, note]) => <li key={k}><a className="book" href={`/research?source=${k}#desk`}>
            <span className="spine-ar" lang="ar" dir="rtl">{ar}</span>
            <strong>{name}</strong><small>{by}</small><span className="note">{note}</span><span className="go">Search this book →</span>
          </a></li>)}
        </ul>
      </section>

      <section className="section howto" aria-labelledby="how-h">
        <span className="eyebrow">How to research here</span>
        <h2 id="how-h">Three steps</h2>
        <ol className="steps">
          <li><strong>Pick a source.</strong> Start with the Qur'an, then check the hadith collections for the same word.</li>
          <li><strong>Search simple words.</strong> "Patient" finds more than "patiently". If nothing matches, related words are tried for you.</li>
          <li><strong>Verify at the source.</strong> Every card links to Quran.com or Sunnah.com. For explanation, read the <a className="ul" href="/knowledge-hub">Knowledge Hub</a> guides; for rulings, ask a scholar.</li>
        </ol>
      </section>

      <section className="section" id="tools" aria-labelledby="tools-h">
        <span className="eyebrow">The toolkit</span>
        <h2 id="tools-h">Research Room tools</h2>
        <p className="lead">Free tools that run in your browser: download your prayer timetable, find the Qibla, calculate zakah and take any surah offline. Need help? See the <a className="ul" href="/help">Help page</a>.</p>
        <ResearchTools />
      </section>
    </div>
  </main>;
}
