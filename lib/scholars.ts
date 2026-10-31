/**
 * Scholar profiles: the four Sunni imams of law and the six compilers of the
 * major hadith collections. Text is original editorial summary of well-established
 * history. Where classical sources differ (most often on birth years), the
 * commonly cited date is given with "commonly dated" or a range.
 * No quotations are attributed to any scholar here.
 */

export type ScholarGroup = "imam" | "compiler";
export interface Link { label: string; url: string }
export interface Scholar {
  slug: string;
  name: string;            // name in common use
  fullName: string;
  kunya: string;
  group: ScholarGroup;
  born: string;            // Hijri and CE, with notes where sources differ
  died: string;
  birthYearCE: string;     // for JSON-LD birthDate (approximate year)
  deathYearCE: string;     // for JSON-LD deathDate
  birthplace: string;
  deathplace: string;
  summary: string;         // one or two sentences, used for cards and SEO description
  teachers: string[];
  students: string[];
  works: string[];
  contribution: string[];  // paragraphs
  whyTheyMatter: string[]; // paragraphs
  furtherReading: Link[];
}

const wiki = (title: string, label: string): Link => ({ label: `${label} (Wikipedia)`, url: `https://en.wikipedia.org/wiki/${title}` });
const brit = (path: string, label: string): Link => ({ label: `${label} (Encyclopaedia Britannica)`, url: `https://www.britannica.com/biography/${path}` });
const SIX_BOOKS = wiki("Kutub_al-Sittah", "The Six Books of hadith");

