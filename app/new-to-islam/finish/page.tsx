import Link from "next/link";
import { FinishFeedback } from "../../../components/PathClient";

export const metadata = {
  title: "Finish Line: Your Questions and Feedback | New to Islam",
  description: "You reached the end of the Path to Success. Tell us what helped, what is still unclear, and whether you would like help finding a mentor or a local mosque.",
  alternates: { canonical: "/new-to-islam/finish" },
};

export default function Page() {
  return <main className="shell page pathstep finish">
    <div className="crumbs"><Link href="/">Home</Link> › <Link href="/new-to-islam">New to Islam</Link> › Finish Line</div>
    <span className="tag">Finish Line</span>
    <h1>You walked the Path to Success</h1>
    <p className="lead">Whether you are a new Muslim, thinking about Islam, or simply curious, thank you for taking this journey. Your answers help us make the path clearer for the next person.</p>
    <FinishFeedback />
    <div className="notice" style={{ marginTop: 28 }}>
      Need to talk to someone now? The <Link href="/help">Help Center</Link> lists support services, and most local mosques welcome visitors and have new-Muslim classes. You can also <Link href="/contact">contact us</Link> directly. <Link href="/new-to-islam">Back to the path overview</Link>.
    </div>
  </main>;
}
