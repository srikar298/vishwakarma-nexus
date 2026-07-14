"use client";

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowRight, Box, Compass, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeritageTeaser = () => {
  const { t, i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const pillars = [
    { icon: <Compass size={20} />, label: "Roots", en: "Vedic Origin" },
    { icon: <Box size={20} />, label: "Architecture", en: "Sacred Form" },
    { icon: <Cpu size={20} />, label: "Engineering", en: "Ancient Science" }
  ];

  return (
    <section className="py-24 bg-stone-950 relative overflow-hidden group">
      <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 space-y-8"
          >
            <div className="space-y-4">
               <h2 className="text-xs font-black text-vermilion uppercase tracking-[0.6em]">
                  {t('home.heritageTeaser.sub', 'Evolution of Craft')}
               </h2>
               <h3 className={`text-4xl md:text-6xl font-black text-white leading-tight font-display 
                  ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                  The <span className="text-vermilion underline decoration-vermilion/30 underline-offset-8">Pancha Brahma</span> Legacy
               </h3>
               <p className="text-stone-400 text-lg leading-relaxed max-w-xl font-medium">
                  Discover how 5,000 years of traditional mastery in iron, wood, metal, stone, and gold shaped the very fabric of Indian civilization.
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {pillars.map((p, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                    className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors"
                  >
                     <div className="text-vermilion">{p.icon}</div>
                     <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest leading-tight">{p.en}</span>
                  </motion.div>
               ))}
            </div>

            <Link href="/heritage" className="inline-flex items-center gap-6 bg-vermilion text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl shadow-vermilion/20 active:scale-95">
               Explore Full Heritage <ArrowRight size={18} />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:w-1/2 relative aspect-video bg-stone-100 rounded-[3rem] overflow-hidden border border-stone-200 group-hover:border-vermilion/30 transition-all duration-700 shadow-xl"
          >
             <img 
               src="/images/features/heritage/hampi-monolith.jpg" 
               alt="Hampi Monolithic Architectural Heritage" 
               className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
             />
             <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md p-8 border-t border-stone-100 translate-y-2 group-hover:translate-y-0 transition-transform">
                <p className="text-[10px] font-black text-vermilion uppercase tracking-widest">Featured Insight</p>
                <p className="text-stone-900 font-bold text-xl">The Monolithic Engineering of Hampi</p>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
