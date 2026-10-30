import Link from "next/link";
export const metadata = { title: "Privacy Policy", description: "How Knowlege.org collects, uses and protects your information, including newsletter emails and research questions." };
const EMAIL = "shaheenarifch@gmail.com";
export default function Page() {
  return <main className="shell page legal">
    <span className="tag">Privacy</span>
    <h1>Privacy Policy</h1>
    <p className="lead">Last updated: 29 October 2026</p>
    <p>Knowlege.org ("we") collects as little personal information as possible. This policy explains what we collect, why, and the choices you have.</p>
    <h2>Information we collect</h2>
    <ul>
      <li><strong>Newsletter.</strong> If you subscribe to the <Link href="/newsletter">Knowlege Letter</Link>, we store your email address, your chosen language, and the date you gave consent.</li>
      <li><strong>Research Desk searches.</strong> Searches run in your browser. Your search words are sent directly to the public sources being searched (<a href="https://alquran.cloud/api" target="_blank" rel="noopener noreferrer">AlQuran Cloud</a> for the Qur'an, and <a href="https://www.jsdelivr.com/terms/privacy-policy-jsdelivr-net" target="_blank" rel="noopener noreferrer">jsDelivr</a>, which serves the hadith collections), not stored by us.</li>
      <li><strong>AI research questions.</strong> If AI research is switched on in future, questions you submit are sent to our AI service to generate a cited answer. Please do not include personal details in questions.</li>
      <li><strong>Technical data.</strong> Our hosting provider (<a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare</a>) processes standard request data such as IP address and browser type to deliver and protect the site.</li>
    </ul>
    <p>We do not sell your information, show ads, or accept donations through this site. We do not use advertising or tracking cookies.</p>
    <h2>How we use it</h2>
    <p>We use your email only to send the newsletter you asked for and, if you write to us, to reply. We may use an email delivery service to send the newsletter; it receives only what it needs to deliver it.</p>
    <h2>Your choices</h2>
    <ul>
      <li><strong>Unsubscribe</strong> at any time using the link in any newsletter, or by emailing <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Unsubscribe")}`}>{EMAIL}</a>.</li>
      <li><strong>See, correct or delete</strong> your data by emailing <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Privacy request")}`}>{EMAIL}</a>. We will respond within 30 days.</li>
    </ul>
    <h2>Retention and security</h2>
    <p>We keep newsletter data while you are subscribed and remove it on request. Data is stored with reputable providers using encrypted connections.</p>
    <h2>Children</h2>
    <p>The newsletter is not intended for children under 13, and we do not knowingly collect their information.</p>
    <h2>Changes</h2>
    <p>If we change this policy, we will update the date above. Questions? <Link href="/contact">Contact us</Link>.</p>
  </main>;
}
