import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Heart, 
  Gavel, 
  Search, 
  GraduationCap
} from 'lucide-react';
import { SEO } from '@/shared/components/SEO';
import { ScrollToTop } from '@/shared/components/ScrollToTop';

// Sub-components
import { ComingSoonHub } from '../components';

export const NetworkHub = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as 'professionals' | 'officials' | 'matrimony' | 'education';
  const initialTab = ['professionals', 'officials', 'matrimony', 'education'].includes(tabParam || '')
    ? tabParam
    : 'professionals';

  const [activeTab, setActiveTab] = useState<'professionals' | 'officials' | 'matrimony' | 'education'>(initialTab);

  useEffect(() => {
    if (tabParam && ['professionals', 'officials', 'matrimony', 'education'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabId: 'professionals' | 'officials' | 'matrimony' | 'education') => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const tabs: Array<{ id: 'professionals' | 'officials' | 'matrimony' | 'education'; label: string; icon: React.ReactNode; color: string; bg: string }> = [
    { id: 'professionals', label: t('network.hub.tabs.professionals'), icon: <Briefcase size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'officials', label: t('network.hub.tabs.officials'), icon: <Gavel size={18} />, color: 'text-saffron-600', bg: 'bg-saffron-50' },
    { id: 'education', label: t('network.hub.tabs.education'), icon: <GraduationCap size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'matrimony', label: t('network.hub.tabs.matrimony'), icon: <Heart size={18} />, color: 'text-pink-600', bg: 'bg-pink-50' }
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 group">
      <SEO 
        title={t('network.hub.seo_title')} 
        description={t('network.hub.seo_description')} 
      />
      <ScrollToTop />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
           <div className="space-y-4">
              <div className="flex items-center gap-3 bg-stone-900 text-white w-fit px-4 py-1 rounded-full">
                 <Users size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">{t('network.hub.badge')}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-stone-900 leading-tight font-display tracking-tight">
                {t('network.hub.title').split(' ').map((word, i) => 
                  word.toLowerCase() === 'unity' ? (
                    <span key={i} className="text-vermilion underline decoration-vermilion/20 underline-offset-8"> {word} </span>
                  ) : ` ${word} `
                )}
              </h1>
              <p className="text-stone-600 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                {t('network.hub.subtitle')}
              </p>
           </div>
           
           {/* Global Search Bar (Strategic) */}
           <div className="w-full md:w-96 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-vermilion transition-colors" size={18} />
              <input 
                type="text"
                placeholder={t('network.hub.search_placeholder')}
                className="w-full h-14 pl-14 pr-6 bg-white rounded-2xl border border-stone-200 focus:ring-2 focus:ring-vermilion transition-all font-medium text-stone-800 shadow-sm"
              />
           </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4 hide-scrollbar">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => handleTabChange(tab.id)}
               className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap
                 ${activeTab === tab.id 
                   ? `${tab.bg} ${tab.color} shadow-lg shadow-black/5 ring-1 ring-stone-900/5` 
                   : 'bg-white text-stone-400 hover:bg-stone-100 hover:text-stone-600'
                 }
               `}
             >
               {tab.icon}
               {tab.label}
             </button>
           ))}
        </div>

        {/* Dynamic Content Layer */}
        <div className="min-h-[600px] relative">
          <AnimatePresence mode="wait">
             <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
             >
                <ComingSoonHub activeTab={activeTab} />
             </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Call to Action (Strategic Integration) */}
        <div className="mt-24 bg-stone-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
           <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                {t('network.hub.cta.title').split(' ').map((word, i) => 
                  word.toLowerCase().includes('missing') ? (
                    <span key={i} className="text-turmeric"> {word} </span>
                  ) : ` ${word} `
                )}
              </h2>
              <p className="text-stone-400 text-lg font-medium leading-relaxed">
                {t('network.hub.cta.subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <button className="bg-vermilion text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-vermilion/90 transition-all shadow-xl shadow-vermilion/20 active:scale-95">
                   {t('network.hub.cta.list_profile')}
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 backdrop-blur-md">
                   {t('network.hub.cta.register_mentor')}
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
;
