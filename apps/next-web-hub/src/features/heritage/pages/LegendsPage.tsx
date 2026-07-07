import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LegendsGallery } from '../components/LegendsGallery';
import { ScrollToTop } from '@/shared/components/ScrollToTop';
import { Award, Users, Star, ArrowRight } from 'lucide-react';
import { SEO } from '../../../shared/components/SEO';

export const LegendsPage = () => {
  const { i18n, t } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={t('legends.nav', 'Hall of Legends')} 
        description="Honoring the visionaries, reformers, and masters who shaped the Vishwakarma identity."
      />
      <ScrollToTop />
      
      {/* Header Splash */}
      <section className="relative pt-40 pb-20 bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-6">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full"
           >
             <Award size={16} className="text-saffron-500" />
             <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.5em]">Hall of Legends</span>
           </motion.div>
           <h1 className={`text-5xl md:text-7xl font-black text-white font-display leading-[1.1]
             ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
             The <span className="text-saffron-500">Icons</span> of Our Community
           </h1>
           <p className="text-stone-400 text-xl font-medium max-w-2xl mx-auto italic">
             "Honoring the visionaries, reformers, and masters who shaped the Vishwakarma identity."
           </p>
        </div>
      </section>

      {/* Intro Stats */}
      <section className="py-20 bg-stone-50 border-b border-stone-100">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
               { label: "Historical Icons", value: "50+", icon: <Star size={14} className="text-saffron-500" /> },
               { label: "Documented Stories", value: "200+", icon: <Users size={14} className="text-saffron-500" /> },
               { label: "States Represented", value: "12", icon: <Award size={14} className="text-saffron-500" /> },
               { label: "Research Citations", value: "1.2k", icon: <Users size={14} className="text-saffron-500" /> }
            ].map((stat, i) => (
               <div key={i} className="text-center space-y-2">
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <p className="text-3xl font-black text-stone-900">{stat.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{stat.label}</p>
               </div>
            ))}
         </div>
      </section>

      <LegendsGallery />

      {/* Featured Community Member Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
         <div className="bg-saffron-600 rounded-[3.5rem] p-12 md:p-24 text-white flex flex-col md:flex-row gap-16 items-center shadow-2xl shadow-saffron-600/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-[100px]" />
            <div className="md:w-1/2 space-y-8 relative z-10">
               <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Featured Story</span>
               <h3 className="text-4xl md:text-6xl font-black font-display leading-[1.1]">The Architect of Modern Hampi</h3>
               <p className="text-white/80 text-lg leading-relaxed font-medium">
                  Discover how the descendants of the original Vijayanagara artisans are today leading the 3D restoration projects of the World Heritage site.
               </p>
               <button className="bg-white text-saffron-600 px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl">
                  Read Full Feature
               </button>
            </div>
            <div className="md:w-1/2 aspect-[4/5] bg-stone-950/20 rounded-[3rem] border border-white/20 backdrop-blur-md flex items-center justify-center relative z-10 group overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
               <div className="text-center space-y-4">
                  <ArrowRight size={48} className="mx-auto text-white/50 group-hover:text-white transition-all group-hover:translate-x-4" />
                  <p className="text-xs font-black uppercase tracking-[0.5em] text-white/50">Next Feature Coming Soon</p>
               </div>
            </div>
         </div>
      </section>

      {/* Community Contribution */}
      <section className="py-24 bg-stone-50 border-t border-stone-100 text-center">
         <div className="max-w-2xl mx-auto px-4 space-y-8">
            <h3 className="text-3xl font-black text-stone-900 font-display">Nominate a Legend</h3>
            <p className="text-stone-500 font-medium">Do you know a community member whose contribution to art, science, or society deserves a place in this Hall of Legends? Let us know.</p>
            <button className="bg-stone-900 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-vermilion transition-all shadow-xl active:scale-95">
               Start Nomination
            </button>
         </div>
      </section>
    </div>
  );
};
