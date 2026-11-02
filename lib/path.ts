import { getGuide, HUB_PHOTO, type Photo } from "./library";
import { sites } from "./holysites";
import { mosques, KAABAH, NABAWI } from "./mosques";

/**
 * "Path to Success" — the New to Islam walkthrough (/new-to-islam).
 * Text may carry [Q s:a] and [H collection n] tokens; <Cited> turns them into source links.
 * Consensus positions come first; school differences go in `detail`.
 */

export interface Quiz { q: string; options: string[]; answer: number; why: string }
export interface Milestone {
  slug: string;
  title: string;
  short: string;            // one line for the trail map
  falah: string;            // how this step is part of "success"
  photo: Photo;
  story: string[];          // history
  practice: string[];       // what you do
  points?: string[];
  value: string;            // what it builds
  example: { title: string; text: string };
  key: string;              // key verse or hadith
  detail?: string;          // differences between the schools / more detail
  links: Array<{ href: string; title: string }>;
  quiz: Quiz[];
}

const site = (id: string) => sites.find(s => s.id === id)!.photo;
const mosque = (name: string) => mosques.find(m => m.name === name)!.photo;
const guidePhoto = (slug: string) => getGuide(slug)?.photo ?? HUB_PHOTO;

export const PATH_REVIEWED = "2026-11-02";
export const PATH_KEY = "knowlege.path.v1";

