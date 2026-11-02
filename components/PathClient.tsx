"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ---------- progress, saved only in this browser ---------- */
const KEY = "knowlege.path.v1";
const EVT = "knowlege-path";
const CONTACT = "shaheenarifch@gmail.com";

function read(): string[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) ?? "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
}
function save(done: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(done)); } catch { /* storage blocked: progress just isn't kept */ }
  window.dispatchEvent(new Event(EVT));
}
function useDone(): [string[], boolean] {
  const [done, setDone] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setDone(read());
    sync(); setReady(true);
    window.addEventListener(EVT, sync); window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener("storage", sync); };
  }, []);
  return [done, ready];
}

export interface TrailItem { slug: string; title: string; short: string }

function Bar({ pct, label }: { pct: number; label: string }) {
  return <div className="pbar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={label}>
    <span style={{ width: `${pct}%` }} />
  </div>;
}

/* ---------- hub: trail map ---------- */
export function TrailMap({ items }: { items: TrailItem[] }) {
  const [done, ready] = useDone();
  const count = items.filter(i => done.includes(i.slug)).length;
  const pct = Math.round((count / items.length) * 100);
  const next = items.find(i => !done.includes(i.slug));
  return <div className="trail">
    <div className="trailtop">
      <div>
        <strong>{ready ? `${count} of ${items.length} milestones complete` : `${items.length} milestones`}</strong>
        <Bar pct={ready ? pct : 0} label="Your progress on the Path to Success" />
        <small className="hint">Progress is saved only in this browser, with no account. <Link href="/privacy">Privacy</Link></small>
      </div>
      <div className="actions">
        {next
          ? <Link className="btn primary" href={`/new-to-islam/${next.slug}`}>{count ? "Continue where you left off" : "Start the path"} →</Link>
          : <Link className="btn primary" href="/new-to-islam/finish">You finished! Share feedback →</Link>}
        {count > 0 && <button className="btn" type="button" onClick={() => { if (confirm("Reset your progress on this device?")) save([]); }}>Reset</button>}
      </div>
    </div>
    <ol className="steps">
      {items.map((m, i) => {
        const isDone = done.includes(m.slug);
        return <li key={m.slug} className={isDone ? "done" : next?.slug === m.slug ? "now" : ""}>
          <Link href={`/new-to-islam/${m.slug}`}>
            <span className="dot" aria-hidden>{isDone ? "✓" : i}</span>
            <span><b>{m.title}</b><small>{m.short}</small></span>
          </Link>
        </li>;
      })}
      <li className={next ? "" : "now"}>
        <Link href="/new-to-islam/finish"><span className="dot" aria-hidden>★</span><span><b>Finish Line: Your Questions and Feedback</b><small>Tell us what helped and what is still unclear</small></span></Link>
      </li>
    </ol>
  </div>;
}

/* ---------- milestone page: sticky progress bar ---------- */
export function StepBar({ items, current }: { items: TrailItem[]; current: number }) {
  const [done] = useDone();
  const pct = Math.round((items.filter(i => done.includes(i.slug)).length / items.length) * 100);
  return <div className="stepbar">
    <div className="shell">
      <div className="stepbarrow">
        <Link href="/new-to-islam">Path to Success</Link>
        <span>Milestone {current} of {items.length - 1} · {pct}% complete</span>
      </div>
      <Bar pct={pct} label="Your progress on the Path to Success" />
      <nav className="sdots" aria-label="Milestones">
        {items.map((m, i) => <Link key={m.slug} href={`/new-to-islam/${m.slug}`} title={m.title}
          className={`${done.includes(m.slug) ? "done" : ""} ${i === current ? "cur" : ""}`} aria-current={i === current ? "step" : undefined}>{done.includes(m.slug) ? "✓" : i}</Link>)}
      </nav>
    </div>
  </div>;
}

/* ---------- checkpoint quiz + mark complete ---------- */
export interface QuizItem { q: string; options: string[]; answer: number; why: string }
export function Checkpoint({ slug, quiz, nextHref, nextLabel }: { slug: string; quiz: QuizItem[]; nextHref: string; nextLabel: string }) {
  const [picked, setPicked] = useState<Array<number | null>>(quiz.map(() => null));
  const [done] = useDone();
  const router = useRouter();
  const answered = picked.every(p => p !== null);
  const right = picked.filter((p, i) => p === quiz[i].answer).length;
  const finish = () => { const d = read(); if (!d.includes(slug)) save([...d, slug]); router.push(nextHref); };
  return <section className="checkpoint" aria-labelledby="cp">
    <h2 id="cp">Checkpoint</h2>
    <p className="hint">A quick check, not a test. Pick an answer to see the explanation.</p>
    {quiz.map((item, qi) => <fieldset key={qi} className="qitem">
      <legend>{qi + 1}. {item.q}</legend>
      {item.options.map((o, oi) => {
        const p = picked[qi];
        const cls = p === null ? "" : oi === item.answer ? "right" : oi === p ? "wrong" : "";
        return <button type="button" key={oi} className={`opt ${cls}`} disabled={p !== null}
          onClick={() => setPicked(prev => prev.map((v, k) => k === qi ? oi : v))}>{o}</button>;
      })}
      {picked[qi] !== null && <p className="why">{picked[qi] === item.answer ? "Correct. " : "Not quite. "}{item.why}</p>}
    </fieldset>)}
    <div className="actions cpactions">
      {answered && <p className="score">{right} of {quiz.length} correct{right === quiz.length ? ". Masha'Allah!" : ". Well done for finishing."}</p>}
      <button type="button" className="btn primary" onClick={finish} disabled={!answered}>
        {done.includes(slug) ? "Continue" : "Mark complete"} → {nextLabel}
      </button>
      {!answered && <small className="hint">Answer the questions above to continue.</small>}
    </div>
  </section>;
}

