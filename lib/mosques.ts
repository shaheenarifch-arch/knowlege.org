// Real, licensed photos (Wikimedia Commons) of the two holy mosques and other
// great mosques of the world. Each credit is required by its licence.
import type { Photo } from "./library";

const T = "https://thumb.wikimedia.org/wikipedia/commons/thumb/";
const C = "https://commons.wikimedia.org/wiki/File:";
const BYSA4 = "https://creativecommons.org/licenses/by-sa/4.0";

export interface Mosque { name: string; place: string; note: string; photo: Photo }

export const KAABAH: Photo = {
  src: `${T}b/b3/The_Kaaba_during_Hajj_-_edited.jpg/1920px-The_Kaaba_during_Hajj_-_edited.jpg`,
  alt: "The Ka'bah in Masjid al-Haram, Makkah, surrounded by pilgrims performing tawaf during Hajj",
  width: 1920, height: 1346, author: "Adli Wahid (edited by Basile Morin)", license: "CC BY-SA 4.0", licenseUrl: BYSA4,
  sourceUrl: `${C}The_Kaaba_during_Hajj_-_edited.jpg`,
};

export const NABAWI: Photo = {
  src: `${T}4/44/Wide_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_%28Al_Masjid-e-Nabawi%29.jpg/1920px-Wide_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_%28Al_Masjid-e-Nabawi%29.jpg`,
  alt: "The Green Dome and minarets of Masjid an-Nabawi, the Prophet's Mosque in Madinah",
  width: 1920, height: 1280, author: "TheHadiRahim", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  sourceUrl: `${C}Wide_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_(Al_Masjid-e-Nabawi).jpg`,
};

