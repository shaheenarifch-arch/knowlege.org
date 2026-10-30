import Link from "next/link";
export const metadata = { title: "Terms of Use", description: "The terms for using Knowlege.org, including use of source texts, reflections, directories and the newsletter." };
export default function Page() {
  return <main className="shell page legal">
    <span className="tag">Terms</span>
    <h1>Terms of Use</h1>
    <p className="lead">Last updated: 29 October 2026</p>
    <p>By using Knowlege.org ("the site") you agree to these terms. If you do not agree, please do not use the site.</p>
    <h2>Educational purpose</h2>
    <p>The site is for learning and research. Nothing on it is a religious ruling (fatwa), or legal, medical or financial advice. For rulings, ask a qualified scholar.</p>
    <h2>Sources and accuracy</h2>
    <p>Verse and hadith texts are shown as published by the named sources, and hadith gradings are shown as given by those sources. We work to keep references accurate but cannot guarantee that every source or translation is free of error. Please <Link href="/contact">report any mistake</Link> you find. See <Link href="/about#sources">how we use sources</Link>.</p>
    <h2>Charity and help directories</h2>
    <p>Listings link to independent organizations. We review them before listing, but we do not control those organizations and are not responsible for their services. Knowlege.org does not collect donations; please give directly through an organization's official channels.</p>
    <h2>Content and copyright</h2>
    <p>Original text on this site belongs to Knowlege.org. Source texts remain subject to their own licenses, such as public-domain translations and open datasets. You may share links and short quotes with attribution.</p>
    <h2>Acceptable use</h2>
    <p>Please do not misuse the site, for example by attempting to disrupt it, scraping it at a damaging rate, or submitting unlawful or abusive content.</p>
    <h2>External links</h2>
    <p>Links to other websites are provided for convenience. We are not responsible for their content or privacy practices.</p>
    <h2>Liability</h2>
    <p>The site is provided "as is" without warranties of any kind. To the extent permitted by law, Knowlege.org is not liable for any loss arising from use of the site.</p>
    <h2>Governing law</h2>
    <p>These terms are governed by the laws of the Commonwealth of Massachusetts, USA.</p>
    <h2>Changes</h2>
    <p>We may update these terms and will change the date above when we do. See also our <Link href="/privacy">Privacy Policy</Link>.</p>
  </main>;
}
