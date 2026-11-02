// Help Resource Directory: US national and Massachusetts services.
// Every entry was checked against the provider's own official website on CHECKED.
// Descriptions are Knowlege.org's own wording. To add a provider, add one object to RESOURCES.
export type Need = "food" | "housing" | "education" | "health" | "counseling" | "community";
export type Kind = "government" | "nonprofit" | "muslim";
export interface Resource {
  name: string; need: Need[]; area: "US" | "MA"; kind: Kind; url: string;
  phone?: string; tel?: string; text?: string; hours?: string;
  offers: string; who: string; languages: string; note?: string;
}

export const CHECKED = "2 November 2026";
export const NEEDS: Array<[Need, string]> = [["food", "Food"], ["housing", "Housing"], ["education", "Education"], ["health", "Healthcare"], ["counseling", "Counseling and wellbeing"], ["community", "Community services"]];
export const KINDS: Record<Kind, string> = { government: "Government", nonprofit: "Nonprofit", muslim: "Muslim community" };
export const AREAS: Record<"US" | "MA", string> = { US: "United States (national)", MA: "Massachusetts" };

/** Urgent help, shown separately at the top of the page. */
export const URGENT: Array<{ label: string; how: string; tel?: string; sms?: string; url?: string; note: string }> = [
  { label: "Emergency", how: "Call 911", tel: "911", note: "Police, fire or ambulance when someone is in danger now." },
  { label: "988 Suicide & Crisis Lifeline", how: "Call or text 988", tel: "988", sms: "988", url: "https://988lifeline.org/get-help/", note: "24/7, free and confidential. Spanish: press 2, or text AYUDA to 988." },
  { label: "Crisis Text Line", how: "Text HOME to 741741", sms: "741741", url: "https://www.crisistextline.org/", note: "24/7 support by text. Spanish: text HOLA." },
  { label: "National Domestic Violence Hotline", how: "Call 1-800-799-7233 or text START to 88788", tel: "18007997233", url: "https://www.thehotline.org/", note: "24/7 confidential support and safety planning." },
  { label: "Poison Help", how: "Call 1-800-222-1222", tel: "18002221222", url: "https://poisonhelp.hrsa.gov/", note: "24/7, connects you to your local poison center. Over 100 languages." },
  { label: "211 / Mass 211", how: "Call 211", tel: "211", url: "https://mass211.org/", note: "24/7 referral to local help with food, housing, bills and more. In Massachusetts you can also call 877-211-6277." },
];

