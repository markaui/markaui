/** Shared matrimony dataset powering search, cards, detail modals and shortlists. */

export interface MatrimonyProfile {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  city: string;
  state: string;
  community: string;
  motherTongue: string;
  profession: string;
  education: string;
  income: string;
  height: string;
  matchScore: number;
  premium: boolean;
  verified: boolean;
  image: string;
  gallery: string[];
  about: string;
  horoscope: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    moonSign: string;
    nakshatra: string;
    gotra: string;
    manglik: "No" | "Yes" | "Partial";
  };
  family: {
    status: string;
    father: string;
    mother: string;
    siblings: string;
    type: string;
    values: string;
  };
  lifestyle: {
    diet: string;
    smoke: string;
    drink: string;
    hobbies: string[];
  };
  partnerPrefs: {
    ageRange: string;
    height: string;
    community: string;
    occupation: string;
    cities: string;
  };
}

export const COMMUNITY_OPTIONS = [
  "Any",
  "Hindu",
  "Muslim",
  "Christian",
  "Sikh",
  "Jain",
  "Inter-Caste",
] as const;

export const CITY_OPTIONS = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Pune",
  "Jaipur",
  "Kolkata",
  "Chennai",
  "Gurugram",
  "Kochi",
  "Ahmedabad",
  "Lucknow",
] as const;

export const AGE_OPTIONS = ["18 – 25 yrs", "26 – 30 yrs", "31 – 35 yrs", "36 – 45 yrs"] as const;

export interface SearchQuery {
  /** gender the seeker is looking for */
  seeking: "male" | "female";
  age: string;
  community: string;
  city: string;
  term?: string;
  sort?: "match" | "age-asc" | "age-desc" | "name";
}

function ageMatches(age: number, bucket: string): boolean {
  switch (bucket) {
    case "18 – 25 yrs":
      return age >= 18 && age <= 25;
    case "26 – 30 yrs":
      return age >= 26 && age <= 30;
    case "31 – 35 yrs":
      return age >= 31 && age <= 35;
    case "36 – 45 yrs":
      return age >= 36 && age <= 45;
    default:
      return true;
  }
}

export function filterProfiles(
  profiles: MatrimonyProfile[],
  query: SearchQuery
): MatrimonyProfile[] {
  const term = (query.term ?? "").trim().toLowerCase();
  const result = profiles.filter((p) => {
    if (query.seeking && p.gender !== query.seeking) return false;
    if (!ageMatches(p.age, query.age)) return false;
    if (query.community && query.community !== "Any" && p.community !== query.community)
      return false;
    if (query.city && query.city !== "Any" && p.city !== query.city) return false;
    if (
      term &&
      !`${p.name} ${p.city} ${p.profession} ${p.education} ${p.community}`
        .toLowerCase()
        .includes(term)
    )
      return false;
    return true;
  });

  const sorted = [...result];
  switch (query.sort) {
    case "age-asc":
      sorted.sort((a, b) => a.age - b.age);
      break;
    case "age-desc":
      sorted.sort((a, b) => b.age - a.age);
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      sorted.sort((a, b) => b.matchScore - a.matchScore);
  }
  return sorted;
}

