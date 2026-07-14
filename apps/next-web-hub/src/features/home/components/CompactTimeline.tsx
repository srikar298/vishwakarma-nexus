"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  ArrowRight, 
  Calendar, 
  Trophy, 
  Compass, 
  Flame, 
  Heart, 
  Users
} from 'lucide-react';

interface TimelineEvent {
  date: string;
  year: string;
  te: string;
  en: string;
  hi: string;
  category: 'organization' | 'awards' | 'protest' | 'charity' | 'campaign' | 'movement';
}

export const CompactTimeline: React.FC = () => {
  const { i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';
  const [activeYear, setActiveYear] = useState<string>('2026');
  const [limit, setLimit] = useState<number>(3);

  const years = ['2017', '2018', '2019', '2020', '2023', '2024', '2025', '2026'];

  const timelineEvents: TimelineEvent[] = [
  {
      date: "25.02.2017",
      year: "2017",
      te: "శ్రీ వీరబ్రహ్మేంద్ర స్వామి నుండి మారోజు వీరన్న వరకు గల తాత్విక భూమికను అనుసరిస్తూ విశ్వకర్మ నాలెడ్జ్ సెంటర్ (VKC) ఏర్పాటు.",
      en: "Establishment of Vishwakarma Knowledge Centre (VKC) following the philosophical foundation from Sri Veerabrahmendra Swami to Maroju Veeranna.",
hi: "श्री वीरब्रहमेन्द्र स्वामी से मारोजू वीरन्ना तक के दार्शनिक आधार का अनुसरण करते हुए विश्वकर्मा नॉलेज सेंटर (VKC) की स्थापना।",
      category: "organization"
    },
{
      date: "16.05.2017",
      year: "2017",
      te: "10వ తరగతిలో ఉత్తమ ప్రతిభతో 9+ GPA సాధించిన విశ్వకర్మ విద్యార్థిని విద్యార్థులకు 'అభినందన సభ' నాగోల్ విశ్వకర్మ భవన్ లో.",
      en: "'Abhinandana Sabha' felicitation event for Vishwakarma students securing 10th class GPA of 9+ at Nagole Vishwakarma Bhavan.",
hi: "नागोल विश्वकर्मा भवन में 10वीं कक्षा में 9+ GPA प्राप्त करने वाले विश्वकर्मा छात्रों के लिए 'अभिनंदन सभा' सम्मान समारोह।",
      category: "awards"
    },
{
      date: "17.06.2017",
      year: "2017",
      te: "విశ్వకర్మ లెజెండరీ అవార్డ్స్-2018 ప్రకటన విడుదల.",
      en: "Official release of the Vishwakarma Legendary Awards 2018 announcement.",
hi: "विश्वकर्मा लेजेंडरी अवार्ड्स-2018 की घोषणा का आधिकारिक विमोचन।",
      category: "awards"
    },
{
      date: "23.06.2017",
      year: "2017",
      te: "బ్యాంకులు చేసిన మోసానికి బలైన పెండ్యాల మొహనాచారి, సరిత రైతు దంపతుల ఆత్మహత్యపై పరిహారం కోసం పోరాటం.",
      en: "Struggle for justice and compensation for the family of farmer couple Pendyala Mohanachari & Saritha after their bank-fraud induced suicide.",
hi: "बैंक धोखाधड़ी के कारण आत्महत्या करने वाले किसान दंपति पेंड्याला मोहनाचारी और सरिता के परिवार के लिए मुआवजे की मांग को लेकर संघर्ष।",
      category: "protest"
    },
{
      date: "26.07.2017",
      year: "2017",
      te: "ఆకలి చావుకు గురైన రైతు కూలీ శ్రీమతి రామోజు నాగమణి గారి కుటుంబానికి అండగా నిలిచి ఆర్థిక విరాళాల అందజేత.",
      en: "Financial aid and support collected and presented to the family of deceased farm laborer Ramoju Nagamani.",
hi: "भूख से मरने वाली खेत मजदूर श्रीमती रामोजू नागमणि के परिवार के लिए वित्तीय सहायता जुटाकर उन्हें प्रदान की गई।",
      category: "charity"
    },
{
      date: "31.07.2017",
      year: "2017",
      te: "విశ్వకర్మలలోని అపార ప్రతిభావంతులైన, నిష్ణాతులైన వ్యక్తుల్ని వెతుకుతూ కర్నూల్ నుండి ప్రయాణం ప్రారంభం.",
      en: "Began journey from Kurnool, AP, to identify and document highly skilled and talented Vishwakarma personalities.",
hi: "आंध्र प्रदेश के कर्नूल से अत्यधिक कुशल और प्रतिभाशाली विश्वकर्मा हस्तियों की खोज और दस्तावेजीकरण की यात्रा शुरू।",
      category: "campaign"
    },
{
      date: "08.08.2017",
      year: "2017",
      te: "శ్రీ బంగారు బాబు గారితో కలిసి అద్దంకి నుండి కర్ణాటక, బెంగళూరు వరకు కళాకారుల వెలికితీత ప్రయాణం విస్తరణ.",
      en: "Extended talent search journey from Addanki, AP, alongside Sri Bangaru Babu up to Bangalore, Karnataka.",
hi: "श्री बंगारू बाबू के साथ आंध्र प्रदेश के अड्डंकी से कर्नाटक के बेंगलुरु तक प्रतिभा खोज यात्रा का विस्तार।",
      category: "campaign"
    },
{
      date: "14.08.2017",
      year: "2017",
      te: "'వెలిప్రేమ' పేరుతో శ్రీ ఈశ్వరిదేవి పై tv9లో తప్పుడు కథనం ప్రసారానికి వ్యతిరేకంగా వనస్థలిపురంలో పిర్యాదుతో ఉద్యమం ప్రారంభం.",
      en: "Launched the Eshwari Devi movement, filing a police complaint at Vanasthalipuram against a misleading TV9 broadcast titled 'Veliprema'.",
hi: "टीवी9 द्वारा प्रसारित भ्रामक कार्यक्रम 'वेलीप्रेमा' के खिलाफ वनस्थलीपुरम पुलिस स्टेशन में शिकायत दर्ज कर 'ईश्वरी देवी' आंदोलन की शुरुआत।",
      category: "movement"
    },
{
      date: "16.08.2017",
      year: "2017",
      te: "ఈశ్వరిదేవి పై ప్రసారం చేసిన తప్పుడు కథనాన్ని వెనక్కి తీసుకోవాలంటూ tv9 ముట్టడి.",
      en: "Led protests at the TV9 office demanding retraction of the false broadcast on Sri Eshwari Devi.",
hi: "श्री ईश्वरी देवी पर प्रसारित झूठी खबर को वापस लेने की मांग को लेकर विभिन्न संगठनों के साथ मिलकर टीवी9 कार्यालय का घेराव।",
      category: "movement"
    },
{
      date: "18.08.2017",
      year: "2017",
      te: "tv9 పై న్యాయపోరాటం కోసం విశ్వకర్మ మేధావులు, విద్యావంతులతో అత్యవర సమావేశం.",
      en: "Held an emergency meeting with Vishwakarma intellectuals and educators to coordinate a legal battle against TV9.",
hi: "टीवी9 के खिलाफ कानूनी लड़ाई के लिए विश्वकर्मा बुद्धिजीवियों और शिक्षाविदों के साथ आपातकालीन बैठक।",
      category: "movement"
    },
{
      date: "23.08.2017",
      year: "2017",
      te: "శ్రీ ఈశ్వరి దేవి చరిత్రను అందరూ సమగ్రంగా తెలుసుకునేందుకు తాత్విక సదస్సు ఏర్పాటు.",
      en: "Organized a Philosophical Seminar to present and preserve the authentic history of Sri Eshwari Devi.",
hi: "श्री ईश्वरी देवी के वास्तविक इतिहास को उजागर और संरक्षित करने के लिए विचार संगोष्ठी का आयोजन।",
      category: "movement"
    },
{
      date: "28.08.2017",
      year: "2017",
      te: "బ్రహ్మంగారి మఠంలో 'వెలిప్రేమ'పై ఆత్మగౌరవ దీక్ష; ఆంధ్రా, తెలంగాణ రాష్ట్ర కన్వీనర్ల నియామకం. (వివరణ: మొత్తం శ్రీ ఈశ్వరిదేవి మూమెంట్ లో విశ్వనాథుల పుష్పగిరి గారు ప్రధాన భూమిక పోషించారు).",
      en: "Organized the Self-Respect Deeksha at Brahmamgari Matham, appointing AP & Telangana state coordinators. (Note: Viswanadhula Pushpagiri played the leading role in the entire Sri Eshwari Devi movement).",
hi: "ब्रह्ममगारी मठ में 'वेलीप्रेमा' के विरोध में आत्मसम्मान दीक्षा का आयोजन और आंध्र प्रदेश व तेलंगाना के संयोजकों की नियुक्ति। (नोट: श्री विश्वनाथुला पुष्पगिरी ने ईश्वरी देवी आंदोलन में मुख्य भूमिका निभाई)।",
      category: "movement"
    },
{
      date: "27.05.2018",
      year: "2018",
      te: "సుందరయ్య విజ్ఞాన కేంద్రంలో 'విశ్వకర్మ లెజెండరీ అవార్డ్స్-2018' నిర్వహణ; 6 రాష్ట్రాల నుండి ప్రతినిధుల హాజరు మరియు 101 మంది ప్రముఖులకు పురస్కారాలు.",
      en: "Hosted the grand 'Vishwakarma Legendary Awards 2018' at Sundarayya Vignana Kendram, welcoming delegates from 6 states and honoring 101 figures.",
hi: "सुंदरैया विज्ञान केंद्र में 'विश्वकर्मा लेजेंडरी अवार्ड्स 2018' का भव्य आयोजन, जिसमें 6 राज्यों के प्रतिनिधियों ने भाग लिया और 101 हस्तियों को सम्मानित किया गया।",
      category: "awards"
    },
{
      date: "16.12.2018",
      year: "2018",
      te: "కర్నూల్ జిల్లా అధ్యక్షులుగా డా. వీరబ్రహ్మయ్య, ప్రకాశం జిల్లా అధ్యక్షులుగా అల్లూరి హరిబాబుల నియామకం.",
      en: "Appointed Dr. Veerabrahmaiah as Kurnool District President and Sri Alluri Haribabu as Prakasam District President.",
hi: "डॉ. वीरब्रह्मैया को कर्नूल जिला अध्यक्ष और श्री अल्लूरी हरिबाबू को प्रकाशम जिला अध्यक्ष नियुक्त किया गया।",
      category: "organization"
    },
{
      date: "01.03.2019",
      year: "2019",
      te: "VKC తెలంగాణ రాష్ట్ర కమిటీ విస్తరణ మరియు వివిధ జిల్లాలకు బాధ్యుల ఏర్పాటు.",
      en: "Expanded the VKC Telangana State Committee, assigning new district leadership responsibilities.",
hi: "VKC तेलंगाना राज्य समिति का विस्तार और विभिन्न जिलों के लिए नए पदाधिकारियों की नियुक्ति।",
      category: "organization"
    },
{
      date: "03.03.2019",
      year: "2019",
      te: "ఉస్మానియా యూనివర్సిటీలో విశ్వకర్మ విద్యార్థుల సమ్మేళనం.",
      en: "Conducted a summit of Vishwakarma student unions at Osmania University.",
hi: "उस्मानिया विश्वविद्यालय में विश्वकर्मा छात्र संघों का महासम्मेलन।",
      category: "organization"
    },
{
      date: "18.03.2019",
      year: "2019",
      te: "విశ్వకర్మ లెజెండరీ అవార్డ్స్-2019 కోసం దరఖాస్తుల ఆహ్వానం.",
      en: "Invited applications and nominations for the Vishwakarma Legendary Awards 2019.",
hi: "विश्वकर्मा लेजेंडरी अवार्ड्स-2019 के लिए नामांकन और आवेदन आमंत्रित करने की घोषणा।",
      category: "awards"
    },
{
      date: "22.03.2019",
      year: "2019",
      te: "కర్ణాటక చికబల్లాపూర్ లో VKC కర్ణాటక శాఖ ప్రారంభం; కన్వీనర్ గా శ్రీ శ్రీనివాస్ ఆచారి నియామకం.",
      en: "Launched the VKC Karnataka Chapter at Chikkaballapur, appointing Srinivas Achari as coordinator.",
hi: "कर्नाटक के चिक्काबल्लापुर में VKC कर्नाटक शाखा का शुभारंभ और श्रीनिवास आचारी को संयोजक नियुक्त किया गया।",
      category: "organization"
    },
{
      date: "21.04.2019",
      year: "2019",
      te: "అమరావతి మంగళగిరి విశ్వకర్మ భవనంలో శ్రీ రంగోజు నాగరాజు శర్మ గారి ఆధ్వర్యంలో ఆంధ్రప్రదేశ్ రాష్ట్ర కమిటీ విస్తరణ సమావేశం; అధ్యక్షురాలిగా ప్రముఖ శిల్పి శ్రీమతి భువనేశ్వరి నియామకం (ప్రస్తుతం వ్యక్తిగత కారణాల వల్ల వైదొలిగారు).",
      en: "Expanded the AP State Committee at Mangalagiri, AP under the guidance of Rangoju Nagaraju Sharma, appointing renowned sculptor Smt. Bhuvaneshwari as President (currently stepped down due to personal reasons).",
hi: "मंगलगिरी में श्री रंगोजू नागराजू शर्मा के मार्गदर्शन में आंध्र प्रदेश राज्य समिति का विस्तार, जिसमें प्रसिद्ध मूर्तिकार श्रीमती भुवनेश्वरी को अध्यक्ष नियुक्त किया गया (वर्तमान में व्यक्तिगत व्यस्तताओं के कारण सेवामुक्त)।",
      category: "organization"
    },
{
      date: "04.05.2019",
      year: "2019",
      te: "రాజస్థాన్ విశ్వకర్మ భవన్ లో రాజస్థాన్ విశ్వకర్మ కమ్యూనిటీ పయనీర్స్ గెట్ టూ గెదర్ మీటింగ్.",
      en: "Organized the Rajasthan Vishwakarma Pioneers Get-Together at Rajasthan Vishwakarma Bhavan.",
hi: "राजस्थान विश्वकर्मा भवन में राजस्थान विश्वकर्मा अग्रणी अग्रदूतों की बैठक का आयोजन।",
      category: "organization"
    },
{
      date: "25.05.2019",
      year: "2019",
      te: "సోమాజిగూడా ప్రెస్ క్లబ్ లో విశ్వకర్మ లెజెండరీ అవార్డ్స్ పోస్టర్ మరియు ఆహ్వాన పత్రిక ఆవిష్కరణ.",
      en: "Held a press meet at Somajiguda Press Club to release the Legendary Awards poster and invitation.",
hi: "सोमाजीगुड़ा प्रेस क्लब में लेजेंडरी अवार्ड्स के पोस्टर और आमंत्रण पत्र का प्रेस विमोचन।",
      category: "awards"
    },
{
      date: "30.05.2019",
      year: "2019",
      te: "రవీంద్రభారతిలో ఇంటర్నేషనల్ విశ్వకర్మ కాన్ఫిరెన్స్ మరియు విశ్వకర్మ లెజెండరీ అవార్డ్స్-2019 అత్యంత వైభవంగా నిర్వహణ.",
      en: "Hosted the International Vishwakarma Conference and Legendary Awards 2019 at Ravindra Bharathi, celebrating VKC's 2nd Anniversary.",
hi: "रवींद्र भारती में विश्वकर्मा नॉलेज सेंटर की दूसरी वर्षगांठ के उपलक्ष्य में अंतर्राष्ट्रीय विश्वकर्मा सम्मेलन और लेजेंडरी अवार्ड्स-2019 का भव्य आयोजन।",
      category: "awards"
    },
{
      date: "10.06.2019",
      year: "2019",
      te: "కార్యక్రమ విజయవంతానికి తోడ్పడిన వారికి 'VKC BRIGADE' తరపున ధన్యవాద సత్కార సభ.",
      en: "Hosted a thank-you felicitation ceremony for 'VKC BRIGADE' volunteers and contributors.",
hi: "वर्षगांठ समारोह को सफल बनाने वाले 'VKC ब्रिगेड' के स्वयंसेवकों और सहयोगियों के लिए धन्यवाद और सम्मान समारोह का आयोजन।",
      category: "organization"
    },
{
      date: "11.06.2019",
      year: "2019",
      te: "వయోభారంతో రాలేకపోయిన బ్రహ్మశ్రీ చెర్వుగట్టు రామాచార్యుల వారిని పెనుమాకలో కలిసి అవార్డు అందజేత.",
      en: "Visited Brahmasri Chervugattu Ramacharyulu at his residence in Penumaka, AP, to present his Legendary Award.",
hi: "उम्र संबंधी अस्वस्थता के कारण समारोह में न आ पाने वाले ब्रह्मश्री चेर्वुगट्टू रामाचार्युलु से उनके पेनुमाका स्थित आवास पर मिलकर सम्मान प्रदान किया गया।",
      category: "awards"
    },
{
      date: "01.07.2019",
      year: "2019",
      te: "తెలంగాణ రాష్ట్ర కమిటీ అధ్యక్షులుగా శ్రీ గుగ్గిళ్ల వేణు నియామకం.",
      en: "Appointed Sri Guggilla Venu as the VKC Telangana State Committee President.",
hi: "श्री गुग्गिला वेणु को VKC तेलंगाना राज्य समिति का अध्यक्ष नियुक्त किया गया।",
      category: "organization"
    },
{
      date: "08.07.2019",
      year: "2019",
      te: "బీసీ కమిషన్ సభ్యులు బ్రహ్మశ్రీ తల్లోజు ఆచారి గారికి విశ్వకర్మల సంక్షేమం కోరుతూ వినతిపత్రం అందజేత.",
      en: "Submitted a welfare memorandum to National BC Commission member Talloju Achari.",
hi: "राष्ट्रीय पिछड़ा वर्ग आयोग के सदस्य ब्रह्मश्री तल्लोजी आचारी को विश्वकर्मा समाज के कल्याण के संबंध में ज्ञापन सौंपा।",
      category: "protest"
    },
{
      date: "21.07.2019",
      year: "2019",
      te: "కడప బ్రహ్మంగారి మఠంలో విద్యార్థులకు ఆధునిక విద్యను అందించే విద్యాసంస్థ ఏర్పాటుకై ప్రాథమిక సమావేశం.",
      en: "Convened a meeting at Brahmamgari Matham, Kadapa, to plan a modern educational school managed by VKC.",
hi: "कडपा के ब्रह्ममगारी मठ में विश्वकर्मा छात्रों के लिए प्राथमिक स्तर से आधुनिक शिक्षा प्रदान करने वाले संस्थान की स्थापना के लिए प्रारंभिक बैठक।",
      category: "organization"
    },
{
      date: "14.08.2019",
      year: "2019",
      te: "VKC మహారాష్ట్ర కన్వీనర్ గా బ్రహ్మశ్రీ కాసర్లవార్ విద్యాసాగర్ నియామకం.",
      en: "Appointed Brahmasri Kasarlawar Vidyasagar as VKC Maharashtra State Coordinator.",
hi: "ब्रह्मश्री कासरलावार विद्यासागर को VKC महाराष्ट्र राज्य का संयोजक नियुक्त किया गया।",
      category: "organization"
    },
{
      date: "01.09.2019",
      year: "2019",
      te: "విశ్వబ్రాహ్మణులపై అనుచిత వ్యాఖ్యలు చేసిన లలితా జ్యూవెలర్స్ ఎండి కిరణ్ కుమార్ గారిపై కరీంనగర్ పోలీస్ స్టేషన్ లో కరీంనగర్ జిల్లా VKC యువజన విభాగం అధ్యక్షులు మనోజ్ చారి ఆధ్వర్యంలో పోలీసు ఫిర్యాదు.",
      en: "Filed a police complaint in Karimnagar against Lalitha Jewelry MD Kiran Kumar for derogatory remarks, led by District VKC Youth Wing President Manoj Chari.",
hi: "विश्वकर्मा समुदाय के खिलाफ अपमानजनक टिप्पणी करने पर ललिता ज्वेलर्स के एमडी किरण कुमार के खिलाफ करीमनगर में जिला VKC युवा अध्यक्ष मनोज चारी के नेतृत्व में पुलिस शिकायत दर्ज।",
      category: "protest"
    },
{
      date: "02.09.2019",
      year: "2019",
      te: "విశ్వకర్మలకు 20% రాజకీయ రిజర్వేషన్లు అందించాలని కోరుతూ VKC మహారాష్ట్ర కన్వీనర్ బ్రహ్మశ్రీ కాసర్లవార్ విద్యాసాగర్ గారు గడ్చిరోలి ఎంపీ శ్రీ అశోక్ నేతే గారికి వినతిపత్రం సమర్పణ.",
      en: "VKC Maharashtra Coordinator Brahmasri Kasarlawar Vidyasagar submitted a memorandum to Gadchiroli MP Ashok Nete requesting 20% political reservation for Vishwakarmas.",
hi: "महाराष्ट्र के संयोजक ब्रह्मश्री कासरलावार विद्यासागर ने गढ़चिरौली के सांसद श्री अशोक नेते को विश्वकर्मा समाज के लिए 20% राजनीतिक आरक्षण की मांग का ज्ञापन सौंपा।",
      category: "protest"
    },
{
      date: "23.09.2019",
      year: "2019",
      te: "గడ్చిరోలి ఎంపీ శ్రీ అశోక్ నేతే గారు విశ్వకర్మలకు 20% రాజకీయ రిజర్వేషన్ అందించాలని కోరుతూ మహారాష్ట్ర ముఖ్యమంత్రి శ్రీ దేవేంద్ర ఫడ్నవీస్ గారికి లేఖ రాయడం జరిగింది (బ్రహ్మశ్రీ కాసర్లవార్ విద్యాసాగర్ గారి కృషిని గౌరవిస్తూ అభినందనలు).",
      en: "Following efforts by Brahmasri Kasarlawar Vidyasagar, Gadchiroli MP Ashok Nete formally wrote to Maharashtra CM Devendra Fadnavis recommending 20% reservations.",
hi: "गढ़चिरौली सांसद अशोक नेते ने महाराष्ट्र के मुख्यमंत्री देवेंद्र फडणवीस को 20% आरक्षण देने की सिफारिश का पत्र लिखा (इस प्रयास में कासरलावार विद्यासागर के योगदान की सराहना की गई)।",
      category: "protest"
    },
{
      date: "2020",
      year: "2020",
      te: "కరోనా కష్టకాలంలో నిత్యావసర సరుకుల పంపిణీ కార్యక్రమం (శివరామ్ గారి ఆధ్వర్యంలో).",
      en: "Distributed groceries and relief packages to families during the COVID-19 pandemic under the VKC Youth Wing.",
hi: "कोरोना महामारी के दौरान VKC यूथ विंग के अध्यक्ष कुरेल्ला शिवराज के नेतृत्व में जरूरतमंद परिवारों को राशन और राहत सामग्री का वितरण।",
      category: "charity"
    },
{
      date: "2023",
      year: "2023",
      te: "విజయవాడ తుమ్మలపల్లి కళాక్షేత్రంలో 108 మంది ప్రముఖులకు విశ్వకర్మ లెజెండరీ అవార్డ్స్ అందజేత.",
      en: "Hosted the Legendary Awards at Tummalapalli Kalakshetram, Vijayawada, honoring 108 prominent personalities.",
hi: "विजयवाड़ा के तुमलापल्ली कलाक्षेत्र में विश्वकर्मा लेजेंडरी अवार्ड्स का आयोजन और 108 हस्तियों को सम्मान।",
      category: "awards"
    },
{
      date: "05.2024",
      year: "2024",
      te: "సుందరయ్య విజ్ఞాన కేంద్రంలో విశ్వకర్మ లెజెండరీ అవార్డ్స్ కార్యక్రమం నిర్వహణ.",
      en: "Hosted the annual Vishwakarma Legendary Awards ceremony at Sundarayya Vignana Kendram, Hyderabad.",
hi: "हैदराबाद के सुंदरैया विज्ञान केंद्र में वार्षिक विश्वकर्मा लेजेंडरी अवार्ड्स का सफल आयोजन।",
      category: "awards"
    },
{
      date: "11.2024",
      year: "2024",
      te: "న్యూఢిల్లీ లోని తెలంగాణ భవన్ లో విశ్వకర్మ లీడర్ అవార్డ్స్ అందజేత.",
      en: "Presented the Vishwakarma Leader Awards at Telangana Bhavan, New Delhi.",
hi: "नई दिल्ली के तेलंगाना भवन में विश्वकर्मा लीडर अवार्ड्स प्रदान किए गए।",
      category: "awards"
    },
{
      date: "05.2025",
      year: "2025",
      te: "విశ్వకర్మ లెజెండరీ అవార్డ్స్-2025 విజయవంతంగా అందజేత.",
      en: "Hosted the annual Vishwakarma Legendary Awards 2025 ceremony.",
hi: "वार्षिक विश्वकर्मा लेजेंडरी अवार्ड्स-2025 का भव्य आयोजन और पुरस्कार वितरण।",
      category: "awards"
    },
{
      date: "22.06.2025",
      year: "2025",
      te: "టాంక్ బండ్ వీరబ్రహ్మేంద్రస్వామి విగ్రహం నుండి శ్రీశైలం వరకు 500 బైకులతో ప్రతిష్టాత్మక యువ యాత్ర ర్యాలీ.",
      en: "Launched the prestigious Vishwakarma Yuva Yatra bike rally with 500 bikes from Tank Bund to Srisailam.",
hi: "हैदराबाद टैंक बंड से श्रीशैलम तक 500 बाइकों के साथ भव्य 'विश्वकर्मा युवा यात्रा' रैली का आयोजन।",
      category: "campaign"
    },
{
      date: "06.07.2025",
      year: "2025",
      te: "విశ్వబ్రాహ్మణుల హక్కులకై మరియు 5% రాజకీయ రిజర్వేషన్లకై 450 కి.మీ.ల చారిత్రాత్మక పాదయాత్ర ప్రారంభం.",
      en: "Began the historic 450 km Chaitanya Yatra padayatra marching for 21 days for political rights.",
hi: "राजनीतिक अधिकारों और 5% आरक्षण की मांग को लेकर 21 दिवसीय ऐतिहासिक 450 किमी लंबी 'विश्वकर्मा चैतन्य पदयात्रा' का शुभारंभ।",
      category: "campaign"
    },
{
      date: "26.07.2025",
      year: "2025",
      te: "శ్రీ వీరబ్రహ్మేంద్ర స్వామి మఠంలో మొదటి విడత పాదయాత్ర ముగింపు సభ.",
      en: "Concluded the first phase of the padayatra at Sree Veerabrahmendra Swami Matham with a public meeting.",
hi: "श्री वीरब्रह्मेन्द्र स्वामी मठ में पदयात्रा के पहले चरण का समापन और विशाल जनसभा का आयोजन।",
      category: "campaign"
    },
{
      date: "03.08.2025",
      year: "2025",
      te: "విశ్వబ్రాహ్మణ సాధికారతకు కృషి చేస్తున్న విశ్వనాథుల పుష్పగిరి గారికి బీసీ సంఘాల అభినందన సభ.",
      en: "BC organizations held a grand appreciation meet to honor Sri Viswanadhula Pushpagiri for community advocacy.",
hi: "विश्वकर्मा अधिकारों के लिए लगातार संघर्ष करने वाले श्री विश्वनाथुला पुष्पगिरी के सम्मान में पिछड़ा वर्ग संघों द्वारा अभिनंदन सभा।",
      category: "awards"
    },
{
      date: "29.08.2025",
      year: "2025",
      te: "సమాజవాది పార్టీ జాతీయ నాయకులు శ్రీ రామ్ ఆశ్రే గారికి సన్మానం, మలిదశ పాదయాత్ర పోస్టర్ ఆవిష్కరణ.",
      en: "Felicitation of Bahujan Leader Sri Ram Asrey and release of the Phase 2 Padayatra poster at Bashir Bagh Press Club.",
hi: "बशीर बाग प्रेस क्लब में समाजवादी पार्टी के राष्ट्रीय नेता श्री राम आसरे का अभिनंदन और द्वितीय चरण की पदयात्रा के पोस्टर का अनावरण।",
      category: "organization"
    },
{
      date: "17.09.2025",
      year: "2025",
      te: "విశ్వకర్మ జయంతి రోజున ఆదిలాబాద్ నుండి 1500 కి.మీ.ల బృహత్ చైతన్య పాదయాత్ర ప్రారంభం.",
      en: "Launched the massive 1,500 km Chaitanya Yatra padayatra from Adilabad on Vishwakarma Jayanti.",
hi: "विश्वकर्मा जयंती के अवसर पर आदिलाबाद से 1500 किमी लंबी ऐतिहासिक चैतन्य महापदयात्रा की शुरुआत।",
      category: "campaign"
    },
{
      date: "30.09.2025",
      year: "2025",
      te: "ఎన్నికల కోడ్ కారణంగా వరంగల్ ప్రొ. జయశంకర్ పార్క్ లో పాదయాత్ర నిలుపుదల.",
      en: "Paused the walking rally at Warangal due to local body election code restrictions.",
hi: "स्थानीय निकाय चुनावों के कोड लागू होने के कारण वारंगल में पदयात्रा को रोका गया।",
      category: "campaign"
    },
{
      date: "07.12.2025",
      year: "2025",
      te: "బీసీ రిజర్వేషన్ల కోసం ఆత్మబలిదానం చేసిన సాయి ఈశ్వరాచారి జ్ఞాపకార్థం ఎల్బీనగర్ లో కొవ్వొత్తుల ర్యాలీ.",
      en: "Led a massive candle march at LB Nagar in honor of martyr Sai Ishwarachari who died for BC reservations.",
hi: "आरक्षण की मांग को लेकर बलिदान देने वाले अमर शहीद साई ईश्वराचारी के सम्मान में एलबी नगर में विशाल कैंडल मार्च।",
      category: "protest"
    },
{
      date: "17.12.2025",
      year: "2025",
      te: "అమరుడు సాయి ఈశ్వరాచారి కుటుంబానికి విరాళాలుగా సేకరించిన రూ. 64,716/- అందజేత.",
      en: "Presented financial aid of Rs. 64,716 collected by the Youth Wing to Sai Ishwarachari's family.",
hi: "शहीद साई ईश्वराचारी के परिवार को समाज से एकत्रित ₹64,716 की सहायता राशि यूथ विंग द्वारा प्रदान की गई।",
      category: "charity"
    },
{
      date: "25.12.2025",
      year: "2025",
      te: "స్థానిక సంస్థల్లో విజయం సాధించిన విశ్వబ్రాహ్మణ సర్పంచులు, వార్డు సభ్యులకు సన్మాన సభ.",
      en: "Felicitation ceremony for newly elected Sarpanches and Ward Members at Bashir Bagh Press Club.",
hi: "स्थानीय चुनावों में विजयी विश्वकर्मा सरपंचों और वार्ड सदस्यों का बशीर बाग प्रेस क्लब में सम्मान समारोह।",
      category: "awards"
    },
{
      date: "30.12.2025",
      year: "2025",
      te: "అసెంబ్లీలో విశ్వబ్రాహ్మణుల గళం వినిపించిన రామగుండం ఎమ్మెల్యే రాజ్ ఠాకూర్ గారిని కలిసి కృతజ్ఞతల సమర్పణ.",
      en: "Met Ramagundam MLA Sri Makkan Singh Raj Thakur to thank him for representing community issues in the Assembly.",
hi: "विधानसभा में विश्वकर्मा समाज की आवाज उठाने के लिए रामगुंडम विधायक श्री मखन सिंह राज ठाकुर से मिलकर धन्यवाद ज्ञापन।",
      category: "organization"
    },
{
      date: "01.01.2026",
      year: "2026",
      te: "మారోజు వీరన్న జయంతి సభ; త్వరలోనే వారి విగ్రహాన్ని ఏర్పాటు చేస్తామని వికెసి ప్రకటన.",
      en: "Maroju Veeranna Birth Anniversary meeting; VKC announced plans to install his memorial statue.",
hi: "मारोजू वीरन्ना की जयंती पर सभा; VKC द्वारा जल्द ही उनकी प्रतिमा स्थापित करने की घोषणा।",
      category: "organization"
    },
{
      date: "26.01.2026",
      year: "2026",
      te: "జడ్చర్ల గంగాపూర్ లో జడ్చర్ల నియోజకవర్గ VKC కన్వీనర్ బ్రహ్మశ్రీ దేవోజు మహేష్ ఆచారి ఆధ్వర్యంలో విశ్వబ్రాహ్మణ నాయకులతో సమావేశం.",
      en: "Convened a leadership meet of Vishwabrahmana leaders in Gangapur, Jadcherla under VKC Coordinator Brahmasri Devoju Mahesh Achari.",
hi: "जदचर्ला के गंगापुर में संयोजक ब्रह्माश्री देवोजू महेश आचारी के नेतृत्व में विश्वकर्मा नेताओं की महत्वपूर्ण बैठक।",
      category: "organization"
    },
{
      date: "09.02.2026",
      year: "2026",
      te: "విశ్వకర్మ ప్రీమియర్ లీగ్ (VPL) క్రికెట్ టోర్నమెంట్ పోస్టర్ ను ACP కిరణ్ కుమార్ సర్ చేతుల మీదుగా ఆవిష్కరణ.",
      en: "Unveiled the Vishwakarma Premier League (VPL) cricket poster through ACP Sri Kiran Kumar Sir.",
hi: "विश्वकर्मा प्रीमियर लीग (VPL) क्रिकेट का पोस्टर एसीपी ब्रह्माश्री किरण कुमार सर के कर-कमलों द्वारा जारी।",
      category: "campaign"
    },
{
      date: "25.02.2026",
      year: "2026",
      te: "భూత్పూర్ లో విశ్వబ్రాహ్మణ సంఘాల ప్రతినిధులతో సమావేశం.",
      en: "Convened a strategic coordination meeting with community leaders at Bhutpur.",
hi: "भूतपुर में विश्वकर्मा संगठनों के प्रतिनिधियों के साथ समन्वय बैठक।",
      category: "organization"
    },
{
      date: "08.03.2026",
      year: "2026",
      te: "కీసర లెగసీ అరీనా లో విశ్వకర్మ ప్రీమియర్ లీగ్ ను ప్రారంభించిన ACP కిరణ్ కుమార్ సర్.",
      en: "VPL cricket tournament launched by ACP Sri Kiran Kumar Sir at Legacy Cricket Arena, Keesara.",
hi: "कीसरा के लेगेसी क्रिकेट एरिना में एसीपी किरण कुमार सर द्वारा विश्वकर्मा प्रीमियर लीग का भव्य उद्घाटन।",
      category: "campaign"
    },
{
      date: "31.03.2026",
      year: "2026",
      te: "ఎల్బీ స్టేడియం లో విశ్వకర్మ ప్రీమియర్ లీగ్ ఫైనల్ మరియు విజేతలకు బహుమతుల ప్రధానోత్సవం.",
      en: "Grand finals and prize distribution of the Vishwakarma Premier League at LB Stadium.",
hi: "एलबी स्टेडियम में विश्वकर्मा प्रीमियर लीग का फाइनल मैच और पुरस्कार वितरण समारोह।",
      category: "campaign"
    }
  ];

  // Filter events of selected activeYear
  const yearEvents = timelineEvents.filter(e => e.year === activeYear);
  const visibleEvents = yearEvents.slice(0, limit);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    
    // If user scrolled near the bottom, load more
    if (scrollBottom < 40 && limit < yearEvents.length) {
      setLimit(prev => Math.min(prev + 3, yearEvents.length));
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'organization':
        return <Users size={11} className="text-gold-600" />;
      case 'awards':
        return <Trophy size={11} className="text-turmeric" />;
      case 'charity':
        return <Heart size={11} className="text-saffron-400" />;
      case 'campaign':
        return <Compass size={11} className="text-saffron-500" />;
      case 'movement':
        return <Flame size={11} className="text-vermilion" />;
      default:
        return <Calendar size={11} className="text-stone-500" />;
    }
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'organization':
        return 'bg-gold-500/10 border-gold-500/20 text-gold-600';
      case 'awards':
        return 'bg-turmeric/10 border-turmeric/20 text-turmeric';
      case 'charity':
        return 'bg-saffron-400/10 border-saffron-400/20 text-saffron-400';
      case 'campaign':
        return 'bg-saffron-500/10 border-saffron-500/20 text-saffron-500';
      case 'movement':
        return 'bg-vermilion/10 border-vermilion/20 text-vermilion';
      default:
        return 'bg-stone-500/10 border-stone-500/20 text-stone-500';
    }
  };

  return (
    <section className="py-20 bg-stone-50/50 border-b border-stone-100 overflow-hidden relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header Block */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-vermilion/10 text-vermilion px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {isTelugu ? 'ప్రస్థాన మైలురాళ్లు' : isHindi ? 'यात्रा के मील के पत्थर' : 'Journey Milestones'}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tighter font-display leading-none">
            {isTelugu ? 'విశ్వకర్మ నాలెడ్జ్ సెంటర్ చరిత్ర' : isHindi ? 'विश्वकर्मा नॉलेज सेंटर का इतिहास' : 'VKC Historic Timeline'}
          </h2>
          <p className="text-stone-500 text-xs font-medium leading-relaxed max-w-md mx-auto">
            {isTelugu 
              ? '2017 ఆవిర్భావం నుండి నేటి వరకు సమాజ సాధికారత, సాంస్కృతిక పరిరక్షణలో సాధించిన కొన్ని ముఖ్యమైన విజయాలు.'
              : isHindi
              ? '2017 में स्थापना से लेकर आज तक समाज के सशक्तिकरण और सांस्कृतिक संरक्षण में हासिल की गई प्रमुख उपलब्धियां।'
              : 'A curated timeline showcasing VKC\'s key struggles, mobilizations, and achievements from 2017 to 2026.'}
          </p>
        </div>

        {/* Horizontal Year Navigation Bar */}
        <div className="relative mb-12 overflow-x-auto no-scrollbar py-2">
          <div className="flex gap-4 md:gap-0 justify-between items-center min-w-[540px] max-w-xl mx-auto px-4 relative">
            {/* Horizontal Line connecting nodes */}
            <div className="absolute left-4 right-4 h-[2px] bg-stone-250 -z-10 top-1/2 -translate-y-1/2" />
            
            {years.map((year) => {
              const isActive = activeYear === year;
              return (
                <button
                  key={year}
                  onClick={() => {
                    setActiveYear(year);
                    setLimit(3); // Reset detail view limit when swapping years
                  }}
                  className={`relative w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center font-black text-xs transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-stone-900 text-white border-stone-900 shadow-lg scale-110 z-10' 
                      : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-900 z-10'
                  }`}
                >
                  <span className="font-mono text-[10px] tracking-tighter leading-none">{year}</span>
                  {isActive && (
                    <span className="absolute -bottom-6 text-stone-900 leading-none text-lg">
                      ▾
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Year Timeline Details */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-150 shadow-sm relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-vermilion/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div 
            onScroll={handleScroll}
            className="relative max-h-[300px] overflow-y-auto pr-2 md:pr-4 space-y-6 scroll-smooth"
            style={{ scrollbarWidth: 'thin' }}
          >
            {/* The vertical timeline line */}
            <div className="absolute left-[15px] top-2 bottom-8 w-[2px] bg-stone-150" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {visibleEvents.map((m, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-start gap-4 md:gap-6 group pl-8"
                  >
                    {/* Circle Node Dot */}
                    <div className="absolute left-[4px] top-1 w-6 h-6 rounded-full bg-white border-2 border-stone-200 flex items-center justify-center group-hover:border-stone-900 transition-colors z-10">
                      {getCategoryIcon(m.category)}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 pb-5 border-b border-stone-100 last:border-b-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold text-stone-850 bg-stone-100 px-1.5 py-0.5 rounded font-mono">
                          {m.date}
                        </span>
                        <span className={`text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getCategoryStyle(m.category)}`}>
                          {m.category}
                        </span>
                      </div>
                      <p className="text-stone-700 text-xs md:text-sm font-semibold leading-relaxed group-hover:text-stone-900 transition-colors">
                        {isTelugu ? m.te : isHindi ? m.hi : m.en}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Extra spacer at the bottom so the last item is not covered by the gradient fade */}
                {limit < yearEvents.length && (
                  <div className="h-16" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom fade gradient and show more trigger */}
          {limit < yearEvents.length && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none flex items-end justify-center pb-5 z-20">
              <button
                onClick={() => setLimit(prev => Math.min(prev + 3, yearEvents.length))}
                className="pointer-events-auto bg-stone-900 hover:bg-vermilion text-white text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-lg hover:shadow-vermilion/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                {isTelugu ? 'మరిన్ని చూడండి' : isHindi ? 'और अधिक देखें' : 'Scroll / Load More'} (+{yearEvents.length - limit})
              </button>
            </div>
          )}
        </div>

        {/* Explore Full Journey Button */}
        <div className="text-center mt-12">
          <Link href="/founder"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-vermilion hover:shadow-lg hover:shadow-vermilion/15 transition-all active:scale-[0.98] group"
          >
            {isTelugu ? 'పూర్తి ప్రస్థాన వివరాలు చూడండి' : isHindi ? 'संपूर्ण 50+ मील के पत्थर देखें' : 'Explore Full 50+ Milestones'}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};

