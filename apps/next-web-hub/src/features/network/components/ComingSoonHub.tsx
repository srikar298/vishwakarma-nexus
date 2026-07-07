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
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/infrastructure/config/supabaseClient';

interface ComingSoonHubProps {
  activeTab: 'professionals' | 'officials' | 'matrimony' | 'education';
}

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
      "👔 మాస్టర్ మెంటార్ రిజిస్ట్రీ (IAS, IPS మరియు సీనియర్ ఇంజనీర్ల మార్గదర్శకత్వం)",
      "🤝 నిపుణుల మధ్య ప్రాజెక్ట్ రిఫరల్స్ మరియు కన్సల్టింగ్",
      "🎓 యువ శిల్పులకు నైపుణ్య శిక్షణ కార్యక్రమాలు"
    ],
    pointsHi: [
      "👔 मास्टर मेंटर रजिस्ट्री (IAS, IPS और वरिष्ठ इंजीनियरों से सीधा मार्गदर्शन)",
      "🤝 पेशेवरों के बीच प्रोजेक्ट रेफरल और परामर्श",
      "🎓 युवा शिल्पकारों के लिए व्यावसायिक प्रशिक्षण कार्यक्रम"
    ],
    icon: <Briefcase size={40} />,
    accent: "text-blue-600",
    border: "border-blue-100",
    bg: "from-blue-50 to-indigo-50",
    glow: "bg-blue-500/10",
    btnBg: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
  },
  officials: {
    titleEn: "Dignitary Index: Officials Directory",
    titleTe: "ప్రభుత్వ అధికారుల నిఘంటువు",
    titleHi: "शासकीय अधिकारी निर्देशिका",
    descEn: "A unified directory of IAS, IPS, administrative leaders, and political representatives in our community to strengthen advocacy.",
    descTe: "మన కమ్యూనిటీకి చెందిన ఐఏఎస్, ఐపీఎస్, రాజకీయ మరియు పరిపాలనా రంగాల ప్రముఖుల సమగ్ర సమాచారం.",
    descHi: "सामुदायिक अधिकारों को मजबूत करने के लिए समाज के आईएएस, आईपीएस, प्रशासनिक अधिकारियों और जनप्रतिनिधियों की निर्देशिका।",
    pointsEn: [
      "🏛️ Verified Administrative Directory & Contact Portals",
      "🛡️ Collective Representation & Public Advocacy Channels",
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

export const ComingSoonHub = ({ activeTab }: ComingSoonHubProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const cfg = CONFIG[activeTab];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const title = lang === 'te' ? cfg.titleTe : lang === 'hi' ? cfg.titleHi : cfg.titleEn;
  const desc = lang === 'te' ? cfg.descTe : lang === 'hi' ? cfg.descHi : cfg.descEn;
  const points = lang === 'te' ? cfg.pointsTe : lang === 'hi' ? cfg.pointsHi : cfg.pointsEn;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setLoading(true);
    const { error } = await supabase
      .from('inquiries')
      .insert([
        {
          name,
          phone,
          trade: `Waitlist: ${cfg.titleEn}`,
          state: 'Waitlist Registration'
        }
      ]);

    if (error) {
      alert("Registration failed: " + error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
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
              {lang === 'te' ? 'త్వరలో ప్రారంభం' : lang === 'hi' ? 'शीघ्र आ रहा है' : 'Coming Soon'}
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
        </div>

        {/* Waitlist Form Card */}
        <div className="md:w-1/2 w-full relative z-10">
          <div className="bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-[2rem] border border-white/60 shadow-xl max-w-md mx-auto space-y-6">
            <div className="space-y-2 text-center">
              <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-md border ${cfg.border}`}>
                <span className={cfg.accent}>{cfg.icon}</span>
              </div>
              <h3 className="text-lg font-black text-stone-900 uppercase tracking-widest pt-2">Join the Waitlist</h3>
              <p className="text-stone-500 text-xs font-semibold">Be the first to know when we launch this hub.</p>
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
                  <h4 className="font-black text-stone-950 text-sm">Registration Successful!</h4>
                  <p className="text-stone-600 text-xs font-medium leading-relaxed">
                    {lang === 'te' 
                      ? 'ధన్యవాదాలు! ప్రారంభ అప్‌డేట్స్ మరియు ఆహ్వానాలను మీకు పంపుతాము.' 
                      : lang === 'hi' 
                        ? 'धन्यवाद! हम आपको लॉन्च अपडेट और आमंत्रण भेजेंगे।' 
                        : 'Thank you! We will send you launch updates and exclusive invites.'}
                  </p>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Ramesh Achary"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Mobile Number</label>
                    <input 
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all text-xs font-medium"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white h-12 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-lg ${cfg.btnBg}`}
                  >
                    {loading ? 'Registering...' : 'Register Interest'}
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </AnimatePresence>
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
             <h5 className="text-lg font-black text-stone-900">{item.title}</h5>
             <p className="text-stone-500 text-sm leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