export const MATRIMONY_PROFILES: MatrimonyProfile[] = [
  {
    id: "emma-wilson",
    name: "Emma Wilson",
    age: 27,
    gender: "female",
    city: "Jaipur",
    state: "Rajasthan",
    community: "Hindu",
    motherTongue: "Hindi",
    profession: "Interior Designer",
    education: "B.Arch, CEPT University",
    income: "₹18 – 24 LPA",
    height: "5 ft 6 in",
    matchScore: 96,
    premium: true,
    verified: true,
    image: "https://picsum.photos/seed/markaui-face-1/400/400",
    gallery: ["https://picsum.photos/seed/markaui-face-1/400/400", "https://picsum.photos/seed/markaui-face-3/400/400", "https://picsum.photos/seed/markaui-face-5/400/400"],
    about:
      "A Jaipur girl with a big love for heritage architecture, Sunday flea markets and filter coffee. I run a boutique design studio and spend my free time restoring old havelis with my father. Looking for a partner who values family, laughter and long conversations over chai.",
    horoscope: {
      birthDate: "14 Mar 1998",
      birthTime: "06:42 AM",
      birthPlace: "Jaipur, Rajasthan",
      moonSign: "Simha (Leo)",
      nakshatra: "Magha",
      gotra: "Kaushik",
      manglik: "No",
    },
    family: {
      status: "Middle class, nuclear family",
      father: "Businessman — textile exports",
      mother: "Homemaker, gold medallist in MA",
      siblings: "1 younger brother (studying B.Tech)",
      type: "Nuclear",
      values: "Moderate",
    },
    lifestyle: {
      diet: "Vegetarian",
      smoke: "Never",
      drink: "Never",
      hobbies: ["Interior styling", "Kathak dance", "Sketching", "Travel"],
    },
    partnerPrefs: {
      ageRange: "27 – 33 yrs",
      height: "5 ft 9 in and above",
      community: "Hindu — open to all communities",
      occupation: "Business / Design / Medicine",
      cities: "Jaipur, Delhi NCR, Mumbai",
    },
  },
  {
    id: "john-doe",
    name: "John Doe",
    age: 31,
    gender: "male",
    city: "Mumbai",
    state: "Maharashtra",
    community: "Jain",
    motherTongue: "Gujarati",
    profession: "Investment Banker",
    education: "MBA, IIM Ahmedabad",
    income: "₹45 – 60 LPA",
    height: "5 ft 11 in",
    matchScore: 92,
    premium: false,
    verified: true,
    image: "https://picsum.photos/seed/markaui-face-2/400/400",
    gallery: ["https://picsum.photos/seed/markaui-face-2/400/400", "https://picsum.photos/seed/markaui-face-4/400/400", "https://picsum.photos/seed/markaui-face-6/400/400"],
    about:
      "Mumbai-based banker by profession, marathoner by obsession. I believe in working hard, eating clean and calling my parents every evening. Seeking a warm, independent partner to build a calm, happy home away from the city's rush.",
    horoscope: {
      birthDate: "02 Nov 1994",
      birthTime: "11:20 PM",
      birthPlace: "Mumbai, Maharashtra",
      moonSign: "Karka (Cancer)",
      nakshatra: "Pushya",
      gotra: "Goyal",
      manglik: "No",
    },
    family: {
      status: "Affluent, joint family",
      father: "Retired chartered accountant",
      mother: "Homemaker, runs a trust",
      siblings: "1 elder sister (married, London)",
      type: "Joint",
      values: "Traditional",
    },
    lifestyle: {
      diet: "Jain / Pure Vegetarian",
      smoke: "Never",
      drink: "Socially",
      hobbies: ["Marathon running", "Value investing", "Chess", "Treks"],
    },
    partnerPrefs: {
      ageRange: "26 – 30 yrs",
      height: "5 ft 3 in – 5 ft 8 in",
      community: "Jain / Hindu Vaishnav preferred",
      occupation: "Any — family-first outlook",
      cities: "Mumbai, Pune, Bengaluru",
    },
  },
  {
    id: "hannah-watson",
    name: "Hannah Lee",
    age: 25,
    gender: "female",
    city: "Bengaluru",
    state: "Karnataka",
    community: "Inter-Caste",
    motherTongue: "Tamil",
    profession: "Product Manager",
    education: "B.Tech, NIT Trichy",
    income: "₹28 – 34 LPA",
    height: "5 ft 4 in",
    matchScore: 94,
    premium: true,
    verified: true,
    image: "https://picsum.photos/seed/markaui-face-3/400/400",
    gallery: ["https://picsum.photos/seed/markaui-face-3/400/400", "https://picsum.photos/seed/markaui-face-7/400/400", "https://picsum.photos/seed/markaui-face-1/400/400"],
    about:
      "Product manager at a fintech unicorn, Tamil at heart, Bengaluru by choice. Carnatic playlists, weekend badminton and a perpetually unfinished novel. My family is Tamil-Hindi fusion, so love across communities feels like home to us.",
    horoscope: {
      birthDate: "27 Jun 2000",
      birthTime: "04:15 PM",
      birthPlace: "Chennai, Tamil Nadu",
      moonSign: "Kanya (Virgo)",
      nakshatra: "Hasta",
      gotra: "Bharadwaj",
      manglik: "Partial",
    },
    family: {
      status: "Upper middle class, nuclear family",
      father: "ISRO scientist (retired)",
      mother: "Carnatic music teacher",
      siblings: "Only child",
      type: "Nuclear",
      values: "Liberal",
    },
    lifestyle: {
      diet: "Vegetarian, loves bakery treats",
      smoke: "Never",
      drink: "Occasionally",
      hobbies: ["Badminton", "Carnatic music", "Blogging", "Baking"],
    },
    partnerPrefs: {
      ageRange: "25 – 30 yrs",
      height: "5 ft 7 in and above",
      community: "Any — caste no bar",
      occupation: "Tech / Product / Research",
      cities: "Bengaluru, Chennai, Hyderabad",
    },
  },
  {
    id: "david-sterling",
    name: "David Sterling",
    age: 29,
    gender: "male",
    city: "Delhi NCR",
    state: "Delhi",
    community: "Hindu",
    motherTongue: "Hindi",
    profession: "Family Business — Textiles",
    education: "BBA, Hindu College (DU)",
    income: "₹60 LPA +",
    height: "6 ft 0 in",
    matchScore: 90,
    premium: false,
    verified: true,
    image: "https://picsum.photos/seed/markaui-face-4/400/400",
    gallery: ["https://picsum.photos/seed/markaui-face-4/400/400", "https://picsum.photos/seed/markaui-face-2/400/400", "https://picsum.photos/seed/markaui-face-8/400/400"],
    about:
      "Third-generation textile exporter from Delhi. Sundays are for cricket with cousins, Saturdays for our family's langar seva. I would love a partner who becomes my best friend first and enjoys the beautiful chaos of a big Punjabi-Hindu family.",
    horoscope: {
      birthDate: "19 Jan 1997",
      birthTime: "09:05 AM",
      birthPlace: "Delhi",
      moonSign: "Vririsbha (Taurus)",
      nakshatra: "Rohini",
      gotra: "Stoneal",
      manglik: "No",
    },
    family: {
      status: "Affluent, joint family",
      father: "Textile industrialist",
      mother: "Homemaker, NGO chairperson",
      siblings: "2 elder sisters (both married)",
      type: "Joint",
      values: "Traditional",
    },
    lifestyle: {
      diet: "Vegetarian",
      smoke: "Never",
      drink: "Socially",
      hobbies: ["Cricket", "Collecting watches", "Road trips", "Seva work"],
    },
    partnerPrefs: {
      ageRange: "25 – 29 yrs",
      height: "5 ft 4 in and above",
      community: "Hindu preferred",
      occupation: "Homemaker or professional — her choice",
      cities: "Delhi NCR, Jaipur, Lucknow",
    },
  },
  {
    id: "jane-brooks",
    name: "Maya Brooks",
    age: 31,
    gender: "female",
    city: "Pune",
    state: "Maharashtra",
    community: "Hindu",
    motherTongue: "Marathi",
    profession: "Pediatrician",
    education: "MBBS, MD — B J Medical College",
    income: "₹22 – 28 LPA",
    height: "5 ft 3 in",
    matchScore: 91,
    premium: true,
    verified: true,
    image: "https://picsum.photos/seed/markaui-face-5/400/400",
    gallery: ["https://picsum.photos/seed/markaui-face-5/400/400", "https://picsum.photos/seed/markaui-face-9/400/400", "https://picsum.photos/seed/markaui-face-3/400/400"],
    about:
      "Pediatrician who sings lullabies better than prescriptions. Pune root, Wari devotee, absolute sucker for my grandmother's puran poli. Seeking a kind, grounded partner — doctors welcome but not mandatory!",
    horoscope: {
      birthDate: "08 Sep 1994",
      birthTime: "07:55 AM",
      birthPlace: "Pune, Maharashtra",
      moonSign: "Dhanu (Sagittarius)",
      nakshatra: "Mula",
      gotra: "Kashyap",
      manglik: "No",
    },
    family: {
      status: "Upper middle class, nuclear family",
      father: "Retired bank manager",
      mother: "School principal",
      siblings: "1 younger sister (married, Nagpur)",
      type: "Nuclear",
      values: "Moderate",
    },
    lifestyle: {
      diet: "Vegetarian",
      smoke: "Never",
      drink: "Never",
      hobbies: ["Singing", "Gardening", "Temple visits", "Trekking forts"],
    },
    partnerPrefs: {
      ageRange: "30 – 36 yrs",
      height: "5 ft 7 in and above",
      community: "Hindu — Deshastha preferred",
      occupation: "Any stable profession",
      cities: "Pune, Mumbai, Nashik",
    },
  },
  {
    id: "daniel-cole",
    name: "Henry Cole",
    age: 28,
    gender: "male",
    city: "Jaipur",
    state: "Rajasthan",
    community: "Hindu",
    motherTongue: "Hindi",
    profession: "Civil Services — IRS",
    education: "MA Economics, St. Stephen's",
    income: "₹16 – 20 LPA (Govt.)",
    height: "5 ft 10 in",
    matchScore: 89,
    premium: false,
    verified: true,
    image: "https://picsum.photos/seed/markaui-face-6/400/400",
    gallery: ["https://picsum.photos/seed/markaui-face-6/400/400", "https://picsum.photos/seed/markaui-face-4/400/400", "https://picsum.photos/seed/markaui-face-10/400/400"],
    about:
      "IRS officer posted in Jaipur, Rajput by lineage, reader by habit. I cook a mean dal baati and spend mornings at the gym and evenings with Premchand. Looking for a partner to share a simple, honest, service-oriented life.",
    horoscope: {
      birthDate: "30 Apr 1998",
      birthTime: "05:30 AM",
      birthPlace: "Kota, Rajasthan",
      moonSign: "Meena (Pisces)",
      nakshatra: "Revati",
      gotra: "Vashishtha",
      manglik: "No",
    },
    family: {
      status: "Middle class, nuclear family",
      father: "Retired army colonel",
      mother: "Homemaker",
      siblings: "1 younger sister (UPSC aspirant)",
      type: "Nuclear",
      values: "Traditional",
    },
    lifestyle: {
      diet: "Non-vegetarian",
      smoke: "Never",
      drink: "Rarely",
      hobbies: ["Reading", "Gym", "Cooking", "Horse riding"],
    },
    partnerPrefs: {
      ageRange: "24 – 28 yrs",
      height: "5 ft 3 in and above",
      community: "Hindu — open to castes",
      occupation: "Government / Teaching / Any",
      cities: "Jaipur, Delhi NCR, any transfer-friendly city",
    },
  },
  {
    id: "olivia-davis",
    name: "Olivia Davis",
    age: 26,
    gender: "female",
    city: "Kochi",
    state: "Kerala",
    community: "Christian",
    motherTongue: "Malayalam",
    profession: "Classical Dancer & Choreographer",
    education: "MA Dance, Kalakshetra",
    income: "₹9 – 12 LPA",
    height: "5 ft 5 in",
    matchScore: 88,
    premium: false,
    verified: true,
    image: "https://picsum.photos/seed/markaui-face-7/400/400",
    gallery: ["https://picsum.photos/seed/markaui-face-7/400/400", "https://picsum.photos/seed/markaui-face-3/400/400", "https://picsum.photos/seed/markaui-face-1/400/400"],
    about:
      "Mohiniyattam dancer running an academy by the backwaters. Church choir on Sundays, houseboats on holidays. My ideal partner respects art, joins family prayers and doesn't mind an audience of seventy students on open-house days.",
    horoscope: {
      birthDate: "11 Dec 1999",
      birthTime: "02:10 PM",
      birthPlace: "Kochi, Kerala",
      moonSign: "Mithuna (Gemini)",
      nakshatra: "Ardra",
      gotra: "—",
      manglik: "No",
    },
    family: {
      status: "Middle class, nuclear family",
      father: "Merchant navy captain",
      mother: "Nurse, government hospital",
      siblings: "1 elder brother (married, Dubai)",
      type: "Nuclear",
      values: "Moderate",
    },
    lifestyle: {
      diet: "Non-vegetarian",
      smoke: "Never",
      drink: "Never",
      hobbies: ["Mohiniyattam", "Choir singing", "Swimming", "Kayaking"],
    },
    partnerPrefs: {
      ageRange: "26 – 31 yrs",
      height: "5 ft 8 in and above",
      community: "Christian — all denominations",
      occupation: "Any — must respect her career",
      cities: "Kochi, Bengaluru, Chennai",
    },
  },
  {
    id: "liam-blake",
    name: "Owen Blake",
    age: 30,
    gender: "male",
    city: "Gurugram",
    state: "Haryana",
    community: "Sikh",
    motherTongue: "Punjabi",
    profession: "SaaS Founder",
    education: "B.Tech, Punjab Engineering College",
    income: "₹1 Cr + (Founder)",
    height: "6 ft 1 in",
    matchScore: 93,
    premium: true,
    verified: true,
    image: "https://picsum.photos/seed/markaui-face-8/400/400",
    gallery: ["https://picsum.photos/seed/markaui-face-8/400/400", "https://picsum.photos/seed/markaui-face-2/400/400", "https://picsum.photos/seed/markaui-face-6/400/400"],
    about:
      "Founder of a 40-person SaaS startup, turbaned techie who still does langar duty every Guru Nanak Jayanti. Weekends mean drives to Kasauli and matches at the gurudwara cricket ground. Seeking a partner who balances ambition with warmth.",
    horoscope: {
      birthDate: "23 Aug 1996",
      birthTime: "10:45 PM",
      birthPlace: "Chandigarh",
      moonSign: "Vrischika (Scorpio)",
      nakshatra: "Anuradha",
      gotra: "Kashyap",
      manglik: "No",
    },
    family: {
      status: "Affluent, nuclear family",
      father: "Retired brigadier",
      mother: "Homemaker",
      siblings: "1 younger brother (studying abroad)",
      type: "Nuclear",
      values: "Moderate",
    },
    lifestyle: {
      diet: "Non-vegetarian",
      smoke: "Never",
      drink: "Socially",
      hobbies: ["Cricket", "Hill drives", "Podcasts", "Kirtan"],
    },
    partnerPrefs: {
      ageRange: "26 – 30 yrs",
      height: "5 ft 5 in and above",
      community: "Sikh preferred, Hindu fine",
      occupation: "Professional / Entrepreneur",
      cities: "Gurugram, Delhi NCR, Chandigarh",
    },
  },
  {
    id: "ava-thompson",
    name: "Ava Thompson",
    age: 24,
    gender: "female",
    city: "Ahmedabad",
    state: "Gujarat",
    community: "Hindu",
    motherTongue: "Gujarati",
    profession: "Chartered Accountant",
    education: "CA, B.Com — HL College",
    income: "₹14 – 18 LPA",
    height: "5 ft 2 in",
    matchScore: 87,
    premium: false,
    verified: true,
    image: "https://picsum.photos/seed/markaui-face-9/400/400",
    gallery: ["https://picsum.photos/seed/markaui-face-9/400/400", "https://picsum.photos/seed/markaui-face-5/400/400", "https://picsum.photos/seed/markaui-face-7/400/400"],
    about:
      "Newest CA in a family of accountants — I balance books by day and garba steps by night. Big joint family, bigger weddings. Looking for a Gujarati boy who loves festivals, food and family group chats that never sleep.",
    horoscope: {
      birthDate: "05 Feb 2002",
      birthTime: "08:25 AM",
      birthPlace: "Ahmedabad, Gujarat",
      moonSign: "Karka (Cancer)",
      nakshatra: "Ashlesha",
      gotra: "Bhardwaj",
      manglik: "No",
    },
    family: {
      status: "Upper middle class, joint family",
      father: "Textile trader",
      mother: "Homemaker",
      siblings: "2 brothers (elder married)",
      type: "Joint",
      values: "Traditional",
    },
    lifestyle: {
      diet: "Jain-leaning Vegetarian",
      smoke: "Never",
      drink: "Never",
      hobbies: ["Garba", "Cooking", "Instagram food pages", "Sudoku"],
    },
    partnerPrefs: {
      ageRange: "25 – 29 yrs",
      height: "5 ft 6 in and above",
      community: "Hindu Gujarati preferred",
      occupation: "Business / CA / Tech",
      cities: "Ahmedabad, Mumbai, Vadodara",
    },
  },
  {
    id: "alex-turner",
    name: "Max Turner",
    age: 32,
    gender: "male",
    city: "Lucknow",
    state: "Uttar Pradesh",
    community: "Muslim",
    motherTongue: "Urdu",
    profession: "Hotelier — Heritage Resorts",
    education: "BHM, IHM Lucknow",
    income: "₹30 – 40 LPA",
    height: "6 ft 0 in",
    matchScore: 90,
    premium: false,
    verified: true,
    image: "https://picsum.photos/seed/markaui-face-10/400/400",
    gallery: ["https://picsum.photos/seed/markaui-face-10/400/400", "https://picsum.photos/seed/markaui-face-8/400/400", "https://picsum.photos/seed/markaui-face-4/400/400"],
    about:
      "I restore heritage havelis into boutique stays in old Lucknow. Sherwani collector, Urdu poet at mushairas, kebab connoisseur. Namaz five times, family always first. Seeking a partner who finds magic in slow evenings and real conversations.",
    horoscope: {
      birthDate: "17 Jul 1994",
      birthTime: "03:50 PM",
      birthPlace: "Lucknow, Uttar Pradesh",
      moonSign: "Tula (Libra)",
      nakshatra: "Swati",
      gotra: "—",
      manglik: "No",
    },
    family: {
      status: "Upper middle class, joint family",
      father: "Retired curator, state museum",
      mother: "Homemaker, embroidery artist",
      siblings: "1 elder sister (married, Hyderabad)",
      type: "Joint",
      values: "Traditional",
    },
    lifestyle: {
      diet: "Non-vegetarian",
      smoke: "Never",
      drink: "Never",
      hobbies: ["Urdu poetry", "Archery", "Restoration projects", "Cricket"],
    },
    partnerPrefs: {
      ageRange: "25 – 30 yrs",
      height: "5 ft 3 in and above",
      community: "Muslim — Sunni/Shia both welcome",
      occupation: "Any — education valued",
      cities: "Lucknow, Delhi NCR, Hyderabad",
    },
  },
];

export const PRESS_LOGOS = [
  "Vogue Weddings",
  "ELLE India",
  "WeddingVows",
  "The Knot Weekly",
  "Brides Today",
] as const;