export const mosques: Mosque[] = [
  { name: "Masjid al-Haram", place: "Makkah, Saudi Arabia", note: "Home of the Ka'bah and the qiblah of every prayer; the largest mosque in the world.",
    photo: { src: `${T}5/51/Masjid_al-Haram_2022.jpg/1920px-Masjid_al-Haram_2022.jpg`, alt: "Masjid al-Haram in Makkah with the Ka'bah at its centre", width: 1920, height: 1280,
      author: "مريم محمد الغلبان", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/", sourceUrl: `${C}Masjid_al-Haram_2022.jpg` } },
  { name: "Masjid an-Nabawi", place: "Madinah, Saudi Arabia", note: "The Prophet's Mosque, built by the Prophet ﷺ himself; the second holiest mosque.", photo: NABAWI },
  { name: "Al-Aqsa Mosque", place: "Jerusalem", note: "The first qiblah and the third holiest mosque in Islam [Q 17:1].",
    photo: { src: `${T}8/87/Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg/1920px-Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg`, alt: "Al-Aqsa Mosque with its grey dome in the Old City of Jerusalem", width: 1920, height: 1032,
      author: "Godot13", license: "CC BY-SA 4.0", licenseUrl: BYSA4, sourceUrl: `${C}Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_(NE_exposure).jpg` } },
  { name: "Djamaa el Djazaïr", place: "Algiers, Algeria", note: "The Great Mosque of Algiers, with the world's tallest minaret.",
    photo: { src: `${T}f/fa/Djama%C3%A2_El_Djaza%C3%AFr_%E2%80%93_The_Great_Mosque_of_Algiers_11.jpg/1920px-Djama%C3%A2_El_Djaza%C3%AFr_%E2%80%93_The_Great_Mosque_of_Algiers_11.jpg`, alt: "The Great Mosque of Algiers and its tall square minaret", width: 1920, height: 1441,
      author: "Rachid Hamatou", license: "CC BY-SA 4.0", licenseUrl: BYSA4, sourceUrl: `${C}Djama%C3%A2_El_Djaza%C3%AFr_%E2%80%93_The_Great_Mosque_of_Algiers_11.jpg` } },
  { name: "Istiqlal Mosque", place: "Jakarta, Indonesia", note: "The largest mosque in Southeast Asia, in the country with the most Muslims.",
    photo: { src: `${T}b/bd/Masjid_Istiqlal.jpg/1920px-Masjid_Istiqlal.jpg`, alt: "Istiqlal Mosque in Jakarta with its large white dome", width: 1920, height: 1462,
      author: "Michael Coghlan", license: "CC BY-SA 4.0", licenseUrl: BYSA4, sourceUrl: `${C}Masjid_Istiqlal.jpg` } },
  { name: "Hassan II Mosque", place: "Casablanca, Morocco", note: "Built partly over the Atlantic Ocean, with one of the tallest minarets in the world.",
    photo: { src: `${T}e/e5/Whispers_of_Gold_-_Hassan_II_Mosque_at_Dusk.jpg/1920px-Whispers_of_Gold_-_Hassan_II_Mosque_at_Dusk.jpg`, alt: "Hassan II Mosque in Casablanca glowing gold at dusk", width: 1920, height: 1280,
      author: "OussamaHamama", license: "CC BY-SA 4.0", licenseUrl: BYSA4, sourceUrl: `${C}Whispers_of_Gold_-_Hassan_II_Mosque_at_Dusk.jpg` } },
  { name: "Sheikh Zayed Grand Mosque", place: "Abu Dhabi, UAE", note: "Famed for its white marble, 82 domes and one of the world's largest carpets.",
    photo: { src: `${T}b/bc/Sheikh_Zayed_Grand_Mosque_%40_Abu_Dhabi_%2815856602738%29.jpg/1920px-Sheikh_Zayed_Grand_Mosque_%40_Abu_Dhabi_%2815856602738%29.jpg`, alt: "White marble domes and minarets of Sheikh Zayed Grand Mosque in Abu Dhabi", width: 1920, height: 1440,
      author: "Guilhem Vellut", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", sourceUrl: `${C}Sheikh_Zayed_Grand_Mosque_@_Abu_Dhabi_(15856602738).jpg` } },
  { name: "Faisal Mosque", place: "Islamabad, Pakistan", note: "A tent-shaped modern design at the foot of the Margalla Hills.",
    photo: { src: `${T}e/e0/Ali_Mujtaba_WLM2017_FAISAL_MOSQUE_019.jpg/1920px-Ali_Mujtaba_WLM2017_FAISAL_MOSQUE_019.jpg`, alt: "Faisal Mosque in Islamabad with its four pencil minarets", width: 1920, height: 1208,
      author: "Ali Mujtaba", license: "CC BY-SA 4.0", licenseUrl: BYSA4, sourceUrl: `${C}Ali_Mujtaba_WLM2017_FAISAL_MOSQUE_019.jpg` } },
  { name: "Badshahi Mosque", place: "Lahore, Pakistan", note: "A Mughal masterpiece of red sandstone built in 1673.",
    photo: { src: `${T}c/c8/Badshahi_Mosque_front_picture.jpg/1920px-Badshahi_Mosque_front_picture.jpg`, alt: "Front view of the red sandstone Badshahi Mosque in Lahore", width: 1920, height: 1280,
      author: "Romero Maia", license: "CC BY-SA 4.0", licenseUrl: BYSA4, sourceUrl: `${C}Badshahi_Mosque_front_picture.jpg` } },
  { name: "Sultan Ahmed (Blue) Mosque", place: "Istanbul, Türkiye", note: "Six minarets and blue Iznik tiles from the early 1600s.",
    photo: { src: `${T}0/03/Istanbul_%2834223582516%29_%28cropped%29.jpg/1920px-Istanbul_%2834223582516%29_%28cropped%29.jpg`, alt: "The Sultan Ahmed Blue Mosque in Istanbul with its cascading domes", width: 1920, height: 1618,
      author: "Pedro Szekely", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", sourceUrl: `${C}Istanbul_(34223582516)_(cropped).jpg` } },
];

/** One great mosque shown on each guide page. */
export const guideMosque: Record<string, string> = {
  salah: "Masjid al-Haram", purity: "Sultan Ahmed (Blue) Mosque", fasting: "Masjid an-Nabawi",
  zakah: "Sheikh Zayed Grand Mosque", marriage: "Badshahi Mosque",
};
export const mosqueFor = (slug: string) => mosques.find(m => m.name === guideMosque[slug]);
