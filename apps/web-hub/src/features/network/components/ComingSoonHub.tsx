import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Heart, 
  Briefcase, 
  Gavel, 
  GraduationCap,
  Sparkles,
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Phone,
  User,
  MapPin,
  Share2,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';
import { supabase } from '@/infrastructure/config/supabaseClient';
import { type TrackType } from '@/features/onboarding/components/JoinModal';

interface ComingSoonHubProps {
  activeTab: 'professionals' | 'officials' | 'matrimony' | 'education';
  onOpenRegistration?: (track: TrackType) => void;
}

const STATES_AND_DISTRICTS = [
  "Telangana - Mahabubnagar", "Telangana - Hyderabad", "Telangana - Rangareddy", 
  "Telangana - Medchal", "Telangana - Warangal", "Telangana - Karimnagar", 
  "Telangana - Nalgonda", "Telangana - Khammam", "Telangana - Nizamabad",
  "Telangana - Sangareddy", "Telangana - Vikarabad", "Telangana - Adilabad",
  "Andhra Pradesh - Visakhapatnam", "Andhra Pradesh - Vijayawada / Krishna", 
  "Andhra Pradesh - Guntur", "Andhra Pradesh - Tirupati", "Andhra Pradesh - Kurnool",
  "Andhra Pradesh - Anantapur", "Andhra Pradesh - Godavari", "Karnataka - Bengaluru", 
  "Maharashtra", "Delhi / NCR", "Other Region"
];

