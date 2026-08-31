export interface Donor {
  id: string; // URL slug, e.g. "dr-harikanth"
  name: string;
  avatar: string; // Saved headshot/couple/group portrait path
  tier: 'patron' | 'gold' | 'silver' | 'honorary';
  amount: number;
  formattedAmount: string;
  location: string;
  role: string;
  joinDate: string;
  description: string; // Custom description detailing their role/contribution
  quote: Record<string, string>; // Multilingual quote (en, te, hi)
}

export const mockDonors: Donor[] = [
  {
    id: 'dr-harikanth',
    name: 'Dr. Harikanth',
    avatar: '/images/donors/dr-harikanth-donor.jpg',
    tier: 'patron',
    amount: 300000,
    formattedAmount: '₹3,00,000',
    location: 'Hyderabad, Telangana',
    role: 'Doctor & Legacy Patron',
    joinDate: 'July 2026',
    description: 'Contributed ₹3,00,000 to support conducting community events, cultural celebrations, and heritage workshops.',
    quote: {
      en: 'Supporting traditional artisans is the most sustainable way to keep our legacy alive. Digital mapping is a massive step forward.',
      te: 'సాంప్రదాయ కళాకారులకు మద్దతు ఇవ్వడం మన వారసత్వాన్ని కాపాడటానికి అత్యంత ప్రభావవంతమైన మార్గం. డిజిటల్ మ్యాపింగ్ దీనికి ఒక పెద్ద ముందడుగు.',
      hi: 'पारंपरिक शिल्पकारों का समर्थन करना हमारी विरासत को जीवित रखने का सबसे स्थायी तरीका है। डिजिटल मैपिंग एक बड़ा कदम है।'
    }
  },
  {
    id: 'smt-geetha-rani-sudhakar-chary',
    name: 'Smt. Geetha Rani & Sri Sudhakar Chary',
    avatar: '/images/donors/geetha-rani-sudhakar-chary-donor.jpg',
    tier: 'gold',
    amount: 100000,
    formattedAmount: '₹1,00,000',
    location: 'Nawabpet, Telangana',
    role: 'Sarpanch of Nawabpet',
    joinDate: 'August 2026',
    description: 'Donated ₹1,00,000 to empower traditional master craftsmen and fund skill development.',
    quote: {
      en: 'Empowering our local village craftsmen and promoting rural heritage is our core mission as community leaders.',
      te: 'గ్రామీణ ప్రాంతాల కళాకారులను ప్రోత్సహించడం మరియు గ్రామీణ వారసత్వాన్ని కాపాడటం ప్రజా ప్రతినిధులుగా మా ప్రధాన లక్ష్యం.',
      hi: 'हमारे स्थानीय ग्रामीण शिल्पकारों को सशक्त बनाना और ग्रामीण विरासत को बढ़ावा देना एक जन प्रतिनिधि के रूप में हमारा मुख्य मिशन है।'
    }
  },
  {
    id: 'smt-vishwaika-vishwaroopachary',
    name: 'Smt. Vishwaika & Sri Vishwaroopa Chary',
    avatar: '/images/donors/vishwaika-vishwaroopachary-donor.jpg',
    tier: 'silver',
    amount: 50000,
    formattedAmount: '₹50,000',
    location: 'Hyderabad, Telangana',
    role: 'Poet, Writer & Anchor',
    joinDate: 'September 2026',
    description: 'Donated ₹50,000 to empower traditional master craftsmen and fund skill development.',
    quote: {
      en: 'Art, literature, and sculpture are the threads that bind the history of our great community together. VKC is building the digital bridge.',
      te: 'కళ, సాహిత్యం మరియు శిల్పకళ మన గొప్ప కమ్యూనిటీ చరిత్రను ఒకదానితో ఒకటి బంధించే దారాలు. VKC దీనికి ఒక డిజిటల్ వంతెనను నిర్మిస్తోంది.',
      hi: 'कला, साहित्य और मूर्तिकला वे धागे हैं जो हमारे महान समुदाय के इतिहास को एक साथ बांधते हैं। वीकेसी इसके लिए डिजिटल पुल का निर्माण कर रहा है।'
    }
  },
  {
    id: 'sriramoju-chandramouli-chary',
    name: 'Sriramoju Chandramouli Chary',
    avatar: '/images/donors/sriramoju-chandramouli-chary-donor.jpg',
    tier: 'silver',
    amount: 50000,
    formattedAmount: '₹50,000',
    location: 'Telangana',
    role: 'Sarpanch & Social Activist',
    joinDate: 'October 2026',
    description: 'Donated ₹50,000 to empower traditional master craftsmen and fund skill development.',
    quote: {
      en: 'Serving the community and supporting the digital sovereignty of our traditional artisan clans is the greatest form of public service.',
      te: 'కమ్యూనిటీకి సేవ చేయడం మరియు మన సాంప్రదాయ కళాకారుల డిజిటల్ సార్వభౌమత్వానికి మద్దతు ఇవ్వడం అత్యంత గొప్ప ప్రజా సేవ.',
      hi: 'समाज की सेवा करना और हमारे पारंपरिक शिल्पकार परिवारों की डिजिटल संप्रभुता का समर्थन करना सार्वजनिक सेवा का सबसे बड़ा रूप है।'
    }
  },
  {
    id: 'brahmasri-omprakash-kothuru',
    name: 'Brahmasri Omprakash Garu (బ్రహ్మశ్రీ ఓంప్రకాష్ గారు)',
    avatar: '/images/donors/omprakash-kothuru-donor.jpg',
    tier: 'silver',
    amount: 50000,
    formattedAmount: '₹50,000',
    location: 'Kothur, Telangana (కొత్తూరు)',
    role: 'Community Sponsor & Patron, Kothur',
    joinDate: 'October 2026',
    description: 'Contributed ₹50,000 to support traditional artisans, skill development, and community welfare initiatives.',
    quote: {
      en: 'Supporting our Vishwakarma community and preserving our sacred artisan legacy is our duty. VKC is building a powerful future for all of us.',
      te: 'మన విశ్వకర్మ సమాజాన్ని ఆదుకోవడం మరియు మన సాంప్రదాయ కళా వారసత్వాన్ని ప్రోత్సహించడం మన కర్తవ్యం. వికెసి మన సంఘానికి గొప్ప భవిష్యత్తును నిర్మిస్తోంది.',
      hi: 'हमारे विश्वकर्मा समाज का सहयोग करना और हमारी पारंपरिक शिल्प विरासत को बढ़ावा देना हमारा परम कर्तव्य है। वीकेसी हमारे लिए उज्ज्वल भविष्य का निर्माण कर रहा है।'
    }
  },
  {
    id: 'sirikonda-madhusudhana',
    name: 'Brahmasri Sirikonda Madhusudhana Chary',
    avatar: '/images/donors/sirikonda-madhusudhana-supporter.jpg',
    tier: 'honorary',
    amount: 0,
    formattedAmount: 'Patronage',
    location: 'Warangal, Telangana',
    role: '1st Speaker of Telangana Legislative Assembly, Member of Legislative Council & Leader of the Opposition, Telangana',
    joinDate: 'October 2026',
    description: 'Offering governance leadership, legislative guidance, and advocacy to support traditional artisan socio-economic welfare.',
    quote: {
      en: 'Preserving our cultural roots and enabling digital transformation for our traditional artisan clans is key to achieving social and economic justice.',
      te: 'మన సాంస్కృతిక మూలాలను పరిరక్షించడం మరియు మన సాంప్రదాయ కళాకారుల కమ్యూనిటీల కోసం డిజిటల్ పరివర్తనను సాధించడం సామాజిక, ఆర్థిక న్యాయానికి కీలకం.',
      hi: 'हमारी सांस्कृतिक जड़ों को संरक्षित करना और हमारे पारंपरिक शिल्पकार परिवारों के लिए डिजिटल परिवर्तन को सक्षम करना सामाजिक और आर्थिक न्याय प्राप्त करने की कुंजी है।'
    }
  },
  {
    id: 'dasoju-sravan',
    name: 'Dr. Dasoju Sravan',
    avatar: '/images/donors/dasoju-sravan-supporter.jpg',
    tier: 'honorary',
    amount: 0,
    formattedAmount: 'Patronage',
    location: 'Hyderabad, Telangana',
    role: 'Member of Legislative Council (MLC), Telangana',
    joinDate: 'November 2026',
    description: 'Providing strategic community advocacy, educational policy advice, and legislative leadership for artisan empowerment.',
    quote: {
      en: 'Vedic architectural knowledge and structural sciences must be archived and promoted globally to empower the modern generation of artisans.',
      te: 'ఆధునిక శిల్పకారుల తరానికి ప్రాతినిధ్యం వహించడానికి వైదిక వాస్తుశాస్త్ర జ్ఞానాన్ని మరియు నిర్మాణ శాస్త్రాలను భద్రపరిచి, ప్రపంచవ్యాప్తంగా ప్రచారం చేయాలి.',
      hi: 'शिल्पकारों की आधुनिक पीढ़ी को सशक्त बनाने के लिए वैदिक वास्तुकला ज्ञान और संरचनात्मक विज्ञान को दुनिया भर में संग्रहीत और बढ़ावा दिया जाना चाहिए।'
    }
  },
  {
    id: 'talloju-achary',
    name: 'Brahmasri Talloju Achary',
    avatar: '/images/donors/talloju-achary-supporter.jpg',
    tier: 'honorary',
    amount: 0,
    formattedAmount: 'Patronage',
    location: 'Hyderabad, Telangana',
    role: 'Ex-Member of National BC Commission',
    joinDate: 'October 2026',
    description: 'Providing commission advocacy, welfare guidance, and social justice leadership for backward classes and artisan clans.',
    quote: {
      en: 'Empowering backward classes and traditional artisans with modern education and digital skills is crucial for true social equity.',
      te: 'వెనుకబడిన తరగతులు మరియు సాంప్రదాయ కళాకారులను ఆధునిక విద్య, డిజిటల్ నైపుణ్యాలతో బలోపేతం చేయడం నిజమైన సామాజిక సమానత్వానికి కీలకం.',
      hi: 'पिछड़े वर्गों और पारंपरिक शिल्पकारों को आधुनिक शिक्षा और डिजिटल कौशल से सशक्त बनाना वास्तविक सामाजिक समानता के लिए महत्वपूर्ण है।'
    }
  },
  {
    id: 'e-venkatachary',
    name: 'Brahmasri Edukoju VenkataChary',
    avatar: '/images/donors/e-venkatachary-collector.jpg',
    tier: 'honorary',
    amount: 0,
    formattedAmount: 'Patronage',
    location: 'Vikarabad, Telangana',
    role: 'Addl. Collector, Vikarabad District',
    joinDate: 'September 2026',
    description: 'Offering administrative expertise, public policy guidance, and district welfare coordination to empower local artisans.',
    quote: {
      en: 'Promoting digital equity and welfare programs for our traditional artisan communities is a vital step toward sustainable rural development.',
      te: 'మన సాంప్రదాయ కళాకారుల కమ్యూనిటీల కోసం డిజిటల్ ఈక్విటీని మరియు సంక్షేమ పథకాలను పెంపొందించడం స్థిరమైన గ్రామీణాభివృద్ధికి ఒక ముఖ్యమైన అడుగు.',
      hi: 'हमारे पारंपरिक शिल्पकार समुदायों के लिए डिजिटल समानता और कल्याणकारी कार्यक्रमों को बढ़ावा देना सतत ग्रामीण विकास की दिशा में एक महत्वपूर्ण कदम है।'
    }
  },
  {
    id: 'brahmasri-kammaripalli-mallikharjuna-kiran-kumar',
    name: 'Brahmasri Kammaripalli Mallikharjuna Kiran Kumar',
    avatar: '/images/donors/brahmasri-kammaripalli-mallikharjuna-kiran-kumar.jpg',
    tier: 'honorary',
    amount: 0,
    formattedAmount: 'Patronage',
    location: 'CCS, Hyderabad, Telangana',
    role: 'Asst Commissioner of Police, Economical offences wing',
    joinDate: 'August 2026',
    description: 'Providing executive police leadership, economic security advice, and youth community development guidance.',
    quote: {
      en: 'Preserving our community’s traditional engineering and craft legacies is key to securing our economic and cultural future.',
      te: 'మన సాంప్రదాయ ఇంజనీరింగ్ మరియు శిల్పకళా వారసత్వాలను పరిరక్షించడం మన ఆర్థిక మరియు సాంస్కృతిక భవిష్యత్తుకు భద్రత చేకూరుస్తుంది.',
      hi: 'हमारे समुदाय के पारंपरिक इंजीनियरिंग और शिल्प कौशल की विरासत को संरक्षित करना हमारे आर्थिक और सांस्कृतिक भविष्य को सुरक्षित करने की कुंजी है।'
    }
  },
  {
    id: 'bibinagar-anuradha',
    name: 'Smt. Bibinagar Anuradha',
    avatar: '/images/donors/bibinagar-anuradha-supporter.jpg',
    tier: 'honorary',
    amount: 0,
    formattedAmount: 'Patronage',
    location: 'Bibinagar, Telangana',
    role: 'Senior BJP Leader & Social Activist',
    joinDate: 'December 2026',
    description: 'Providing grass-root political leadership, social empowerment coordination, and advocacy for rural women artisans.',
    quote: {
      en: 'Supporting the listing of rural women artisans in the digital directory is critical to achieving grass-root financial independence.',
      te: 'గ్రామీణ మహిళా కళాకారులను డిజిటల్ డైరెక్టరీలో నమోదు చేయడం ద్వారా వారి గ్రామీణ ఆర్థిక స్వాతంత్ర్యానికి బలమైన పునాది లభిస్తుంది.',
      hi: 'डिजिटल निर्देशिका में ग्रामीण महिला शिल्पकारों को सूचीबद्ध करने का समर्थन करना जमीनी स्तर पर वित्तीय स्वतंत्रता प्राप्त करने के लिए महत्वपूर्ण है।'
    }
  }
];
