import Link from "next/link";
import { GuestPostForm } from "../../components/GuestPostForm";

export const metadata = {
  title: "Write for Us: Guest Posts",
  description: "Share beneficial knowledge on Knowlege.org. Read the guest post guidelines, submit your article, and track its review status.",
};

const STEPS = [
  ["Submit", "Send your article with the form below. You get a tracking code by email straight away."],
  ["Review", "An editor reads it and checks every Qur'an verse and hadith reference, usually within 7 days."],
  ["Changes", "If something needs fixing, we email you a note and a private link to edit and resubmit."],
  ["Published", "Once approved, your article goes live on the blog with your name and bio, and we email you the link."],
];

export default function Page() {
  return <main className="shell page gp">
    <span className="tag">Guest posts</span>
    <h1>Write for Knowlege.org</h1>
    <p className="lead">Share beneficial knowledge with readers around the world. We welcome original, well-sourced articles from students of knowledge, teachers, and everyday Muslims with something useful to say.</p>

    <section className="section" aria-labelledby="how">
      <h2 id="how">How it works</h2>
      <ol className="gp-steps">{STEPS.map(([t, d], i) => <li key={t}><span className="gp-num">{i + 1}</span><div><strong>{t}</strong><p>{d}</p></div></li>)}</ol>
      <p className="help">Already sent an article? <Link href="/write-for-us/status">Check its status</Link> with your tracking code.</p>
    </section>

    <section className="section" id="rules" aria-labelledby="rules-h">
      <h2 id="rules-h">Guidelines</h2>
      <ul className="gp-rules">
        <li><strong>Original work only.</strong> Not published elsewhere, and not written by AI.</li>
        <li><strong>Every source cited.</strong> Give the reference for each Qur&apos;an verse (e.g. 2:153) and hadith (collection and number). Use sound (sahih or hasan) hadith.</li>
        <li><strong>Respectful and balanced.</strong> Where the four Sunni schools differ, say so fairly. No attacks on people, groups or scholars.</li>
        <li><strong>Learning, not rulings.</strong> Don&apos;t issue fatwas; point readers to a qualified scholar for rulings.</li>
        <li><strong>No selling.</strong> No affiliate links, product promotion or paid links.</li>
        <li><strong>Length.</strong> 600–2,000 words, written in English.</li>
      </ul>
      <p className="help">We may edit for clarity, spelling and references, and we&apos;ll ask you before any change to meaning. Read our <Link href="/terms">terms</Link> and <Link href="/privacy">privacy policy</Link>.</p>
    </section>

    <section className="section" aria-labelledby="form-h">
      <h2 id="form-h">Submit your article</h2>
      <GuestPostForm />
    </section>

    <section className="section" id="faq" aria-labelledby="faq-h">
      <h2 id="faq-h">Questions</h2>
      <details className="faq"><summary>How long does review take?</summary><p>Usually within 7 days. You&apos;ll get an email at each step, and you can check any time on the <Link href="/write-for-us/status">status page</Link>.</p></details>
      <details className="faq"><summary>I lost my tracking code.</summary><p>Search your email for &quot;We received your article&quot; from Knowlege.org, or <Link href="/contact">contact us</Link> with your name and article title.</p></details>
      <details className="faq"><summary>I didn&apos;t get an email.</summary><p>Check your spam or promotions folder and add editors@knowlege.org to your contacts. Still nothing? <Link href="/contact">Contact us</Link>.</p></details>
      <details className="faq"><summary>Can I include images?</summary><p>Not in the form yet. If an image is important to your article, mention it in the references box and the editor will contact you.</p></details>
      <details className="faq"><summary>Am I paid for guest posts?</summary><p>No. Knowlege.org is a non-commercial project; articles are shared as a form of sadaqah jariyah (ongoing charity).</p></details>
    </section>
  </main>;
}
