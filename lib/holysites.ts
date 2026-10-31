// Holy sites and places of ziyarat in Makkah, Madinah and Jerusalem.
// Real, licensed photos from Wikimedia Commons; each credit is required by its licence.
import type { Photo } from "./library";
import { KAABAH, NABAWI, mosques } from "./mosques";

const T = "https://thumb.wikimedia.org/wikipedia/commons/thumb/";
const C = "https://commons.wikimedia.org/wiki/File:";
const lic = {
  bysa4: ["CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0"],
  bysa3: ["CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0"],
  bysa2: ["CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0"],
  by4: ["CC BY 4.0", "https://creativecommons.org/licenses/by/4.0"],
} as const;
const photo = (path: string, file: string, w: number, h: number, alt: string, author: string, l: readonly [string, string]): Photo =>
  ({ src: `${T}${path}`, alt, width: w, height: h, author, license: l[0], licenseUrl: l[1], sourceUrl: `${C}${file}` });

export interface Site { id: string; name: string; local: string; city: "Makkah" | "Madinah" | "Jerusalem"; text: string; photo: Photo }

const aqsa = mosques.find(m => m.name === "Al-Aqsa Mosque")!.photo;

export const sites: Site[] = [
  { id: "kaabah", name: "The Ka'bah", local: "Khana Ka'bah", city: "Makkah", photo: KAABAH,
    text: "The House of God, first built for worship by Ibrahim and Isma'il [Q 2:127] and the qiblah every Muslim faces in prayer [Q 2:144]. Pilgrims circle it seven times in tawaf during Hajj and Umrah." },
  { id: "hajr-aswad", name: "The Black Stone", local: "Hajr-e-Aswad", city: "Makkah",
    photo: photo("c/ce/%E0%A6%B9%E0%A6%BE%E0%A6%9C%E0%A6%B0%E0%A7%87_%E0%A6%86%E0%A6%B8%E0%A6%93%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%A6.jpg/1920px-%E0%A6%B9%E0%A6%BE%E0%A6%9C%E0%A6%B0%E0%A7%87_%E0%A6%86%E0%A6%B8%E0%A6%93%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%A6.jpg",
      "%E0%A6%B9%E0%A6%BE%E0%A6%9C%E0%A6%B0%E0%A7%87_%E0%A6%86%E0%A6%B8%E0%A6%93%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%A6.jpg", 1920, 2560, "The Black Stone (Hajr-e-Aswad) in its silver frame at the corner of the Ka'bah", "Noor Mohammad Siam", lic.bysa4),
    text: "Set in the eastern corner of the Ka'bah, where each round of tawaf begins and ends. The Prophet ﷺ kissed it; 'Umar said he kissed it only because he had seen the Prophet ﷺ do so, knowing a stone can neither harm nor benefit [H bukhari 1597]." },
  { id: "maqam-ibrahim", name: "Station of Ibrahim", local: "Maqam-e-Ibrahim", city: "Makkah",
    photo: photo("4/43/Door_of_the_Holy_Kaaba_and_Maqam_Ibrahim_in_the_Grand_Mosque%2C_Makkah_%282025%29.jpg/1920px-Door_of_the_Holy_Kaaba_and_Maqam_Ibrahim_in_the_Grand_Mosque%2C_Makkah_%282025%29.jpg",
      "Door_of_the_Holy_Kaaba_and_Maqam_Ibrahim_in_the_Grand_Mosque,_Makkah_(2025).jpg", 1920, 1320, "The golden enclosure of Maqam Ibrahim beside the door of the Ka'bah", "Saudi Press Agency (SPA)", lic.bysa4),
    text: "The stone on which Ibrahim stood while raising the Ka'bah, one of the clear signs in the Sanctuary [Q 3:97]. God commands: take the Station of Ibrahim as a place of prayer [Q 2:125], so pilgrims pray two units behind it after tawaf." },
  { id: "zamzam", name: "The Well of Zamzam", local: "Aab-e-Zamzam", city: "Makkah",
    photo: photo("9/90/%D8%A8%D8%A6%D8%B1_%D8%B2%D9%85%D8%B2%D9%85_%D8%A7%D9%84%D8%A3%D8%AB%D8%B1%D9%8A.jpg/1920px-%D8%A8%D8%A6%D8%B1_%D8%B2%D9%85%D8%B2%D9%85_%D8%A7%D9%84%D8%A3%D8%AB%D8%B1%D9%8A.jpg",
      "%D8%A8%D8%A6%D8%B1_%D8%B2%D9%85%D8%B2%D9%85_%D8%A7%D9%84%D8%A3%D8%AB%D8%B1%D9%8A.jpg", 1920, 1280, "The historic brass well head of the Zamzam well on display", "Mohammad Bahareth", lic.bysa2),
    text: "The blessed spring that God brought forth for Hajar and the infant Isma'il in the barren valley where Ibrahim left them [Q 14:37]. Pilgrims drink its water to this day; the well itself now lies beneath the mosque floor. Shown: the historic well head." },
  { id: "nabawi", name: "The Prophet's Mosque", local: "Masjid an-Nabawi", city: "Madinah", photo: NABAWI,
    text: "Built by the Prophet ﷺ after the Hijrah. It is one of only three mosques worth travelling to for worship, with Masjid al-Haram and Al-Aqsa [H bukhari 1189]." },
  { id: "roza", name: "The Prophet's Resting Place", local: "Roza-e-Rasool ﷺ", city: "Madinah",
    photo: photo("b/b9/Mrs_Aisha_room.jpg/1920px-Mrs_Aisha_room.jpg", "Mrs_Aisha_room.jpg", 1920, 1440, "Visitors before the golden grille of the Prophet's chamber in Masjid an-Nabawi", "Aiman titi", lic.bysa3),
    text: "The Prophet ﷺ is buried in the room of 'A'ishah, now inside Masjid an-Nabawi beneath the Green Dome, with Abu Bakr and 'Umar beside him. Between his house and his pulpit lies the Rawdah, a garden from the gardens of Paradise [H bukhari 1196]. Visitors greet him with salam, calmly and with respect." },
  { id: "baqi", name: "Jannat al-Baqi'", local: "Ziyarat of the Sahabah", city: "Madinah",
    photo: photo("e/eb/Al-Baqi_Cemetery_2021.jpg/1920px-Al-Baqi_Cemetery_2021.jpg", "Al-Baqi_Cemetery_2021.jpg", 1920, 1440, "Simple graves of Jannat al-Baqi' cemetery with the minarets of Masjid an-Nabawi behind", "Saleh Al Hussain", lic.by4),
    text: "Madinah's main cemetery, beside the Prophet's Mosque. Thousands of companions (Sahabah) rest here, among them 'Uthman ibn 'Affan, many of the Prophet's wives and his son Ibrahim. The Prophet ﷺ used to visit and pray for those buried there." },
  { id: "uhud", name: "Martyrs of Uhud", local: "Shuhada-e-Uhud", city: "Madinah",
    photo: photo("b/b8/Makam_Syuhada_Uhud.jpg/1920px-Makam_Syuhada_Uhud.jpg", "Makam_Syuhada_Uhud.jpg", 1920, 1440, "The walled burial ground of the martyrs of Uhud at the foot of Mount Uhud", "Imam Khairul Annas", lic.bysa3),
    text: "At the foot of Mount Uhud lie Hamzah ibn 'Abd al-Muttalib, the Prophet's uncle, and around seventy companions martyred in the Battle of Uhud in 3 AH, which the Qur'an recounts [Q 3:121]." },
  { id: "thawr", name: "Cave of Thawr", local: "Ghar-e-Thawr", city: "Makkah",
    photo: photo("e/ea/Jabl_e_Thawr.jpg/1920px-Jabl_e_Thawr.jpg", "Jabl_e_Thawr.jpg", 1920, 1440, "The great rock of the cave of Thawr on the summit of Jabal Thawr", "King Eliot", lic.bysa4),
    text: "On Jabal Thawr, south of Makkah, the Prophet ﷺ and Abu Bakr hid for three nights at the start of the Hijrah. The Qur'an records the Prophet telling him, \"Do not grieve; indeed God is with us\" [Q 9:40]." },
  { id: "hira", name: "Cave of Hira", local: "Ghar-e-Hira", city: "Makkah",
    photo: photo("7/7c/Hira_Cave.jpg/1920px-Hira_Cave.jpg", "Hira_Cave.jpg", 1920, 1282, "Visitors at the narrow entrance of the Cave of Hira on Jabal al-Nour", "saudipics", lic.bysa4),
    text: "High on Jabal al-Nour, the Prophet ﷺ used to retreat for worship, and here the first revelation came to him [H bukhari 3]: \"Read in the name of your Lord who created\" [Q 96:1]." },
  { id: "aqsa", name: "Al-Aqsa Mosque", local: "Masjid-e-Aqsa", city: "Jerusalem", photo: aqsa,
    text: "The first qiblah, the destination of the Prophet's Night Journey [Q 17:1], and the third of the three mosques worth travelling to for worship [H bukhari 1189]." },
];

export const ZIYARAT_NOTE = "Visiting the historic caves, Uhud and other sites is not part of Hajj or Umrah, and no special acts of worship are prescribed there. Visitors reflect on the history, pray for the dead at the cemeteries, and keep to the etiquette taught in the Sunnah.";