export const RESOURCES: Resource[] = [
  // Food
  { name: "SNAP food benefits (Massachusetts DTA)", need: ["food"], area: "MA", kind: "government", url: "https://www.mass.gov/snap-benefits-formerly-food-stamps",
    phone: "(877) 382-2363", tel: "18773822363", hours: "Weekdays 8:15 a.m. to 4:45 p.m.",
    offers: "Monthly money for groceries, with an online eligibility screener, an online application (DTA Connect) and a mobile app.", who: "Massachusetts households that meet income and household rules; use the screener to check.", languages: "Website can be translated, including Spanish, Portuguese, Chinese, Haitian Creole and Vietnamese" },
  { name: "Project Bread FoodSource Hotline", need: ["food"], area: "MA", kind: "nonprofit", url: "https://www.projectbread.org/get-help",
    phone: "1-800-645-8333", tel: "18006458333", hours: "Mon to Fri 8 a.m. to 7 p.m.; Sat 10 a.m. to 2 p.m.",
    offers: "Free, confidential counselors who find food near you, check SNAP eligibility, help with the SNAP application and find meals for children.", who: "Anyone living in Massachusetts.", languages: "180 languages" },
  { name: "The Greater Boston Food Bank: find food", need: ["food"], area: "MA", kind: "nonprofit", url: "https://www.gbfb.org/need-food/",
    phone: "617-598-5022", tel: "6175985022",
    offers: "Search by ZIP code for nearby food pantries and meal programs, plus help applying for SNAP.", who: "People in 190 cities and towns across Eastern Massachusetts.", languages: "English", note: "The phone number is the SNAP application help team." },
  { name: "Massachusetts WIC Nutrition Program", need: ["food", "health"], area: "MA", kind: "government", url: "https://www.mass.gov/orgs/women-infants-children-nutrition-program",
    phone: "(800) 942-1007", tel: "18009421007", hours: "Mon to Fri 9 a.m. to 5 p.m.",
    offers: "Healthy foods, nutrition advice and breastfeeding support for families.", who: "Pregnant and breastfeeding women and children under 5; parents, grandparents and guardians can apply for a child.", languages: "Materials in Arabic, Chinese, French, Haitian Creole, Khmer, Portuguese, Russian, Spanish and Vietnamese" },
  { name: "Feeding America: find your local food bank", need: ["food"], area: "US", kind: "nonprofit", url: "https://www.feedingamerica.org/find-your-local-foodbank",
    offers: "Search by ZIP code or state for your local food bank, which links you to pantries and free meal sites.", who: "Anyone who needs food; each food bank sets its own hours.", languages: "English, Spanish" },
  // Housing
  { name: "RAFT emergency housing help", need: ["housing"], area: "MA", kind: "government", url: "https://www.mass.gov/info-details/residential-assistance-for-families-in-transition-raft-program",
    phone: "(877) 211-6277", tel: "18772116277",
    offers: "Up to $7,000 in a 12-month period toward unpaid rent, utilities, moving costs or mortgage payments; apply online through the Housing Help Hub.", who: "Massachusetts households in a housing crisis with income below 50% of the area median (60% if at risk of domestic violence).", languages: "Interpreters available", note: "The phone number is Mass 211, which helps with RAFT questions." },
  { name: "Housing Consumer Education Centers", need: ["housing"], area: "MA", kind: "government", url: "https://www.masshousinginfo.org/",
    offers: "Regional centers that answer housing questions for tenants, landlords, buyers and homeowners. Find your local center by town.", who: "Massachusetts residents with a housing question.", languages: "Contact your local center" },
  { name: "MassLegalHelp: eviction and tenant rights", need: ["housing"], area: "MA", kind: "nonprofit", url: "https://www.masslegalhelp.org/housing-apartments-shelter/eviction",
    offers: "Free, plain-language legal information on evictions, notices to quit, lockouts, utility shutoffs and Housing Court, plus help finding a lawyer.", who: "Anyone with a Massachusetts housing problem.", languages: "English" },
  { name: "HUD: vouchers and public housing", need: ["housing"], area: "US", kind: "government", url: "https://www.hud.gov/helping-americans",
    phone: "(800) 955-2232", tel: "18009552232",
    offers: "Explains Housing Choice Vouchers and public housing, which you apply for through your local housing authority, and helps you find a HUD-approved housing counselor.", who: "Households that meet income and eligibility rules set by the local housing authority.", languages: "English", note: "For homeless services, HUD suggests calling 211." },
  { name: "ICNA Relief transitional housing", need: ["housing"], area: "US", kind: "muslim", url: "https://icnarelief.org/transitional-housing/",
    phone: "866-354-0102", tel: "18663540102",
    offers: "Transitional housing for homeless women and their children in a halal setting, with case management and help finding housing and work.", who: "Homeless women aged 18 to 68 with little or no income and lawful U.S. status; boys over 10 cannot stay at family sites.", languages: "English" },
  // Education
  { name: "Federal Student Aid (FAFSA)", need: ["education"], area: "US", kind: "government", url: "https://studentaid.gov",
    phone: "1-800-433-3243", tel: "18004333243", hours: "Mon 8 a.m. to 9 p.m.; Tue and Wed 8 a.m. to 8 p.m.; Thu and Fri 8 a.m. to 6 p.m. ET",
    offers: "The FAFSA form and federal grants, loans and work-study for college or career school.", who: "Students at eligible colleges and career schools who meet federal rules.", languages: "English, Spanish" },
  { name: "Massachusetts Office of Student Financial Assistance", need: ["education"], area: "MA", kind: "government", url: "https://www.mass.edu/osfa/",
    phone: "(617) 391-6070", tel: "6173916070",
    offers: "State grants including MASSGrant, MASSGrant Plus and Free Community College, plus scholarships, tuition waivers and a no-interest loan.", who: "Massachusetts students; each program has its own rules.", languages: "English" },
  { name: "Massachusetts Adult Education Help Desk", need: ["education"], area: "MA", kind: "government", url: "https://adultedhelpdeskma.org/",
    phone: "800-447-8844", tel: "18004478844",
    offers: "Finds free classes near you for English (ESOL), high school equivalency, reading, writing, math and job training.", who: "Adults living in Massachusetts.", languages: "English" },
  { name: "Khan Academy", need: ["education"], area: "US", kind: "nonprofit", url: "https://www.khanacademy.org",
    offers: "Free online lessons and practice in math, science, reading, computing and test prep, from early grades to college.", who: "Anyone; Khan Academy Kids is for ages 2 to 8.", languages: "Over 55 languages" },
  // Healthcare
  { name: "Massachusetts Health Connector", need: ["health"], area: "MA", kind: "government", url: "https://www.mahealthconnector.org/",
    phone: "1-877-623-6765 (TTY 711)", tel: "18776236765", hours: "Mon to Fri 8 a.m. to 6 p.m.",
    offers: "The state's official place to compare and buy health and dental plans, with help finding savings.", who: "Massachusetts residents and families.", languages: "Help in Spanish, Arabic, Chinese, Haitian Creole, Hindi, Gujarati, Portuguese, Vietnamese and more on the same number" },
  { name: "MassHealth", need: ["health"], area: "MA", kind: "government", url: "https://www.mass.gov/info-details/contact-masshealth",
    phone: "(800) 841-2900 (TTY 711)", tel: "18008412900", hours: "Mon to Fri 8 a.m. to 5 p.m.",
    offers: "Help with MassHealth (Medicaid) applications, eligibility, benefits, member cards and premiums.", who: "Massachusetts MassHealth members and applicants.", languages: "Interpreters available" },
  { name: "Find a Health Center (HRSA)", need: ["health", "counseling"], area: "US", kind: "government", url: "https://findahealthcenter.hrsa.gov/",
    offers: "Find a community health center offering medical, dental, mental health and addiction care with fees based on income.", who: "Everyone, including people who cannot pay or have no insurance.", languages: "English" },
  { name: "HealthCare.gov", need: ["health"], area: "US", kind: "government", url: "https://www.healthcare.gov/contact-us/",
    phone: "1-800-318-2596 (TTY 1-855-889-4325)", tel: "18003182596", hours: "24 hours, 7 days (except holidays)",
    offers: "Help applying for Marketplace health insurance and finding savings.", who: "People in states that use HealthCare.gov.", languages: "English, Spanish", note: "Massachusetts residents use the Massachusetts Health Connector instead." },
  // Counseling and wellbeing
  { name: "Massachusetts Behavioral Health Help Line", need: ["counseling"], area: "MA", kind: "government", url: "https://www.masshelpline.com/",
    phone: "833-773-2445 (call or text)", tel: "18337732445", text: "833-773-2445", hours: "24/7, including holidays",
    offers: "Free, confidential connection to mental health and addiction treatment, including urgent and crisis care, by phone, text or chat.", who: "Anyone in Massachusetts; no insurance needed.", languages: "Interpreters in 200+ languages by phone" },
  { name: "SAMHSA National Helpline", need: ["counseling"], area: "US", kind: "government", url: "https://www.samhsa.gov/find-help/helplines/national-helpline",
    phone: "1-800-662-4357", tel: "18006624357", hours: "24/7, 365 days",
    offers: "Free, confidential referrals and information for mental health and substance use concerns.", who: "Individuals and families.", languages: "English, Spanish" },
  { name: "FindTreatment.gov", need: ["counseling", "health"], area: "US", kind: "government", url: "https://findtreatment.gov/",
    offers: "Anonymous search for state-licensed mental health and addiction treatment near you.", who: "Anyone in the US.", languages: "English" },
  { name: "Naseeha Mental Health helpline", need: ["counseling"], area: "US", kind: "muslim", url: "https://www.naseeha.org/helpline-textline",
    phone: "1 (866) 627-3342", tel: "18666273342", hours: "24/7",
    offers: "A free, anonymous, faith-aware listening line, plus live chat and low-cost online therapy.", who: "Muslims and people from Muslim backgrounds (youth, adults and parents); everyone is welcome.", languages: "English, Arabic, Urdu, Hindi, Punjabi, Bengali, Gujarati, French", note: "Based in Canada; online therapy serves the USA and Canada." },
  { name: "Khalil Center", need: ["counseling"], area: "US", kind: "muslim", url: "https://khalilcenter.com/appointments",
    phone: "1-855-552-5445", tel: "18555525445",
    offers: "Faith-integrated counseling, psychiatry, assessments, religious consultation and premarital and career counseling.", who: "Adults, youth, children, couples and families.", languages: "English", note: "Offices are outside Massachusetts; ask about remote sessions." },
  // Community
  { name: "Mass 211", need: ["community", "housing", "food"], area: "MA", kind: "nonprofit", url: "https://mass211.org/",
    phone: "2-1-1 or 877-211-6277", tel: "211", hours: "24/7",
    offers: "One call for local help with housing and shelter, food, utilities, child care, mental health and emergencies.", who: "Massachusetts residents.", languages: "Website in about 100 languages" },
  { name: "Islamic Society of Boston Cultural Center (ISBCC): social services", need: ["community", "housing", "food", "education"], area: "MA", kind: "muslim", url: "https://isbcc.org/social-services/",
    phone: "617-858-6114", tel: "6178586114",
    offers: "Help with housing, financial assistance, monthly food distribution, legal referrals, a health team and ESL classes, at 100 Malcolm X Blvd., Roxbury.", who: "Community members in Greater Boston; contact the office for details.", languages: "English" },
  { name: "CAIR Massachusetts", need: ["community"], area: "MA", kind: "muslim", url: "https://cairma.org/report/",
    phone: "(617) 862-9159", tel: "6178629159", hours: "Mon to Fri 9 a.m. to 5 p.m.",
    offers: "Civil rights help if you face harassment or discrimination because of your faith, with an online report form and a legal team.", who: "People in Massachusetts.", languages: "English" },
  { name: "211 (national)", need: ["community"], area: "US", kind: "nonprofit", url: "https://www.211.org/",
    phone: "211", tel: "211",
    offers: "Connects you to local help with bills, food, housing, health and mental health care, and disaster recovery anywhere in the US.", who: "Anyone in the US; calls go to your local 211.", languages: "English, Spanish" },
];
