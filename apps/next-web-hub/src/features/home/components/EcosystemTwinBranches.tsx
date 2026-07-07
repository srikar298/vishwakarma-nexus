"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface EcosystemTwinBranchesProps {
  onOpenMatrimony: () => void;
}

export const EcosystemTwinBranches: React.FC<EcosystemTwinBranchesProps> = ({ onOpenMatrimony }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <section id="ecosystem" className="py-24 bg-stone-50 relative overflow-hidden group">
      {/* Subtle blueprint grid texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-stone-500">
            {lang === 'te' ? 'క్రియాశీల సేవలు' : lang === 'hi' ? 'सक्रिय सेवाएँ' : 'Active Services'}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 leading-tight font-display">
            {lang === 'te' ? 'వారసత్వానికి రూపాలు: మన సేవలు' : 
             lang === 'hi' ? 'विरासत के स्वरूप: हमारी सेवाएँ' : 
             'Branches of Heritage: Twin Service Portals'}
          </h2>
          <p className="text-stone-600 text-sm md:text-base font-medium leading-relaxed">
            {lang === 'te' ? 'వారసత్వ మూలాల నుండి ఉద్భవించిన రెండు ప్రధాన సేవలు. సామాజిక అనుసంధానం మరియు ఆర్థిక నిలకడకై సాధనాలు.' : 
             lang === 'hi' ? 'सांस्कृतिक विरासत से उपजी दो मुख्य सेवाएँ। सामाजिक एकजुटता और आर्थिक सशक्तिकरण के साधन।' : 
             'Two core pathways originating from our heritage roots: supporting family lineages (Social) and preserving traditional craft livelihood (Economic).'}
          </p>
        </div>

        {/* Twin Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">

          {/* BRANCH A: PARINAYA MATRIMONY */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[2.5rem] border border-rose-100/50 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative group/card flex flex-col justify-between min-h-[380px] p-8 md:p-10"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/5 blur-[80px] rounded-full pointer-events-none group-hover/card:bg-rose-500/10 transition-colors" />

            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover/card:scale-110 transition-transform">
                  <Heart size={28} className="fill-rose-600/10" />
                </div>
                <span className="bg-rose-50 text-rose-700 text-[8px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-rose-100">
                  {lang === 'te' ? 'సామాజిక శాఖ' : lang === 'hi' ? 'सामाजिक शाखा' : 'Social Branch'}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-black text-stone-900 font-display flex items-center gap-2">
                  <span>💍 {lang === 'te' ? 'పరిణయ మ్యాట్రిమోనీ' : lang === 'hi' ? 'परिणय मैट्रिमोनी' : 'Parinaya Matrimony'}</span>
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed font-medium">
                  {lang === 'te' ? 'మన విశ్వకర్మ కుటుంబాల కోసం ప్రత్యేకంగా రూపొందించబడిన అత్యంత సురక్షితమైన మరియు గోత్ర-ధృవీకరించబడిన అనుసంధాన పోర్టల్.' : 
                   lang === 'hi' ? 'हमारे विश्वकर्मा परिवारों के लिए विशेष रूप से तैयार किया गया अत्यंत सुरक्षित और गोत्र-सत्यापित जीवनसाथी खोज पोर्टल।' : 
                   'A secure and verified matchmaking portal to preserve lineage values. Verified through identity checks and gotra validation.'}
                </p>
              </div>

              <ul className="space-y-2 pt-2">
                {[
                  { label: lang === 'te' ? '100% ధృవీకరించబడిన ప్రొఫైల్స్' : '100% Identity-Verified Matches' },
                  { label: lang === 'te' ? 'గోత్ర మరియు వంశావళి రిజిస్ట్రీ' : 'Traditional Gotra Registry' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-stone-600">
                    <span className="text-rose-500">✨</span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 relative z-10">
              <button 
                onClick={onOpenMatrimony}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-[0.2em] h-12 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-600/10 active:scale-[0.98]"
              >
                {lang === 'te' ? 'సంప్రదించండి / రిజిస్టర్' : lang === 'hi' ? 'पंजीकरण करें' : 'Explore Matches'}
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>

          {/* BRANCH B: ARTISAN DIRECTORY */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[2.5rem] border border-amber-100/50 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative group/card flex flex-col justify-between min-h-[380px] p-8 md:p-10"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none group-hover/card:bg-amber-500/10 transition-colors" />

            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover/card:scale-110 transition-transform">
                  <Search size={28} />
                </div>
                <span className="bg-amber-50 text-amber-700 text-[8px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-amber-100">
                  {lang === 'te' ? 'ఆర్థిక శాఖ' : lang === 'hi' ? 'आर्थिक शाखा' : 'Economic Branch'}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-black text-stone-900 font-display flex items-center gap-2">
                  <span>🛠️ {lang === 'te' ? 'కళాకారుల నిఘంటువు' : lang === 'hi' ? 'शिल्पकार निर्देशिका' : 'Artisan Directory'}</span>
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed font-medium">
                  {lang === 'te' ? 'మన 18 సాంప్రదాయ వృత్తుల కళాకారులను నేరుగా వినియోగదారులతో అనుసంధానించే ప్రత్యేక సర్వీస్ డైరెక్టరీ.' : 
                   lang === 'hi' ? 'हमारे 18 पारंपरिक शिल्पों के शिल्पकारों को सीधे खरीदारों से जोड़ने वाली विशिष्ट सेवा निर्देशिका।' : 
                   'An economic registry mapping and promoting master craftsmen of the 18 traditional Vishwakarma trades globally.'}
                </p>
              </div>

              <ul className="space-y-2 pt-2">
                {[
                  { label: lang === 'te' ? 'సాంప్రదాయ వృత్తుల వారీగా వర్గీకరణ' : 'Classified by 18 Ancestral Crafts' },
                  { label: lang === 'te' ? 'ఖరీదుదారులతో నేరుగా అనుసంధానం' : 'Direct-to-Artisan Lead Engine' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-stone-600">
                    <span className="text-amber-500">✨</span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 relative z-10">
              <Link 
                href="/directory"
                className="w-full bg-stone-900 hover:bg-stone-850 text-white font-black text-xs uppercase tracking-[0.2em] h-12 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98]"
              >
                {lang === 'te' ? 'డైరెక్టరీని శోధించండి' : lang === 'hi' ? 'निर्देशिका खोजें' : 'Search Directory'}
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
