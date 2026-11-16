import Link from "next/link";
import { GuestPostForm } from "../../../components/GuestPostForm";
import { getByCode, guestDb } from "../../../lib/guest-posts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Your Guest Post", robots: { index: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ code?: string; token?: string }> }) {
  const { code = "", token = "" } = await searchParams;
  let post = null;
  try { post = code ? await getByCode(await guestDb(), code) : null; } catch (e) { console.error(e); }
  const valid = post && post.edit_token === token;

  return <main className="shell page gp">
    <p className="crumbs"><Link href="/write-for-us">Write for us</Link> / Edit</p>
    <h1>Edit your article</h1>
    {!valid ? <div className="notice">This edit link isn&apos;t valid. Please use the <strong>Edit and resubmit</strong> link from your latest email, or <Link href="/contact">contact us</Link>.</div>
      : post!.status !== "CHANGES_REQUESTED" ? <div className="notice">This article isn&apos;t waiting for changes right now. <Link href={`/write-for-us/status?code=${post!.code}`}>Check its status</Link>.</div>
      : <GuestPostForm initial={{ name: post!.name, email: post!.email, bio: post!.bio, title: post!.title, topic: post!.topic, summary: post!.summary, body: post!.body, refs: post!.refs }} edit={{ code: post!.code, token, note: post!.editor_note }} />}
  </main>;
}
