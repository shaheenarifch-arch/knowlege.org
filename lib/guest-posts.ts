// Guest posts ("Write for us"): storage in Cloudflare D1 and the status workflow.
// Table: database/d1-guest-posts.sql. Help: https://developers.cloudflare.com/d1/
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { z } from "zod";
import { TOPICS } from "./guest-topics";

type D1Stmt = { bind(...v: unknown[]): D1Stmt; run(): Promise<unknown>; first<T = Record<string, unknown>>(): Promise<T | null>; all<T = Record<string, unknown>>(): Promise<{ results: T[] }> };
type D1Like = { prepare(q: string): D1Stmt };

export type GuestStatus = "SUBMITTED" | "IN_REVIEW" | "CHANGES_REQUESTED" | "RESUBMITTED" | "PUBLISHED" | "DECLINED";

export interface GuestPost {
  id: string; code: string; edit_token: string; status: GuestStatus;
  name: string; email: string; bio: string; title: string; topic: string; summary: string; body: string; refs: string;
  slug: string | null; editor_note: string | null;
  created_at: string; updated_at: string; published_at: string | null; last_reminded_at: string | null;
}
export interface GuestEvent { id: string; post_id: string; event: string; note: string | null; created_at: string }

/** What the writer sees for each status. */
export const STATUS_LABEL: Record<GuestStatus, { label: string; help: string }> = {
  SUBMITTED: { label: "Submitted", help: "We have your article. An editor will start reviewing it soon." },
  IN_REVIEW: { label: "In review", help: "An editor is reading your article and checking its references." },
  CHANGES_REQUESTED: { label: "Changes requested", help: "The editor asked for some changes. Use the edit link in your email to update and resubmit." },
  RESUBMITTED: { label: "Resubmitted", help: "Thank you for the update. The editor will review it again." },
  PUBLISHED: { label: "Published", help: "Your article is live on Knowlege.org." },
  DECLINED: { label: "Not accepted", help: "This article was not accepted. The editor's reason is shown below." },
};

export { TOPICS };

/** The article fields a writer fills in (used for new submissions and resubmissions). */
export const ArticleSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  bio: z.string().trim().min(20, "Please write a short bio (at least 20 characters).").max(400),
  title: z.string().trim().min(10, "The title should be at least 10 characters.").max(120),
  topic: z.enum(TOPICS),
  summary: z.string().trim().min(40, "The summary should be at least 40 characters.").max(300),
  body: z.string().trim().refine(t => wordCount(t) >= 600, "The article must be at least 600 words.").refine(t => wordCount(t) <= 2000, "The article must be 2,000 words or fewer."),
  refs: z.string().trim().min(10, "Please list your references (Qur'an verses, hadith numbers, books).").max(4000),
  original: z.literal(true, { errorMap: () => ({ message: "Please confirm the article is your own original work." }) }),
});
export type Article = z.infer<typeof ArticleSchema>;

export const wordCount = (t: string) => (t.trim().match(/\S+/g) ?? []).length;

export async function guestDb(): Promise<D1Like> {
  const { env } = await getCloudflareContext({ async: true });
  const b = (env as unknown as { NEWSLETTER_DB?: D1Like }).NEWSLETTER_DB;
  if (!b) throw new Error("NEWSLETTER_DB_NOT_BOUND");
  return b;
}

/** Reads a setting from the Cloudflare env (vars/secrets) or process.env. */
export async function setting(name: string): Promise<string | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const v = (env as unknown as Record<string, unknown>)[name];
    if (typeof v === "string" && v) return v;
  } catch { /* not on Cloudflare */ }
  return process.env[name] || undefined;
}

export async function siteUrl() { return ((await setting("NEXT_PUBLIC_SITE_URL")) ?? "https://knowlege.org").replace(/\/$/, ""); }

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L
function randomString(n: number, alphabet = ALPHABET) {
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  return Array.from(bytes, b => alphabet[b % alphabet.length]).join("");
}
export const newCode = () => "KG-" + randomString(6);
export const newToken = () => randomString(32, "abcdefghijklmnopqrstuvwxyz0123456789");

export function slugify(title: string) {
  return title.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "guest-post";
}

export async function logEvent(db: D1Like, postId: string, event: string, note: string | null = null) {
  await db.prepare("INSERT INTO guest_post_events (id,post_id,event,note) VALUES (?1,?2,?3,?4)").bind(crypto.randomUUID(), postId, event, note).run();
}

export async function getByCode(db: D1Like, code: string) {
  return db.prepare("SELECT * FROM guest_posts WHERE code=?1").bind(code.trim().toUpperCase()).first<GuestPost>();
}
export async function getById(db: D1Like, id: string) {
  return db.prepare("SELECT * FROM guest_posts WHERE id=?1").bind(id).first<GuestPost>();
}
export async function getPublished() {
  try {
    const db = await guestDb();
    return (await db.prepare("SELECT * FROM guest_posts WHERE status='PUBLISHED' ORDER BY published_at DESC").all<GuestPost>()).results;
  } catch (e) {
    console.error("guest posts unavailable", e);
    return [];
  }
}
export async function getPublishedBySlug(slug: string) {
  try {
    const db = await guestDb();
    return await db.prepare("SELECT * FROM guest_posts WHERE slug=?1 AND status='PUBLISHED'").bind(slug).first<GuestPost>();
  } catch (e) {
    console.error("guest post unavailable", e);
    return null;
  }
}

/** Splits the article into blocks: "## " lines are headings, blank lines separate paragraphs. */
export function toBlocks(body: string): Array<{ h?: string; p?: string }> {
  return body.replace(/\r\n/g, "\n").split(/\n\s*\n/).map(b => b.trim()).filter(Boolean)
    .map(b => (b.startsWith("## ") ? { h: b.slice(3).trim() } : { p: b.replace(/\n/g, " ") }));
}

/** Only lets the signed-in editor through. /admin is protected by Cloudflare Access, which adds this header. */
export async function isEditor(h: { get(name: string): string | null }) {
  const allowed = ((await setting("GUEST_POST_EDITOR_EMAIL")) ?? "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
  const who = (h.get("cf-access-authenticated-user-email") ?? "").toLowerCase();
  return allowed.length > 0 && allowed.includes(who);
}