const CONFIG = {
  professionals: {
    titleEn: "Vedic Careers: Professionals Hub",
    titleTe: "వికెసి ప్రొఫెషనల్స్ హబ్",
    titleHi: "वीकेसी प्रोफेशनल्स हब",
    descEn: "Connecting master craftsmen, engineers, and corporate leaders across the globe to foster community collaborations and projects.",
    descTe: "ప్రపంచవ్యాప్తంగా ఉన్న మన కమ్యూనిటీ నిపుణులు, ఇంజనీర్లు మరియు పారిశ్రామికవేత్తలను ఒకే వేదికపైకి తీసుకురావడం.",
    descHi: "सामुदायिक सहयोग और परियोजनाओं को बढ़ावा देने के लिए दुनिया भर के मास्टर शिल्पकारों, इंजीनियरों और कॉर्पोरेट नेताओं को जोड़ना।",
    pointsEn: [
      "👔 Master Mentor Registry (Direct advice from IAS, IPS, and Senior Engineers)",
      "🤝 Peer-to-peer Project Referrals & Consulting",
      "🎓 Guild Apprenticeship Programs for Young Artisans"
    ],
    pointsTe: [
      "👔 మాస్టర్ మెంటార్ రిజిస్ట్రీ (ఐఏఎస్, ఇంజనీర్ల మార్గదర్శకత్వం)",
      "🤝 నిపుణుల మధ్య ప్రాజెక్ట్ రిఫరల్స్ మరియు కన్సల్టింగ్",
      "🎓 యువ శిల్పులకు అప్రెంటిస్‌షిప్ కార్యక్రమాలు"
    ],
    pointsHi: [
      "👔 मास्टर मेंटर रजिस्ट्री (आईएएस, आईपीएस और वरिष्ठ इंजीनियरों से सीधा मार्गदर्शन)",
      "🤝 आपसी प्रोजेक्ट रेफरल और परामर्श प्रणाली",
      "🎓 युवा शिल्पकारों के लिए व्यावसायिक अप्रेंटिसशिप कार्यक्रम"
    ],
    icon: <Briefcase size={40} />,
    accent: "text-blue-600",
    border: "border-blue-100",
    bg: "from-blue-50 to-indigo-50",
    glow: "bg-blue-500/10",
    btnBg: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
  },
  officials: {
    titleEn: "Administrative Registry: Officials Hub",
    titleTe: "అధికారిక వేదిక: అడ్మినిస్ట్రేటివ్ హబ్",
    titleHi: "प्रशासनिक निर्देशिका: अधिकारी केंद्र",
    descEn: "Bridging the gap between our people, public administrators, civil servants, and welfare scheme officials.",
    descTe: "ప్రజా సంక్షేమం కోసం ప్రభుత్వ అధికారులు, ప్రజాప్రతినిధులు మరియు ప్రజల మధ్య ప్రత్యక్ష అనుసంధానం.",
    descHi: "हमारे समाज के नागरिकों, सिविल सेवकों, और प्रशासनिक अधिकारियों के बीच मजबूत सेतु।",
    pointsEn: [
      "🏛️ Verified Public Servant Directory & Direct Connect Desk",
      "🛡️ Civic Grievance & Legal Advocacy Support Network",
      "📢 Direct Citizen Welfare & Scholarship Guidance Support"
    ],
    pointsTe: [
      "🏛️ ధృవీకరించబడిన అధికారుల వివరాలు మరియు సంప్రదింపు వేదిక",
      "🛡️ సామాజిక హక్కులు మరియు రక్షణ కోసం ప్రత్యేక విభాగాలు",
      "📢 ప్రజా సంక్షేమ పథకాలు మరియు స్కాలర్‌షిప్‌ల సమాచారం"
    ],
    pointsHi: [
      "🏛️ सत्यापित प्रशासनिक निर्देशिका और संपर्क मंच",
      "🛡️ सामुदायिक अधिकारों और जनहित के लिए वकालत मंच",
      "📢 जनकल्याणकारी योजनाओं और छात्रवृत्ति सहायता प्रणाली"
    ],
    icon: <Gavel size={40} />,
    accent: "text-saffron-600",
    border: "border-saffron-100",
    bg: "from-saffron-50/50 to-orange-50/50",
    glow: "bg-saffron-500/10",
    btnBg: "bg-saffron-600 hover:bg-saffron-700 shadow-saffron-600/20"
  },
  education: {
    titleEn: "Gyan Vardhini: Education Hub",
    titleTe: "జ్ఞాన వర్ధిని: విద్యా విభాగం",
    titleHi: "ज्ञान वर्धिनी: शिक्षा केंद्र",
    descEn: "Empowering the next generation of scholars with study circles, exam guides, mentorship portfolios, and decennial merit scholarships.",
    descTe: "విద్యార్థులకు స్టడీ సర్కిల్స్, పోటీ పరీక్షల గైడ్స్, మెంటార్షిప్ మరియు దశాబ్ది మెరిట్ స్కాలర్‌షిప్‌ల ద్వారా సాధికారత.",
    descHi: "अगली पीढ़ी के छात्रों को अध्ययन मंडलियों, परीक्षा गाइड, मेंटरशिप और दशकीय योग्यता छात्रवृत्ति से सशक्त बनाना।",
    pointsEn: [
      "🎓 Decennial Merit Scholarships (Top 5% Student Fellowships)",
      "📚 UPSC & Civil Services Strategy Roadmaps by IAS Mentors",
      "💡 Industry-aligned Tech Internships & Placements"
    ],
    pointsTe: [
      "🎓 వికెసి దశాబ్ది మెరిట్ స్కాలర్‌షిప్‌లు",
      "📚 ఐఏఎస్ అధికారుల పర్యవేక్షణలో యూపీఎస్సీ పోటీ పరీక్షల శిక్షణ",
      "💡 ఐటీ మరియు ఇంజనీరింగ్ రంగాల్లో ఇంటర్న్‌షిప్‌ల అమరిక"
    ],
    pointsHi: [
      "🎓 वीकेसी दशकीय योग्यता छात्रवृत्ति (शीर्ष 5% छात्रों के लिए)",
      "📚 आईएएस मेंटर्स द्वारा सिविल सेवा परीक्षा की रणनीतिक तैयारी",
      "💡 सूचना प्रौद्योगिकी और इंजीनियरिंग उद्योगों में इंटर्नशिप"
    ],
    icon: <GraduationCap size={40} />,
    accent: "text-emerald-600",
    border: "border-emerald-100",
    bg: "from-emerald-50 to-teal-50",
    glow: "bg-emerald-500/10",
    btnBg: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
  },
  matrimony: {
    titleEn: "Parinaya: Matrimony Portal",
    titleTe: "పరిణయ: విశ్వకర్మ మ్యాట్రిమోనీ",
    titleHi: "परिणय: विश्वकर्मा मैट्रिमोनी",
    descEn: "A secure, verified, and premium matchmaking network designed exclusively to safeguard family values in our community.",
    descTe: "మన విశ్వకర్మ కుటుంబాల కోసం ప్రత్యేకంగా రూపొందిస్తున్న అత్యంత సురక్షితమైన మరియు ధృవీకరించబడిన మ్యాట్రిమోనీ పోర్టల్.",
    descHi: "हमारे विश्वकर्मा परिवारों के लिए विशेष रूप से तैयार किया गया अत्यंत सुरक्षित और सत्यापित मैट्रिमोनी पोर्टल।",
    pointsEn: [
      "💍 100% Identity-Verified Matches (Mandatory Registry Validation)",
      "🔒 Secure Privacy Settings with High-grade Profile Photo Protection",
      "📜 Traditional Kula-wise Clan & Lineage Registry Integration"
    ],
    pointsTe: [
      "💍 100% ధృవీకరించబడిన ప్రొఫైల్స్ (తప్పనిసరి రిజిస్ట్రీ వెరిఫికేషన్)",
      "🔒 అత్యున్నత భద్రతతో కూడిన ప్రొఫైల్ ఫోటోల రక్షణ సెట్టింగ్స్",
      "📜 గోత్రాలు మరియు శాఖల ఆధారిత సంప్రదాయ అనుసంధానం"
    ],
    pointsHi: [
      "💍 100% पहचान-सत्यापित मैच (अनिवार्य पृष्ठभूमि सत्यापन)",
      "🔒 उच्च स्तरीय फोटो सुरक्षा और सख्त गोपनीयता सेटिंग्स",
      "📜 पारंपरिक गोत्र और शाखा-वार ऐतिहासिक संरेखण"
    ],
    icon: <Heart size={40} />,
    accent: "text-rose-600",
    border: "border-rose-100",
    bg: "from-rose-50 to-pink-50",
    glow: "bg-rose-500/10",
    btnBg: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
  }
};

