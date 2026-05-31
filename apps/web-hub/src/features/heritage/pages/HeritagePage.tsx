import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { RootsSection } from '../components/RootsSection';
import { PanchaKulaExhibits } from '../components/PanchaKulaExhibits';
import { SEO } from '../../../shared/components/SEO';
import { EngineeringSecrets } from '../components/EngineeringSecrets';
import { ScrollToTop } from '@/shared/components/ScrollToTop';

import { PageHero } from '@/shared/ui/PageHero';

export const HeritagePage = () => {
  const { t, i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const sections = [
    { id: 'roots', title: t('heritage.nav.roots', 'Vedic Roots') },
    { id: 'exhibits', title: t('heritage.nav.exhibits', 'Gallery of Mastery') },
    { id: 'engineering', title: t('heritage.nav.engineering', 'Engineering Secrets') }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={t('heritage.nav.title', 'Heritage Archive')} 
        description={t('heritage.roots.description', 'Explore 5,000 years of traditional mastery. From Vedic roots to sacred geometry and architectural engineering secrets of the Vishwakarma legacy.')}
        type="article"
      />
      <ScrollToTop />
      
      <PageHero 
        badgeLabel={t('heritage.hero.badge')}
        title={<>{t('heritage.hero.title_part1')} <span className="text-vermilion">{t('heritage.hero.title_highlight')}</span> {t('heritage.hero.title_part2')}</>}
        subtitle={t('heritage.hero.subtitle')}
      />

      {/* Main Content Layout */}
      <div className="max-w-[1700px] mx-auto px-6 py-12 md:py-32 flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 relative overflow-visible">
        
        {/* Sticky Nav - Technical Sidebar (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-2 lg:sticky lg:top-40 h-fit space-y-12">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-4">
                {t('heritage.nav.title')}
              </h4>
              <div className="flex flex-col gap-6 relative">
                 <div className="absolute left-[3px] top-0 w-[1px] h-full bg-stone-100" />
                 {sections.map((s, i) => (
                    <a 
                      key={s.id} 
                      href={`#${s.id}`} 
                      className="flex items-center gap-4 text-stone-500 hover:text-vermilion transition-all group relative z-10"
                    >
                       <div className="w-2 h-2 rounded-full bg-stone-200 border-2 border-white group-hover:bg-vermilion group-hover:scale-150 transition-all shadow-sm" />
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black font-mono text-stone-300 group-hover:text-vermilion/50 transition-colors">0{i + 1}</span>
                          <span className="text-xs font-bold uppercase tracking-widest">{s.title}</span>
                       </div>
                    </a>
                 ))}
              </div>
           </div>
        </aside>

        {/* Content Stream */}
        <div className="lg:col-span-10 space-y-24 md:space-y-48 relative w-full overflow-visible">
           {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="relative w-full">
                 <div className="absolute -top-12 left-0 flex items-center gap-4 opacity-30 select-none">
                    <span className="text-[10px] font-black font-mono text-vermilion tracking-widest">[ SEC_0{i + 1} ]</span>
                    <div className="h-[1px] w-24 bg-vermilion/50" />
                 </div>
                 <div className="w-full">
                   {i === 0 && <RootsSection />}
                   {i === 1 && <PanchaKulaExhibits />}
                   {i === 2 && <EngineeringSecrets />}
                 </div>
              </section>
           ))}

           {/* Call to Action */}
           <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-stone-900 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-24 text-center text-white space-y-10 relative overflow-hidden border border-white/5 shadow-3xl mx-auto w-full"
           >
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-vermilion to-transparent" />
              
              <div className="space-y-4 relative z-10">
                 <h3 className={`text-3xl md:text-6xl font-black font-display tracking-tight
                   ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                   {t('heritage.cta.title')}
                 </h3>
                 <p className={`text-stone-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed
                   ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                   {t('heritage.cta.description')}
                 </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 pt-6 relative z-10">
                 <button className="bg-vermilion text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:scale-105 transition-all shadow-2xl shadow-vermilion/20 active:scale-95">
                    {t('heritage.cta.btn_historical')}
                 </button>
                 <button className="bg-white/5 border border-white/10 text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/10 transition-all backdrop-blur-md">
                    {t('heritage.cta.btn_volunteer')}
                 </button>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};
