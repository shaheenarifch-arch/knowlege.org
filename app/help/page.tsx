import Link from "next/link";
import { HelpDirectory } from "../../components/HelpDirectory";
import { URGENT, CHECKED } from "../../lib/help-resources";

export const metadata = {
  title: "Help Resource Directory",
  description: "Free food, housing, education, healthcare, counseling and community services in Massachusetts and across the US, checked against official sources, with urgent crisis numbers.",
  alternates: { canonical: "/help" },
};

export default function Page() {
  return <main className="shell page helpdir">
    <span className="tag">Find help</span>
    <h1>Help Resource Directory</h1>
    <p className="lead">Free and low-cost services for food, housing, education, healthcare, counseling and community support, in Massachusetts and nationwide. Every listing links to the provider's official website.</p>

    <section className="urgent" aria-labelledby="urgent-h">
      <h2 id="urgent-h">Need help right now?</h2>
      <p className="help">This website is not an emergency service. If you or someone else is in danger, call 911.</p>
      <ul>{URGENT.map(u => <li key={u.label}>
        <strong>{u.label}</strong>
        <span className="how">{u.tel ? <a href={`tel:${u.tel}`}>{u.how}</a> : u.sms ? <a href={`sms:${u.sms}${u.label.startsWith("Crisis") ? "?&body=HOME" : ""}`}>{u.how}</a> : u.how}</span>
        <span className="note">{u.note}{u.url && <> <a href={u.url} target="_blank" rel="noopener noreferrer">Website ↗</a></>}</span>
      </li>)}</ul>
    </section>

    <HelpDirectory />

    <section className="section">
      <h2>About this directory</h2>
      <p className="lead">Listings were checked against each provider's own website on {CHECKED}. Phone numbers, hours and rules can change, so please confirm with the provider. Knowlege.org is not connected to these services and does not decide who qualifies.</p>
      <p className="help">Know a service that should be listed, or found a wrong number? <Link href="/contact">Suggest a resource or report a correction</Link>. For questions about zakah or charity, see our <Link href="/charity">Charity page</Link> and the <Link href="/knowledge-hub/zakah">Zakah guide</Link>.</p>
    </section>
  </main>;
}
