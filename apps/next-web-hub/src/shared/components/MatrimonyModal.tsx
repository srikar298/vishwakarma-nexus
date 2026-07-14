"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BaseModal } from '@/shared/ui/BaseModal';

interface MatrimonyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MatrimonyModal: React.FC<MatrimonyModalProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleClose = () => {
    onClose();
    setIsSubmitted(false);
    setWaitlistEmail("");
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={handleClose}
      className="!bg-gradient-to-b !from-stone-900 !to-stone-950 text-white !border-stone-800"
      maxW="max-w-[360px]"
    >
      {/* Pink & Gold Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="p-6 text-center space-y-4 relative z-10">
        {/* Visual Icon Header */}
        <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-rose-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20 ring-4 ring-rose-500/10">
          <span className="text-2xl">💍</span>
        </div>

        <div className="space-y-1">
          <span className="bg-rose-500/10 text-rose-400 border border-rose-500/25 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest inline-block">
            {i18n.language === 'te' ? 'త్వరలో ప్రారంభం' : i18n.language === 'hi' ? 'जल्द ही आ रहा है' : 'Coming Soon'}
          </span>
          <h3 className="text-lg md:text-xl font-extrabold tracking-tight leading-tight text-white font-display">
            {i18n.language === 'te' 
              ? 'పరిణయ: విశ్వకర్మ మ్యాట్రిమోనీ' 
              : i18n.language === 'hi' 
                ? 'परिणय: विश्वकर्मा मैट्रिमोनी' 
                : 'Parinaya: Vishwakarma Matrimony'}
          </h3>
        </div>

        <p className="text-stone-300 text-[11px] leading-relaxed max-w-[280px] mx-auto">
          {i18n.language === 'te'
            ? 'మన విశ్వకర్మ సంఘం కోసం ప్రత్యేకంగా సురక్షితమైన, ధృవీకరించబడిన మరియు గౌరవప్రదమైన మ్యాట్రిమోనీ పోర్టల్‌ను రూపొందిస్తున్నాము. అతి త్వరలోనే ప్రారంభం కానుంది!'
            : i18n.language === 'hi'
              ? 'हमारे विश्वकर्मा समाज के लिए विशेष रूप से सुरक्षित, सत्यापित और सम्मानित मैट्रिमोनी पोर्टल तैयार किया जा रहा है। बहुत जल्द लॉन्च होगा!'
              : 'We are crafting a highly secure, verified, and premium matchmaking portal tailored exclusively for the Vishwakarma community. Launching very soon!'}
        </p>

        {/* Interactive Waitlist Form */}
        <div className="pt-1.5">
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-emerald-400 text-[11px] font-bold"
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
              className="space-y-2"
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
                className="w-full h-10 px-3.5 rounded-xl bg-stone-850 border border-stone-800 text-white placeholder-stone-500 text-[11px] focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all text-center"
              />
              <button 
                type="submit"
                className="w-full bg-rose-600 text-white h-10 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-700 transition-all active:scale-[0.98] shadow-lg shadow-rose-600/15"
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
    </BaseModal>
  );
};
