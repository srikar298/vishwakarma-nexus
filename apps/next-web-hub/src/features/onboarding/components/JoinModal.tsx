"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Phone, 
  Briefcase, 
  MapPin, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  Hammer, 
  Heart, 
  Sparkles, 
  Award, 
  Flag, 
  Share2, 
  Copy, 
  Check,
  Building2,
  GraduationCap,
  Calendar,
  Compass
} from 'lucide-react';
import { submitToGoogleSheets } from '@/infrastructure/api/googleSheets.api';
import { BaseModal } from '@/shared/ui/BaseModal';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';

export type TrackType = 'yatra' | 'artisan' | 'matrimony' | 'professional' | 'mentor' | 'patron';

export const PANCHA_BRAHMA_LINEAGES = [
  { id: 'manu', label: 'Manu (మను / मनु) — Iron / Blacksmith (Lohar / Kammari)', short: '🔨 Manu (Iron/Blacksmith)' },
  { id: 'maya', label: 'Maya (మయ / मय) — Wood / Architecture (Vadla / Suthar)', short: '🪚 Maya (Wood/Carpentry)' },
  { id: 'thwashta', label: 'Thwashta (త్వష్ట / त्वष्टा) — Brass / Bronze / Copper (Kanchari)', short: '🔔 Thwashta (Brass/Copper)' },
  { id: 'shilpi', label: 'Shilpi (శిల్పి / शिल्पी) — Stone / Sculptor (Kasi / Silpi)', short: '🗿 Shilpi (Stone/Sculptor)' },
  { id: 'vishvajna', label: 'Vishvajna (విశ్వజ్ఞ / विश्वज्ञ) — Gold / Jewellery (Sonar / Swarnakar)', short: '👑 Vishvajna (Goldsmith)' },
];

export const MATRIMONY_EDUCATIONS = [
  "B.Tech / B.E. / Engineering",
  "Post Graduate (M.Tech / MS / MBA / MCA)",
  "Doctor / MBBS / MD / Dental",
  "CA / CS / Finance / Banking",
  "Graduate (B.Sc / B.Com / B.A / BBA)",
  "Diploma / ITI / Polytechnic",
  "Civil Services / Govt Officer",
  "Other Higher Education"
];

export const YATRA_SEVA_OPTIONS = [
  { id: 'padayatri', label: '🚶 Walking the Yatra (Padayatri)', short: 'Padayatri' },
  { id: 'welcome', label: '🚩 District Welcome Committee', short: 'Welcome Committee' },
  { id: 'annadanam', label: '🍲 Annadanam & Water Seva Stalls', short: 'Annadanam Seva' },
  { id: 'accommodation', label: '🏡 Accommodation / Ashram Stay', short: 'Accommodation Support' },
  { id: 'medical', label: '🩺 Medical & Transport Support', short: 'Medical/Transport' },
];

export const PATRON_INTEREST_OPTIONS = [
  "Student Scholarships & Education Aid",
  "Pushpagiri Ekta Yatra & Annadanam",
  "Temple & Heritage Shastra Restoration",
  "Community Hall / Kalyana Mandapam",
  "Artisan Welfare & Modern Toolkits"
];

const TRADES = [
  "Carpenter (Suthar)", "Boat Maker", "Armourer", "Blacksmith (Lohar)", 
  "Hammer and Tool Kit Maker", "Locksmith", "Goldsmith (Sonar)", 
  "Potter (Kumhaar)", "Sculptor / Stone Carver", "Cobbler (Charmakar)", 
  "Mason (Rajmistri)", "Basket/Mat/Broom Maker", "Doll & Toy Maker", 
  "Barber (Naai)", "Garland maker (Malakaar)", "Washerman (Dhobi)", 
  "Tailor (Darzi)", "Fishing Net Maker"
];

const ALL_DISTRICT_SUGGESTIONS = [
  // Telangana (All 33 Districts)
  "Telangana - Adilabad",
  "Telangana - Bhadradri Kothagudem",
  "Telangana - Hanamkonda",
  "Telangana - Hyderabad",
  "Telangana - Jagtial",
  "Telangana - Jangaon",
  "Telangana - Jayashankar Bhupalpally",
  "Telangana - Jogulamba Gadwal",
  "Telangana - Kamareddy",
  "Telangana - Karimnagar",
  "Telangana - Khammam",
  "Telangana - Kumuram Bheem Asifabad",
  "Telangana - Mahabubabad",
  "Telangana - Mahabubnagar",
  "Telangana - Mancherial",
  "Telangana - Medak",
  "Telangana - Medchal-Malkajgiri",
  "Telangana - Mulugu",
  "Telangana - Nagarkurnool",
  "Telangana - Nalgonda",
  "Telangana - Narayanpet",
  "Telangana - Nirmal",
  "Telangana - Nizamabad",
  "Telangana - Peddapalli",
  "Telangana - Rajanna Sircilla",
  "Telangana - Rangareddy",
  "Telangana - Sangareddy",
  "Telangana - Siddipet",
  "Telangana - Suryapet",
  "Telangana - Vikarabad",
  "Telangana - Wanaparthy",
  "Telangana - Warangal",
  "Telangana - Yadadri Bhuvanagiri",

  // Andhra Pradesh (All 26 Districts)
  "Andhra Pradesh - Alluri Sitharama Raju",
  "Andhra Pradesh - Anakapalli",
  "Andhra Pradesh - Ananthapuramu (Anantapur)",
  "Andhra Pradesh - Annamayya",
  "Andhra Pradesh - Bapatla",
  "Andhra Pradesh - Chittoor",
  "Andhra Pradesh - Dr. B.R. Ambedkar Konaseema",
  "Andhra Pradesh - East Godavari (Rajahmundry)",
  "Andhra Pradesh - Eluru",
  "Andhra Pradesh - Guntur",
  "Andhra Pradesh - Kakinada",
  "Andhra Pradesh - Krishna (Machilipatnam)",
  "Andhra Pradesh - Kurnool",
  "Andhra Pradesh - Nandyal",
  "Andhra Pradesh - NTR (Vijayawada)",
  "Andhra Pradesh - Palnadu",
  "Andhra Pradesh - Parvathipuram Manyam",
  "Andhra Pradesh - Prakasam (Ongole)",
  "Andhra Pradesh - Sri Potti Sriramulu Nellore",
  "Andhra Pradesh - Sri Sathya Sai (Puttaparthi)",
  "Andhra Pradesh - Srikakulam",
  "Andhra Pradesh - Tirupati",
  "Andhra Pradesh - Visakhapatnam",
  "Andhra Pradesh - Vizianagaram",
  "Andhra Pradesh - West Godavari (Bhimavaram)",
  "Andhra Pradesh - YSR Kadapa",

  // Major Regional Hubs & Metros
  "Karnataka - Bengaluru",
  "Karnataka - Bellary / Raichur",
  "Maharashtra - Mumbai / Thane",
  "Maharashtra - Pune",
  "Maharashtra - Nanded / Solapur",
  "Tamil Nadu - Chennai",
  "Delhi / NCR",
  "Odisha",
  "Other State / NRI"
];


