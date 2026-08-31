export interface LeadershipMember {
  id: string;
  serial: number;
  name: {
    en: string;
    te: string;
    hi: string;
  };
  role: {
    en: string;
    te: string;
    hi: string;
  };
  wing: 'national' | 'state' | 'youth';
  wingCategory: {
    en: string;
    te: string;
    hi: string;
  };
  badgeColor: string;
}

export const LEADERSHIP_MEMBERS: LeadershipMember[] = [
  {
    id: "vidyasagar",
    serial: 1,
    name: {
      en: "Brahmasri Kasarlawar Vidyasagar ji",
      te: "బ్రహ్మశ్రీ కాసర్లవార్ విద్యాసాగర్ జీ",
      hi: "ब्रह्मश्री कासरलवार विद्यासागर जी"
    },
    role: {
      en: "National Secretary",
      te: "జాతీయ కార్యదర్శి",
      hi: "राष्ट्रीय सचिव"
    },
    wing: "national",
    wingCategory: {
      en: "National Governing Board",
      te: "జాతీయ కార్యవర్గం",
      hi: "राष्ट्रीय शासी निकाय"
    },
    badgeColor: "bg-vermilion/10 text-vermilion border-vermilion/30"
  },
  {
    id: "prabhakarachary",
    serial: 2,
    name: {
      en: "Brahmasri Solleti Prabhakarachary ji",
      te: "బ్రహ్మశ్రీ సొల్లేటి ప్రభాకరాచార్య జీ",
      hi: "ब्रह्मश्री सोल्लेटी प्रभाकराचार्य जी"
    },
    role: {
      en: "National Joint Secretary",
      te: "జాతీయ సంయుక్త కార్యదర్శి",
      hi: "राष्ट्रीय संयुक्त सचिव"
    },
    wing: "national",
    wingCategory: {
      en: "National Governing Board",
      te: "జాతీయ కార్యవర్గం",
      hi: "राष्ट्रीय शासी निकाय"
    },
    badgeColor: "bg-vermilion/10 text-vermilion border-vermilion/30"
  },
  {
    id: "laxmi-narayana",
    serial: 3,
    name: {
      en: "Brahmasri V. Laxmi Narayana Ji",
      te: "బ్రహ్మశ్రీ వి. లక్ష్మీ నారాయణ జీ",
      hi: "ब्रह्मश्री वी. लक्ष्मी नारायण जी"
    },
    role: {
      en: "National Core Committee Member",
      te: "జాతీయ కోర్ కమిటీ సభ్యులు",
      hi: "राष्ट्रीय कोर कमेटी सदस्य"
    },
    wing: "national",
    wingCategory: {
      en: "National Core Committee",
      te: "జాతీయ కోర్ కమిటీ",
      hi: "राष्ट्रीय कोर कमेटी"
    },
    badgeColor: "bg-saffron-500/10 text-saffron-700 border-saffron-500/30"
  },
  {
    id: "praveen-kumar",
    serial: 4,
    name: {
      en: "Brahmasri Kondoju Praveen Kumar ji",
      te: "బ్రహ్మశ్రీ కొండోజు ప్రవీణ్ కుమార్ జీ",
      hi: "ब्रह्मश्री कोंडोजु प्रवीण कुमार जी"
    },
    role: {
      en: "President - Telangana State",
      te: "తెలంగాణ రాష్ట్ర అధ్యక్షులు",
      hi: "अध्यक्ष - तेलंगाना राज्य"
    },
    wing: "state",
    wingCategory: {
      en: "State Leadership",
      te: "రాష్ట్ర నాయకత్వం",
      hi: "राज्य नेतृत्व"
    },
    badgeColor: "bg-amber-500/10 text-amber-800 border-amber-500/30"
  },
  {
    id: "ramesh-chary",
    serial: 5,
    name: {
      en: "Brahmasri Yanmanagadla Ramesh Chary ji",
      te: "బ్రహ్మశ్రీ యన్మనగండ్ల రమేష్ చారి జీ",
      hi: "ब्रह्मश्री यनमनागंडला रमेश चारी जी"
    },
    role: {
      en: "Convenor - VKC Mahabubnagar Parliament",
      te: "కన్వీనర్ - వీకేసీ మహబూబ్‌నగర్ పార్లమెంట్",
      hi: "संयोजक - वीकेसी महबूबनगर संसद"
    },
    wing: "state",
    wingCategory: {
      en: "Parliamentary Wing",
      te: "పార్లమెంట్ విభాగం",
      hi: "संसदीय प्रभाग"
    },
    badgeColor: "bg-stone-100 text-stone-800 border-stone-300"
  },
  {
    id: "raghinandhan",
    serial: 6,
    name: {
      en: "Brahmasri Kurella Raghinandhan Acharya ji",
      te: "బ్రహ్మశ్రీ కురెళ్ళ రఘునందన్ ఆచార్య జీ",
      hi: "ब्रह्मश्री कुरेल्ला रघुनंदन आचार्य जी"
    },
    role: {
      en: "National Youth Wing Convenor",
      te: "జాతీయ యువజన విభాగం కన్వీనర్",
      hi: "राष्ट्रीय युवा विंग संयोजक"
    },
    wing: "youth",
    wingCategory: {
      en: "National Youth Wing",
      te: "జాతీయ యువజన విభాగం",
      hi: "राष्ट्रीय युवा विंग"
    },
    badgeColor: "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
  },
  {
    id: "trinath-achary",
    serial: 7,
    name: {
      en: "Brahmasri Muniganti Trinath Achary ji",
      te: "బ్రహ్మశ్రీ మునిగంటి త్రినాథ్ ఆచార్య జీ",
      hi: "ब्रह्मश्री मुनिगंटी त्रिनाथ आचार्य जी"
    },
    role: {
      en: "President - Telangana State Youth Wing",
      te: "తెలంగాణ రాష్ట్ర యువజన విభాగం అధ్యక్షులు",
      hi: "अध्यक्ष - तेलंगाना राज्य युवा विंग"
    },
    wing: "youth",
    wingCategory: {
      en: "State Youth Wing",
      te: "రాష్ట్ర యువజన విభాగం",
      hi: "राज्य युवा विंग"
    },
    badgeColor: "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
  }
];
