"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Megaphone, ArrowUpRight, X } from 'lucide-react';
import { AnniversaryModal } from './AnniversaryModal';
import { SocialLinks } from '@/shared/ui/SocialLinks';

interface Announcement {
  id: string;
  en: string;
  te: string;
  hi: string;
}

interface AnnouncementTickerProps {
  onOpenJoinModal?: (track?: 'yatra' | 'artisan' | 'matrimony' | 'professional' | 'patron') => void;
}

export const AnnouncementTicker: React.FC<AnnouncementTickerProps> = ({ onOpenJoinModal }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [isAnniversaryModalOpen, setIsAnniversaryModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);

  const announcements = [
    {
      id: "pushpagiri-yatra",
      en: "🚩 Pushpagiri Chalo Delhi Paadha Yathra: Mobilizing the Vishwakarma Community! Register your mobile number for official updates & Digital Pass.",
      te: "🚩 పుష్పగిరి చలో ఢిల్లీ పాదయాత్ర: విశ్వకర్మ ఐక్యత కోసం మీ మొబైల్ నంబర్‌తో ఇప్పుడే నమోదు చేసుకోండి — డిజిటల్ పాస్ పొందండి.",
      hi: "🚩 पुष्पगिरि चलो दिल्ली पदयात्रा: विश्वकर्मा समाज की एकजुटता! आधिकारिक अपडेट और डिजिटल पास के लिए अभी मोबाइल नंबर से रजिस्टर करें।"
    },
    {
      id: "matrimony",
      en: "💍 Parinaya: Grand Launch of \"Vishwakarma Matrimony\" exclusively for our community. Register interest now!",
      te: "💍 పరిణయ: మన సంఘం కోసం ప్రత్యేకంగా \"విశ్వకర్మ మ్యాట్రిమోనీ\" అట్టహాసంగా ప్రారంభోత్సవం",
      hi: "💍 परिणय: हमारे समाज के लिए विशेष रूप से \"विश्वकर्मा मैट्रिमोनी\" का भव्य शुभारंभ"
    },
    {
      id: "anniversary",
      en: "🎉 VKC 10th Anniversary Decennial Celebrations successfully concluded! We express our heartfelt gratitude to Smt Seethakka garu (Minister), ACP Brahmasri K.M. Kiran Kumar Sir, and all community members who made it historic.",
      te: "🎉 VKC 10వ వార్షికోత్సవ దశాబ్ది ఉత్సవాలు విజయవంతంగా ముగిసాయి! గౌరవనీయులైన మంత్రి శ్రీమతి సీతక్క గారికి, ACP బ్రహ్మశ్రీ K.M కిరణ్ కుమార్ గారికి మరియు సహకరించిన సంఘ సభ్యులందరికీ ధన్యవాదాలు.",
      hi: "🎉 वीकेसी 10वीं वर्षगांठ दशकीय समारोह सफलतापूर्वक संपन्न हुआ! माननीय मंत्री श्रीमती सीतक्का गारू, मुख्य अतिथि एसीपी ब्रह्मश्री के.एम. किरण कुमार सर और सभी समाज बंधुओं का सहृदय आभार।"
    },
    { 
      id: "pm-scheme",
      en: "PM Vishwakarma Scheme: New registration cycle open for 2026. Apply now at reach out to VKC admin.",
      te: "పీఎం విశ్వకర్మ పథకం: 2026 కొత్త రిజిస్ట్రేషన్ సైకిల్ ప్రారంభమైంది. వివరాలకు వికెసి అడ్మిన్‌ను సంప్రదించండి.",
      hi: "पीएम विश्वकर्मा योजना: 2026 के लिए नया पंजीकरण चक्र खुला है। अधिक जानकारी के लिए वीकेसी एडमिन से संपर्क करें।"
    }
  ];

  const handleAnnouncementClick = (id: string) => {
    if (id === 'pushpagiri-yatra') {
      if (onOpenJoinModal) onOpenJoinModal('yatra');
    } else if (id === 'matrimony') {
      router.push('/network?tab=matrimony');
    } else if (id === 'anniversary') {
      setIsAnniversaryModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-vermilion text-white py-2 overflow-hidden border-b border-vermilion-700 relative z-[60]">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 md:gap-4">
          {/* Interactive Trigger Button */}
          <button 
            onClick={() => setIsListOpen(true)}
            className="flex items-center gap-2 bg-black/25 hover:bg-black/40 px-2.5 md:px-3 py-1 rounded-full border border-white/20 whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            title="View all updates"
          >
            <Megaphone size={12} className="animate-pulse shrink-0 text-white" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white">
              {t('updates.latest', 'Latest Updates')}
            </span>
          </button>

          {/* Ticker Animation */}
          <div className="flex-1 overflow-hidden relative h-6">
            <motion.div
              animate={{ x: ["100%", "-100%"] }}
              transition={{ 
                repeat: Infinity, 
                duration: 55, 
                ease: "linear" 
              }}
              className="flex items-center gap-20 whitespace-nowrap"
            >
              {announcements.map((ann, i) => (
                <div 
                  key={i} 
                  onClick={() => handleAnnouncementClick(ann.id)}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <span className="text-xs font-bold tracking-wide italic opacity-90 group-hover:opacity-100 transition-opacity">
                    { ann[i18n.language as keyof Announcement] || ann.en }
                  </span>
                  <div className="bg-white/20 p-1 rounded-full group-hover:bg-white group-hover:text-vermilion transition-all">
                    <ArrowUpRight size={10} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Social Utility Nav */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/20">
             <span className="text-[8px] font-black uppercase tracking-widest text-white/60 mr-2">Official Handles:</span>
             <SocialLinks size={18} iconClassName="hover:scale-110 transition-transform text-white opacity-80 hover:opacity-100" />
          </div>
        </div>
      </div>

      {/* List Modal */}
      <AnimatePresence>
        {isListOpen && (
          <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setIsListOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl w-full max-w-[460px] p-5 md:p-6 border border-stone-800 shadow-2xl relative overflow-hidden z-10"
            >
              {/* Decorative Ambient Glows */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-vermilion/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => setIsListOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white transition-colors bg-stone-850 rounded-full border border-stone-800 cursor-pointer"
              >
                <X size={14} />
              </button>

              <div className="space-y-4 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
                  <Megaphone size={16} className="text-vermilion shrink-0 animate-pulse" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      {i18n.language === 'te' ? 'తాజా సమాచారం & యాత్ర వార్తలు' : i18n.language === 'hi' ? 'ताज़ा समाचार और यात्रा अपडेट' : 'Latest News & Yatra Updates'}
                    </h3>
                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">
                      {i18n.language === 'te' ? 'విశ్వకర్మ నాలెడ్జ్ సెంటర్' : 'Vishwakarma Knowledge Centre'}
                    </p>
                  </div>
                </div>

                {/* Announcement List */}
                <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1 no-scrollbar">
                  {announcements.map((ann) => {
                    const isClickable = ann.id === 'pushpagiri-yatra' || ann.id === 'matrimony' || ann.id === 'anniversary';
                    const icon = ann.id === 'pushpagiri-yatra' ? '🚩' : ann.id === 'matrimony' ? '💍' : ann.id === 'anniversary' ? '🎉' : '📢';
                    
                    return (
                      <div 
                        key={ann.id}
                        onClick={() => {
                          setIsListOpen(false);
                          handleAnnouncementClick(ann.id);
                        }}
                        className={`flex gap-3 p-3.5 rounded-xl border text-left transition-all ${
                          isClickable 
                            ? 'bg-stone-850/60 hover:bg-stone-850 border-stone-800 hover:border-vermilion/40 cursor-pointer active:scale-[0.99]' 
                            : 'bg-stone-900/30 border-stone-850/50'
                        }`}
                      >
                        <div className="text-xl shrink-0 select-none">
                          {icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-[11px] leading-relaxed font-medium text-stone-200">
                            {ann[i18n.language as keyof Announcement] || ann.en}
                          </p>
                          {isClickable && (
                            <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-vermilion font-bold">
                              {ann.id === 'pushpagiri-yatra' 
                                ? (i18n.language === 'te' ? 'ఇప్పుడే నమోదు చేయండి →' : 'Register Mobile Number →') 
                                : (i18n.language === 'te' ? 'మరింత సమాచారం →' : 'View Details →')}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Anniversary Modal Integration */}
      <AnniversaryModal 
        isOpen={isAnniversaryModalOpen}
        onClose={() => setIsAnniversaryModalOpen(false)}
      />
    </>
  );
};