/* ---------- feedback: questions on each milestone, and the finish line ---------- */
type Payload = Record<string, string | number | boolean | undefined>;
async function send(body: Payload): Promise<"ok" | "fallback"> {
  try {
    const r = await fetch("/api/path-feedback", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) return "ok";
  } catch { /* network error: fall back to email */ }
  return "fallback";
}
function mailto(subject: string, body: Payload) {
  const text = Object.entries(body).filter(([k, v]) => v !== undefined && v !== "" && k !== "website").map(([k, v]) => `${k}: ${v}`).join("\n");
  return `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}

export function AskBox({ step, title }: { step: string; title: string }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "fallback">("idle");
  const [mail, setMail] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body: Payload = { kind: "question", step, message: String(f.get("message") ?? ""), email: String(f.get("email") ?? ""), website: String(f.get("website") ?? "") };
    setState("sending");
    const r = await send(body);
    if (r === "fallback") setMail(mailto(`Path to Success question: ${title}`, body));
    setState(r);
  }
  return <section className="askbox" aria-labelledby="ask">
    <h2 id="ask">Questions or comments on this milestone?</h2>
    <p className="hint">Ask anything that confused you, or tell us what to explain better. Include your email if you would like a reply. This is general learning support, not a religious ruling (fatwa); for personal situations ask a local imam or see the <Link href="/help">Help Center</Link>.</p>
    {state === "ok" ? <p className="notice">JazakAllahu khayran, thank you. Your message reached us.</p>
      : state === "fallback" ? <p className="notice">We could not save your message here. <a href={mail}>Send it by email instead</a>; it is already filled in.</p>
      : <form onSubmit={onSubmit} className="fform">
        <label>Your question or comment<textarea name="message" required minLength={3} maxLength={3000} rows={4} /></label>
        <label>Email (optional, only to reply)<input name="email" type="email" maxLength={200} autoComplete="email" /></label>
        <input name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden />
        <button className="btn primary" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send"}</button>
      </form>}
  </section>;
}

export function FinishFeedback() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "fallback">("idle");
  const [mail, setMail] = useState("");
  const [done, ready] = useDone();
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body: Payload = {
      kind: "final", step: "finish", rating: Number(f.get("rating") ?? 0) || undefined,
      helped: String(f.get("helped") ?? ""), unclear: String(f.get("unclear") ?? ""), message: String(f.get("message") ?? ""),
      wantsMentor: f.get("mentor") === "yes", location: String(f.get("location") ?? ""), email: String(f.get("email") ?? ""),
      completed: done.length, website: String(f.get("website") ?? ""),
    };
    setState("sending");
    const r = await send(body);
    if (r === "fallback") setMail(mailto("Path to Success feedback", body));
    setState(r);
  }
  if (state === "ok") return <div className="notice finishok"><h2>JazakAllahu khayran!</h2><p>Your feedback reached us. If you asked for a reply or a mentor, we will write to you. Keep going, one small step at a time.</p><div className="actions"><Link className="btn primary" href="/newsletter">Get the Knowlege Letter</Link><Link className="btn" href="/knowledge-hub">Explore the Knowledge Hub</Link></div></div>;
  if (state === "fallback") return <p className="notice">We could not save your feedback here. <a href={mail}>Send it by email instead</a>; it is already filled in.</p>;
  return <form onSubmit={onSubmit} className="fform finishform">
    {ready && <p className="hint">You completed {done.length} of 12 milestones on this device.</p>}
    <fieldset className="stars"><legend>How helpful was the Path to Success?</legend>
      {[1, 2, 3, 4, 5].map(n => <label key={n}><input type="radio" name="rating" value={n} required /><span>{n}</span></label>)}
      <small className="hint">1 = not helpful, 5 = very helpful</small>
    </fieldset>
    <label>What helped you most?<textarea name="helped" rows={3} maxLength={2000} /></label>
    <label>What is still unclear, or what should we add?<textarea name="unclear" rows={3} maxLength={2000} /></label>
    <label>Any other question or comment<textarea name="message" rows={3} maxLength={3000} /></label>
    <label className="check"><input type="checkbox" name="mentor" value="yes" /> I would like help finding a mentor or a local mosque</label>
    <label>Your city and country (optional, to suggest a local mosque)<input name="location" maxLength={200} /></label>
    <label>Email (optional, only to reply)<input name="email" type="email" maxLength={200} autoComplete="email" /></label>
    <input name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden />
    <small className="hint">We use these answers only to reply to you and improve this path. See our <Link href="/privacy">Privacy Policy</Link>.</small>
    <button className="btn primary" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send feedback"}</button>
  </form>;
}