export const scholars: Scholar[] = [
  {
    slug: "abu-hanifah", name: "Abu Hanifah", group: "imam",
    fullName: "al-Nu'man ibn Thabit ibn Zuta", kunya: "Abu Hanifah",
    born: "80 AH / 699 CE (commonly dated)", died: "150 AH / 767 CE",
    birthYearCE: "0699", deathYearCE: "0767",
    birthplace: "Kufa, Iraq", deathplace: "Baghdad, Iraq",
    summary: "Kufan jurist whose teaching circle became the Hanafi school, the most widely followed school of Sunni law today.",
    teachers: ["Hammad ibn Abi Sulayman, his principal teacher in law for many years", "'Ata' ibn Abi Rabah in Makkah", "Ja'far al-Sadiq, from whom he is reported to have learned in Madinah"],
    students: ["Abu Yusuf Ya'qub ibn Ibrahim, later chief judge in Baghdad", "Muhammad ibn al-Hasan al-Shaybani", "Zufar ibn al-Hudhayl"],
    works: ["No large book by his own hand survives; his legal method and opinions were recorded and organised by his students, above all Abu Yusuf and al-Shaybani", "Short creedal texts such as al-Fiqh al-Akbar are attributed to him, though scholars discuss how much of them is his own wording"],
    contribution: [
      "Abu Hanifah taught law in Kufa, a city with a deep tradition of legal reasoning inherited from Companions such as 'Abd Allah ibn Mas'ud. He was a cloth merchant by trade and taught through discussion: a question was put to his circle, debated, and settled only after the students had examined it from several angles.",
      "His approach gave a careful place to reasoned analogy (qiyas) and juristic preference (istihsan) alongside the Qur'an, the Sunnah and the consensus of the Companions. The Hanafi school that grew from his circle became the official school of the Abbasid judiciary and later of the Ottoman and Mughal states.",
    ],
    whyTheyMatter: [
      "The Hanafi school is followed by a large share of Sunni Muslims, especially in Turkey, the Balkans, Central Asia and South Asia. Its method of working through hypothetical cases helped make Islamic law a structured discipline rather than a collection of isolated answers.",
    ],
    furtherReading: [wiki("Abu_Hanifa", "Abu Hanifa"), brit("Abu-Hanifah", "Abu Hanifah"), wiki("Hanafi_school", "Hanafi school")],
  },
  {
    slug: "malik-ibn-anas", name: "Malik ibn Anas", group: "imam",
    fullName: "Malik ibn Anas ibn Malik ibn Abi 'Amir al-Asbahi", kunya: "Abu 'Abd Allah",
    born: "93 AH / 711 CE (commonly dated; reports range from about 90 to 97 AH)", died: "179 AH / 795 CE",
    birthYearCE: "0711", deathYearCE: "0795",
    birthplace: "Madinah, Arabia", deathplace: "Madinah, Arabia",
    summary: "The leading scholar of Madinah in his age, author of al-Muwatta' and the imam of the Maliki school.",
    teachers: ["Nafi', the freed slave and student of 'Abd Allah ibn 'Umar", "Ibn Shihab al-Zuhri", "Rabi'ah ibn Abi 'Abd al-Rahman (Rabi'at al-Ra'y)", "Ja'far al-Sadiq"],
    students: ["Muhammad ibn Idris al-Shafi'i", "'Abd al-Rahman ibn al-Qasim", "'Abd Allah ibn Wahb", "Muhammad ibn al-Hasan al-Shaybani", "Yahya ibn Yahya al-Laythi, whose transmission of al-Muwatta' is the best known"],
    works: ["al-Muwatta', one of the earliest surviving compilations of hadith, reports from the Companions and Successors, and legal opinion, arranged by legal topic"],
    contribution: [
      "Malik spent almost his whole life in Madinah, the city of the Prophet ﷺ, and taught there for decades. His al-Muwatta' brought together hadith, the rulings of the Companions and the established practice of the people of Madinah, organised chapter by chapter around the questions of worship and daily life.",
      "A distinctive feature of his method is the weight he gave to the living practice of Madinah ('amal ahl al-Madinah), which he saw as a strong witness to the Sunnah handed down across generations in the Prophet's own city. The Maliki school built on this foundation.",
    ],
    whyTheyMatter: [
      "The Maliki school became the main school of North and West Africa and of Muslim Spain, and remains dominant in much of Africa today. al-Muwatta' is also an important early witness to how hadith and law were taught in the second Islamic century.",
    ],
    furtherReading: [wiki("Malik_ibn_Anas", "Malik ibn Anas"), brit("Malik-ibn-Anas", "Malik ibn Anas"), wiki("Muwatta_Imam_Malik", "al-Muwatta'"), wiki("Maliki_school", "Maliki school")],
  },
  {
    slug: "al-shafii", name: "al-Shafi'i", group: "imam",
    fullName: "Muhammad ibn Idris al-Shafi'i", kunya: "Abu 'Abd Allah",
    born: "150 AH / 767 CE", died: "204 AH / 820 CE",
    birthYearCE: "0767", deathYearCE: "0820",
    birthplace: "Gaza, Palestine (commonly reported; some reports name nearby Ashkelon)", deathplace: "Fustat (Old Cairo), Egypt",
    summary: "Jurist of the Quraysh who set out the principles of legal reasoning in al-Risalah and whose teaching became the Shafi'i school.",
    teachers: ["Malik ibn Anas in Madinah, with whom he studied al-Muwatta'", "Muslim ibn Khalid al-Zanji in Makkah", "Sufyan ibn 'Uyaynah", "Muhammad ibn al-Hasan al-Shaybani in Baghdad"],
    students: ["Ahmad ibn Hanbal", "Isma'il ibn Yahya al-Muzani", "Yusuf ibn Yahya al-Buwayti", "al-Rabi' ibn Sulayman al-Muradi, the main transmitter of his books"],
    works: ["al-Risalah, the first known systematic work on the principles of jurisprudence (usul al-fiqh)", "Kitab al-Umm, a large collection of his legal teaching transmitted by al-Rabi'"],
    contribution: [
      "al-Shafi'i grew up in Makkah after his father's early death, studied with Malik in Madinah, and later encountered the Hanafi scholars of Iraq. Having learned from both traditions, he set out to explain clearly how a jurist should move from the sources to a ruling.",
      "In al-Risalah he described the roles of the Qur'an, the Sunnah, consensus and analogy, and argued that an authentic hadith of the Prophet ﷺ must be followed even where local practice or opinion pointed elsewhere. He spent his last years in Egypt, where he revised much of his earlier teaching.",
    ],
    whyTheyMatter: [
      "His framework shaped how all later schools discussed legal method, not only his own. The Shafi'i school is widely followed in Egypt, East Africa, Yemen, Southeast Asia and parts of the Levant.",
    ],
    furtherReading: [wiki("Al-Shafi%27i", "al-Shafi'i"), brit("Abu-Abd-Allah-ash-Shafii", "al-Shafi'i"), wiki("Shafi%27i_school", "Shafi'i school")],
  },
  {
    slug: "ahmad-ibn-hanbal", name: "Ahmad ibn Hanbal", group: "imam",
    fullName: "Ahmad ibn Muhammad ibn Hanbal al-Shaybani", kunya: "Abu 'Abd Allah",
    born: "164 AH / 780 CE", died: "241 AH / 855 CE",
    birthYearCE: "0780", deathYearCE: "0855",
    birthplace: "Baghdad, Iraq", deathplace: "Baghdad, Iraq",
    summary: "Baghdad hadith master and jurist, compiler of the Musnad, known for his steadfastness during the Mihna; the Hanbali school is named after him.",
    teachers: ["Hushaym ibn Bashir", "Sufyan ibn 'Uyaynah", "Waki' ibn al-Jarrah", "'Abd al-Razzaq al-San'ani in Yemen", "Muhammad ibn Idris al-Shafi'i"],
    students: ["Muhammad ibn Isma'il al-Bukhari", "Muslim ibn al-Hajjaj", "Abu Dawud al-Sijistani", "His sons Salih and 'Abd Allah, who transmitted his answers and the Musnad"],
    works: ["al-Musnad, one of the largest early hadith collections, arranged by the Companion who narrated each report", "Kitab al-Zuhd, on simplicity and devotion", "Several collections of his answers to legal questions (masa'il), recorded by his sons and students"],
    contribution: [
      "Ahmad travelled widely in search of hadith, to Makkah, Madinah, Yemen, Syria and elsewhere, and became one of the most respected hadith authorities of his time. His Musnad gathers many thousands of reports arranged by narrator.",
      "During the Mihna, an inquisition begun under the caliph al-Ma'mun, he refused to affirm the doctrine that the Qur'an was created, and he was imprisoned and flogged under al-Mu'tasim. His legal method stayed close to the texts: the Qur'an, the Sunnah and the views of the Companions came first, with analogy used sparingly.",
    ],
    whyTheyMatter: [
      "His endurance during the Mihna made him a lasting symbol of principled scholarship. The Hanbali school, built from his recorded answers, is the smallest of the four but is the main school in Saudi Arabia and Qatar, and his Musnad remains a major hadith reference.",
    ],
    furtherReading: [wiki("Ahmad_ibn_Hanbal", "Ahmad ibn Hanbal"), brit("Ahmad-ibn-Hanbal", "Ahmad ibn Hanbal"), wiki("Musnad_Ahmad_ibn_Hanbal", "Musnad Ahmad ibn Hanbal"), wiki("Hanbali_school", "Hanbali school")],
  },
  {
    slug: "al-bukhari", name: "al-Bukhari", group: "compiler",
    fullName: "Muhammad ibn Isma'il ibn Ibrahim ibn al-Mughirah al-Bukhari", kunya: "Abu 'Abd Allah",
    born: "194 AH / 810 CE", died: "256 AH / 870 CE",
    birthYearCE: "0810", deathYearCE: "0870",
    birthplace: "Bukhara, Central Asia (present-day Uzbekistan)", deathplace: "Khartank, near Samarkand",
    summary: "Central Asian hadith master whose Sahih is regarded by Sunni Muslims as the most authentic book after the Qur'an.",
    teachers: ["Ahmad ibn Hanbal", "'Ali ibn al-Madini", "Yahya ibn Ma'in", "Ishaq ibn Rahwayh"],
    students: ["Muslim ibn al-Hajjaj", "Muhammad ibn 'Isa al-Tirmidhi", "Muhammad ibn Yusuf al-Firabri, through whom the Sahih is mostly transmitted"],
    works: ["al-Jami' al-Sahih, known as Sahih al-Bukhari", "al-Adab al-Mufrad, on manners and conduct", "al-Tarikh al-Kabir, a large biographical dictionary of hadith narrators"],
    contribution: [
      "al-Bukhari began studying hadith as a boy and later travelled through Khurasan, Iraq, the Hijaz, Syria and Egypt to hear reports directly from their transmitters. He became known for his memory and for his detailed knowledge of narrators and their weaknesses.",
      "His Sahih includes only reports whose chains met strict conditions, including evidence that each narrator actually met the one before him. He arranged it by topic, and his chapter headings are themselves read as short statements of his legal understanding.",
    ],
    whyTheyMatter: [
      "Sahih al-Bukhari, together with Sahih Muslim, forms the core of the Sunni hadith canon and is the first of the Six Books. Centuries of commentary, such as Ibn Hajar's Fath al-Bari, grew around it.",
    ],
    furtherReading: [wiki("Muhammad_al-Bukhari", "Muhammad al-Bukhari"), brit("al-Bukhari", "al-Bukhari"), wiki("Sahih_al-Bukhari", "Sahih al-Bukhari"), SIX_BOOKS],
  },
  {
    slug: "muslim-ibn-al-hajjaj", name: "Muslim ibn al-Hajjaj", group: "compiler",
    fullName: "Muslim ibn al-Hajjaj ibn Muslim al-Qushayri al-Naysaburi", kunya: "Abu al-Husayn",
    born: "commonly dated 204 or 206 AH / about 820 CE (reports range from 202 to 206 AH)", died: "261 AH / 875 CE",
    birthYearCE: "0820", deathYearCE: "0875",
    birthplace: "Nishapur, Khurasan (present-day Iran)", deathplace: "Nishapur, Khurasan",
    summary: "Nishapur hadith master whose Sahih Muslim is ranked with al-Bukhari's as one of the two most authentic hadith collections.",
    teachers: ["Muhammad ibn Isma'il al-Bukhari", "Ahmad ibn Hanbal", "Ishaq ibn Rahwayh", "Yahya ibn Yahya al-Naysaburi"],
    students: ["Muhammad ibn 'Isa al-Tirmidhi", "Ibrahim ibn Muhammad ibn Sufyan, the main transmitter of the Sahih", "Ibn Khuzaymah"],
    works: ["al-Musnad al-Sahih, known as Sahih Muslim", "al-Kuna wa al-Asma', on the names and kunyas of narrators", "Kitab al-Tamyiz, on detecting errors in hadith"],
    contribution: [
      "Muslim travelled to the Hijaz, Iraq, Syria and Egypt to collect hadith and studied closely with al-Bukhari during his time in Nishapur. Like his teacher, he accepted into his Sahih only reports with sound, connected chains.",
      "His Sahih is admired for its arrangement: he gathers the different chains and wordings of a single hadith in one place, which lets the reader compare versions side by side. He also wrote an introduction explaining his standards for accepting narrators.",
    ],
    whyTheyMatter: [
      "Sahih Muslim is the second of the Six Books. Together with Sahih al-Bukhari it is known as al-Sahihayn, the two Sahihs, and the two works are the most relied-upon hadith collections in Sunni scholarship.",
    ],
    furtherReading: [wiki("Muslim_ibn_al-Hajjaj", "Muslim ibn al-Hajjaj"), brit("Muslim-ibn-al-Hajjaj", "Muslim ibn al-Hajjaj"), wiki("Sahih_Muslim", "Sahih Muslim"), SIX_BOOKS],
  },
  {
    slug: "abu-dawud", name: "Abu Dawud", group: "compiler",
    fullName: "Sulayman ibn al-Ash'ath ibn Ishaq al-Azdi al-Sijistani", kunya: "Abu Dawud",
    born: "202 AH / 817 CE", died: "275 AH / 889 CE",
    birthYearCE: "0817", deathYearCE: "0889",
    birthplace: "Sijistan (Sistan), on the borders of present-day Iran and Afghanistan", deathplace: "Basra, Iraq",
    summary: "Hadith scholar of Sijistan whose Sunan gathers the hadith most used by jurists, the third of the Six Books.",
    teachers: ["Ahmad ibn Hanbal", "Yahya ibn Ma'in", "Ishaq ibn Rahwayh", "Qutaybah ibn Sa'id"],
    students: ["Muhammad ibn 'Isa al-Tirmidhi", "His son Abu Bakr 'Abd Allah ibn Abi Dawud", "Abu 'Ali al-Lu'lu'i, whose transmission of the Sunan is the most widely used"],
    works: ["Sunan Abi Dawud", "al-Marasil, on reports whose chains skip the Companion", "Masa'il al-Imam Ahmad, his record of Ahmad ibn Hanbal's answers"],
    contribution: [
      "Abu Dawud was a close student of Ahmad ibn Hanbal and travelled widely in Iraq, Syria, Egypt and the Hijaz before settling in Basra. He chose for his Sunan the hadith that jurists rely on for legal rulings, arranged by topic from purification onward.",
      "He included reports beyond the strictest level of authenticity when they were used in law, and he often added brief notes on weaknesses in a chain, so readers could judge each report.",
    ],
    whyTheyMatter: [
      "Sunan Abi Dawud is the third of the Six Books and has long been a standard reference for anyone studying the evidence behind legal rulings. His record of Ahmad ibn Hanbal's answers is also an early source for the Hanbali school.",
    ],
    furtherReading: [wiki("Abu_Dawud_al-Sijistani", "Abu Dawud al-Sijistani"), wiki("Sunan_Abi_Dawud", "Sunan Abi Dawud"), SIX_BOOKS],
  },
  {
    slug: "al-tirmidhi", name: "al-Tirmidhi", group: "compiler",
    fullName: "Muhammad ibn 'Isa ibn Sawrah al-Sulami al-Tirmidhi", kunya: "Abu 'Isa",
    born: "about 209 AH / 824 CE (commonly dated)", died: "279 AH / 892 CE",
    birthYearCE: "0824", deathYearCE: "0892",
    birthplace: "Near Tirmidh (Termez), on the Oxus in present-day Uzbekistan", deathplace: "Near Tirmidh",
    summary: "Student of al-Bukhari whose Jami' grades each hadith and records how jurists used it; also author of al-Shama'il.",
    teachers: ["Muhammad ibn Isma'il al-Bukhari, his most influential teacher", "Muslim ibn al-Hajjaj", "Abu Dawud al-Sijistani", "Qutaybah ibn Sa'id"],
    students: ["Muhammad ibn Ahmad ibn Mahbub al-Mahbubi, the main transmitter of the Jami'", "Others in Khurasan who carried his works onward"],
    works: ["al-Jami', known as Jami' al-Tirmidhi or Sunan al-Tirmidhi", "al-Shama'il al-Muhammadiyyah, on the appearance and character of the Prophet ﷺ", "al-'Ilal, on hidden defects in hadith"],
    contribution: [
      "al-Tirmidhi studied with al-Bukhari and travelled to Iraq and the Hijaz. In later life he lost his sight, and he is remembered for his strong memory.",
      "His Jami' is unusually helpful to students: after many hadith he states its grade, notes other Companions who narrated on the same subject, and mentions which scholars and schools acted on it. He made wide use of the grade hasan (good), which helped define it as a category.",
    ],
    whyTheyMatter: [
      "Jami' al-Tirmidhi is the fourth of the Six Books and is valued as a bridge between hadith and law. al-Shama'il remains one of the best-loved books on the Prophet's ﷺ character.",
    ],
    furtherReading: [wiki("Al-Tirmidhi", "al-Tirmidhi"), brit("al-Tirmidhi", "al-Tirmidhi"), wiki("Jami%27_al-Tirmidhi", "Jami' al-Tirmidhi"), SIX_BOOKS],
  },
  {
    slug: "al-nasai", name: "al-Nasa'i", group: "compiler",
    fullName: "Ahmad ibn Shu'ayb ibn 'Ali al-Nasa'i", kunya: "Abu 'Abd al-Rahman",
    born: "214 or 215 AH / about 829 CE (commonly dated)", died: "303 AH / 915 CE",
    birthYearCE: "0829", deathYearCE: "0915",
    birthplace: "Nasa, Khurasan (present-day Turkmenistan)", deathplace: "Reports differ: Ramla in Palestine or Makkah",
    summary: "Khurasani hadith critic known for strict standards, whose al-Mujtaba (al-Sunan al-Sughra) is one of the Six Books.",
    teachers: ["Qutaybah ibn Sa'id, with whom he studied for over a year", "Ishaq ibn Rahwayh", "Other leading hadith scholars of Khurasan, Iraq, Syria and Egypt"],
    students: ["Abu Bakr Ibn al-Sunni, who transmitted al-Mujtaba", "Abu Ja'far al-Tahawi", "Abu al-Qasim al-Tabarani"],
    works: ["al-Sunan al-Kubra, his larger collection", "al-Mujtaba, also called al-Sunan al-Sughra, the shorter selection counted among the Six Books", "Khasa'is 'Ali, on the merits of 'Ali ibn Abi Talib", "Kitab al-Du'afa' wa al-Matrukin, on weak narrators"],
    contribution: [
      "al-Nasa'i travelled widely and spent much of his career in Egypt before moving to Syria late in life. He was known among his peers as a demanding critic of narrators, and his judgements on transmitters are still cited in hadith criticism.",
      "His al-Mujtaba is a careful selection from his larger Sunan. It is arranged by legal topic and often places different versions of a report next to each other to show where they differ.",
    ],
    whyTheyMatter: [
      "His Sunan is counted among the Six Books and is noted for its relatively small share of weak reports. His writings on narrators also made him an important figure in the science of evaluating transmitters.",
    ],
    furtherReading: [wiki("Al-Nasa%27i", "al-Nasa'i"), brit("an-Nasai", "al-Nasa'i"), wiki("Sunan_al-Nasa%27i", "Sunan al-Nasa'i"), SIX_BOOKS],
  },
  {
    slug: "ibn-majah", name: "Ibn Majah", group: "compiler",
    fullName: "Muhammad ibn Yazid ibn Majah al-Rab'i al-Qazwini", kunya: "Abu 'Abd Allah",
    born: "209 AH / 824 CE", died: "273 AH / 887 CE (some references give 886)",
    birthYearCE: "0824", deathYearCE: "0887",
    birthplace: "Qazvin, Persia (present-day Iran)", deathplace: "Qazvin",
    summary: "Hadith scholar of Qazvin whose Sunan came to be counted as the sixth of the Six Books.",
    teachers: ["Abu Bakr ibn Abi Shaybah", "Muhammad ibn 'Abd Allah ibn Numayr", "Hisham ibn 'Ammar of Damascus"],
    students: ["Abu al-Hasan 'Ali ibn Ibrahim al-Qattan, the main transmitter of the Sunan", "Other students in Qazvin"],
    works: ["Sunan Ibn Majah", "A Qur'an commentary (tafsir) and a history of Qazvin are reported in the sources but have not survived"],
    contribution: [
      "Ibn Majah travelled to Iraq, the Hijaz, Syria and Egypt to gather hadith before returning to his home city of Qazvin. His Sunan is arranged by topic and contains a number of hadith found in none of the other five books.",
      "Because it includes more weak reports than the other collections, scholars took some time to accept it as one of the six; from around the late fifth and sixth Islamic centuries it became widely counted among them.",
    ],
    whyTheyMatter: [
      "His Sunan completes the Six Books and preserves material not found elsewhere in them. Its history is also a good example of how hadith scholars weighed a collection's strengths and weaknesses before giving it a place in the canon.",
    ],
    furtherReading: [wiki("Ibn_Majah", "Ibn Majah"), brit("Ibn-Majah", "Ibn Majah"), wiki("Sunan_Ibn_Majah", "Sunan Ibn Majah"), SIX_BOOKS],
  },
];

export const getScholar = (slug: string) => scholars.find(s => s.slug === slug);
export const imams = scholars.filter(s => s.group === "imam");
export const compilers = scholars.filter(s => s.group === "compiler");