const MODAL_TEXTS = {
  en: {
    badge: 'Express Registration',
    subtitle: 'Vishwakarma Ekta Maha Padayatra & VKC Network',
    step1Title: 'Contact Info',
    step2Title: 'Verification & Details',
    selectedCategory: 'Selected Category',
    changeCategory: 'Change',
    stepIndicator: (current: number, total: number) => `Step ${current} of ${total}`,
    purposeLabel: 'Select Category',
    phoneLabel: 'Mobile Number (WhatsApp)',
    phonePlaceholder: '98765 43210',
    phoneNote: 'Digital pass & updates will be sent via WhatsApp.',
    nameLabel: 'Full Name',
    namePlaceholder: 'e.g. Brahmasri Ramesh Chary',
    nextBtn: 'Continue to Details',
    locationLabel: 'District / Region',
    locationPlaceholder: 'Type your District (e.g. Siddipet, Warangal, Guntur)',
    mandalLabel: 'Mandal / Town / Area',
    mandalPlaceholder: 'e.g. Shadnagar / Kukatpally',
    lineageLabel: 'Pancha Brahma Lineage / Kula',
    lineagePlaceholder: 'Select your Lineage (Optional)',
    matrimonyAgeLabel: 'Age (Years)',
    matrimonyAgePlaceholder: 'e.g. 27',
    matrimonyEduLabel: 'Highest Education',
    matrimonyEduPlaceholder: 'Select Education Level',
    workCityLabel: 'Current Work City / Country',
    workCityPlaceholder: 'e.g. Hyderabad / Bengaluru / USA',
    yatraSevaLabel: 'Yatra Seva / Contribution Role',
    workshopTypeLabel: 'Artisan Enterprise Type',
    workshopOwn: 'Own Workshop / Self-Employed',
    workshopEmployed: 'Employed / Wage Craftsman',
    companyLabel: 'Company / Business Name',
    companyPlaceholder: 'e.g. Infosys / Sri Sai Interiors',
    youthReferralLabel: '🤝 Open to mentoring or hiring Vishwakarma youth',
    mentorModeLabel: 'Preferred Mentoring Format',
    mentorModeWebinar: 'Online Webinars',
    mentorMode1on1: '1-on-1 Guidance',
    patronInterestLabel: 'Community Support Focus',
    craftLabelArtisan: 'Traditional Craft Specialization',
    craftPlaceholderArtisan: 'Select your traditional craft',
    craftLabelMatrimony: 'Gotra / Subsect & Profession',
    craftPlaceholderMatrimony: 'e.g. Sanaga Gotra / Software Architect',
    craftLabelMentor: 'Area of Mentorship / Expertise',
    craftPlaceholderMentor: 'e.g. Civil Services Coaching, Enterprise, Tech',
    craftLabelProfessional: 'Profession / Designation / Business',
    craftPlaceholderProfessional: 'e.g. Software Engineer / Architect / Contractor',
    craftLabelYatra: 'Volunteer Notes / Coordination Area',
    craftPlaceholderYatra: 'e.g. Can coordinate 50 yatris or arrange vehicles',
    craftLabelPatron: 'Additional Support Notes',
    craftPlaceholderPatron: 'e.g. Offering venue, logistics, or scholarship grants',
    lookingForLabel: 'Looking For Alliance',
    lookingForGroom: 'Looking for Groom',
    lookingForBride: 'Looking for Bride',
    pmSchemeTitle: 'Free PM Vishwakarma Scheme Assistance',
    pmSchemeDesc: 'Assistance for free ₹15,000 modern toolkit e-voucher & subsidized credit.',
    backBtn: 'Back',
    submitBtn: 'Complete & Generate Digital Pass',
    submitting: 'Generating Pass...',
    confirmedTitle: 'Registration Confirmed!',
    confirmedSub: 'Welcome to Vishwakarma Knowledge Centre & Community Network.',
    passTitle: 'VISHWAKARMA NEXUS',
    passSub: 'Official Verified Member Registry',
    memberName: 'Member Name',
    registeredMobile: 'Registered Mobile',
    districtRegion: 'District / Region',
    category: 'Category',
    lineageText: 'Lineage / Kula',
    verifiedMember: 'Verified Member',
    shareWhatsApp: 'Share on WhatsApp with Fellow Bandhus',
    copyPass: 'Copy Member Pass Details',
    copied: 'Copied to Clipboard!',
    closeReturn: 'Close & Return to Home',
    tracks: {
      professional: 'Professional Network',
      mentor: 'Register as Mentor',
      matrimony: 'Parinaya Matrimony',
      artisan: 'Master Artisan & Digital ID',
      yatra: 'Vishwakarma Ekta Maha Padayatra',
      patron: 'Community Member / Patron'
    },
    trackPills: {
      yatra: 'Ekta Yatra',
      matrimony: 'Matrimony',
      artisan: 'Artisan ID',
      professional: 'Professional',
      mentor: 'Mentor',
      patron: 'Patron'
    },
    trackSubtitles: {
      yatra: 'Official Digital Yatri Pass & Coordination Registry',
      matrimony: '100% Verified Community Matchmaking Registry',
      artisan: 'Digital ID Card & Free PM Vishwakarma Scheme Assistance',
      professional: 'Business Networking, Job Referrals & Directory',
      mentor: 'Guide Vishwakarma Youth & Students',
      patron: 'Community Development & Heritage Support'
    }
  },
  te: {
    badge: 'ఎక్స్‌ప్రెస్ రిజిస్ట్రేషన్',
    subtitle: 'విశ్వకర్మ వంశస్థుల ఏకతా మహా పాదయాత్ర & VKC నెట్‌వర్క్',
    step1Title: 'మీ వివరాలు',
    step2Title: 'ధృవీకరణ & వివరాలు',
    selectedCategory: 'ఎంచుకున్న విభాగం',
    changeCategory: 'మార్చండి',
    stepIndicator: (current: number, total: number) => `దశ ${current} / ${total}`,
    purposeLabel: 'నమోదు విభాగం ఎంచుకోండి',
    phoneLabel: 'మొబైల్ నంబర్ (వాట్సాప్)',
    phonePlaceholder: '98765 43210',
    phoneNote: 'డిజిటల్ పాస్ మరియు సమాచారం వాట్సాప్ ద్వారా పంపబడుతుంది.',
    nameLabel: 'పూర్తి పేరు',
    namePlaceholder: 'ఉదా: బ్రహ్మశ్రీ రమేష్ చారి',
    nextBtn: 'వివరాలకు కొనసాగండి',
    locationLabel: 'జిల్లా / ప్రాంతం',
    locationPlaceholder: 'మీ జిల్లాను టైప్ చేయండి (ఉదా: సిద్దిపేట, వరంగల్, గుంటూరు)',
    mandalLabel: 'మండలం / పట్టణం / ప్రాంతం',
    mandalPlaceholder: 'ఉదా: షాద్‌నగర్ / కూకట్‌పల్లి',
    lineageLabel: 'పంచబ్రహ్మ వంశం / శాఖ',
    lineagePlaceholder: 'మీ వంశం ఎంచుకోండి (ఐచ్ఛికం)',
    matrimonyAgeLabel: 'వయస్సు (సంవత్సరాలు)',
    matrimonyAgePlaceholder: 'ఉదా: 27',
    matrimonyEduLabel: 'విద్యార్హత',
    matrimonyEduPlaceholder: 'విద్యార్హత ఎంచుకోండి',
    workCityLabel: 'ఉద్యోగం / నివాస నగరం',
    workCityPlaceholder: 'ఉదా: హైదరాబాద్ / USA / బెంగళూరు',
    yatraSevaLabel: 'పాదయాత్ర సేవ / సహకార విభాగం',
    workshopTypeLabel: 'వృత్తి కేంద్రం రకం',
    workshopOwn: 'సొంత వర్క్‌షాప్ / స్వయం ఉపాధి',
    workshopEmployed: 'ఉద్యోగి / దినసరి కళాకారుడు',
    companyLabel: 'సంస్థ / వ్యాపారం / కంపెనీ పేరు',
    companyPlaceholder: 'ఉదా: ఇన్ఫోసిస్ / శ్రీ సాయి ఇంటీరియర్స్',
    youthReferralLabel: '🤝 మన విశ్వకర్మ యువతకు మెంటార్‌షిప్ లేదా ఉద్యోగ అవకాశాలు ఇవ్వడానికి సిద్ధం',
    mentorModeLabel: 'మార్గదర్శక విధానం',
    mentorModeWebinar: 'ఆన్‌లైన్ వెబినార్లు',
    mentorMode1on1: 'ప్రత్యక్ష 1-on-1 గైడెన్స్',
    patronInterestLabel: 'సహకార విభాగం',
    craftLabelArtisan: 'సాంప్రదాయ వృత్తి నైపుణ్యం',
    craftPlaceholderArtisan: 'మీ సాంప్రదాయ వృత్తిని ఎంచుకోండి',
    craftLabelMatrimony: 'గోత్రం / ఉపశాఖ మరియు వృత్తి',
    craftPlaceholderMatrimony: 'ఉదా: సనగ గోత్రం / సాఫ్ట్‌వేర్ ఆర్కిటెక్ట్',
    craftLabelMentor: 'మార్గదర్శకత్వం / మెంటార్‌షిప్ రంగం',
    craftPlaceholderMentor: 'ఉదా: సివిల్ సర్వీసెస్, ఉన్నత విద్య, వ్యాపారం',
    craftLabelProfessional: 'వృత్తి / ఉద్యోగం / వ్యాపారం',
    craftPlaceholderProfessional: 'ఉదా: ఇంజనీర్ / ఆర్కిటెక్ట్ / కాంట్రాక్టర్',
    craftLabelYatra: 'సమన్వయ వివరాలు / స్వచ్ఛంద సేవ',
    craftPlaceholderYatra: 'ఉదా: 50 మంది యాత్రికులకు వసతి లేదా భోజన ఏర్పాట్లు చేయగలను',
    craftLabelPatron: 'సహకార వివరాలు',
    craftPlaceholderPatron: 'ఉదా: విద్యా ప్రోత్సాహకం, యాత్ర ఏర్పాట్లు లేదా ఆర్థిక సహాయం',
    lookingForLabel: 'సంబంధం ఎవరి కోసం?',
    lookingForGroom: 'అబ్బాయి కావాలి (Groom)',
    lookingForBride: 'అమ్మాయి కావాలి (Bride)',
    pmSchemeTitle: 'PM విశ్వకర్మ పథకం ఉచిత సహాయం',
    pmSchemeDesc: 'ఉచిత ₹15,000 టూల్‌కిట్ ఈ-వోచర్ & తక్కువ వడ్డీ రుణం కొరకు దరఖాస్తు సహాయం.',
    backBtn: 'వెనుకకు',
    submitBtn: 'పూర్తి చేసి డిజిటల్ పాస్ పొందండి',
    submitting: 'పాస్ జారీ అవుతోంది...',
    confirmedTitle: 'నమోదు విజయవంతంగా పూర్తయింది!',
    confirmedSub: 'విశ్వకర్మ నాలెడ్జ్ సెంటర్ & సంఘ నెట్‌వర్క్‌కు స్వాగతం.',
    passTitle: 'విశ్వకర్మ నెక్సస్',
    passSub: 'అధికారిక ధృవీకరించబడిన సభ్యుల రిజిస్ట్రీ',
    memberName: 'సభ్యుని పేరు',
    registeredMobile: 'నమోదైన మొబైల్',
    districtRegion: 'జిల్లా / ప్రాంతం',
    category: 'విభాగం',
    lineageText: 'పంచబ్రహ్మ వంశం',
    verifiedMember: 'ధృవీకరించబడిన సభ్యుడు',
    shareWhatsApp: 'తోటి బంధువులతో వాట్సాప్‌లో పంచుకోండి',
    copyPass: 'సభ్యత్వ పాస్ వివరాలు కాపీ చేయండి',
    copied: 'క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది!',
    closeReturn: 'ముగించి హోమ్‌కు వెళ్లండి',
    tracks: {
      professional: 'వృత్తి నిపుణుల నెట్‌వర్క్',
      mentor: 'గౌరవ మెంటార్‌గా నమోదు',
      matrimony: 'పరిణయ మ్యాట్రిమోనీ పోర్టల్',
      artisan: 'కళాకారుల డిజిటల్ ఐడీ కార్డ్',
      yatra: 'విశ్వకర్మ ఏకతా మహా పాదయాత్ర',
      patron: 'సంఘ పోషకులు / సభ్యులు'
    },
    trackPills: {
      yatra: 'ఏకతా యాత్ర',
      matrimony: 'మ్యాట్రిమోనీ',
      artisan: 'కళాకారుల ID',
      professional: 'వృత్తి నిపుణులు',
      mentor: 'మెంటార్',
      patron: 'పోషకులు'
    },
    trackSubtitles: {
      yatra: 'అధికారిక డిజిటల్ యాత్రి పాస్ మరియు రిజిస్ట్రీ',
      matrimony: '100% ధృవీకరించబడిన విశ్వకర్మ మ్యాట్రిమోనీ',
      artisan: 'కళాకారుల డిజిటల్ ID & PM విశ్వకర్మ ఉచిత సహాయం',
      professional: 'వ్యాపార, ఉద్యోగ నెట్‌వర్కింగ్ మరియు డైరెక్టరీ',
      mentor: 'యువతకు మరియు విద్యార్థులకు మార్గదర్శకత్వం',
      patron: 'సంఘాభివృద్ధి మరియు సాంస్కృతిక సహకారం'
    }
  },
  hi: {
    badge: 'त्वरित एक्सप्रेस पंजीकरण',
    subtitle: 'विश्वकर्मा एकता महा पदयात्रा एवं VKC नेटवर्क',
    step1Title: 'आपका विवरण',
    step2Title: 'सत्यापन एवं विवरण',
    selectedCategory: 'चयनित श्रेणी',
    changeCategory: 'बदलें',
    stepIndicator: (current: number, total: number) => `चरण ${current} / ${total}`,
    purposeLabel: 'पंजीकरण श्रेणी चुनें',
    phoneLabel: 'मोबाइल नंबर (व्हाट्सएप)',
    phonePlaceholder: '98765 43210',
    phoneNote: 'डिजिटल पास और अपडेट व्हाट्सएप द्वारा भेजे जाएंगे।',
    nameLabel: 'पूरा नाम',
    namePlaceholder: 'उदा. ब्रह्मश्री रमेश चारी',
    nextBtn: 'विवरण पर आगे बढ़ें',
    locationLabel: 'जिला / क्षेत्र',
    locationPlaceholder: 'अपना जिला टाइप करें (उदा. सिद्दिपेट, वारंगल, गुंटूर)',
    mandalLabel: 'तहसील / शहर / क्षेत्र',
    mandalPlaceholder: 'उदा. शादनगर / कुकटपल्ली',
    lineageLabel: 'पंचब्रह्म वंश / शाखा',
    lineagePlaceholder: 'अपना वंश चुनें (वैकल्पिक)',
    matrimonyAgeLabel: 'उम्र (वर्ष)',
    matrimonyAgePlaceholder: 'उदा. 27',
    matrimonyEduLabel: 'उच्चतम शिक्षा',
    matrimonyEduPlaceholder: 'शिक्षा स्तर चुनें',
    workCityLabel: 'कार्यरत शहर / देश',
    workCityPlaceholder: 'उदा. हैदराबाद / बेंगलुरु / यूएसए',
    yatraSevaLabel: 'पदयात्रा सेवा / सहयोग भूमिका',
    workshopTypeLabel: 'शिल्प प्रतिष्ठान प्रकार',
    workshopOwn: 'स्वयं की कार्यशाला / स्व-रोजगार',
    workshopEmployed: 'कार्यरत / वेतनभोगी कारीगर',
    companyLabel: 'कंपनी / व्यवसाय का नाम',
    companyPlaceholder: 'उदा. इंफोसिस / साई इंटीरियर्स',
    youthReferralLabel: '🤝 विश्वकर्मा युवाओं को मेंटरशिप या रोजगार अवसर देने में रुचि',
    mentorModeLabel: 'मेंटरशिप प्रारूप',
    mentorModeWebinar: 'ऑनलाइन वेबिनार',
    mentorMode1on1: 'व्यक्तिगत मार्गदर्शन',
    patronInterestLabel: 'सहयोग का क्षेत्र',
    craftLabelArtisan: 'पारंपरिक शिल्प विशेषता',
    craftPlaceholderArtisan: 'अपना पारंपरिक शिल्प चुनें',
    craftLabelMatrimony: 'गोत्र / उपशाखा एवं व्यवसाय',
    craftPlaceholderMatrimony: 'उदा. सनग गोत्र / सॉफ्टवेयर इंजीनियर',
    craftLabelMentor: 'मार्गदर्शन / मेंटरशिप क्षेत्र',
    craftPlaceholderMentor: 'उदा. सिविल सेवा, उच्च शिक्षा, उद्यम',
    craftLabelProfessional: 'पेशा / पद / व्यवसाय',
    craftPlaceholderProfessional: 'उदा. इंजीनियर / वास्तुकार / उद्यमी',
    craftLabelYatra: 'समन्वय विवरण / सेवा',
    craftPlaceholderYatra: 'उदा. 50 यात्रियों के आवास या भोजन व्यवस्था में सहयोग',
    craftLabelPatron: 'सहयोग विवरण',
    craftPlaceholderPatron: 'उदा. छात्रवृत्ति, यात्रा व्यवस्था या आर्थिक सहयोग',
    lookingForLabel: 'रिश्ता किसके लिए है?',
    lookingForGroom: 'वर चाहिए (Groom)',
    lookingForBride: 'वधू चाहिए (Bride)',
    pmSchemeTitle: 'PM विश्वकर्मा योजना मुफ्त सहायता',
    pmSchemeDesc: 'मुफ्त ₹15,000 टूलकिट ई-वाउचर और कम ब्याज पर ऋण के लिए मार्गदर्शन।',
    backBtn: 'वापस जाएं',
    submitBtn: 'पंजीकरण पूर्ण करें और डिजिटल पास प्राप्त करें',
    submitting: 'पास जारी हो रहा है...',
    confirmedTitle: 'पंजीकरण सफलतापूर्वक पूर्ण हुआ!',
    confirmedSub: 'विश्वकर्मा नॉलेज सेंटर नेटवर्क में आपका स्वागत है।',
    passTitle: 'विश्वकर्मा नेक्सस',
    passSub: 'आधिकारिक सत्यापित सदस्य रजिस्ट्री',
    memberName: 'सदस्य का नाम',
    registeredMobile: 'पंजीकृत मोबाइल',
    districtRegion: 'जिला / क्षेत्र',
    category: 'श्रेणी',
    lineageText: 'पंचब्रह्म वंश',
    verifiedMember: 'सत्यापित सदस्य',
    shareWhatsApp: 'विश्वकर्मा बंधुओं के साथ व्हाट्सएप पर साझा करें',
    copyPass: 'पास विवरण कॉपी करें',
    copied: 'क्लिपबोर्ड पर कॉपी किया गया!',
    closeReturn: 'बंद करें और वापस जाएं',
    tracks: {
      professional: 'व्यावसायिक नेटवर्क',
      mentor: 'मेंटर के रूप में पंजीकरण',
      matrimony: 'परिणय मैट्रिमोनी पोर्टल',
      artisan: 'शिल्पकार डिजिटल आईडी कार्ड',
      yatra: 'विश्वकर्मा एकता महा पदयात्रा',
      patron: 'समुदाय संरक्षक / सदस्य'
    },
    trackPills: {
      yatra: 'एकता पदयात्रा',
      matrimony: 'मैट्रिमोनी',
      artisan: 'शिल्पकार ID',
      professional: 'व्यावसायिक',
      mentor: 'मेंटर',
      patron: 'संरक्षक'
    },
    trackSubtitles: {
      yatra: 'आधिकारिक डिजिटल यात्री पास एवं समन्वय रजिस्ट्री',
      matrimony: '100% सत्यापित विश्वकर्मा मैट्रिमोनी नेटवर्क',
      artisan: 'डिजिटल आईडी कार्ड एवं PM विश्वकर्मा योजना सहायता',
      professional: 'व्यवसाय, रोजगार नेटवर्किंग एवं डायरेक्टरी',
      mentor: 'विश्वकर्मा युवाओं एवं छात्रों का मार्गदर्शन',
      patron: 'सामुदायिक विकास एवं सांस्कृतिक सहयोग'
    }
  }
};

