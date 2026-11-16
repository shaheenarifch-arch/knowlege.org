// Notification emails for guest posts, sent with Resend (free plan: 3,000 emails/month).
// Setup: https://resend.com/docs/dashboard/domains/introduction (verify knowlege.org), then set
// RESEND_API_KEY as a Cloudflare secret. Without a key, emails are skipped and logged; the
// writer still sees every status on /write-for-us/status.
import { setting, siteUrl, STATUS_LABEL, type GuestPost } from "./guest-posts";

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

function layout(heading: string, html: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1d2b23;line-height:1.6">
<h2 style="color:#145c3c;margin:0 0 12px">${esc(heading)}</h2>${html}
<hr style="border:0;border-top:1px solid #dfe6e1;margin:24px 0">
<p style="font-size:12px;color:#5b6b61">Knowlege.org, Knowledge for Mankind. Questions? Reply to this email or see <a href="https://knowlege.org/contact">our contact page</a>.</p></div>`;
}
const button = (href: string, text: string) =>
  `<p><a href="${href}" style="display:inline-block;background:#145c3c;color:#ffffff;padding:11px 18px;border-radius:999px;text-decoration:none;font-weight:bold">${esc(text)}</a></p>`;
const quote = (s: string) => `<blockquote style="margin:12px 0;padding:10px 14px;background:#eef5f0;border-left:4px solid #145c3c">${esc(s).replace(/\n/g, "<br>")}</blockquote>`;

async function send(to: string, subject: string, html: string, replyTo?: string) {
  const key = await setting("RESEND_API_KEY");
  const from = (await setting("GUEST_POST_FROM_EMAIL")) ?? "Knowlege.org <editors@knowlege.org>";
  if (!key) { console.warn(`guest-post email skipped (RESEND_API_KEY not set): ${subject} -> ${to}`); return false; }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    if (!r.ok) console.error("guest-post email failed", r.status, await r.text());
    return r.ok;
  } catch (e) { console.error("guest-post email failed", e); return false; }
}

async function editors() {
  return ((await setting("GUEST_POST_EDITOR_EMAIL")) ?? "").split(",").map(s => s.trim()).filter(Boolean);
}
async function links(p: GuestPost) {
  const base = await siteUrl();
  return {
    status: `${base}/write-for-us/status?code=${encodeURIComponent(p.code)}`,
    edit: `${base}/write-for-us/edit?code=${encodeURIComponent(p.code)}&token=${encodeURIComponent(p.edit_token)}`,
    review: `${base}/admin/guest-posts?id=${encodeURIComponent(p.id)}`,
    live: p.slug ? `${base}/blog/guest/${p.slug}` : base,
  };
}

/** Writer: "we received your article". */
export async function mailReceived(p: GuestPost) {
  const l = await links(p);
  return send(p.email, `We received your article: ${p.title}`, layout(`Thank you, ${p.name}`, `
<p>We received your article <strong>${esc(p.title)}</strong>. An editor will review it, usually within 7 days.</p>
<p>Your tracking code is <strong style="font-size:18px">${p.code}</strong>. Keep it to check your article's status at any time.</p>
${button(l.status, "Check status")}
<p style="font-size:13px;color:#5b6b61">What happens next: an editor reads your article and checks every Qur'an and hadith reference. You will get an email if changes are needed, and another when it is published.</p>`));
}

/** Writer: their resubmission arrived. */
export async function mailResubmitted(p: GuestPost) {
  const l = await links(p);
  return send(p.email, `We received your updated article: ${p.title}`, layout(`Thank you, ${p.name}`, `
<p>Your updated article <strong>${esc(p.title)}</strong> has been resubmitted. The editor will review it again.</p>${button(l.status, "Check status")}`));
}

/** Editor(s): a new or resubmitted article is waiting. */
export async function mailEditorNew(p: GuestPost, resubmitted = false) {
  const l = await links(p);
  const to = await editors();
  const html = layout(resubmitted ? "Guest post resubmitted" : "New guest post submitted", `
<p><strong>${esc(p.title)}</strong><br>by ${esc(p.name)} &lt;${esc(p.email)}&gt; · ${esc(p.topic)} · ${p.code}</p>
${quote(p.summary)}
${button(l.review, "Review it now")}
<p style="font-size:13px;color:#5b6b61">Reply to this email to write to the author directly.</p>`);
  return Promise.all(to.map(e => send(e, `${resubmitted ? "Resubmitted" : "New"} guest post: ${p.title}`, html, p.email)));
}

/** Editor(s): reminder about articles waiting more than 3 days. */
export async function mailEditorReminder(waiting: GuestPost[]) {
  const base = await siteUrl();
  const rows = waiting.map(p => `<li><a href="${base}/admin/guest-posts?id=${encodeURIComponent(p.id)}">${esc(p.title)}</a> by ${esc(p.name)} · ${STATUS_LABEL[p.status].label} since ${p.updated_at.slice(0, 10)}</li>`).join("");
  const html = layout(`${waiting.length} guest post${waiting.length === 1 ? "" : "s"} waiting for review`, `<ul>${rows}</ul>${button(`${base}/admin/guest-posts`, "Open the review screen")}`);
  return Promise.all((await editors()).map(e => send(e, `Reminder: ${waiting.length} guest post${waiting.length === 1 ? "" : "s"} waiting for review`, html)));
}

/** Writer: the editor's decision. */
export async function mailDecision(p: GuestPost) {
  const l = await links(p);
  if (p.status === "IN_REVIEW") return send(p.email, `Your article is in review: ${p.title}`, layout("Your article is in review", `
<p>An editor has started reviewing <strong>${esc(p.title)}</strong>. We will email you when there's a decision.</p>${button(l.status, "Check status")}`));
  if (p.status === "CHANGES_REQUESTED") return send(p.email, `Changes requested: ${p.title}`, layout("A few changes, please", `
<p>Thank you for <strong>${esc(p.title)}</strong>. Before we can publish it, the editor asks for these changes:</p>${quote(p.editor_note ?? "")}
${button(l.edit, "Edit and resubmit")}
<p style="font-size:13px;color:#5b6b61">This link is private to you; please don't share it. Your tracking code is ${p.code}.</p>`));
  if (p.status === "DECLINED") return send(p.email, `About your article: ${p.title}`, layout(`Thank you, ${p.name}`, `
<p>Thank you for writing <strong>${esc(p.title)}</strong> for Knowlege.org. After review, we are not able to publish it.</p>
${p.editor_note ? `<p>The editor's reason:</p>${quote(p.editor_note)}` : ""}
<p>You are welcome to submit a different article. Please read the <a href="https://knowlege.org/write-for-us">guidelines</a> first.</p>`));
  if (p.status === "PUBLISHED") return send(p.email, `Published: ${p.title}`, layout("Your article is live", `
<p>Alhamdulillah, <strong>${esc(p.title)}</strong> is now published on Knowlege.org.</p>${button(l.live, "Read it live")}
<p>Please share it with family and friends. May Allah reward you for spreading beneficial knowledge.</p>`));
  return false;
}
