"use client";
import { useEffect, useState } from "react";
import { TOPICS } from "../lib/guest-topics";

type Initial = { name: string; email: string; bio: string; title: string; topic: string; summary: string; body: string; refs: string };
const EMPTY: Initial = { name: "", email: "", bio: "", title: "", topic: TOPICS[0], summary: "", body: "", refs: "" };
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const words = (t: string) => (t.trim().match(/\S+/g) ?? []).length;

/** The guest post form. With `edit` set, it updates an article after "Changes requested". */
export function GuestPostForm({ initial = EMPTY, edit }: { initial?: Initial; edit?: { code: string; token: string; note: string | null } }) {
  const [v, setV] = useState<Initial>(initial);
  const [original, setOriginal] = useState(false);
  const [state, setState] = useState<{ busy?: boolean; error?: string; code?: string }>({});
  const set = (k: keyof Initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV({ ...v, [k]: e.target.value });
  const n = words(v.body);

  useEffect(() => {
    if (!SITE_KEY || edit || document.getElementById("cf-turnstile")) return;
    const s = document.createElement("script");
    s.id = "cf-turnstile"; s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"; s.async = true; s.defer = true;
    document.head.appendChild(s);
  }, [edit]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ busy: true });
    const fd = new FormData(e.currentTarget);
    const payload = { ...v, original, website: fd.get("website"), turnstile: fd.get("cf-turnstile-response"), ...(edit ? { code: edit.code, token: edit.token } : {}) };
    type Res = { ok: boolean; code?: string; error?: string };
    const r: Res = await fetch(edit ? "/api/guest-posts/resubmit" : "/api/guest-posts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
      .then(async x => ({ ok: x.ok, ...(await x.json().catch(() => ({}))) }) as { ok: boolean; code?: string; error?: string })
      .catch((): Res => ({ ok: false, error: "Network problem. Please check your connection and try again." }));
    if (r.ok && r.code) { setState({ code: r.code }); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else setState({ error: r.error ?? "Something went wrong. Please try again." });
  }

  if (state.code) return <div className="gp-done" role="status">
    <h2>{edit ? "Changes sent. Thank you!" : "Thank you, your article is in!"}</h2>
    <p>Your tracking code is <strong className="gp-code">{state.code}</strong>. We've also emailed it to <strong>{v.email}</strong>.</p>
    <p>An editor will review your article and check every reference, usually within 7 days. You'll get an email when there's news.</p>
    <p><a className="btn primary" href={`/write-for-us/status?code=${encodeURIComponent(state.code)}`}>Check status</a></p>
    <p className="help">No email after a few minutes? Check your spam folder, or <a href="/contact">contact us</a> with your tracking code.</p>
  </div>;

  return <form className="gp-form" onSubmit={submit} noValidate>
    {edit?.note && <div className="notice"><strong>The editor asked for these changes:</strong><p style={{ whiteSpace: "pre-wrap", margin: "8px 0 0" }}>{edit.note}</p></div>}
    <fieldset><legend>About you</legend>
      <label>Your name<input className="input" required maxLength={80} value={v.name} onChange={set("name")} autoComplete="name" /></label>
      <label>Email<input className="input" required type="email" maxLength={200} value={v.email} onChange={set("email")} autoComplete="email" disabled={!!edit} aria-describedby="gp-email-help" />
        <span className="help" id="gp-email-help">We send your tracking code and every update here. It is never published.</span></label>
      <label>Short bio<textarea className="input" required rows={3} maxLength={400} value={v.bio} onChange={set("bio")} aria-describedby="gp-bio-help" />
        <span className="help" id="gp-bio-help">1–3 sentences shown under your article, e.g. your background or study. {v.bio.length}/400</span></label>
    </fieldset>
    <fieldset><legend>Your article</legend>
      <label>Title<input className="input" required maxLength={120} value={v.title} onChange={set("title")} /></label>
      <label>Topic<select className="input" value={v.topic} onChange={set("topic")}>{TOPICS.map(t => <option key={t}>{t}</option>)}</select></label>
      <label>Summary<textarea className="input" required rows={2} maxLength={300} value={v.summary} onChange={set("summary")} aria-describedby="gp-sum-help" />
        <span className="help" id="gp-sum-help">One or two sentences that appear on the blog list. {v.summary.length}/300</span></label>
      <label>Article<textarea className="input" required rows={18} value={v.body} onChange={set("body")} aria-describedby="gp-body-help" />
        <span className={`help${n > 0 && (n < 600 || n > 2000) ? " gp-warn" : ""}`} id="gp-body-help">{n} words (600–2,000). Leave a blank line between paragraphs. Start a line with <code>## </code> for a heading.</span></label>
      <label>References<textarea className="input" required rows={5} maxLength={4000} value={v.refs} onChange={set("refs")} aria-describedby="gp-refs-help" />
        <span className="help" id="gp-refs-help">One per line, e.g. <em>Qur&apos;an 2:153</em>, <em>Sahih al-Bukhari 6114</em>, or a book with author and page. Look up hadith numbers on <a href="https://sunnah.com" target="_blank" rel="noopener">sunnah.com</a> and verses on <a href="https://quran.com" target="_blank" rel="noopener">quran.com</a>.</span></label>
    </fieldset>
    <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="gp-hp" />
    <label className="gp-check"><input type="checkbox" checked={original} onChange={e => setOriginal(e.target.checked)} /> This is my own original work, not published elsewhere, and I agree to the <a href="/write-for-us#rules">guidelines</a> and <a href="/terms">terms</a>.</label>
    {SITE_KEY && !edit && <div className="cf-turnstile" data-sitekey={SITE_KEY} data-theme="dark" style={{ marginTop: 14 }} />}
    {state.error && <p className="gp-error" role="alert">{state.error}</p>}
    <button className="btn primary" disabled={state.busy} style={{ marginTop: 16 }}>{state.busy ? "Sending…" : edit ? "Resubmit article" : "Submit article"}</button>
    <p className="help">Need help? Read the <a href="/write-for-us#faq">questions below</a> or <a href="/contact">contact us</a>.</p>
  </form>;
}
