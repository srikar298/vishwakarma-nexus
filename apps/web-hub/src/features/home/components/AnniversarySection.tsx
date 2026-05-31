import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, Award, Users, CreditCard, Sparkles, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnniversarySectionProps {
  onOpenMatrimony: () => void;
}

const DIGNITARIES = [
  // Tier 1: VKC Core Leadership
  {
    nameEn: "Brahmasri Kondoju Praveen Kumar Chary garu",
    nameTe: "బ్రహ్మశ్రీ కొండోజు ప్రవీణ్ కుమార్ చారి గారు",
    nameHi: "ब्रह्मश्री कोंडोजु प्रवीण कुमार चारी गारू",
    subEn: "President, VKC Telangana",
    subTe: "అధ్యక్షులు, VKC తెలంగాణ",
    subHi: "अध्यक्ष, VKC तेलंगाना",
    photo: "/images/guests/praveen_kumar.jpg"
  },
  {
    nameEn: "Brahmasri Solleti Prabhakara Chary garu",
    nameTe: "బ్రహ్మశ్రీ సొల్లేటి ప్రభాకర్ చారి గారు",
    nameHi: "ब्रह्मश्री सोल्लेटी प्रभाकर चारी गारू",
    subEn: "National Joint Secretary, VKC",
    subTe: "జాతీయ సంయుక్త కార్యదర్శి, VKC",
    subHi: "राष्ट्रीय संयुक्त सचिव, VKC",
    photo: "/images/guests/solleti_prabhakara.jpg"
  },
  // Tier 2: State-Level Influencers & Community Icons
  {
    nameEn: "Dr. P. Harikanth Acharya garu",
    nameTe: "డాక్టర్ పి. హరికాంత్ ఆచార్య గారు",
    nameHi: "डॉ. पी. हरिकांत आचार्य गारू",
    subEn: "Famous Public Doctor & Social Activist",
    subTe: "ప్రముఖ వైద్యులు & సామాజిక కార్యకర్త",
    subHi: "प्रसिद्ध चिकित्सक एवं सामाजिक कार्यकर्ता",
    photo: "/images/guests/harikanth_acharya.jpg"
  },
  {
    nameEn: "Brahmasri Sirikonda Madhusudhana Chary garu",
    nameTe: "బ్రహ్మశ్రీ సిరికొండ మధుసూదన చారి గారు",
    nameHi: "ब्रह्मश्री सिरिकोंडा मधुसूदन चारी गारू",
    subEn: "Leader of the Opposition, TS Legislative Council & 1st Speaker",
    subTe: "విపక్ష నాయకులు, తెలంగాణ శాసన మండలి & మొదటి స్పీకర్",
    subHi: "तेलंगाना विधान परिषद के विपक्ष के नेता एवं प्रथम स्पीकर",
    photo: "/images/guests/sirikonda_madhusudhana.jpg"
  },
  // Tier 3: Government Officials
  {
    nameEn: "Smt Seethakka garu",
    nameTe: "శ్రీమతి సీతక్క గారు",
    nameHi: "श्रीमती सीतक्का गारू",
    subEn: "Hon'ble Minister for Women & Child Welfare, Telangana",
    subTe: "మహిళా & శిశు సంక్షేమ మంత్రి, తెలంగాణ",
    subHi: "माननीय मंत्री, महिला एवं बाल कल्याण, तेलंगाना",
    photo: "/images/guests/seethakka.jpg"
  },
  {
    nameEn: "Brahmasri K.M. Kiran Kumar Sir",
    nameTe: "బ్రహ్మశ్రీ K.M కిరణ్ కుమార్ సర్",
    nameHi: "ब्रह्मश्री के.एम. किरण कुमार सर",
    subEn: "Chief Guest — ACP, EOW-CCS Hyderabad",
    subTe: "ముఖ్య అతిథి — ACP, EOW-CCS హైదరాబాద్",
    subHi: "मुख्य अतिथि — एसीपी, EOW-CCS हैदराबाद",
    photo: "/images/guests/km_kiran_kumar.jpg"
  },
  {
    nameEn: "Brahmasri E. Venkatachary garu",
    nameTe: "బ్రహ్మశ్రీ ఈ. వెంకటాచారి గారు",
    nameHi: "ब्रह्मश्री ई. वेंकटचारी गारू",
    subEn: "Addl. Collector, Vikarabad District",
    subTe: "అడిషనల్ కలెక్టర్, వికారాబాద్ జిల్లా",
    subHi: "अतिरिक्त कलेक्टर, विकाराबाद जिला",
    photo: "/images/guests/e_venkatachary.jpg"
  },
  {
    nameEn: "Dasoju Sravan garu",
    nameTe: "దాసోజు శ్రవణ్ గారు",
    nameHi: "दासोझु श्रवण गारू",
    subEn: "Member of Legislative Council, Telangana",
    subTe: "శాసన మండలి సభ్యులు, తెలంగాణ",
    subHi: "विधान परिषद सदस्य, तेलंगाना",
    photo: "/images/guests/dasoju_sravan.jpg"
  },
  // Tier 4: State Vishwakarma Community Leaders
  {
    nameEn: "Brahmasri Puligilla Prakash Achary garu",
    nameTe: "బ్రహ్మశ్రీ పులిగిల్ల ప్రకాష్ ఆచారి గారు",
    nameHi: "ब्रह्मश्री पुलिगिल्ला प्रकाश आचारी गारू",
    subEn: "State Vishwakarma Leader & Senior Politician",
    subTe: "రాష్ట్ర విశ్వకర్మ నాయకులు & సీనియర్ రాజకీయవేత్త",
    subHi: "राज्य विश्वकर्मा नेता एवं वरिष्ठ राजनेता",
    photo: "/images/guests/puligilla_prakash.jpg"
  },
  {
    nameEn: "Brahmasri Thalloju Achary garu",
    nameTe: "బ్రహ్మశ్రీ తాళ్ళోజు ఆచారి గారు",
    nameHi: "ब्रह्मश्री ताल्लोजु आचारी गारू",
    subEn: "Ex-National BC Commission Member",
    subTe: "మాజీ జాతీయ బీసీ కమిషన్ సభ్యులు",
    subHi: "पूर्व राष्ट्रीय पिछड़ा वर्ग आयोग सदस्य",
    photo: "/images/guests/thalloju_achary.jpg"
  },
  {
    nameEn: "Brahmasri Varnoju Balakrishna Chary garu",
    nameTe: "బ్రహ్మశ్రీ వర్ణోజు బాలకృష్ణ చారి గారు",
    nameHi: "ब्रह्मश्री वर्णोजु बालकृष्ण चारी गारू",
    subEn: "Senior Congress Party Leader",
    subTe: "సీనియర్ కాంగ్రెస్ పార్టీ నాయకులు",
    subHi: "वरिष्ठ कांग्रेस पार्टी नेता",
    photo: "/images/guests/varnoju_balakrishna.jpg"
  },
  {
    nameEn: "Brahmasri Vadla Laxminarayana Chary garu",
    nameTe: "బ్రహ్మశ్రీ వడ్ల లక్ష్మీనారాయణ చారి గారు",
    nameHi: "ब्रह्मश्री वडला लक्ष्मीनारायण चारी गारू",
    subEn: "Senior BJP Leader, Mahabubnagar",
    subTe: "సీనియర్ బీజేపీ నాయకులు, మహబూబ్‌నగర్",
    subHi: "वरिष्ठ भाजपा नेता, महबूबनगर",
    photo: "/images/guests/vadla_laxminarayana.jpg"
  },
  {
    nameEn: "Brahmasri Ravi Chary garu",
    nameTe: "బ్రహ్మశ్రీ రవి చారి గారు",
    nameHi: "ब्रह्मश्री रवि चारी गारू",
    subEn: "Ex-Corporator GHMC & BJP Senior Leader",
    subTe: "మాజీ కార్పొరేటర్ GHMC & బీజేపీ సీనియర్ నాయకులు",
    subHi: "पूर्व पार्षद GHMC एवं भाजपा वरिष्ठ नेता",
    photo: "/images/guests/ravi_chary.jpg"
  },
  {
    nameEn: "Smt Bibinagar Anuradha garu",
    nameTe: "శ్రీమతి బీబినగర్ అనురాధ గారు",
    nameHi: "श्रीमती बीबीनगर अनुराधा गारू",
    subEn: "Senior BJP Leader",
    subTe: "సీనియర్ బీజేపీ నాయకురాలు",
    subHi: "वरिष्ठ भाजपा नेत्री",
    photo: "/images/guests/bibinagar_anuradha.jpg"
  },
  {
    nameEn: "Brahmasri Yemnnagandla Ramesh Chary garu",
    nameTe: "బ్రహ్మశ్రీ యెమ్నగండ్ల రమేష్ చారి గారు",
    nameHi: "ब्रह्मश्री येमनागंडला रमेश चारी गारू",
    subEn: "President, Swarnakara Sangham, Mahabubnagar",
    subTe: "అధ్యక్షులు, స్వర్ణకార సంఘం, మహబూబ్‌నగర్",
    subHi: "अध्यक्ष, स्वर्णकार संघ, महबूबनगर",
    photo: "/images/guests/ramesh_chary.jpg"
  },
  // Tier 5: Social Activists & Community Contributors
  {
    nameEn: "Brahmasri Chandramouli Chary garu",
    nameTe: "బ్రహ్మశ్రీ చంద్రమౌళి చారి గారు",
    nameHi: "ब्रह्मश्री चंद्रमौली चारी गारू",
    subEn: "Sarpanch, Social Activist & Senior Leader",
    subTe: "సర్పంచ్, సామాజిక కార్యకర్త & సీనియర్ నాయకులు",
    subHi: "सरपंच, सामाजिक कार्यकर्ता एवं वरिष्ठ नेता",
    photo: "/images/guests/chandramouli_chary.jpg"
  },
  {
    nameEn: "Brahmasri Naveen Achary garu",
    nameTe: "బ్రహ్మశ్రీ నవీన్ ఆచారి గారు",
    nameHi: "ब्रह्मश्री नवीन आचारी गारू",
    subEn: "General Secretary, Telangana Jagruthi",
    subTe: "సాధారణ కార్యదర్శి, తెలంగాణ జాగృతి",
    subHi: "महासचिव, तेलंगाना जागृति",
    photo: "/images/guests/naveen_achary.jpg"
  },
  {
    nameEn: "Brahmasri Vannoj Sai Prakash Chary garu",
    nameTe: "బ్రహ్మశ్రీ వన్నోజు సాయి ప్రకాష్ చారి గారు",
    nameHi: "ब्रह्मश्री वन्नोजु साई प्रकाश चारी गारू",
    subEn: "Vishwakarma Leader & Social Activist",
    subTe: "విశ్వకర్మ నాయకులు & సామాజిక కార్యకర్త",
    subHi: "विश्वकर्मा नेता एवं सामाजिक कार्यकर्ता",
    photo: "/images/guests/sai_prakash.jpg"
  },
  {
    nameEn: "Brahmasri Sada Shiva Chary garu",
    nameTe: "బ్రహ్మశ్రీ సదాశివ చారి గారు",
    nameHi: "ब्रह्मश्री सदा शिव चारी गारू",
    subEn: "Social Activist",
    subTe: "సామాజిక కార్యకర్త",
    subHi: "सामाजिक कार्यकर्ता",
    photo: "/images/guests/sadashiva_chary.jpg"
  },
  {
    nameEn: "Brahmasri Nallanagula Sriman garu",
    nameTe: "బ్రహ్మశ్రీ నల్లంగుల శ్రీమన్ గారు",
    nameHi: "ब्रह्मश्री नल्लानगुला श्रीमन गारू",
    subEn: "Social Activist",
    subTe: "సామాజిక కార్యకర్త",
    subHi: "सामाजिक कार्यकर्ता",
    photo: "/images/guests/nallanagula_sriman.jpg"
  },
  {
    nameEn: "Smt Geetha Rani Sudhakar garu",
    nameTe: "శ్రీమతి గీతా రాణి సుధాకర్ గారు",
    nameHi: "श्रीमती गीता रानी सुधाकर गारू",
    subEn: "Sarpanch, Nawabpet & Social Activist",
    subTe: "సర్పంచ్, నవాబ్‌పేట & సామాజిక కార్యకర్త",
    subHi: "सरपंच, नवाबपेट एवं सामाजिक कार्यकर्ता",
    photo: "/images/guests/geetha_rani.jpg"
  },
  {
    nameEn: "Brahmasri Avusala Bhanu Prakash Avadhani garu",
    nameTe: "బ్రహ్మశ్రీ అవుసల భాను ప్రకాష్ అవధాని గారు",
    nameHi: "ब्रह्मश्री अवुसला भानु प्रकाश अवधनी गारू",
    subEn: "Adhyakshulu, PadhaSaraswata Peetam, Telangana",
    subTe: "అధ్యక్షులు, పాదసరస్వత పీఠం, తెలంగాణ",
    subHi: "अध्यक्ष, पादसरस्वत पीठम, तेलंगाना",
    photo: "/images/guests/bhanu_prakash.jpg"
  }
];