export const milestones: Milestone[] = [
  {
    slug: "base-camp",
    title: "Base Camp: What Islam Means",
    short: "The meaning of Islam, and who Muslims are",
    falah: "Every journey starts by knowing where you are going. Islam calls itself a path to success in this life and the next.",
    photo: mosque("Hassan II Mosque"),
    story: [
      "The Arabic word Islam means willing submission to God, and it shares its root (s-l-m) with salam, peace. A Muslim is simply someone who submits to God. The Qur'an describes Islam as the religion God accepts [Q 3:19], and it presents itself not as something new but as the same message brought by Abraham, Moses, Jesus and every prophet before Muhammad ﷺ.",
      "Today close to two billion people are Muslims, on every continent. Most do not live in the Arab world: Indonesia, Pakistan, India and Bangladesh have the largest Muslim populations. The Qur'an treats this diversity as a sign, not a problem [Q 49:13].",
    ],
    practice: [
      "At Base Camp there is nothing you must do yet. Read slowly, ask questions, and take one milestone at a time. The Prophet ﷺ said that this religion is easy, and that whoever makes it too hard on themselves will be overcome by it [H bukhari 39].",
    ],
    points: [
      "Set an intention: you are here to learn honestly. The Prophet ﷺ taught that deeds are judged by intentions [H bukhari 1].",
      "Keep a notebook (or your phone) for questions. Each milestone has a box to send them to us.",
      "You can stop and come back at any time. Your progress is saved in this browser.",
    ],
    value: "Sincerity. Islam begins in the heart, with honest searching, before it becomes actions.",
    example: {
      title: "Salman the seeker",
      text: "Salman al-Farisi grew up in a Zoroastrian family in Persia. He left home searching for the truth, served Christian monks in Syria and Iraq, and was told by the last of them that a prophet would appear in Arabia. Sold into slavery on the way, he reached Madinah, met the Prophet ﷺ and became one of his best-known companions. His story is a reminder that the search itself is honoured.",
    },
    key: "\"Allah intends for you ease, and does not intend for you hardship.\" [Q 2:185]",
    links: [{ href: "/learning", title: "Start Learning on Knowlege.org" }, { href: "/quran", title: "Read the Qur'an" }],
    quiz: [
      { q: "The word Islam is linked to which idea?", options: ["Conquest", "Submission to God, bringing peace", "A specific nation"], answer: 1, why: "Islam means willing submission to God, from the same root as salam (peace)." },
      { q: "Which country has the largest Muslim population?", options: ["Saudi Arabia", "Egypt", "Indonesia"], answer: 2, why: "Indonesia has the largest Muslim population in the world; most Muslims are not Arab." },
    ],
  },
  {
    slug: "one-god",
    title: "One God (Tawhid) and the Six Articles of Faith",
    short: "Who Muslims worship, and the six beliefs",
    falah: "Success starts with knowing who you serve. Tawhid frees a person from serving anything else.",
    photo: mosque("Faisal Mosque"),
    story: [
      "The centre of Islam is tawhid: God (Allah, the Arabic word for God, also used by Arab Christians) is One, with no partner, no child and nothing like Him. A short chapter of the Qur'an, al-Ikhlas, sums it up in four lines [Q 112:1-4]. The Prophet ﷺ said it equals a third of the Qur'an in meaning.",
      "When the angel Jibril (Gabriel) came in human form and asked the Prophet ﷺ about faith in front of his companions, the answer became the six articles of faith that every Muslim holds [H muslim 8].",
    ],
    practice: ["Learn the six articles of faith. Belief in all six is agreed upon by all Muslims [Q 2:285] [Q 4:136]:"],
    points: [
      "Allah: One, the Creator, the Most Merciful.",
      "His angels: created beings who carry out His commands, such as Jibril.",
      "His books: the Torah, Psalms, Gospel and, finally, the Qur'an.",
      "His messengers: from Adam and Noah to Abraham, Moses, Jesus and Muhammad ﷺ, the last of them [Q 33:40].",
      "The Last Day: resurrection, judgement, Paradise and Hell.",
      "Divine decree (qadar): nothing happens outside God's knowledge and will, while people remain responsible for their choices.",
    ],
    value: "Freedom and dignity. If only God is worshipped, no person, wealth or fear can own you.",
    example: {
      title: "Bilal: \"One, One\"",
      text: "Bilal ibn Rabah was an Abyssinian slave in Makkah who accepted Islam. His master laid him on the burning sand with a rock on his chest to force him to give it up. Bilal kept repeating one word: Ahad, Ahad (One, One). He was later freed by Abu Bakr and became the first person to call the adhan.",
    },
    key: "\"Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, and there is none comparable to Him.\" [Q 112:1-4]",
    links: [{ href: "/themes", title: "Explore Qur'anic themes" }, { href: "/research", title: "Search the Qur'an for a word" }],
    quiz: [
      { q: "What does tawhid mean?", options: ["Belief that God is One, with no partner", "Belief in many prophets only", "A type of prayer"], answer: 0, why: "Tawhid is the Oneness of God, the foundation of Islam." },
      { q: "Which of these is one of the six articles of faith?", options: ["Belief in the angels", "Belief in lucky days", "Belief that prophets are divine"], answer: 0, why: "The six are: Allah, angels, books, messengers, the Last Day and divine decree." },
    ],
  },
  {
    slug: "the-messenger",
    title: "The Messenger ﷺ: From Makkah to Madinah",
    short: "The life of Prophet Muhammad ﷺ",
    falah: "The Qur'an calls the Prophet ﷺ the best example to follow [Q 33:21]. Knowing his life shows success lived out.",
    photo: site("hira"),
    story: [
      "Muhammad ﷺ was born in Makkah around 570 CE and orphaned young. Known as al-Amin, \"the trustworthy\", he worked as a merchant and married Khadijah, a respected businesswoman. At about forty, in 610 CE, while reflecting in the cave of Hira, the angel Jibril brought the first words of the Qur'an: \"Read in the name of your Lord who created\" [Q 96:1-5] [H bukhari 3].",
      "For thirteen years he called people in Makkah to worship One God and faced mockery, boycott and persecution. In 622 CE he migrated (the Hijrah) to Madinah, hiding on the way in the cave of Thawr [Q 9:40]. That journey begins the Islamic calendar. In Madinah he built a community, made treaties, and returned to Makkah peacefully in 630 CE. He died in 632 CE after his Farewell Pilgrimage.",
    ],
    practice: [
      "Send blessings on the Prophet ﷺ when his name is mentioned: \"sallallahu alayhi wa sallam\" (God's blessings and peace be upon him), written ﷺ. Begin learning his life (the sirah) from a trusted book or course.",
    ],
    value: "Trustworthiness and patience. His character was recognised even by those who opposed his message.",
    example: {
      title: "Khadijah's comfort",
      text: "When the Prophet ﷺ came home from Hira shaking after the first revelation, Khadijah wrapped him up and reassured him: God would never disgrace him, because he kept family ties, carried the burdens of the weak, helped the poor, honoured guests and stood by people in hardship [H bukhari 3]. She became the first person to believe in him.",
    },
    key: "\"We have not sent you except as a mercy to the worlds.\" [Q 21:107]",
    links: [{ href: "/holy-sites", title: "See the holy sites (Hira, Thawr, Madinah)" }, { href: "/scholars", title: "Scholar profiles" }],
    quiz: [
      { q: "Where did the first revelation come?", options: ["In Madinah", "In the cave of Hira", "In Jerusalem"], answer: 1, why: "The first verses (96:1-5) came in the cave of Hira near Makkah in 610 CE." },
      { q: "What event begins the Islamic calendar?", options: ["The Prophet's birth", "The Hijrah to Madinah in 622 CE", "The first Ramadan"], answer: 1, why: "The Hijri calendar counts from the migration to Madinah." },
    ],
  },
  {
    slug: "quran-and-sunnah",
    title: "The Qur'an and the Sunnah",
    short: "The two sources of guidance",
    falah: "Guidance comes from two sources: the Qur'an, God's word, and the Sunnah, the Prophet's way of living it.",
    photo: KAABAH,
    story: [
      "The Qur'an was revealed in Arabic over about twenty-three years. It has 114 surahs (chapters) and 6,236 verses. Companions memorised it and wrote it down as it came. After the Prophet's death, Abu Bakr had it gathered into one volume, and Uthman later sent standard copies to the major cities. God promises to preserve it [Q 15:9], and millions of people today know all of it by heart.",
      "The Sunnah is the Prophet's teaching, actions and approvals. It is recorded in hadith, each with a chain of narrators (isnad) that scholars checked carefully. The best known collections are Sahih al-Bukhari and Sahih Muslim.",
    ],
    practice: ["Start small and keep going:"],
    points: [
      "Read a good translation of the Qur'an a few verses a day. Translations explain the meaning; the Arabic is the Qur'an itself.",
      "Learn al-Fatihah (the Opening, surah 1) first. It is recited in every unit of prayer.",
      "Then learn a few short surahs from the end of the Qur'an, such as al-Ikhlas (112), al-Falaq (113) and an-Nas (114).",
      "Use our Research Desk to look up any word or topic with exact references.",
    ],
    value: "Humility and learning. The first word revealed was \"Read\", and seeking knowledge is a path to Paradise [H muslim 2699].",
    example: {
      title: "The verses that reached Jubayr",
      text: "Jubayr ibn Mut'im came to Madinah as a non-Muslim, to negotiate for prisoners of war. He heard the Prophet ﷺ reciting surah at-Tur in the sunset prayer. He later said that when the recitation reached its questions about creation, his heart almost flew [H bukhari 4854]. He accepted Islam afterwards.",
    },
    key: "\"Indeed, it is We who sent down the Reminder, and indeed, We will be its guardian.\" [Q 15:9]",
    links: [{ href: "/quran", title: "Read the Qur'an surah by surah" }, { href: "/hadith", title: "Browse the Hadith Library" }, { href: "/research", title: "Open the Research Desk" }],
    quiz: [
      { q: "How many surahs does the Qur'an have?", options: ["99", "114", "150"], answer: 1, why: "The Qur'an has 114 surahs and 6,236 verses." },
      { q: "What is the Sunnah?", options: ["A later law book", "The Prophet's teaching, actions and approvals", "A type of mosque"], answer: 1, why: "The Sunnah is the Prophet's way, preserved in hadith with chains of narrators." },
    ],
  },
  {
    slug: "shahadah",
    title: "The Shahadah: Becoming Muslim",
    short: "The declaration of faith",
    falah: "The Shahadah opens the door. It is short to say and lifelong to live.",
    photo: mosque("Istiqlal Mosque"),
    story: [
      "Every Muslim's faith rests on one testimony. It is the first of the five pillars of Islam [H bukhari 8]. The Prophet ﷺ accepted it from people of every background: rich and poor, free and enslaved, Arab and non-Arab.",
      "There is no compulsion in religion [Q 2:256]. No one should be pressured, and no one has to rush. When the conviction is there, becoming Muslim is simple.",
    ],
    practice: ["To become Muslim, a person sincerely believes and says:"],
    points: [
      "Ash-hadu an la ilaha illallah: I bear witness that there is no god but Allah.",
      "Wa ash-hadu anna Muhammadan rasulullah: and I bear witness that Muhammad is the Messenger of Allah.",
      "It can be said alone. Many people choose to say it at a mosque with witnesses, so they gain a community from day one and, if they want one, a certificate (useful later, for example for Hajj or Umrah visas).",
      "Taking a full bath (ghusl) on entering Islam is part of the practice. See the detail below.",
    ],
    value: "A fresh start. Accepting Islam wipes out what came before it [H muslim 121].",
    example: {
      title: "Amr ibn al-As holds out his hand",
      text: "Amr ibn al-As had fought against the Muslims for years. When he came to accept Islam he held back his hand and asked for one condition: that he be forgiven. The Prophet ﷺ told him that Islam wipes out what came before it [H muslim 121]. Amr went on to become one of the best-known figures of early Islam.",
    },
    key: "\"There is no compulsion in religion. The right course has become distinct from the wrong.\" [Q 2:256]",
    detail: "The Hanbali school, and a strong view in the Maliki school, hold that a new Muslim must take a ghusl on accepting Islam. The Hanafi and Shafi'i schools hold that it is recommended, and required only if something that already requires ghusl applies. All agree it is good practice. Witnesses are not a condition for the Shahadah to be valid.",
    links: [{ href: "/knowledge-hub/purity", title: "Purity guide: how to take a ghusl" }, { href: "/help", title: "Find local help and community support" }],
    quiz: [
      { q: "Do you need witnesses for the Shahadah to be valid?", options: ["Yes, always", "No, but saying it with others brings community support"], answer: 1, why: "Witnesses are not a condition; many choose a mosque for community and a certificate." },
      { q: "What did the Prophet ﷺ tell Amr ibn al-As?", options: ["Islam wipes out what came before it", "He must wait a year", "He must change his name"], answer: 0, why: "Muslim 121: Islam wipes out what came before it. Changing your name is not required." },
    ],
  },
  {
    slug: "purity-and-prayer",
    title: "Purity and Prayer (Wudu and Salah)",
    short: "Wudu, the five daily prayers, and your first prayer",
    falah: "Five times a day the adhan calls \"Hayya 'ala al-falah\", come to success. This is the milestone the whole path is named after.",
    photo: guidePhoto("salah"),
    story: [
      "Prayer was made obligatory before the Hijrah. In Madinah the Muslims needed a way to gather for it, and the call to prayer (adhan) was taught to Abdullah ibn Zayd in a dream. The Prophet ﷺ told him to teach it to Bilal, whose voice was stronger [H abudawud 499]. The same words are called from mosques around the world today.",
      "Before praying, a Muslim makes wudu, a washing that prepares body and mind [Q 5:6]. The Prophet ﷺ said that purity is half of faith [H muslim 223].",
    ],
    practice: ["Wudu, in order: intend it, then wash the hands, rinse the mouth and nose, wash the face, wash the arms to the elbows, wipe over the head (and ears), and wash the feet to the ankles.", "The five daily prayers:"],
    points: [
      "Fajr (dawn): 2 units (rak'ahs)",
      "Dhuhr (midday): 4",
      "Asr (afternoon): 4",
      "Maghrib (sunset): 3",
      "Isha (night): 4",
      "Every prayer faces the Ka'bah in Makkah (the qiblah) and includes standing, bowing, prostrating and sitting.",
      "While you are still learning al-Fatihah, you can praise God with simple words such as SubhanAllah, Alhamdulillah, La ilaha illallah and Allahu akbar, as the Prophet ﷺ taught a man who could not yet learn the Qur'an [H abudawud 832].",
    ],
    value: "Discipline and closeness to God. \"Successful indeed are the believers, who are humble in their prayers\" [Q 23:1-2].",
    example: {
      title: "Bilal climbs the Ka'bah",
      text: "When the Prophet ﷺ entered Makkah in 630 CE, he asked Bilal, once tortured in that same city, to climb onto the Ka'bah and call the adhan. The former slave's voice called everyone to \"come to success\" from the most honoured building in Arabia.",
    },
    key: "\"Successful indeed are the believers: those who are humble in their prayer.\" [Q 23:1-2]",
    detail: "The schools agree on the four washings and the wipe named in the Qur'an [Q 5:6]. They differ on details: whether intention (niyyah) is a condition (required for the Maliki, Shafi'i and Hanbali schools; a strong sunnah for the Hanafi school), and how much of the head must be wiped (a quarter for the Hanafi school, any part for the Shafi'i school, the whole head for the Maliki and Hanbali schools). Small differences in how prayer is performed, such as where the hands are placed, are all valid ways taught by the schools.",
    links: [{ href: "/knowledge-hub/purity", title: "Full guide: purity and wudu" }, { href: "/knowledge-hub/salah", title: "Full guide: how to pray" }, { href: "/islamic-calendar", title: "Islamic calendar" }],
    quiz: [
      { q: "What does \"Hayya 'ala al-falah\" mean?", options: ["God is great", "Come to success", "Peace be upon you"], answer: 1, why: "It is the line of the adhan this whole path is named after." },
      { q: "How many units (rak'ahs) is the Maghrib prayer?", options: ["2", "3", "4"], answer: 1, why: "Fajr 2, Dhuhr 4, Asr 4, Maghrib 3, Isha 4." },
      { q: "If you have not yet learned al-Fatihah, what can you do?", options: ["Skip prayer until you learn it", "Pray and say simple words of praise", "Only pray on Fridays"], answer: 1, why: "The Prophet ﷺ taught simple words of praise to a man who could not yet learn the Qur'an (Abu Dawud 832)." },
    ],
  },
  {
    slug: "fasting",
    title: "Fasting in Ramadan",
    short: "The month of the Qur'an and self-control",
    falah: "Fasting is prescribed \"so that you may become mindful of God\" [Q 2:183]. Mindfulness is the inner engine of success.",
    photo: guidePhoto("fasting"),
    story: [
      "Ramadan is the ninth month of the Islamic calendar. The Qur'an was first revealed in it, on the Night of Power, which is \"better than a thousand months\" [Q 97:1-5]. Fasting the month was made obligatory in the second year after the Hijrah, the same Ramadan in which the Muslims fought the Battle of Badr.",
    ],
    practice: ["From dawn to sunset, adults who are able do not eat, drink or have marital relations:"],
    points: [
      "Eat a pre-dawn meal (suhur), then break the fast at sunset (iftar), following the Sunnah of starting with dates or water.",
      "People who are ill or travelling may make up the days later. Those who cannot fast at all, such as the very elderly, feed a poor person for each day instead [Q 2:184-185]. Pregnant and nursing women may also be excused; ask a scholar about your case.",
      "Guard the tongue as well as the stomach: the Prophet ﷺ said God has no need of someone giving up food while not giving up false speech [H bukhari 1903].",
      "Ramadan ends with Eid al-Fitr, a day of prayer, charity (zakat al-fitr) and celebration.",
    ],
    value: "Self-control and empathy. Feeling hunger turns the heart toward people who are hungry every day.",
    example: {
      title: "A first Ramadan",
      text: "Many new Muslims say their first Ramadan is where they found their community: neighbours knock with food, the mosque holds open iftars, and strangers break their fast together at long tables. If you fast for the first time, tell your local mosque. Most are delighted to host you.",
    },
    key: "\"Whoever fasts Ramadan out of faith and seeking reward, his previous sins will be forgiven.\" [H bukhari 38]",
    links: [{ href: "/knowledge-hub/fasting", title: "Full guide: fasting" }, { href: "/islamic-calendar", title: "When is Ramadan this year?" }],
    quiz: [
      { q: "Fasting is from…", options: ["Midnight to noon", "Dawn to sunset", "Sunset to dawn"], answer: 1, why: "The fast runs from dawn (Fajr) until sunset (Maghrib)." },
      { q: "What happens to someone who is ill during Ramadan?", options: ["They must fast anyway", "They make up the days later", "They are no longer Muslim"], answer: 1, why: "The Qur'an excuses the ill and the traveller, who make up the days later (2:184-185)." },
    ],
  },
  {
    slug: "zakah",
    title: "Zakah and Charity",
    short: "Giving that purifies wealth",
    falah: "Success in Islam is shared. Zakah makes sure wealth reaches people in need.",
    photo: guidePhoto("zakah"),
    story: [
      "When the Muslims of Makkah arrived in Madinah with almost nothing, the Prophet ﷺ paired each one with a family of the Ansar (the people of Madinah) as brothers. Many Ansar offered half of what they owned. The Qur'an praises them for preferring others over themselves even when in need [Q 59:9].",
      "Zakah, the third pillar, turned that generosity into a duty. The word means both purification and growth [Q 9:103].",
    ],
    practice: ["Zakah is due once a year on savings and certain assets above a minimum (the nisab):"],
    points: [
      "The usual rate is 2.5% of qualifying wealth held for a lunar year.",
      "It goes to the eight groups named in the Qur'an, including the poor, the needy, people in debt and travellers in difficulty [Q 9:60].",
      "Voluntary charity (sadaqah) can be given any time, in any amount. Even a smile counts as charity.",
      "Charity never decreases wealth [H muslim 2588].",
    ],
    value: "Generosity and trust. Wealth is a trust from God, not just a possession.",
    example: {
      title: "Sa'd and Abdur-Rahman",
      text: "Sa'd ibn ar-Rabi of the Ansar offered his new brother Abdur-Rahman ibn Awf half of everything he owned. Abdur-Rahman thanked him and asked only to be shown the market. He traded honestly, became one of the wealthiest companions, and became known for giving huge sums in charity.",
    },
    key: "\"The example of those who spend their wealth in the way of Allah is like a seed that grows seven ears, in each ear a hundred grains.\" [Q 2:261]",
    detail: "The schools agree on the 2.5% rate and the eight recipients. They differ on details, for example whether personal jewellery is zakatable (yes for the Hanafi school; generally not for the other three schools) and whether the gold or silver measure sets the nisab for cash. Use our Zakah guide and ask a scholar for your situation.",
    links: [{ href: "/knowledge-hub/zakah", title: "Full guide: zakah" }, { href: "/charity", title: "Verified charity programs" }],
    quiz: [
      { q: "What is the usual rate of zakah on savings?", options: ["2.5%", "10%", "25%"], answer: 0, why: "Zakah on savings above the nisab is 2.5% per lunar year." },
      { q: "Does charity decrease wealth, according to the hadith?", options: ["Yes", "No"], answer: 1, why: "Sahih Muslim 2588: charity does not decrease wealth." },
    ],
  },
  {
    slug: "hajj",
    title: "Hajj and the Holy Sites",
    short: "The pilgrimage to Makkah",
    falah: "Hajj gathers millions in one place, dressed alike, to show that success is not about rank.",
    photo: site("zamzam"),
    story: [
      "Long before Islam's final message, Abraham (Ibrahim) left his wife Hajar and baby Ismail in the empty valley of Makkah by God's command. When the water ran out, Hajar ran seven times between the hills of Safa and Marwah looking for help, until the spring of Zamzam burst out [H bukhari 3364]. Abraham and Ismail later built the Ka'bah and called people to pilgrimage [Q 22:27].",
      "Pilgrims still walk between Safa and Marwah in her footsteps and drink from Zamzam.",
    ],
    practice: ["Hajj is the fifth pillar: once in a lifetime for every adult Muslim who is physically and financially able [Q 3:97]."],
    points: [
      "It takes place in Dhul-Hijjah, the twelfth Islamic month. The heart of it is standing at Arafah on the 9th.",
      "Umrah, the lesser pilgrimage, can be done at any time of year.",
      "Muslims everywhere celebrate Eid al-Adha at the end of Hajj, remembering Abraham's willingness to sacrifice.",
      "A Hajj done well returns a person sinless, like the day they were born [H bukhari 1521].",
    ],
    value: "Equality and sacrifice. Kings and labourers wear the same two white cloths.",
    example: {
      title: "A letter from Makkah",
      text: "In 1964 the American activist Malcolm X performed Hajj. In letters home he described praying beside pilgrims of every colour, from blue-eyed blonds to black Africans, and said the experience changed how he saw race and brotherhood. Hajj still has that effect on many pilgrims.",
    },
    key: "\"Pilgrimage to the House is a duty owed to Allah by people who are able to find a way to it.\" [Q 3:97]",
    links: [{ href: "/holy-sites", title: "The holy sites of Makkah and Madinah" }, { href: "/islamic-calendar", title: "Dhul-Hijjah dates" }],
    quiz: [
      { q: "Who ran between Safa and Marwah looking for water?", options: ["Maryam", "Hajar", "Khadijah"], answer: 1, why: "Hajar, wife of Abraham, searched for water for baby Ismail; Zamzam then appeared." },
      { q: "How often is Hajj obligatory?", options: ["Every year", "Once in a lifetime, if able", "Never"], answer: 1, why: "Once in a lifetime for those physically and financially able (3:97)." },
    ],
  },
  {
    slug: "character",
    title: "Character: Honesty, Mercy and Justice",
    short: "The values that make a Muslim",
    falah: "The best believers are those with the best character [H tirmidhi 1162]. Worship that does not reach your manners is unfinished.",
    photo: NABAWI,
    story: [
      "Before he was a prophet, the people of Makkah trusted Muhammad ﷺ so much that they called him al-Amin. When the tribes nearly fought over who would place the Black Stone in the rebuilt Ka'bah, he laid it on a cloak and had a leader of each tribe lift a corner together, then set it in place himself. The Qur'an later described him: \"You are of great moral character\" [Q 68:4].",
    ],
    practice: ["Character is practised in small, daily choices:"],
    points: [
      "Speak good or stay silent [H bukhari 6018].",
      "Want for others what you want for yourself [H bukhari 13].",
      "Be just, even against yourself or your family [Q 4:135].",
      "Honour your parents, including parents who are not Muslim [Q 17:23-24] [Q 31:15].",
      "Show mercy to animals: a man was forgiven for giving water to a thirsty dog [H bukhari 2363].",
    ],
    value: "Integrity. A Muslim is meant to be recognisable by honesty and kindness before anything else.",
    example: {
      title: "The day at Ta'if",
      text: "The Prophet ﷺ once walked to the town of Ta'if to invite its people to Islam. They chased him out and threw stones until his feet bled. An angel came offering to crush the town between the mountains. He refused, hoping that from their descendants would come people who worship God alone [H bukhari 3231]. Within about ten years, the people of Ta'if had accepted Islam.",
    },
    key: "\"The most complete of the believers in faith are those with the best character.\" [H tirmidhi 1162]",
    links: [{ href: "/themes", title: "Themes: mercy, justice, family, ethics" }, { href: "/blog", title: "Weekly reflections" }],
    quiz: [
      { q: "What was the Prophet ﷺ called before prophethood?", options: ["Al-Amin, the trustworthy", "The king", "The poet"], answer: 0, why: "Even his opponents called him al-Amin." },
      { q: "Should a new Muslim stay kind to non-Muslim parents?", options: ["Yes, the Qur'an commands kindness to parents", "No, cut ties"], answer: 0, why: "The Qur'an commands good treatment of parents, including non-Muslim parents (31:15)." },
    ],
  },
  {
    slug: "daily-life",
    title: "Daily Life: Food, Greetings, Family and the Calendar",
    short: "Halal living, Friday, and the two Eids",
    falah: "Islam is lived on ordinary days. Small habits turn daily life into worship.",
    photo: guidePhoto("marriage"),
    story: [
      "The Prophet ﷺ lived simply. His wife Aisha was asked what he did at home. She said he was in the service of his family, and when the prayer came he went out to pray [H bukhari 676]. Islam does not ask you to leave ordinary life. It asks you to bring God into it.",
    ],
    practice: ["Everyday habits to start with:"],
    points: [
      "Food: eat what is good and lawful (halal). Avoid pork, alcohol, blood and meat not slaughtered in God's name [Q 2:172-173]. The food of the People of the Book is discussed in our guide [Q 5:5].",
      "Say Bismillah (\"in the name of God\") before eating, and Alhamdulillah (\"praise be to God\") after.",
      "Greet with As-salamu alaykum (\"peace be upon you\"). Spreading the greeting of peace builds love [H muslim 54].",
      "Friday (Jumu'ah) has a congregational prayer at midday with a sermon [Q 62:9].",
      "The Islamic calendar is lunar, so Ramadan and the two Eids move about 11 days earlier each year.",
      "Dress modestly. Muslims differ in how they express this, so learn gradually.",
    ],
    value: "Mindfulness. Remembering God at meals, greetings and work keeps faith alive between prayers.",
    example: {
      title: "Keeping your family close",
      text: "Many new Muslims worry about their families. The Qur'an says even parents who pressure you to give up your faith should be treated with kindness in this world [Q 31:15]. Many families who were anxious at first come to respect the change when they see more patience, honesty and care at home.",
    },
    key: "\"Eat from the good things We have provided for you, and be grateful to Allah.\" [Q 2:172]",
    links: [{ href: "/knowledge-hub/halal-haram", title: "Full guide: halal and haram" }, { href: "/knowledge-hub/salah/jumuah", title: "Friday prayer (Jumu'ah)" }, { href: "/islamic-calendar", title: "Islamic calendar" }],
    quiz: [
      { q: "What do Muslims say before eating?", options: ["Bismillah", "Amen", "Nothing"], answer: 0, why: "Bismillah: in the name of God." },
      { q: "Why do Ramadan and the Eids move each year?", options: ["They are set by governments", "The Islamic calendar is lunar", "They are random"], answer: 1, why: "A lunar year is about 11 days shorter than the solar year." },
    ],
  },
  {
    slug: "lifelong-path",
    title: "The Lifelong Path: Community and Consistency",
    short: "Finding community and growing steadily",
    falah: "Success is not one big leap. It is small, steady steps, with company along the way.",
    photo: site("kaabah"),
    story: [
      "The companions did not learn everything at once. The Qur'an itself was revealed over twenty-three years, and early rulings came gradually. The Prophet ﷺ said the deeds most beloved to God are the most consistent, even if small [H bukhari 6464].",
    ],
    practice: ["How to keep going after this path:"],
    points: [
      "Find your local mosque or Islamic centre and introduce yourself. Many have new-Muslim classes and mentors.",
      "Pick one small daily habit at a time: one prayer on time, then two, then five.",
      "Make du'a (personal prayer) in any language. God is near and answers [Q 2:186].",
      "When you slip, turn back to God. No sin is too big for His mercy [Q 39:53].",
      "Keep learning here: weekly reflections, the Knowledge Hub and the newsletter.",
    ],
    value: "Steadfastness. \"With hardship comes ease\" [Q 94:5-6].",
    example: {
      title: "Ten verses at a time",
      text: "Companions such as Ibn Mas'ud described learning the Qur'an a few verses at a time, not moving on until they had understood and acted on them. Depth, not speed, is the way of the people who built the first Muslim community.",
    },
    key: "\"The most beloved deeds to Allah are the most consistent, even if they are small.\" [H bukhari 6464]",
    links: [{ href: "/help", title: "Help Center: community and support" }, { href: "/newsletter", title: "Get the Knowlege Letter" }, { href: "/knowledge-hub", title: "Knowledge Hub" }],
    quiz: [
      { q: "Which deeds are most beloved to God, according to the hadith?", options: ["The biggest ones", "The most consistent, even if small", "Only the ones others see"], answer: 1, why: "Sahih al-Bukhari 6464." },
      { q: "In which language can you make du'a?", options: ["Only Arabic", "Any language"], answer: 1, why: "Personal du'a can be made in any language. The set prayer (salah) is recited in Arabic." },
    ],
  },
];

export const getMilestone = (slug: string) => milestones.findIndex(m => m.slug === slug);
