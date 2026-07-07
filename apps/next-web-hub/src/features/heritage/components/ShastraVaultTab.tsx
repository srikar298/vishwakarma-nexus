"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Compass, Award, Box, Cpu, Scroll, Shield } from 'lucide-react';
import Link from 'next/link';

type TabId = 'heritage' | 'shastra' | 'legends';

export const ShastraVaultTab = () => {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>('heritage');
  const lang = i18n.language;

  const tabs = [
    { id: 'heritage' as TabId, label: lang === 'te' ? 'పంచ బ్రహ్మ వారసత్వం' : lang === 'hi' ? 'पंच ब्रह्म विरासत' : 'Pancha Brahma Legacy', icon: <Compass size={16} /> },
    { id: 'shastra' as TabId, label: lang === 'te' ? 'శాస్త్ర నిధి' : lang === 'hi' ? 'शास्त्र कोष' : 'Shastra Vault', icon: <Scroll size={16} /> },
    { id: 'legends' as TabId, label: lang === 'te' ? 'కీర్తి శిఖరాలు' : lang === 'hi' ? 'कीर्ति शिखर' : 'Hall of Legends', icon: <Award size={16} /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'heritage':
        return (
          <motion.div 
            key="heritage"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
          >
            <div className="lg:w-1/2 space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-black text-vermilion uppercase tracking-[0.4em]">
                  {lang === 'te' ? 'కళా నైపుణ్యాల పరిణామం' : 'Evolution of Craft'}
                </h4>
                <h3 className="text-3xl md:text-5xl font-black text-stone-900 leading-tight font-display">
                  The <span className="text-vermilion underline decoration-vermilion/30 underline-offset-8">Pancha Brahma</span> Legacy
                </h3>
                <p className="text-stone-600 text-base leading-relaxed font-medium">
                  {lang === 'te' ? 'మను, మయ, త్వష్ట, శిల్పి, విశ్వజ్ఞ అను ఐదుగురు బ్రహ్మర్షుల నుండి ఉద్భవించిన 5,000 సంవత్సరాల లోహ, కాష్ట, శిలా నిర్మణ నైపుణ్యాల చరిత్ర.' : 
                   'Discover how 5,000 years of traditional mastery in iron, wood, metal, stone, and gold shaped the very fabric of Indian civilization.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: <Compass size={18} className="text-vermilion" />, title: "Vedic Origin" },
                  { icon: <Box size={18} className="text-vermilion" />, title: "Sacred Form" },
                  { icon: <Cpu size={18} className="text-vermilion" />, title: "Ancient Science" }
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 bg-stone-100 p-4 rounded-xl border border-stone-200/50">
                    <div>{p.icon}</div>
                    <span className="text-[9px] font-black text-stone-700 uppercase tracking-widest leading-tight">{p.title}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link href="/heritage" className="inline-flex items-center gap-4 bg-vermilion hover:bg-vermilion-600 text-white px-8 h-12 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-vermilion/15 transition-all">
                  Explore Full Heritage <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 relative aspect-video bg-stone-100 rounded-[2.5rem] overflow-hidden border border-stone-200 shadow-lg">
              <img 
                src="/images/features/heritage/hampi-monolith.jpg" 
                alt="Hampi Monolithic Architectural Heritage" 
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600'; }}
              />
              <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md p-6 border-t border-stone-100">
                <p className="text-[9px] font-black text-vermilion uppercase tracking-widest">Featured Insight</p>
                <p className="text-stone-900 font-bold text-lg">The Monolithic Engineering of Hampi</p>
              </div>
            </div>
          </motion.div>
        );

      case 'shastra':
        return (
          <motion.div 
            key="shastra"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16"
          >
            <div className="lg:w-1/2 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-stone-200/50 w-fit px-4 py-1 rounded-full text-stone-600">
                  <BookOpen size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Digital Repository</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-stone-900 leading-tight font-display">
                  The <span className="text-vermilion underline decoration-vermilion/30 underline-offset-8">Shastra</span> Vault
                </h3>
                <p className="text-stone-600 text-base leading-relaxed font-medium">
                  {lang === 'te' ? 'మయమతం మరియు మానసారం వంటి ప్రాచీన వాస్తు, శిల్ప శాస్త్ర గ్రంథాల రహస్యాలు మరియు నిర్మాణ సూత్రాలు.' : 
                   'Unlocking the secrets of the ancient treatises. From Mayamata\'s sacred geometry to the architectural logic of the Manasara.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-stone-200/60 shadow-sm flex items-center gap-4">
                  <Scroll size={22} className="text-vermilion" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-stone-450">Chapters</p>
                    <p className="font-bold text-stone-900 text-sm">70+ Treatises</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-stone-200/60 shadow-sm flex items-center gap-4">
                  <Shield size={22} className="text-vermilion" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-stone-450">Status</p>
                    <p className="font-bold text-stone-900 text-sm">Verified Access</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/knowledge" className="inline-flex items-center gap-4 bg-stone-900 hover:bg-vermilion text-white px-8 h-12 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg transition-all">
                  Access Shastra Vault <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 relative aspect-video bg-stone-900 rounded-[2.5rem] overflow-hidden border border-stone-850 p-2 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=800" 
                alt="Ancient Shastra Manuscript" 
                className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 hover:opacity-60 transition-all duration-700 rounded-[2rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 to-transparent pointer-events-none rounded-[2rem]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3 pointer-events-none">
                <Scroll size={48} className="text-white drop-shadow-lg" />
                <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.4em]">Classified Shastra Archive</p>
              </div>
            </div>
          </motion.div>
        );

      case 'legends':
        const legends = [
          { name: "P. Veerabrahmendra Swamy", title: "Prophet & Reformer", img: "/images/features/heritage/legends/veerabrahma.jpg" },
          { name: "Amarashilpi Jakanachari", title: "Master Sculptor", img: "/images/features/heritage/legends/jakanachari.jpg" },
          { name: "Sri Maroju Veeranna", title: "Freedom Fighter", img: "/images/features/heritage/legends/maroju-veeranna.jpg" },
          { name: "Sri Ganala Rammurthy", title: "Architectural Visionary", img: "/images/features/heritage/legends/ganala-rammurthy.jpg" }
        ];

        return (
          <motion.div 
            key="legends"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
          >
            <div className="lg:w-1/2 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-saffron-50 w-fit px-4 py-1 rounded-full text-saffron-700 border border-saffron-100">
                  <Award size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Community Excellence</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-stone-900 leading-tight font-display">
                  The <span className="text-saffron-600 underline decoration-saffron-650/30 underline-offset-8">Hall</span> of Legends
                </h3>
                <p className="text-stone-600 text-base leading-relaxed font-medium">
                  {lang === 'te' ? 'విశ్వకర్మ సంఘ సంస్కర్తలు, ప్రవక్తలు మరియు మహనీయుల చరిత్రలు. మన సాంస్కృతిక స్ఫూర్తి ప్రదాతలు.' : 
                   'Honoring the visionaries and reformers of the Vishwakarma community. Their stories are our strength.'}
                </p>
              </div>

              <div className="flex items-center gap-6 py-4 border-y border-stone-200/60">
                <div className="flex -space-x-2">
                  {legends.map((legend, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-stone-200 border-2 border-white shadow-sm overflow-hidden shrink-0">
                      <img 
                        src={legend.img} 
                        alt={legend.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-${1544005313 + i}-94ddf0286df2?auto=format&fit=crop&q=80&w=80`; }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">50+ Documented Icons</p>
              </div>

              <div className="pt-4">
                <Link href="/legends" className="inline-flex items-center gap-4 bg-stone-900 hover:bg-saffron-600 text-white px-8 h-12 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg transition-all">
                  Meet the Legends <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
              {legends.slice(0, 2).map((legend, i) => (
                <div 
                  key={i} 
                  className="aspect-square rounded-[2rem] bg-stone-900 border border-stone-850 p-6 flex flex-col justify-end relative overflow-hidden group/card shadow-md"
                >
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={legend.img} 
                      alt={legend.name} 
                      className="w-full h-full object-cover opacity-60 group-hover/card:scale-105 transition-all duration-500" 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                  </div>
                  <div className="relative z-10 space-y-1">
                    <p className="text-[8px] font-black text-saffron-400 uppercase tracking-widest leading-none">{legend.title}</p>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider leading-tight">{legend.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tab Controls */}
        <div className="flex justify-center mb-16">
          <div className="bg-stone-100 p-1.5 rounded-2xl flex gap-1 sm:gap-2 shadow-inner border border-stone-200/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-stone-900 text-white shadow-md' 
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
