import Link from "next/link";
export const metadata = { title: "Contact", description: "Contact Knowlege.org about source corrections, charity or help listings, the newsletter or privacy requests." };
const EMAIL = "shaheenarifch@gmail.com";
export default function Page() {
  return <main className="shell page legal">
    <span className="tag">Contact</span>
    <h1>Contact us</h1>
    <p className="lead">Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We aim to reply within a few working days.</p>
    <h2>To help us reply quickly, mention what it's about</h2>
    <ul>
      <li><a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Source correction")}`}>Source correction</a>: include the page link and the verse or hadith reference.</li>
      <li><a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Charity or help listing")}`}>Charity or help listing</a>: include the organization's name, country and registration number.</li>
      <li><a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Newsletter")}`}>Newsletter</a>: subscribing, unsubscribing or changing language.</li>
      <li><a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Privacy request")}`}>Privacy request</a>: to see, correct or delete your data. See our <Link href="/privacy">Privacy Policy</Link>.</li>
    </ul>
    <div className="notice" style={{ marginTop: 28 }}>This inbox is not monitored for emergencies and cannot give religious rulings. If you are in danger, contact your local emergency services. For community support, see the <Link href="/help">Help Resource Directory</Link>.</div>
  </main>;
}