const getInitials = (name: string) => {
  const cleanName = name
    .replace(/^(Smt\.?|Smt|Dr\.?|Dr|ACP|Brahmasri|Varnoju|Vannoj|Vadla|Avusala)\s+/i, '')
    .replace(/\s+garu$/i, '')
    .trim();
  const parts = cleanName.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0] ? parts[0][0].toUpperCase() : 'V';
};

export const AnniversarySection: React.FC<AnniversarySectionProps> = ({ onOpenMatrimony }) => {
  const { t, i18n } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const targetDate = new Date("2026-05-31T17:00:00+05:30");

    const updateTimer = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsLive(true);
        setTimeLeft(null);
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleShare = () => {
    const shareText = i18n.language === 'te'
      ? `విశ్వకర్మ నాలెడ్జ్ సెంటర్ (VKC) 10వ వార్షికోత్సవ దశాబ్ది ఉత్సవాలకు సాదర ఆహ్వానం!🎉\n\n` +
        `📅 తేదీ: 31 మే 2026 (ఆదివారం)\n` +
        `⏰ సమయం: సాయంత్రం 05:00 నుండి రాత్రి 09:30 వరకు\n` +
        `📍 వేదిక: మెయిన్ హాల్, సుందరయ్య విజ్ఞాన కేంద్రం, బాగ్ లింగంపల్లి, హైదరాబాద్.\n` +
        `👑 ముఖ్య అతిథులు: మంత్రి శ్రీమతి సీతక్క గారు, ACP బ్రహ్మశ్రీ K.M కిరణ్ కుమార్ సర్ మరియు ప్రముఖులు\n\n` +
        `దయచేసి ఈ ఆహ్వానాన్ని మన బంధుమిత్రులకు షేర్ చేయండి! 🔄`
      : i18n.language === 'hi'
      ? `विश्वकर्मा नॉलेज सेंटर (VKC) के 10वें वार्षिक दशकीय समारोह में आपका सादर आमंत्रण!🎉\n\n` +
        `📅 दिनांक: 31 मई 2026 (रविवार)\n` +
        `⏰ समय: शाम 05:00 बजे से रात 09:30 बजे तक\n` +
        `📍 स्थान: मुख्य हॉल, सुंदरैया विज्ञान केंद्र, बाग लिंगमपल्ली, हैदराबाद।\n` +
        `👑 मुख्य अतिथि: माननीय मंत्री श्रीमती सीतक्का गारू, एसीपी ब्रह्मश्री के.एम. किरण कुमार सर एवं गणमान्य व्यक्ति\n\n` +
        `कृपया इस निमंत्रण को अपने मित्रों और परिवार के साथ साझा करें! 🔄`
      : `Cordially inviting you to the Vishwakarma Knowledge Centre (VKC) 10th Anniversary Decennial Celebrations!🎉\n\n` +
        `📅 Date: May 31, 2026 (Sunday)\n` +
        `⏰ Time: 05:00 PM to 09:30 PM IST\n` +
        `📍 Venue: Main Hall, Sundarayya Vignana Kendram, Bagh Lingampally, Hyderabad.\n` +
        `👑 Chief Guests: Hon'ble Minister Smt Seethakka garu, ACP Brahmasri K.M. Kiran Kumar Sir & Dignitaries\n\n` +
        `Please share this invitation with your family and friends! 🔄`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <section className="py-24 relative overflow-hidden bg-white border-y border-stone-100">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
          <div className="inline-flex items-center gap-3 bg-saffron-550/10 border border-saffron-500/20 px-4 py-1.5 rounded-full text-saffron-700">
            <Sparkles size={14} className="animate-spin-slow text-saffron-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {i18n.language === 'te' ? 'వికెసి దశాబ్ది ఉత్సవాలు' : i18n.language === 'hi' ? 'वीकेसी दशकीय स्थापना दिवस' : 'VKC Decennial Celebration'}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight font-display">
            {i18n.language === 'te'
              ? '10 సంవత్సరాల వైభవ ప్రస్థానం మరియు సంఘ వికాస ఉత్సవాలు!'
              : i18n.language === 'hi'
              ? 'वीकेसी दशकीय समारोह: विरासत और सशक्तिकरण के 10 वर्ष'
              : 'Celebrating 10 Years of Legacy & Empowerment'}
          </h2>
          <p className="text-stone-600 text-base md:text-lg font-medium leading-relaxed">
            {i18n.language === 'te'
              ? 'ఒక దశాబ్దపు ఉత్కృష్టత, వారసత్వ పరిరక్షణ మరియు సంఘ నాయకత్వ ప్రస్థానానికి గుర్తుగా Hyderabad లో నేడు నిర్వహిస్తున్న మహా వేడుక.'
              : i18n.language === 'hi'
              ? 'हैदराबाद में आज उत्कृष्टता, विरासत संरक्षण और सामुदायिक नेतृत्व के एक दशक का उत्सव मनाया जा रहा है।'
              : 'Celebrating a decade of excellence, heritage preservation, and community leadership today in Hyderabad.'}
          </p>
        </div>

        {/* Dynamic Countdown Alert Banner */}
        <div className="max-w-4xl mx-auto mb-16 bg-stone-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-stone-850 shadow-xl text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 space-y-6">

            {isLive ? (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  {i18n.language === 'te' ? 'వేడుకలు ప్రారంభమయ్యాయి' : i18n.language === 'hi' ? 'उत्सव लाइव है' : 'Celebrations are Live'}
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
                  {i18n.language === 'te'
                    ? 'హైదరాబాద్‌లో దశాబ్ది ఉత్సవాలు అట్టహాసంగా ప్రారంభమయ్యాయి! రండి, పాల్గొనండి.'
                    : i18n.language === 'hi'
                    ? 'हैदराबाद में दशकीय स्थापना दिवस समारोह शुरू हो गया है! आप आमंत्रित हैं।'
                    : 'The Decennial Celebration has commenced in Hyderabad!'}
                </h3>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-saffron-400 uppercase tracking-[0.3em]">
                  {i18n.language === 'te' ? 'వేడుకలు ప్రారంభమగు సమయం' : i18n.language === 'hi' ? 'उत्सव शुरू होने में समय' : 'Celebrations Start In'}
                </p>
                {timeLeft && (
                  <div className="flex justify-center gap-6 md:gap-10">
                    {[
                      {
                        label: i18n.language === 'te' ? 'గంటలు' : i18n.language === 'hi' ? 'घंटे' : 'Hours',
                        value: timeLeft.hours
                      },
                      {
                        label: i18n.language === 'te' ? 'నిమిషాలు' : i18n.language === 'hi' ? 'मिनट' : 'Minutes',
                        value: timeLeft.minutes
                      },
                      {
                        label: i18n.language === 'te' ? 'సెకన్లు' : i18n.language === 'hi' ? 'सेकंड' : 'Seconds',
                        value: timeLeft.seconds
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="text-4xl md:text-5xl font-black font-mono leading-none tracking-tight text-white bg-white/5 border border-white/10 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center">
                          {String(item.value).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest mt-2">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <p className="text-stone-300 text-xs md:text-sm max-w-xl mx-auto font-medium">
                {i18n.language === 'te'
                  ? 'మంత్రి శ్రీమతి సీతక్క గారు, ACP బ్రహ్మశ్రీ K.M కిరణ్ కుమార్ సర్ మరియు వివిధ రాష్ట్రాల నుండి విచ్చేస్తున్న 20+ ప్రముఖులు.'
                  : i18n.language === 'hi'
                  ? 'माननीय मंत्री श्रीमती सीतक्का गारू, एसीपी ब्रह्मश्री के.एम. किरण कुमार सर एवं विभिन्न राज्यों के 20+ गणमान्य व्यक्ति।'
                  : 'Graced by Smt Seethakka garu (Minister), ACP Brahmasri K.M. Kiran Kumar Sir & 20+ Distinguished Dignitaries.'}
              </p>
              
              <div className="flex flex-wrap justify-center gap-1.5 max-w-2xl mx-auto pt-1">
                {DIGNITARIES.slice(0, 4).map((g, idx) => {
                  const initials = getInitials(g.nameEn);
                  return (
                    <span key={idx} className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 pl-1.5 pr-3 py-0.5 rounded-full text-[9px] font-bold text-stone-300">
                      <div className="w-5 h-5 rounded-full bg-stone-800 text-saffron-400 text-[8px] font-black flex items-center justify-center shrink-0 overflow-hidden relative border border-stone-700">
                        <span className="absolute inset-0 flex items-center justify-center">{initials}</span>
                        {g.photo && (
                          <img
                            src={g.photo}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <span>{i18n.language === 'te' ? g.nameTe : i18n.language === 'hi' ? g.nameHi : g.nameEn}</span>
                    </span>
                  );
                })}
                <span className="bg-saffron-500/10 border border-saffron-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-black text-saffron-400">
                  + {DIGNITARIES.length - 4} More Dignitaries
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Live Event Invite details */}
          <div className="bg-stone-50 border border-stone-100 p-8 rounded-[2.5rem] relative overflow-hidden group flex flex-col justify-between hover:shadow-2xl transition-all duration-500 hover:border-saffron-500/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-saffron-500/5 -mr-12 -mt-12 rounded-full group-hover:scale-[3] transition-transform duration-700 -z-0" />
            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 bg-saffron-550/10 rounded-2xl flex items-center justify-center text-saffron-600">
                <Calendar size={20} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-stone-900 font-display">
                  {i18n.language === 'te' ? 'హైదరాబాద్ వేడుకలు' : i18n.language === 'hi' ? 'हैदराबाद समारोह' : 'Hyderabad Celebrations'}
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed font-semibold">
                  {i18n.language === 'te'
                    ? 'విభిన్న రాష్ట్రాల నుండి వచ్చిన ప్రతినిధులను కలుసుకోవడానికి నేడు సుందరయ్య విజ్ఞాన కేంద్రం, హైదరాబాద్‌లో మాతో చేరండి.'
                    : i18n.language === 'hi'
                    ? 'विभिन्न राज्यों के प्रतिनिधियों से मिलने के लिए आज सुंदरैया विज्ञान केंद्र, हैदराबाद में हमसे जुड़ें।'
                    : 'Join us today at Sundarayya Vignana Kendram, Hyderabad to meet representatives from various states.'}
                </p>
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-2 text-stone-600 text-xs font-bold bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                <MapPin size={14} className="text-saffron-600 shrink-0" />
                <span className="truncate">
                  {i18n.language === 'te' ? 'సుందరయ్య విజ్ఞాన కేంద్రం' : i18n.language === 'hi' ? 'सुंदरैया विज्ञान केंद्र' : 'Sundarayya Vignana Kendram'}
                </span>
              </div>
              <button
                onClick={handleShare}
                className="w-full bg-saffron-600 text-white h-12 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-saffron-700 transition-all cursor-pointer"
              >
                <Share2 size={12} />
                {i18n.language === 'te' ? 'ఆహ్వానాన్ని షేర్ చేయండి' : i18n.language === 'hi' ? 'निमंत्रण साझा करें' : 'Share Invitation'}
              </button>
            </div>
          </div>

          {/* Card 2: Parinaya Matrimony Launch */}
          <div
            onClick={onOpenMatrimony}
            className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm relative overflow-hidden group flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-all duration-500 hover:border-pink-500/20"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50/50 -mr-12 -mt-12 rounded-full group-hover:scale-[3] transition-transform duration-700 -z-0" />
            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500">
                <Sparkles size={20} />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-pink-500/10 border border-pink-500/20 px-2.5 py-0.5 rounded-full text-pink-500 text-[8px] font-black uppercase tracking-widest">
                  {i18n.language === 'te' ? 'అట్టహాసంగా ప్రారంభం' : i18n.language === 'hi' ? 'भव्य शुभारंभ' : 'Grand Launch'}
                </div>
                <h3 className="text-xl font-black text-stone-900 font-display">💍 {i18n.language === 'hi' ? 'परिणय' : i18n.language === 'te' ? 'పరిణయ' : 'Parinaya'} Matrimony</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-semibold">
                  {i18n.language === 'te'
                    ? 'మన సంఘం కోసం ప్రత్యేకంగా రూపొందించిన అధికారిక మ్యాట్రిమోనీ ప్లాట్‌ఫారమ్ దశాబ్ది ఉత్సవాల వేడుకలో ప్రారంభించబడుతుంది. త్వరగా నమోదు చేసుకోండి!'
                    : i18n.language === 'hi'
                    ? 'दशकीय समारोह के इस अवसर पर हमारे समाज के लिए विशेष रूप से बनाए गए आधिकारिक मैट्रिमोनी प्लेटफॉर्म का शुभारंभ हो रहा है। शीघ्र पंजीकरण करें!'
                    : 'The official community-exclusive matrimony platform launches at the decennial celebration event. Register early!'}
                </p>
              </div>
            </div>

            <div className="pt-8 relative z-10">
              <span className="inline-flex items-center gap-2 text-[10px] font-black text-pink-500 uppercase tracking-widest group-hover:gap-3.5 transition-all">
                {i18n.language === 'te' ? 'వెయిట్‌లిస్ట్‌లో నమోదు చేసుకోండి' : i18n.language === 'hi' ? 'प्रतीक्षा सूची में शामिल हों' : 'Register Waitlist'} <span className="text-pink-500">→</span>
              </span>
            </div>
          </div>

          {/* Card 3: Membership Cards */}
          <Link
            to="/membership"
            className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm relative overflow-hidden group flex flex-col justify-between hover:shadow-2xl transition-all duration-500 hover:border-vermilion/20"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-vermilion/5 -mr-12 -mt-12 rounded-full group-hover:scale-[3] transition-transform duration-700 -z-0" />
            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 bg-vermilion/5 rounded-2xl flex items-center justify-center text-vermilion">
                <CreditCard size={20} />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-vermilion/10 border border-vermilion/20 px-2.5 py-0.5 rounded-full text-vermilion text-[8px] font-black uppercase tracking-widest">
                  {i18n.language === 'te' ? 'ప్రత్యక్ష పంపిణీ' : i18n.language === 'hi' ? 'लाइव वितरण' : 'Live Distribution'}
                </div>
                <h3 className="text-xl font-black text-stone-900 font-display">
                  {i18n.language === 'te' ? 'VKC సభ్యత్వ కార్డులు' : i18n.language === 'hi' ? 'VKC सदस्यता कार्ड' : 'VKC Membership Cards'}
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed font-semibold">
                  {i18n.language === 'te'
                    ? 'విడుదల మరియు పంపిణీ ఈరోజు ప్రారంభం. మీ కార్డు కోసం ఆన్‌లైన్ దరఖాస్తు చేసుకోండి.'
                    : i18n.language === 'hi'
                    ? 'आज समारोह में आधिकारिक सामुदायिक कार्डों का वितरण शुरू हो रहा है। अपना कार्ड प्राप्त करने के लिए ऑनलाइन आवेदन अवश्य करें!'
                    : 'Distribution of official community cards begins at the event today. Make sure to apply online to claim yours!'}
                </p>
              </div>
            </div>

            <div className="pt-8 relative z-10">
              <span className="inline-flex items-center gap-2 text-[10px] font-black text-vermilion uppercase tracking-widest group-hover:gap-3.5 transition-all">
                {i18n.language === 'te' ? 'కార్డు కోసం దరఖాస్తు చేసుకోండి' : i18n.language === 'hi' ? 'कार्ड के लिए आवेदन करें' : 'Apply for Card'} <span className="text-vermilion">→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Dignitaries Gallery */}
        <div className="mb-16">
          <div className="text-center mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 bg-saffron-550/10 border border-saffron-500/20 px-4 py-1.5 rounded-full text-saffron-700 mb-2">
              <Users size={13} className="text-saffron-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {i18n.language === 'te' ? 'గౌరవనీయ అతిథులు' : i18n.language === 'hi' ? 'माननीय अतिथिगण' : 'Honourable Guests'}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight font-display">
              {i18n.language === 'te'
                ? '22 మంది ప్రముఖ అతిథులు'
                : i18n.language === 'hi'
                ? '22 गणमान्य अतिथिगण'
                : '22 Distinguished Dignitaries'}
            </h3>
            <p className="text-stone-500 text-sm font-medium">
              {i18n.language === 'te'
                ? 'దశాబ్ది ఉత్సవాల సందర్భంగా ఆశీర్వదించడానికి విచ్చేస్తున్న మహనీయులు'
                : i18n.language === 'hi'
                ? 'दशकीय समारोह को आशीर्वाद देने पधारे महानुभाव'
                : 'Eminent personalities gracing the decennial celebration'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {DIGNITARIES.map((g, idx) => {
              const initials = getInitials(g.nameEn);
              const name = i18n.language === 'te' ? g.nameTe : i18n.language === 'hi' ? g.nameHi : g.nameEn;
              const sub = i18n.language === 'te' ? g.subTe : i18n.language === 'hi' ? g.subHi : g.subEn;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className="group flex flex-col items-center text-center gap-3 bg-white border border-stone-100 rounded-3xl p-4 hover:shadow-xl hover:border-saffron-500/20 transition-all duration-300"
                >
                  {/* Photo */}
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 border-2 border-stone-200 group-hover:border-saffron-500/40 transition-all duration-300 shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-saffron-100 to-stone-100 text-saffron-700 text-2xl font-black">
                      {initials}
                    </div>
                    {g.photo && (
                      <img
                        src={g.photo}
                        alt={g.nameEn}
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-0.5 min-w-0 w-full">
                    <p className="text-[11px] font-black text-stone-900 leading-tight line-clamp-2">
                      {name}
                    </p>
                    <p className="text-[9px] font-semibold text-saffron-600 leading-snug line-clamp-2">
                      {sub}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Schedule & Specific Highlights */}
        <div className="bg-stone-50 border border-stone-100 p-8 md:p-12 rounded-[2.5rem] grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h4 className="text-xs font-black text-saffron-600 uppercase tracking-widest flex items-center gap-2">
              <Award size={16} /> {i18n.language === 'te' ? 'కార్యక్రమ ముఖ్యాంశాలు' : i18n.language === 'hi' ? 'कार्यक्रम की मुख्य विशेषताएं (Event Agenda)' : 'Event Agenda'}
            </h4>
            <ul className="space-y-4 text-xs font-bold text-stone-600 uppercase tracking-wider">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-saffron-550 rounded-full shrink-0" />
                {i18n.language === 'te'
                  ? '🏛️ వివిధ రాష్ట్రాల నాయకులతో జాతీయ సదస్సు'
                  : i18n.language === 'hi'
                  ? '🏛️ विभिन्न राज्यों के नेताओं के साथ राष्ट्रीय सम्मेलन'
                  : '🏛️ National Conference with state leaders'}
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-saffron-550 rounded-full shrink-0" />
                {i18n.language === 'te'
                  ? '🏆 విశ్వకర్మ లెజెండరీ & లీడర్ అవార్డుల ప్రధానోత్సవం'
                  : i18n.language === 'hi'
                  ? '🏆 विश्वकर्मा लेजेंडरी और लीडर पुरस्कारों का वितरण'
                  : '🏆 Vishwakarma Legendary & Leader Awards'}
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-saffron-550 rounded-full shrink-0" />
                {i18n.language === 'te'
                  ? '🎓 ఉత్తమ ప్రతిభ కనబరిచిన విద్యార్థులకు పురస్కారాలు (10వ తరగతి/ఇంటర్)'
                  : i18n.language === 'hi'
                  ? '🎓 मेधावी छात्रों के लिए पुरस्कार (10वीं/इंटर)'
                  : '🎓 Student Excellence Awards (10th/Inter)'}
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-saffron-550 rounded-full shrink-0" />
                {i18n.language === 'te'
                  ? '💍 పరిణయ మ్యాట్రిమోనీ ప్రారంభోత్సవం'
                  : i18n.language === 'hi'
                  ? '💍 परिणय मैट्रिमोनी का भव्य शुभारंभ'
                  : '💍 Parinaya Matrimony Launch'}
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-saffron-550 rounded-full shrink-0" />
                {i18n.language === 'te'
                  ? '🌐 అధికారిక వెబ్‌సైట్ ప్రారంభోత్సవ వేడుక'
                  : i18n.language === 'hi'
                  ? '🌐 आधिकारिक वेबसाइट का उद्घाटन समारोह'
                  : '🌐 Official Website Launch Ceremony'}
              </li>
            </ul>
          </div>

          <div className="space-y-6 flex flex-col justify-center">
            <h4 className="text-xs font-black text-stone-900 uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-saffron-600" /> {i18n.language === 'te' ? 'తేదీ & సమయాలు' : i18n.language === 'hi' ? 'दिनांक और समय' : 'Date & Timings'}
            </h4>
            <p className="text-stone-500 text-xs leading-relaxed font-bold uppercase tracking-widest">
              {i18n.language === 'te'
                ? 'నేడు (ఆదివారం, 31 మే 2026)'
                : i18n.language === 'hi'
                ? 'आज (रविवार, 31 मई 2026)'
                : 'Today (Sunday, May 31, 2026)'}
              <br/>
              {i18n.language === 'te'
                ? 'సాయంత్రం 05:00 నుండి రాత్రి 09:30 వరకు IST'
                : i18n.language === 'hi'
                ? 'शाम 05:00 बजे से रात 09:30 बजे IST तक'
                : '05:00 PM to 09:30 PM IST'}
            </p>
            <div className="h-[1px] bg-stone-200 w-full" />
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
              {i18n.language === 'te'
                ? 'ఆహ్వానాల కొరకు సంప్రదించండి: 9700960815, 8886469469'
                : i18n.language === 'hi'
                ? 'आरएसवीपी संपर्क: 9700960815, 8886469469'
                : 'RSVP Contact: 9700960815, 8886469469'}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
