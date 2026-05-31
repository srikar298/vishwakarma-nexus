import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Megaphone, ArrowUpRight, X } from 'lucide-react';

export const AnnouncementTicker = () => {
  const { t, i18n } = useTranslation();
  const [isMatrimonyModalOpen, setIsMatrimonyModalOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const announcements = [
    {
      id: "matrimony",
      en: "💍 Parinaya: Grand Launch of \"Vishwakarma Matrimony\" exclusively for our community. Register interest now!",
      te: "💍 పరిణయ: మన సంఘం కోసం ప్రత్యేకంగా \"విశ్వకర్మ మ్యాట్రిమోనీ\" అట్టహాసంగా ప్రారంభోత్సవం",
      hi: "💍 परिणय: हमारे समाज के लिए विशेष रूप से \"विश्वकर्मा मैट्रिमोनी\" का भव्य शुभारंभ"
    },
    { 
      id: "pm-scheme",
      en: "PM Vishwakarma Scheme: New registration cycle open for 2026. Apply now at reach out to VKC admin.",
      te: "పీఎం విశ్వకర్మ పథకం: 2026 కొత్త రిజిస్ట్రేషన్ సైకిల్ ప్రారంభమైంది. వివరాలకు వికెసి అడ్మిన్‌ను సంప్రదించండి.",
      hi: "पीएम विश्वकर्मा योजना: 2026 के लिए नया पंजीकरण चक्र खुला है। अधिक जानकारी के लिए वीकेसी एडमिन से संपर्क करें।"
    },
    {
      id: "summit",
      en: "Upcoming: State-level Artisan Summit in Hyderabad (August 15th). Stay tuned for details.",
      te: "రాబోయే ఈవెంట్: హైదరాబాద్‌లో రాష్ట్ర స్థాయి కళాకారుల సదస్సు (ఆగస్టు 15). వివరాల కోసం వేచి ఉండండి.",
      hi: "आगामी: हैदराबाद में राज्य स्तरीय शिल्पकार शिखर सम्मेलन (15 अगस्त)। विवरण के लिए बने रहें।"
    }
  ];

  return (
    <>
      <div className="bg-vermilion text-white py-2 overflow-hidden border-b border-vermilion-700 relative z-[60]">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 md:gap-4">
          {/* Static Header */}
          <div className="flex items-center gap-2 bg-black/20 px-2 md:px-3 py-1 rounded-full border border-white/20 whitespace-nowrap shrink-0">
            <Megaphone size={12} className="animate-bounce shrink-0 text-white" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white">{t('updates.latest', 'Latest Updates')}</span>
          </div>

          {/* Ticker Animation */}
          <div className="flex-1 overflow-hidden relative h-6">
            <motion.div
              animate={{ x: ["100%", "-100%"] }}
              transition={{ 
                repeat: Infinity, 
                duration: 35, 
                ease: "linear" 
              }}
              className="flex items-center gap-20 whitespace-nowrap"
            >
              {announcements.map((ann, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    if (ann.id === 'matrimony') {
                      setIsMatrimonyModalOpen(true);
                    }
                  }}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <span className="text-xs font-bold tracking-wide italic opacity-90 group-hover:opacity-100 transition-opacity">
                    { (ann as any)[i18n.language] || (ann as any)['en'] }
                  </span>
                  <div className="bg-white/20 p-1 rounded-full group-hover:bg-white group-hover:text-vermilion transition-all">
                    <ArrowUpRight size={10} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Matrimony Coming Soon Modal */}
      <AnimatePresence>
        {isMatrimonyModalOpen && (
          <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => {
              setIsMatrimonyModalOpen(false);
              setIsSubmitted(false);
              setWaitlistEmail("");
            }} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-[2.5rem] w-full max-w-md p-8 md:p-10 border border-stone-850 shadow-2xl relative overflow-hidden z-10"
            >
              {/* Pink & Gold Ambient Glows */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => {
                  setIsMatrimonyModalOpen(false);
                  setIsSubmitted(false);
                  setWaitlistEmail("");
                }}
                className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white transition-colors bg-stone-800/50 rounded-full border border-stone-800/80"
              >
                <X size={16} />
              </button>

              <div className="text-center space-y-6 relative z-10">
                {/* Visual Icon Header */}
                <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-rose-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20 ring-4 ring-rose-500/10">
                  <span className="text-4xl">💍</span>
                </div>

                <div className="space-y-2">
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block">
                    {i18n.language === 'te' ? 'త్వరలో ప్రారంభం' : i18n.language === 'hi' ? 'जल्द ही आ रहा है' : 'Coming Soon'}
                  </span>
                  <h3 className="text-2xl font-black tracking-tight leading-tight text-white">
                    {i18n.language === 'te' 
                      ? 'పరిణయ: విశ్వకర్మ మ్యాట్రిమోనీ' 
                      : i18n.language === 'hi' 
                        ? 'परिणय: विश्वकर्मा मैट्रिमोनी' 
                        : 'Parinaya: Vishwakarma Matrimony'}
                  </h3>
                </div>

                <p className="text-stone-300 text-xs font-medium leading-relaxed max-w-sm mx-auto">
                  {i18n.language === 'te'
                    ? 'మన విశ్వకర్మ సంఘం కోసం ప్రత్యేకంగా సురక్షితమైన, ధృవీకరించబడిన మరియు గౌరవప్రదమైన మ్యాట్రిమోనీ పోర్టల్‌ను రూపొందిస్తున్నాము. అతి త్వరలోనే ప్రారంభం కానుంది!'
                    : i18n.language === 'hi'
                      ? 'हमारे विश्वकर्मा समाज के लिए विशेष रूप से सुरक्षित, सत्यापित और सम्मानित मैट्रिमोनी पोर्टल तैयार किया जा रहा है। बहुत जल्द लॉन्च होगा!'
                      : 'We are crafting a highly secure, verified, and premium matchmaking portal tailored exclusively for the Vishwakarma community. Launching very soon!'}
                </p>

                {/* Interactive Waitlist Form */}
                <div className="pt-2">
                  {isSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-emerald-400 text-xs font-bold"
                    >
                      {i18n.language === 'te'
                        ? '🎉 ధన్యవాదాలు! మీ ఆసక్తి నమోదు చేయబడింది. ప్రారంభించిన వెంటనే మీకు తెలియజేస్తాము.'
                        : i18n.language === 'hi'
                          ? '🎉 धन्यवाद! आपकी रुचि दर्ज कर ली गई है। लॉन्च होते ही आपको सूचित किया जाएगा।'
                          : '🎉 Thank you! Your interest has been registered. We will notify you at launch.'}
                    </motion.div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (waitlistEmail.trim()) {
                          setIsSubmitted(true);
                        }
                      }}
                      className="space-y-3"
                    >
                      <input 
                        type="text"
                        required
                        placeholder={i18n.language === 'te' 
                          ? 'మీ ఫోన్ నంబర్ లేదా ఈమెయిల్' 
                          : i18n.language === 'hi' 
                            ? 'आपका फोन नंबर या ईमेल' 
                            : 'Your Phone Number or Email'}
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl bg-stone-850 border border-stone-800 text-white placeholder-stone-500 text-xs focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all text-center"
                      />
                      <button 
                        type="submit"
                        className="w-full bg-rose-600 text-white h-12 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all active:scale-98 shadow-lg shadow-rose-600/20"
                      >
                        {i18n.language === 'te' 
                          ? 'త్వరగా అప్‌డేట్స్ పొందండి' 
                          : i18n.language === 'hi' 
                            ? 'अपडेट प्राप्त करें' 
                            : 'Get Notified'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