const TRACK_CONFIGS: Array<{
  id: TrackType;
  icon: typeof Briefcase;
  color: string;
  badge: string;
}> = [
  { id: 'yatra', icon: Flag, color: 'text-amber-600', badge: '🚩 Ekta Yatra' },
  { id: 'matrimony', icon: Heart, color: 'text-rose-600', badge: '💍 Matrimony' },
  { id: 'artisan', icon: Hammer, color: 'text-vermilion', badge: '🛠️ Artisan ID' },
  { id: 'professional', icon: Briefcase, color: 'text-blue-600', badge: '💼 Professional' },
  { id: 'mentor', icon: Award, color: 'text-purple-600', badge: '🎓 Mentor' },
  { id: 'patron', icon: Sparkles, color: 'text-emerald-600', badge: '🌟 Patron' },
];

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrack?: TrackType;
}

export function JoinModal({ isOpen, onClose, defaultTrack = 'yatra' }: JoinModalProps) {
  const { i18n } = useTranslation();
  const currentLang = (['en', 'te', 'hi'].includes(i18n.language) ? i18n.language : 'en') as 'en' | 'te' | 'hi';
  const tModal = MODAL_TEXTS[currentLang] || MODAL_TEXTS.en;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [memberId, setMemberId] = useState('');
  
  const [formData, setFormData] = useState({
    track: defaultTrack,
    name: '',
    phone: '',
    location: '',
    mandal: '',
    lineage: '',
    tradeOrDetail: '',
    matrimonyLookingFor: 'groom' as 'groom' | 'bride',
    matrimonyAge: '',
    matrimonyEducation: '',
    workCity: '',
    yatraSeva: 'padayatri',
    workshopType: 'own' as 'own' | 'employed',
    pmVishwakarmaInterest: true,
    company: '',
    youthReferralInterest: true,
    mentorMode: 'webinar' as 'webinar' | 'one_on_one',
    patronInterest: PATRON_INTEREST_OPTIONS[0],
  });

  useEffect(() => {
    if (defaultTrack) {
      setFormData(prev => (prev.track === defaultTrack ? prev : { ...prev, track: defaultTrack }));
    }
  }, [defaultTrack]);

  const handleReset = useCallback(() => {
    setStep(1);
    setSuccess(false);
    setCopied(false);
    setFormData({
      track: defaultTrack,
      name: '',
      phone: '',
      location: '',
      mandal: '',
      lineage: '',
      tradeOrDetail: '',
      matrimonyLookingFor: 'groom',
      matrimonyAge: '',
      matrimonyEducation: '',
      workCity: '',
      yatraSeva: 'padayatri',
      workshopType: 'own',
      pmVishwakarmaInterest: true,
      company: '',
      youthReferralInterest: true,
      mentorMode: 'webinar',
      patronInterest: PATRON_INTEREST_OPTIONS[0],
    });
    onClose();
  }, [defaultTrack, onClose]);

  const getLineageShort = () => {
    const found = PANCHA_BRAHMA_LINEAGES.find(l => l.id === formData.lineage);
    return found ? found.short : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const prefix = formData.track === 'matrimony' ? 'VKC-M' : formData.track === 'mentor' ? 'VKC-L' : formData.track === 'professional' ? 'VKC-P' : 'VKC';
    const generatedId = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    setMemberId(generatedId);

    const lineageObj = PANCHA_BRAHMA_LINEAGES.find(l => l.id === formData.lineage);
    const lineageText = lineageObj ? lineageObj.short : undefined;

    const payload = {
      uid: generatedId,
      memberId: generatedId,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      track: formData.track,
      category: tModal.tracks[formData.track],
      location: formData.location.trim() || 'India',
      state: formData.location.trim() || 'India',
      mandal: formData.mandal.trim() || undefined,
      lineage: lineageText,
      trade: formData.track === 'yatra' 
        ? `Yatra Seva: ${formData.yatraSeva}${formData.tradeOrDetail ? ` | Notes: ${formData.tradeOrDetail}` : ''}`
        : (formData.tradeOrDetail || 'Member'),
      matrimonyLookingFor: formData.track === 'matrimony' ? formData.matrimonyLookingFor : undefined,
      matrimonyAge: formData.track === 'matrimony' ? formData.matrimonyAge : undefined,
      matrimonyEducation: formData.track === 'matrimony' ? formData.matrimonyEducation : undefined,
      workCity: formData.track === 'matrimony' ? formData.workCity : undefined,
      yatraSeva: formData.track === 'yatra' ? formData.yatraSeva : undefined,
      workshopType: formData.track === 'artisan' ? (formData.workshopType === 'own' ? 'Own Workshop' : 'Employed') : undefined,
      pmVishwakarmaInterest: formData.track === 'artisan' ? (formData.pmVishwakarmaInterest ? 'Yes' : 'No') : undefined,
      company: formData.track === 'professional' ? formData.company : undefined,
      youthReferralInterest: formData.track === 'professional' ? (formData.youthReferralInterest ? 'Yes' : 'No') : undefined,
      mentorMode: formData.track === 'mentor' ? formData.mentorMode : undefined,
      patronInterest: formData.track === 'patron' ? formData.patronInterest : undefined,
      notes: `Track: ${formData.track} | Mandal: ${formData.mandal || 'N/A'} | Lineage: ${lineageText || 'N/A'}${
        formData.track === 'matrimony' ? ` | Looking: ${formData.matrimonyLookingFor} | Age: ${formData.matrimonyAge || 'N/A'} | Edu: ${formData.matrimonyEducation || 'N/A'} | City: ${formData.workCity || 'N/A'}` : ''
      }${
        formData.track === 'artisan' ? ` | Workshop: ${formData.workshopType} | PMVishwakarma: ${formData.pmVishwakarmaInterest ? 'Interested' : 'No'}` : ''
      }${
        formData.track === 'yatra' ? ` | Seva: ${formData.yatraSeva}` : ''
      }${
        formData.track === 'professional' ? ` | Company: ${formData.company || 'N/A'} | YouthMentor: ${formData.youthReferralInterest ? 'Yes' : 'No'}` : ''
      }${
        formData.track === 'mentor' ? ` | Format: ${formData.mentorMode}` : ''
      }${
        formData.track === 'patron' ? ` | Focus: ${formData.patronInterest}` : ''
      } | GeneratedID: ${generatedId}`
    };

    await submitToGoogleSheets(payload);
    setSuccess(true);
    setLoading(false);
  };

  const getShareText = () => {
    const categoryName = tModal.tracks[formData.track] || 'Vishwakarma Nexus';
    const lineageStr = getLineageShort();
    const locStr = [formData.mandal?.trim(), formData.location?.trim()].filter(Boolean).join(', ');

    if (currentLang === 'te') {
      return `*|| జై విశ్వకర్మ ||*\n*${categoryName} — VKC అధికారిక రిజిస్ట్రీ*\n\nనేను అధికారిక నెట్‌వర్క్‌లో నమోదు చేసుకున్నాను.\n*నా డిజిటల్ ఐడీ:* ${memberId}\n*విభాగం:* ${categoryName}${lineageStr ? `\n*శాఖ/వంశం:* ${lineageStr}` : ''}${locStr ? `\n*ప్రాంతం:* ${locStr}` : ''}\n\n*మీరూ ఇప్పుడే మొబైల్ నంబర్‌తో నమోదు చేసుకొని డిజిటల్ పాస్ పొందండి:*\nhttps://vishwakarmaknowledgecentre.org/membership`;
    }
    if (currentLang === 'hi') {
      return `*|| जय विश्वकर्मा ||*\n*${categoryName} — VKC आधिकारिक रजिस्ट्री*\n\nमैंने आधिकारिक नेटवर्क पर पंजीकरण कर लिया है।\n*मेरी डिजिटल आईडी:* ${memberId}\n*श्रेणी:* ${categoryName}${lineageStr ? `\n*वंश/शाखा:* ${lineageStr}` : ''}${locStr ? `\n*स्थान:* ${locStr}` : ''}\n\n*आप भी अपने मोबाइल नंबर से तुरंत पंजीकरण करें और डिजिटल पास पाएं:*\nhttps://vishwakarmaknowledgecentre.org/membership`;
    }
    return `*|| Jai Vishwakarma ||*\n*${categoryName} — Official VKC Network*\n\nI have successfully registered with Vishwakarma Nexus.\n*My Digital ID:* ${memberId}\n*Category:* ${categoryName}${lineageStr ? `\n*Lineage:* ${lineageStr}` : ''}${locStr ? `\n*Location:* ${locStr}` : ''}\n\n*Register your mobile number and claim your Verified Digital Pass:*\nhttps://vishwakarmaknowledgecentre.org/membership`;
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(getShareText())}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryBadgeLabel = () => {
    return tModal.tracks[formData.track] || tModal.verifiedMember;
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={handleReset}
      title={tModal.badge}
      maxW="max-w-lg"
    >
      {success ? (
        <div className="p-5 md:p-7 text-center space-y-4">
          {/* Success Animated Badge */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="text-emerald-600 w-7 h-7" />
          </motion.div>

          <div>
            <h2 id="modal-title" className="text-xl md:text-2xl font-black text-stone-900 font-display">
              {tModal.confirmedTitle}
            </h2>
            <p className="text-stone-500 text-xs mt-1">
              {tModal.confirmedSub}
            </p>
          </div>

          {/* Digital Member Pass Card */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white rounded-2xl p-4 md:p-5 text-left border border-amber-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <img src="/images/shared/emblem.png" alt="VKC" className="w-8 h-8 object-contain" />
                <div>
                  <p className="text-xs font-black text-white leading-none">{tModal.passTitle}</p>
                  <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest mt-0.5">{getCategoryBadgeLabel()}</p>
                </div>
              </div>
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/30">
                {memberId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-wider">{tModal.memberName}</p>
                <p className="font-bold text-white text-sm truncate">{formData.name || 'Vishwakarma Bandhu'}</p>
              </div>
              <div>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-wider">{tModal.registeredMobile}</p>
                <p className="font-bold text-white text-sm">{formData.phone}</p>
              </div>
              <div>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-wider">{tModal.districtRegion}</p>
                <p className="font-bold text-amber-300 truncate">
                  {[formData.mandal?.trim(), formData.location?.trim()].filter(Boolean).join(', ') || 'Telangana / AP'}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-wider">{tModal.category}</p>
                <p className="font-bold text-emerald-400 uppercase text-[10px] truncate">{getCategoryBadgeLabel()}</p>
              </div>
            </div>

            {formData.lineage && (
              <div className="mt-2.5 pt-2 border-t border-stone-800/80 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider">{tModal.lineageText}</span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {getLineageShort()}
                </span>
              </div>
            )}

            {formData.track === 'matrimony' && (
              <div className="mt-2 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px]">
                <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider">Alliance Details</span>
                <span className="font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {formData.matrimonyLookingFor === 'groom' ? `🤵 ${tModal.lookingForGroom}` : `👰 ${tModal.lookingForBride}`}
                  {formData.matrimonyAge ? ` • ${formData.matrimonyAge} Yrs` : ''}
                </span>
              </div>
            )}

            {formData.track === 'artisan' && (
              <div className="mt-2 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px]">
                <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider">Artisan Status</span>
                <span className="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {formData.workshopType === 'own' ? '🏪 Own Workshop' : '🛠️ Skilled Craftsman'}
                  {formData.pmVishwakarmaInterest ? ' • PM Scheme Enrolled' : ''}
                </span>
              </div>
            )}

            {formData.track === 'yatra' && (
              <div className="mt-2 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px]">
                <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider">Yatra Contribution</span>
                <span className="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 capitalize truncate max-w-[200px]">
                  {YATRA_SEVA_OPTIONS.find(y => y.id === formData.yatraSeva)?.short || formData.yatraSeva}
                </span>
              </div>
            )}
          </div>

          {/* WhatsApp Share Action */}
          <div className="space-y-2 pt-1">
            <button 
              onClick={handleWhatsAppShare}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Share2 size={16} />
              <span>{tModal.shareWhatsApp}</span>
            </button>

            <button 
              onClick={handleCopy}
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? tModal.copied : tModal.copyPass}</span>
            </button>
          </div>

          <button 
            onClick={handleReset}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold pt-1 cursor-pointer"
          >
            {tModal.closeReturn}
          </button>
        </div>
      ) : (
        <div className="p-4 md:p-6">
          {/* Header Bar with Language Switcher */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100 pr-12">
            <div className="flex items-center gap-2 min-w-0">
              <span className="bg-gradient-to-r from-vermilion to-amber-500 p-1.5 rounded-lg text-white shrink-0">
                <Flag className="w-3.5 h-3.5" />
              </span>
              <div className="min-w-0">
                <span className="font-black text-stone-900 uppercase tracking-tight text-xs block truncate">
                  {tModal.badge}
                </span>
                <span className="text-[10px] text-amber-700 font-semibold block truncate">
                  {tModal.subtitle}
                </span>
              </div>
            </div>
            <div className="shrink-0">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Progressive 2-Step Stepper */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider mb-1.5">
              <button
                type="button"
                onClick={() => step === 2 && setStep(1)}
                className={`flex items-center gap-1.5 transition-colors ${
                  step === 1 ? 'text-vermilion font-black' : 'text-stone-600 hover:text-stone-900 cursor-pointer'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  step === 1 ? 'bg-vermilion text-white shadow-sm' : 'bg-emerald-600 text-white'
                }`}>
                  {step === 2 ? '✓' : '1'}
                </span>
                <span>{tModal.step1Title}</span>
              </button>

              <div className="flex items-center gap-1.5 text-stone-400">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  step === 2 ? 'bg-vermilion text-white shadow-sm' : 'bg-stone-200 text-stone-600'
                }`}>
                  2
                </span>
                <span className={step === 2 ? 'text-vermilion font-black' : 'text-stone-400 font-bold'}>
                  {tModal.step2Title}
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-vermilion to-amber-500 rounded-full"
                initial={false}
                animate={{ width: step === 1 ? '50%' : '100%' }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {/* Category Pill Selector (Horizontal Scrollable Chips) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center justify-between">
                      <span>{tModal.purposeLabel}</span>
                      <span className="text-[10px] text-amber-700 font-bold hidden sm:inline truncate max-w-[200px]">
                        {tModal.tracks[formData.track]}
                      </span>
                    </label>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar -mx-1 px-1 touch-pan-x">
                      {TRACK_CONFIGS.map((t) => {
                        const Icon = t.icon;
                        const isSelected = formData.track === t.id;
                        return (
                          <button
                            type="button"
                            key={t.id}
                            onClick={() => setFormData(prev => ({ ...prev, track: t.id }))}
                            className={`shrink-0 h-9 px-3 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                              isSelected
                                ? 'bg-gradient-to-r from-vermilion to-amber-600 text-white shadow-md shadow-vermilion/25 ring-2 ring-vermilion/20 scale-[1.02]'
                                : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200/70'
                            }`}
                          >
                            <Icon size={14} className={isSelected ? 'text-white' : t.color} />
                            <span>{tModal.trackPills[t.id] || tModal.tracks[t.id]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Track Subtitle Hint */}
                    <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-[11px] text-amber-950 font-medium">
                      <span className="truncate">{tModal.trackSubtitles[formData.track]}</span>
                      <span className="shrink-0 text-[9px] uppercase font-black tracking-wider text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded ml-2">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label htmlFor="full-name" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                      <User size={12} className="text-vermilion" /> 
                      {tModal.nameLabel}
                    </label>
                    <input 
                      id="full-name"
                      type="text" 
                      required
                      autoComplete="name"
                      autoCapitalize="words"
                      enterKeyHint="next"
                      placeholder={tModal.namePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-sm font-semibold"
                      value={formData.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => ({ ...prev, name: val }));
                      }}
                    />
                  </div>

                  {/* WhatsApp Mobile Number */}
                  <div className="space-y-1">
                    <label htmlFor="mobile-phone" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone size={12} className="text-vermilion" /> 
                      {tModal.phoneLabel}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-black text-stone-500">
                        🇮🇳 +91
                      </div>
                      <input 
                        id="mobile-phone"
                        type="tel" 
                        inputMode="numeric"
                        autoComplete="tel"
                        enterKeyHint="done"
                        pattern="[0-9]{10}"
                        required
                        placeholder={tModal.phonePlaceholder}
                        className="w-full pl-16 pr-4 py-2.5 rounded-xl border-2 border-stone-200 focus:border-vermilion focus:ring-4 focus:ring-vermilion/10 outline-none transition-all text-sm font-bold tracking-wider"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData(prev => ({ ...prev, phone: val }));
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-stone-400">{tModal.phoneNote}</p>
                  </div>

                  {/* Continue CTA */}
                  <button 
                    type="button"
                    disabled={!formData.name.trim() || formData.phone.length < 10}
                    onClick={() => setStep(2)}
                    className="w-full bg-gradient-to-r from-[#E34234] via-[#D33326] to-[#C92A1C] hover:from-[#C92A1C] hover:to-[#A51D10] text-white py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-red-500/25 touch-manipulation cursor-pointer mt-1"
                  >
                    <span>{tModal.nextBtn}</span>
                    <ChevronRight size={14} />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 max-h-[68vh] overflow-y-auto pr-1 no-scrollbar"
                >
                  {/* Selected Track Pill with Change Option */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider shrink-0">
                        {tModal.selectedCategory}:
                      </span>
                      <span className="text-xs font-black text-stone-800 truncate">
                        {tModal.tracks[formData.track]}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-bold text-vermilion hover:underline ml-2 shrink-0 cursor-pointer"
                    >
                      {tModal.changeCategory}
                    </button>
                  </div>

                  {/* District & Mandal (2 Columns on tablet/desktop) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* District / Location */}
                    <div className="space-y-1">
                      <label htmlFor="location-input" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin size={12} className="text-vermilion" /> 
                        {tModal.locationLabel}
                      </label>
                      <input 
                        id="location-input"
                        type="text"
                        list="district-suggestions"
                        required
                        autoComplete="off"
                        enterKeyHint="next"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            document.getElementById('mandal-input')?.focus();
                          }
                        }}
                        placeholder={tModal.locationPlaceholder}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-semibold bg-white"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      />
                      <datalist id="district-suggestions">
                        {ALL_DISTRICT_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                      </datalist>
                    </div>

                    {/* Mandal / Town */}
                    <div className="space-y-1">
                      <label htmlFor="mandal-input" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Compass size={12} className="text-vermilion" />
                        {tModal.mandalLabel}
                      </label>
                      <input 
                        id="mandal-input"
                        type="text"
                        enterKeyHint="next"
                        placeholder={tModal.mandalPlaceholder}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-semibold"
                        value={formData.mandal}
                        onChange={(e) => setFormData(prev => ({ ...prev, mandal: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Pancha Brahma Lineage / Kula Selector */}
                  <div className="space-y-1">
                    <label htmlFor="lineage-select" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-600" />
                      {tModal.lineageLabel}
                    </label>
                    <select
                      id="lineage-select"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-bold appearance-none bg-white cursor-pointer"
                      value={formData.lineage}
                      onChange={(e) => setFormData(prev => ({ ...prev, lineage: e.target.value }))}
                    >
                      <option value="">{tModal.lineagePlaceholder}</option>
                      {PANCHA_BRAHMA_LINEAGES.map(l => (
                        <option key={l.id} value={l.id}>{l.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* MATRIMONY SPECIFIC FIELDS */}
                  {formData.track === 'matrimony' && (
                    <div className="space-y-2.5 p-2.5 bg-rose-50/50 rounded-xl border border-rose-100">
                      {/* Looking for Alliance */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-rose-900 uppercase tracking-widest flex items-center gap-1.5">
                          <Heart size={12} className="text-rose-500" />
                          {tModal.lookingForLabel}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, matrimonyLookingFor: 'groom' }))}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              formData.matrimonyLookingFor === 'groom'
                                ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20 shadow-sm'
                                : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50'
                            }`}
                          >
                            🤵 {tModal.lookingForGroom}
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, matrimonyLookingFor: 'bride' }))}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              formData.matrimonyLookingFor === 'bride'
                                ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20 shadow-sm'
                                : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50'
                            }`}
                          >
                            👰 {tModal.lookingForBride}
                          </button>
                        </div>
                      </div>

                      {/* Age & Education (2 Columns) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label htmlFor="matrimony-age" className="text-[10px] font-black text-rose-900 uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar size={12} className="text-rose-500" />
                            {tModal.matrimonyAgeLabel}
                          </label>
                          <input 
                            id="matrimony-age"
                            type="number"
                            inputMode="numeric"
                            placeholder={tModal.matrimonyAgePlaceholder}
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none text-xs font-bold bg-white"
                            value={formData.matrimonyAge}
                            onChange={(e) => setFormData(prev => ({ ...prev, matrimonyAge: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="matrimony-edu" className="text-[10px] font-black text-rose-900 uppercase tracking-widest flex items-center gap-1.5">
                            <GraduationCap size={12} className="text-rose-500" />
                            {tModal.matrimonyEduLabel}
                          </label>
                          <select 
                            id="matrimony-edu"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none text-xs font-bold bg-white cursor-pointer"
                            value={formData.matrimonyEducation}
                            onChange={(e) => setFormData(prev => ({ ...prev, matrimonyEducation: e.target.value }))}
                          >
                            <option value="">{tModal.matrimonyEduPlaceholder}</option>
                            {MATRIMONY_EDUCATIONS.map(edu => (
                              <option key={edu} value={edu}>{edu}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Work Location City */}
                      <div className="space-y-1">
                        <label htmlFor="work-city" className="text-[10px] font-black text-rose-900 uppercase tracking-widest flex items-center gap-1.5">
                          <Building2 size={12} className="text-rose-500" />
                          {tModal.workCityLabel}
                        </label>
                        <input 
                          id="work-city"
                          type="text"
                          placeholder={tModal.workCityPlaceholder}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none text-xs font-medium bg-white"
                          value={formData.workCity}
                          onChange={(e) => setFormData(prev => ({ ...prev, workCity: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}

                  {/* ARTISAN SPECIFIC FIELDS */}
                  {formData.track === 'artisan' && (
                    <div className="space-y-2.5">
                      {/* Workshop Type Selector */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                          <Hammer size={12} className="text-vermilion" />
                          {tModal.workshopTypeLabel}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, workshopType: 'own' }))}
                            className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                              formData.workshopType === 'own'
                                ? 'border-vermilion bg-vermilion/5 text-vermilion ring-2 ring-vermilion/20 shadow-sm'
                                : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50'
                            }`}
                          >
                            🏪 {tModal.workshopOwn}
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, workshopType: 'employed' }))}
                            className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                              formData.workshopType === 'employed'
                                ? 'border-vermilion bg-vermilion/5 text-vermilion ring-2 ring-vermilion/20 shadow-sm'
                                : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50'
                            }`}
                          >
                            🛠️ {tModal.workshopEmployed}
                          </button>
                        </div>
                      </div>

                      {/* PM Vishwakarma Scheme Assistance Card */}
                      <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 cursor-pointer hover:bg-amber-100/60 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.pmVishwakarmaInterest}
                          onChange={(e) => setFormData(prev => ({ ...prev, pmVishwakarmaInterest: e.target.checked }))}
                          className="mt-0.5 w-4 h-4 text-vermilion rounded border-stone-300 focus:ring-vermilion cursor-pointer"
                        />
                        <div className="text-left">
                          <p className="text-[11px] font-black text-amber-950 leading-tight">
                            {tModal.pmSchemeTitle}
                          </p>
                          <p className="text-[9px] text-amber-800 leading-snug mt-0.5">
                            {tModal.pmSchemeDesc}
                          </p>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* EKTA YATRA SPECIFIC FIELDS */}
                  {formData.track === 'yatra' && (
                    <div className="space-y-1">
                      <label htmlFor="yatra-seva" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Flag size={12} className="text-amber-600" />
                        {tModal.yatraSevaLabel}
                      </label>
                      <select 
                        id="yatra-seva"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10 outline-none text-xs font-bold appearance-none bg-white cursor-pointer"
                        value={formData.yatraSeva}
                        onChange={(e) => setFormData(prev => ({ ...prev, yatraSeva: e.target.value }))}
                      >
                        {YATRA_SEVA_OPTIONS.map(y => (
                          <option key={y.id} value={y.id}>{y.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* PROFESSIONAL SPECIFIC FIELDS */}
                  {formData.track === 'professional' && (
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label htmlFor="company-input" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                          <Building2 size={12} className="text-blue-600" />
                          {tModal.companyLabel}
                        </label>
                        <input 
                          id="company-input"
                          type="text"
                          placeholder={tModal.companyPlaceholder}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-xs font-semibold"
                          value={formData.company}
                          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        />
                      </div>

                      {/* Youth Mentorship / Referral Toggle */}
                      <label className="flex items-start gap-2.5 p-2 rounded-xl bg-blue-50/60 border border-blue-200/60 cursor-pointer hover:bg-blue-100/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.youthReferralInterest}
                          onChange={(e) => setFormData(prev => ({ ...prev, youthReferralInterest: e.target.checked }))}
                          className="mt-0.5 w-4 h-4 text-blue-600 rounded border-stone-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-[10px] font-bold text-blue-950 leading-tight">
                          {tModal.youthReferralLabel}
                        </span>
                      </label>
                    </div>
                  )}

                  {/* MENTOR SPECIFIC FIELDS */}
                  {formData.track === 'mentor' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Award size={12} className="text-purple-600" />
                        {tModal.mentorModeLabel}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, mentorMode: 'webinar' }))}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            formData.mentorMode === 'webinar'
                              ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-600/20 shadow-sm'
                              : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50'
                          }`}
                        >
                          💻 {tModal.mentorModeWebinar}
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, mentorMode: 'one_on_one' }))}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            formData.mentorMode === 'one_on_one'
                              ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-600/20 shadow-sm'
                              : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50'
                          }`}
                        >
                          🤝 {tModal.mentorMode1on1}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PATRON SPECIFIC FIELDS */}
                  {formData.track === 'patron' && (
                    <div className="space-y-1">
                      <label htmlFor="patron-interest" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles size={12} className="text-emerald-600" />
                        {tModal.patronInterestLabel}
                      </label>
                      <select 
                        id="patron-interest"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none text-xs font-bold appearance-none bg-white cursor-pointer"
                        value={formData.patronInterest}
                        onChange={(e) => setFormData(prev => ({ ...prev, patronInterest: e.target.value }))}
                      >
                        {PATRON_INTEREST_OPTIONS.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Dynamic detail input based on track */}
                  <div className="space-y-1">
                    <label htmlFor="detail-input" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase size={12} className="text-vermilion" /> 
                      {formData.track === 'artisan'
                        ? tModal.craftLabelArtisan
                        : formData.track === 'matrimony'
                          ? tModal.craftLabelMatrimony
                          : formData.track === 'mentor'
                            ? tModal.craftLabelMentor
                            : formData.track === 'professional'
                              ? tModal.craftLabelProfessional
                              : formData.track === 'yatra'
                                ? tModal.craftLabelYatra
                                : tModal.craftLabelPatron}
                    </label>

                    {formData.track === 'artisan' ? (
                      <select 
                        id="detail-input"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-bold appearance-none bg-white cursor-pointer"
                        value={formData.tradeOrDetail}
                        onChange={(e) => setFormData(prev => ({ ...prev, tradeOrDetail: e.target.value }))}
                      >
                        <option value="">{tModal.craftPlaceholderArtisan}</option>
                        {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    ) : (
                      <input 
                        id="detail-input"
                        type="text" 
                        required={formData.track === 'professional' || formData.track === 'matrimony'}
                        autoComplete="off"
                        enterKeyHint="done"
                        placeholder={
                          formData.track === 'matrimony'
                            ? tModal.craftPlaceholderMatrimony
                            : formData.track === 'mentor'
                              ? tModal.craftPlaceholderMentor
                              : formData.track === 'professional'
                                ? tModal.craftPlaceholderProfessional
                                : formData.track === 'yatra'
                                  ? tModal.craftPlaceholderYatra
                                  : tModal.craftLabelPatron
                        }
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-medium"
                        value={formData.tradeOrDetail}
                        onChange={(e) => setFormData(prev => ({ ...prev, tradeOrDetail: e.target.value }))}
                      />
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2.5 pt-1.5 sticky bottom-0 bg-white/95 backdrop-blur-sm py-1">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 touch-manipulation cursor-pointer flex items-center gap-1"
                      aria-label={tModal.backBtn}
                    >
                      <ArrowLeft size={16} />
                      <span>{tModal.backBtn}</span>
                    </button>
                    <button 
                      type="submit"
                      disabled={loading || !formData.location.trim() || (formData.track === 'artisan' && !formData.tradeOrDetail)}
                      className="flex-1 bg-gradient-to-r from-vermilion via-amber-600 to-amber-700 text-white py-2.5 rounded-xl font-black text-xs hover:opacity-95 transition-all shadow-lg shadow-vermilion/20 active:scale-[0.98] touch-manipulation disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? tModal.submitting : tModal.submitBtn}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      )}
    </BaseModal>
  );
}
