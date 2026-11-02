// Twelve well-known hadith for the Hadith Library cards, all from Sahih al-Bukhari.
// Titles, summaries and "why it matters" notes are Knowlege.org's own wording; no translation
// is stored here (see CONTENT_GOVERNANCE.md). The detail page loads the full Arabic and English
// text at runtime from the open hadith-api dataset, whose al-Bukhari numbering matches Sunnah.com.
export interface HadithCard {
  slug: string; n: number; title: string; narrator: string; summary: string; matters: string;
  related?: { href: string; label: string };
}

export const HADITH_CARDS: HadithCard[] = [
  { slug: "actions-are-by-intentions", n: 1, title: "Actions are judged by intentions", narrator: "'Umar ibn al-Khattab",
    summary: "Every deed is weighed by the intention behind it, and each person receives what they truly intended.",
    matters: "Al-Bukhari placed it first in his collection, and scholars often open books with it as a reminder to make every act sincerely for Allah." },
  { slug: "islam-built-on-five", n: 8, title: "Islam is built on five", narrator: "'Abdullah ibn 'Umar",
    summary: "The testimony of faith, prayer, zakah, Hajj and fasting Ramadan are the five foundations of Islam.",
    matters: "It sets out the five pillars that every Muslim learns first.",
    related: { href: "/knowledge-hub/salah", label: "Prayer (Salah) guide" } },
  { slug: "safe-from-tongue-and-hand", n: 10, title: "A Muslim keeps others safe from harm", narrator: "'Abdullah ibn 'Amr",
    summary: "A true Muslim is one whose words and actions do not harm other Muslims, and true migration is leaving what Allah forbids.",
    matters: "It ties faith directly to how a person speaks and behaves towards others." },
  { slug: "love-for-your-brother", n: 13, title: "Love for others what you love for yourself", narrator: "Anas ibn Malik",
    summary: "Faith is not complete until a person wants for their brother what they want for themselves.",
    matters: "A short rule for fairness, generosity and good will in every relationship." },
  { slug: "religion-is-easy", n: 39, title: "The religion is easy", narrator: "Abu Hurayrah",
    summary: "Islam is easy; whoever overburdens themselves will be overcome, so keep a steady, moderate path.",
    matters: "It warns against extremes and encourages consistent, balanced worship." },
  { slug: "hadith-of-jibril", n: 50, title: "The hadith of Jibril: Islam, Iman and Ihsan", narrator: "Abu Hurayrah",
    summary: "The angel Jibril came as a man and asked about Islam, faith (iman), excellence (ihsan) and the Hour.",
    matters: "Scholars describe it as a summary of the whole religion: actions, beliefs and worshipping as though you see Allah." },
  { slug: "halal-and-haram-are-clear", n: 52, title: "The lawful and unlawful are clear", narrator: "An-Nu'man ibn Bashir",
    summary: "What is lawful is clear and what is unlawful is clear; between them are doubtful matters that are best avoided. It ends by pointing to the heart.",
    matters: "A key principle for everyday choices: guard your religion by staying away from what is doubtful.",
    related: { href: "/knowledge-hub/halal-haram", label: "Halal and Haram guide" } },
  { slug: "make-things-easy", n: 69, title: "Make things easy, not difficult", narrator: "Anas ibn Malik",
    summary: "Make things easy for people and do not make them hard; give good news and do not drive people away.",
    matters: "Guidance for teachers, parents and anyone sharing Islam with others." },
  { slug: "learn-and-teach-the-quran", n: 5027, title: "The best learn the Qur'an and teach it", narrator: "'Uthman ibn 'Affan",
    summary: "The best among you are those who learn the Qur'an and teach it to others.",
    matters: "It honours both students and teachers of the Qur'an.",
    related: { href: "/quran", label: "Read the Qur'an" } },
  { slug: "speak-good-or-be-silent", n: 6018, title: "Speak good or stay silent", narrator: "Abu Hurayrah",
    summary: "Whoever believes in Allah and the Last Day should not harm their neighbour, should honour their guest, and should say what is good or keep quiet.",
    matters: "Three everyday signs of faith: care for neighbours, generosity to guests and control of the tongue." },
  { slug: "true-strength", n: 6114, title: "True strength is self-control", narrator: "Abu Hurayrah",
    summary: "The strong person is not the one who overpowers others, but the one who controls themselves when angry.",
    matters: "It redefines strength as mastering one's own anger." },
  { slug: "do-not-become-angry", n: 6116, title: "Do not become angry", narrator: "Abu Hurayrah",
    summary: "A man asked for advice and was told not to become angry; each time he asked again, the answer was the same.",
    matters: "A short piece of advice that scholars connect to avoiding much of the harm people do." },
];

export const getHadithCard = (slug: string) => HADITH_CARDS.find(h => h.slug === slug);