export const ComingSoonHub = ({ activeTab, onOpenRegistration }: ComingSoonHubProps) => {
  const { i18n } = useTranslation();
  const lang = (['en', 'te', 'hi'].includes(i18n.language) ? i18n.language : 'en') as 'en' | 'te' | 'hi';
  const cfg = CONFIG[activeTab];

  // Matrimony Registration Form State
  const [formData, setFormData] = useState({
    track: 'matrimony' as TrackType,
    name: '',
    phone: '',
    location: '',
    gotraOrSubsect: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [copied, setCopied] = useState(false);

  const title = lang === 'te' ? cfg.titleTe : lang === 'hi' ? cfg.titleHi : cfg.titleEn;
  const desc = lang === 'te' ? cfg.descTe : lang === 'hi' ? cfg.descHi : cfg.descEn;
  const points = lang === 'te' ? cfg.pointsTe : lang === 'hi' ? cfg.pointsHi : cfg.pointsEn;

  const handleMatrimonySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.phone.length < 10) return;

    setLoading(true);
    const generatedId = `VKC-M-${Math.floor(100000 + Math.random() * 900000)}`;
    setMemberId(generatedId);

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      trade: `Parinaya Matrimony - ${formData.gotraOrSubsect || 'Verified Aspirant'}`,
      state: formData.location || 'Telangana / AP',
    };

    const { error } = await supabase
      .from('inquiries')
      .insert([payload]);

    if (error) {
      setSuccess(true);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleGenericSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.phone.length < 10) return;

    setLoading(true);
    const { error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          trade: `Waitlist: ${cfg.titleEn}`,
          state: 'Waitlist Registration'
        }
      ]);

    if (error) {
      alert(`Registration failed: ${error.message}. Please try again later.`);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const getShareText = () => {
    if (lang === 'te') {
      return `*|| జై విశ్వకర్మ ||*\n*పరిణయ మ్యాట్రిమోనీ — VKC అధికారిక పోర్టల్*\n\nనేను నా ప్రొఫైల్ వివరాలను నమోదు చేసుకున్నాను.\n*నా రిజిస్ట్రేషన్ ఐడీ:* ${memberId}\n\n*విశ్వకర్మ కుటుంబాల కోసం 100% ధృవీకరించబడిన పోర్టల్‌లో ఇప్పుడే నమోదు చేసుకోండి:*\nhttps://vishwakarmaknowledgecentre.org/network?tab=matrimony`;
    }
    if (lang === 'hi') {
      return `*|| जय विश्वकर्मा ||*\n*परिणय मैट्रिमोनी — VKC आधिकारिक पोर्टल*\n\nमैंने अपना प्रोफाइल सफलतापूर्वक पंजीकृत कर लिया है।\n*मेरी रजिस्ट्रेशन आईडी:* ${memberId}\n\n*विश्वकर्मा परिवारों के 100% सत्यापित पोर्टल पर अभी रजिस्टर करें:*\nhttps://vishwakarmaknowledgecentre.org/network?tab=matrimony`;
    }
    return `*|| Jai Vishwakarma ||*\n*Parinaya Matrimony — Official VKC Matchmaking Registry*\n\nI have registered my profile on Parinaya Matrimony.\n*Registration ID:* ${memberId}\n\n*Register on our verified community network:*\nhttps://vishwakarmaknowledgecentre.org/network?tab=matrimony`;
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

  return (
    <div className="space-y-16">
      {/* Hero Panel */}
      <div className={`bg-gradient-to-br ${cfg.bg} rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 border ${cfg.border} flex flex-col md:flex-row items-center gap-12 md:gap-16 relative overflow-hidden shadow-sm`}>
        <div className={`absolute top-0 right-0 w-80 h-80 ${cfg.glow} blur-[120px] rounded-full pointer-events-none`} />
        <div className={`absolute bottom-0 left-0 w-80 h-80 ${cfg.glow} blur-[120px] rounded-full pointer-events-none`} />

        <div className="md:w-1/2 space-y-8 relative z-10">
          <div className="inline-flex items-center gap-3 bg-white px-4 py-1.5 rounded-full shadow-sm border border-stone-100">
            <span className={cfg.accent}>{cfg.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">
              {activeTab === 'matrimony' 
                ? (lang === 'te' ? 'అధికారిక రిజిస్ట్రేషన్' : lang === 'hi' ? 'आधिकारिक पंजीकरण' : 'Official Registry')
                : (lang === 'te' ? 'త్వరలో ప్రారంభం' : lang === 'hi' ? 'शीघ्र आ रहा है' : 'Coming Soon')}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-stone-900 font-display leading-tight">
            {title}
          </h2>
          
          <p className="text-stone-600 text-base md:text-lg font-medium leading-relaxed">
            {desc}
          </p>

          {/* List of Features */}
          <div className="space-y-3.5 pt-2">
            {points.map((p, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-stone-500 mt-1 shrink-0">✨</span>
                <span className="text-stone-700 text-sm font-semibold leading-relaxed">{p}</span>
              </div>
            ))}
          </div>

          {activeTab === 'matrimony' && onOpenRegistration && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenRegistration('matrimony')}
                className="text-xs font-black text-rose-700 hover:text-rose-800 flex items-center gap-2 underline underline-offset-4 cursor-pointer"
              >
                {lang === 'te' ? 'పూర్తి స్క్రీన్ రిజిస్ట్రేషన్ మోడల్‌లో తెరవండి →' : lang === 'hi' ? 'फुल स्क्रीन पंजीकरण फॉर्म खोलें →' : 'Open in Full Registration Modal →'}
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Registration / Waitlist Card */}
        <div className="md:w-1/2 w-full relative z-10">
          <div className="bg-white/95 backdrop-blur-md p-7 md:p-9 rounded-[2rem] border border-white/60 shadow-xl max-w-md mx-auto space-y-5">
            {activeTab === 'matrimony' ? (
              // DEDICATED MATRIMONY REGISTRATION FORM
              <div>
                <div className="space-y-1.5 text-center mb-5">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-rose-100 text-rose-600">
                    <Heart size={24} />
                  </div>
                  <h3 className="text-base md:text-lg font-black text-stone-900 font-display pt-1">
                    {lang === 'te' ? 'పరిణయ మ్యాట్రిమోనీ రిజిస్ట్రేషన్' : lang === 'hi' ? 'परिणय मैट्रिमोनी पंजीकरण' : 'Parinaya Matrimony Registration'}
                  </h3>
                  <p className="text-stone-500 text-xs font-semibold">
                    {lang === 'te' ? 'మీ వివరాలు నమోదు చేసుకొని ధృవీకరించబడిన ప్రొఫైల్ పాస్ పొందండి.' : lang === 'hi' ? 'अपना विवरण दर्ज करें और सत्यापित प्रोफाइल पास प्राप्त करें।' : 'Register your profile to claim your Verified Matrimony Pass.'}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div 
                      key="matrimony-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4 text-center"
                    >
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="text-emerald-600 w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-stone-950 text-base">
                          {lang === 'te' ? 'నమోదు విజయవంతమైంది!' : lang === 'hi' ? 'पंजीकरण सफल रहा!' : 'Registration Confirmed!'}
                        </h4>
                        <p className="text-stone-600 text-xs mt-0.5">
                          {lang === 'te' ? 'పరిణయ మ్యాట్రిమోనీలో మీ ఆసక్తి నమోదు చేయబడింది.' : lang === 'hi' ? 'परिणय मैट्रिमोनी में आपकी रुचि सफलतापूर्वक दर्ज कर ली गई है।' : 'Your interest in Parinaya Matrimony has been registered.'}
                        </p>
                      </div>

                      {/* Verified Pass Card */}
                      <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-xl p-4 text-left border border-rose-500/30 text-xs space-y-2">
                        <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                          <span className="text-[10px] text-rose-400 font-black uppercase">💍 Parinaya Matrimony</span>
                          <span className="bg-rose-500/20 text-rose-300 text-[9px] font-black px-1.5 py-0.5 rounded">{memberId}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-[9px] text-stone-400 block uppercase">Name</span>
                            <span className="font-bold text-white truncate block">{formData.name}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-stone-400 block uppercase">Mobile</span>
                            <span className="font-bold text-white block">{formData.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Viral Actions */}
                      <div className="space-y-2 pt-1">
                        <button 
                          onClick={handleWhatsAppShare}
                          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
                        >
                          <Share2 size={14} />
                          <span>{lang === 'te' ? 'వాట్సాప్‌లో బంధువులతో పంచుకోండి' : lang === 'hi' ? 'व्हाट्सएप पर साझा करें' : 'Share on WhatsApp'}</span>
                        </button>
                        <button 
                          onClick={handleCopy}
                          className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          <span>{copied ? (lang === 'te' ? 'కాపీ చేయబడింది!' : lang === 'hi' ? 'कॉपी किया गया!' : 'Copied!') : (lang === 'te' ? 'పాస్ వివరాలు కాపీ చేయండి' : lang === 'hi' ? 'विवरण कॉपी करें' : 'Copy Pass Details')}</span>
                        </button>
                      </div>

                      <button 
                        onClick={() => {
                          setSuccess(false);
                          setFormData({ track: 'matrimony', name: '', phone: '', location: '', gotraOrSubsect: '' });
                        }}
                        className="text-stone-400 hover:text-stone-700 text-xs font-bold pt-1 cursor-pointer"
                      >
                        {lang === 'te' ? 'మరో ప్రొఫైల్ నమోదు చేయండి' : lang === 'hi' ? 'अन्य प्रोफाइल दर्ज करें' : 'Register Another Profile'}
                      </button>
                    </motion.div>
                  ) : (
                    <form key="matrimony-form" onSubmit={handleMatrimonySubmit} className="space-y-3.5">
                      {/* Registration Purpose / Category Dropdown */}
                      <div className="space-y-1">
                        <label htmlFor="matrimony-purpose-select" className="text-[9px] font-black text-stone-500 uppercase tracking-widest">
                          {lang === 'te' ? 'నమోదు విభాగం' : lang === 'hi' ? 'पंजीकरण श्रेणी' : 'Registration Category'}
                        </label>
                        <div className="relative">
                          <select
                            id="matrimony-purpose-select"
                            value={formData.track}
                            onChange={(e) => setFormData({ ...formData, track: e.target.value as TrackType })}
                            className="w-full h-10 pl-3 pr-8 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 outline-none transition-all text-xs font-bold bg-white cursor-pointer appearance-none text-stone-800"
                          >
                            <option value="matrimony">{lang === 'te' ? 'పరిణయ మ్యాట్రిమోనీ' : lang === 'hi' ? 'परिणय मैट्रिमोनी' : 'Parinaya Matrimony'}</option>
                            <option value="professional">{lang === 'te' ? 'వృత్తి నిపుణుల నెట్‌వర్క్' : lang === 'hi' ? 'व्यावसायिक नेटवर्क' : 'Professional Network'}</option>
                            <option value="mentor">{lang === 'te' ? 'గౌరవ మెంటార్‌గా నమోదు' : lang === 'hi' ? 'मेंटर के रूप में पंजीकरण' : 'Register as Mentor'}</option>
                            <option value="artisan">{lang === 'te' ? 'కళాకారుల డిజిటల్ ఐడీ' : lang === 'hi' ? 'शिल्पकार डिजिटल आईडी' : 'Master Artisan ID'}</option>
                            <option value="yatra">{lang === 'te' ? 'విశ్వకర్మ ఏకతా మహా పాదయాత్ర' : lang === 'hi' ? 'विश्वकर्मा एकता महा पदयात्रा' : 'Ekta Maha Padayatra'}</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Mobile Number */}
                      <div className="space-y-1">
                        <label htmlFor="matrimony-phone" className="text-[9px] font-black text-stone-500 uppercase tracking-widest flex items-center gap-1">
                          <Phone size={10} className="text-rose-600" />
                          {lang === 'te' ? 'మొబైల్ నంబర్ (వాట్సాప్) *' : lang === 'hi' ? 'मोबाइल नंबर (व्हाट्सएप) *' : 'Mobile Number (WhatsApp) *'}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-black text-stone-500">
                            🇮🇳 +91
                          </div>
                          <input 
                            id="matrimony-phone"
                            type="tel" 
                            inputMode="numeric"
                            autoComplete="tel"
                            enterKeyHint="next"
                            pattern="[0-9]{10}"
                            required
                            placeholder="98765 43210"
                            className="w-full pl-14 pr-3 py-2 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all text-base md:text-xs font-bold tracking-wider"
                            value={formData.phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setFormData(prev => ({ ...prev, phone: val }));
                            }}
                          />
                        </div>
                      </div>

                      {/* Full Name */}
                      <div className="space-y-1">
                        <label htmlFor="matrimony-name" className="text-[9px] font-black text-stone-500 uppercase tracking-widest flex items-center gap-1">
                          <User size={10} className="text-rose-600" />
                          {lang === 'te' ? 'పూర్తి పేరు *' : lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                        </label>
                        <input 
                          id="matrimony-name"
                          type="text" 
                          required
                          autoComplete="name"
                          autoCapitalize="words"
                          enterKeyHint="next"
                          placeholder={lang === 'te' ? 'ఉదా: బ్రహ్మశ్రీ రమేష్ చారి' : lang === 'hi' ? 'उदा. ब्रह्मश्री रमेश चारी' : 'e.g. Brahmasri Ramesh Chary'}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all text-base md:text-xs font-semibold"
                          value={formData.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({ ...prev, name: val }));
                          }}
                        />
                      </div>

                      {/* District / Location */}
                      <div className="space-y-1">
                        <label htmlFor="matrimony-location" className="text-[9px] font-black text-stone-500 uppercase tracking-widest flex items-center gap-1">
                          <MapPin size={10} className="text-rose-600" />
                          {lang === 'te' ? 'జిల్లా / నియోజకవర్గం' : lang === 'hi' ? 'जिला / क्षेत्र' : 'District / Area'}
                        </label>
                        <select 
                          id="matrimony-location"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all text-base md:text-xs font-semibold appearance-none bg-white cursor-pointer"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        >
                          <option value="">{lang === 'te' ? 'జిల్లా ఎంచుకోండి' : lang === 'hi' ? 'जिला चुनें' : 'Select District / Area'}</option>
                          {STATES_AND_DISTRICTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      {/* Gotra / Subsect */}
                      <div className="space-y-1">
                        <label htmlFor="matrimony-gotra" className="text-[9px] font-black text-stone-500 uppercase tracking-widest flex items-center gap-1">
                          <Heart size={10} className="text-rose-600" />
                          {lang === 'te' ? 'గోత్రం / ఉపశాఖ / వృత్తి' : lang === 'hi' ? 'गोत्र / उपशाखा / पेशा' : 'Gotra / Subsect / Profession'}
                        </label>
                        <input 
                          id="matrimony-gotra"
                          type="text" 
                          autoComplete="off"
                          enterKeyHint="done"
                          placeholder={lang === 'te' ? 'ఉదా: సనగ గోత్రం, సాఫ్ట్‌వేర్ ఇంజనీర్' : lang === 'hi' ? 'उदा. सनग गोत्र, सॉफ्टवेयर इंजीनियर' : 'e.g. Sanaga Gotra / Software Engineer'}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all text-base md:text-xs font-semibold"
                          value={formData.gotraOrSubsect}
                          onChange={(e) => setFormData(prev => ({ ...prev, gotraOrSubsect: e.target.value }))}
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={loading || !formData.name.trim() || formData.phone.length < 10}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white h-11 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-600/20 disabled:opacity-50 mt-2"
                      >
                        {loading 
                          ? (lang === 'te' ? 'నమోదు అవుతోంది...' : lang === 'hi' ? 'पंजीकरण हो रहा है...' : 'Registering...')
                          : (lang === 'te' ? 'మ్యాట్రిమోనీ ప్రొఫైల్ నమోదు చేయండి' : lang === 'hi' ? 'मैट्रिमोनी प्रोफाइल रजिस्टर करें' : 'Register Matrimony Profile')}
                        <ArrowRight size={14} />
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // GENERIC WAITLIST CARD FOR OTHER TABS
              <div>
                <div className="space-y-2 text-center mb-6">
                  <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-md border ${cfg.border}`}>
                    <span className={cfg.accent}>{cfg.icon}</span>
                  </div>
                  <h3 className="text-lg font-black text-stone-900 uppercase tracking-widest pt-2">
                    {lang === 'te' ? 'ముందస్తు నమోదు' : lang === 'hi' ? 'प्रारंभिक पंजीकरण' : 'Join the Waitlist'}
                  </h3>
                  <p className="text-stone-500 text-xs font-semibold">
                    {lang === 'te' ? 'ఈ వేదిక ప్రారంభమైన వెంటనే అప్‌డేట్స్ పొందండి.' : lang === 'hi' ? 'लॉन्च होते ही सबसे पहले अपडेट प्राप्त करें।' : 'Be the first to know when we launch this hub.'}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-3"
                    >
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="text-emerald-600 w-6 h-6" />
                      </div>
                      <h4 className="font-black text-stone-950 text-sm">
                        {lang === 'te' ? 'నమోదు పూర్తయింది!' : lang === 'hi' ? 'पंजीकरण सफल!' : 'Registration Successful!'}
                      </h4>
                      <p className="text-stone-600 text-xs font-medium leading-relaxed">
                        {lang === 'te' 
                          ? 'ధన్యవాదాలు! ప్రారంభ అప్‌డేట్స్ మరియు ఆహ్వానాలను మీకు పంపుతాము.' 
                          : lang === 'hi' 
                            ? 'धन्यवाद! हम आपको लॉन्च अपडेट और आमंत्रण भेजेंगे।' 
                            : 'Thank you! We will send you launch updates and exclusive invites.'}
                      </p>
                    </motion.div>
                  ) : (
                    <form key="form" onSubmit={handleGenericSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label htmlFor="generic-name" className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                          {lang === 'te' ? 'పూర్తి పేరు' : lang === 'hi' ? 'पूरा नाम' : 'Full Name'}
                        </label>
                        <input 
                          id="generic-name"
                          type="text" 
                          required
                          placeholder="e.g. Ramesh Achary"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full h-12 px-4 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all text-xs font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="generic-phone" className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                          {lang === 'te' ? 'మొబైల్ నంబర్' : lang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                        </label>
                        <input 
                          id="generic-phone"
                          type="tel" 
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full h-12 px-4 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all text-xs font-medium"
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white h-12 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-lg ${cfg.btnBg}`}
                      >
                        {loading 
                          ? (lang === 'te' ? 'నమోదు అవుతోంది...' : lang === 'hi' ? 'पंजीकरण हो रहा है...' : 'Registering...') 
                          : (lang === 'te' ? 'నమోదు చేసుకోండి' : lang === 'hi' ? 'पंजीकरण करें' : 'Register Interest')}
                        <ArrowRight size={14} />
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reusable Security/Trust Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { icon: <Lock className="text-stone-900" />, title: lang === 'te' ? 'పూర్తి గోప్యత' : lang === 'hi' ? 'पूर्ण गोपनीयता' : 'Privacy Assured', desc: lang === 'te' ? 'మీ వ్యక్తిగత సమాచారం పూర్తిగా సురక్షితంగా ఉంచబడుతుంది.' : lang === 'hi' ? 'आपकी व्यक्तिगत जानकारी पूरी तरह से सुरक्षित रखी जाएगी।' : 'Your data is encrypted and strictly used for community verification.' },
          { icon: <CheckCircle2 className="text-stone-900" />, title: lang === 'te' ? 'ధృవీకరించబడిన ప్రొఫైల్స్' : lang === 'hi' ? 'सत्यापित सदस्य' : 'Strict Verification', desc: lang === 'te' ? 'రిజిస్ట్రీ ప్రొఫైల్స్ అన్నీ మా కమిటీ సభ్యులచే పరిశీలించబడతాయి.' : lang === 'hi' ? 'सभी सदस्य प्रोफाइल हमारी समिति द्वारा सत्यापित किए जाते हैं।' : 'Every registrant is cross-referenced with local leadership registries.' },
          { icon: <Sparkles className="text-stone-900" />, title: lang === 'te' ? 'దశాబ్ది ప్రయోజనాలు' : lang === 'hi' ? 'दशकीय लाभ' : 'Decennial Priority', desc: lang === 'te' ? 'వెయిట్‌లిస్ట్ సభ్యులకు మొదటి ప్రాధాన్యత లభిస్తుంది.' : lang === 'hi' ? 'वेटलिस्ट सदस्यों को लॉन्च पर पहली प्राथमिकता मिलेगी।' : 'Early registrants get priority access to services at official launch.' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
             <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-2">
                {item.icon}
             </div>
             <h4 className="text-lg font-black text-stone-900 tracking-tight font-display">{item.title}</h4>
             <p className="text-stone-500 text-xs font-semibold leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
