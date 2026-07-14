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
    quote: {
      en: 'Serving the community and supporting the digital sovereignty of our traditional artisan clans is the greatest form of public service.',
      te: 'కమ్యూనిటీకి సేవ చేయడం మరియు మన సాంప్రదాయ కళాకారుల డిజిటల్ సార్వభౌమత్వానికి మద్దతు ఇవ్వడం అత్యంత గొప్ప ప్రజా సేవ.',
      hi: 'समाज की सेवा करना और हमारे पारंपरिक शिल्पकार परिवारों की डिजिटल संप्रभुता का समर्थन करना सार्वजनिक सेवा का सबसे बड़ा रूप है।'
    }
  },
  {
    id: 'acp-supporter',
    name: 'Sri M. Ravi Kumar (ACP)',
    avatar: '/images/donors/acp-supporter.jpg',
    tier: 'honorary',
    amount: 0,
    formattedAmount: 'Patronage',
    location: 'Nawabpet, Telangana',
    role: 'Assistant Commissioner of Police (ACP)',
    joinDate: 'August 2026',
    quote: {
      en: 'Law enforcement and public administration are proud to support the preservation of our cultural roots and digital artisan directories.',
      te: 'మన సాంస్కృతిక మూలాలను మరియు డిజిటల్ కళాకారుల డైరెక్టరీలను పరిరక్షించడంలో శాంతిభద్రతల విభాగం మరియు ప్రజా పరిపాలన గర్వంగా భాగస్వామ్యం వహిస్తున్నాయి.',
      hi: 'कानून प्रवर्तन और सार्वजनिक प्रशासन हमारे सांस्कृतिक मूल और डिजिटल शिल्पकार निर्देशिकाओं के संरक्षण का समर्थन करने में गर्व महसूस करते हैं।'
    }
  },
  {
    id: 'sub-collector-supporter',
    name: 'Smt. K. Shailaja, IAS',
    avatar: '/images/donors/sub-collector-supporter.jpg',
    tier: 'honorary',
    amount: 0,
    formattedAmount: 'Patronage',
    location: 'Vikarabad, Telangana',
    role: 'Sub-Collector & Civil Servant',
    joinDate: 'September 2026',
    quote: {
      en: 'Ensuring government welfare reach and digital empowerment for our traditional heritage artisans is our administrative commitment.',
      te: 'మన సాంప్రదాయ వారసత్వ కళాకారులకు ప్రభుత్వ సంక్షేమ పథకాలను మరియు డిజిటల్ సాధికారతను చేరవేయడం మా పరిపాలనా నిబద్ధత.',
      hi: 'हमारे पारंपरिक विरासत शिल्पकारों के लिए सरकारी कल्याणकारी पहुंच और डिजिटल सशक्तिकरण सुनिश्चित करना हमारी प्रशासनिक प्रतिबद्धता है।'
    }
  }
];
