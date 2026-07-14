"use client";

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const LegendsTeaser = () => {
  const { i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const legends = [
    { name: "P. Veerabrahmendra Swamy", title: "Prophet & Reformer", img: "/images/features/heritage/legends/veerabrahma.jpg" },
    { name: "Amarashilpi Jakanachari", title: "Master Sculptor", img: "/images/features/heritage/legends/jakanachari.jpg" },
    { name: "Sri Maroju Veeranna", title: "Freedom Fighter", img: "/images/features/heritage/legends/maroju-veeranna.jpg" },
    { name: "Sri Ganala Rammurthy", title: "Architectural Visionary", img: "/images/features/heritage/legends/ganala-rammurthy.jpg" }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden group">
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
               <div className="flex items-center gap-3 bg-saffron-50 w-fit px-4 py-1 rounded-full text-saffron-600">
                  <Award size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Community Excellence</span>
               </div>
               <h3 className={`text-4xl md:text-5xl font-black text-stone-900 leading-tight
                  ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                  The <span className="text-saffron-500 underline decoration-saffron-500/30 underline-offset-8">Hall</span> of Legends
               </h3>
               <p className="text-stone-600 text-lg leading-relaxed max-w-xl font-medium">
                  Honoring the visionaries and reformers of the Vishwakarma community. Their stories are our strength.
               </p>
            </div>

            <div className="flex items-center gap-8 py-4 border-y border-stone-100">
               <div className="flex gap-2 mb-2">
                  {legends.map((legend, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.5 }}
                      className="w-12 h-12 rounded-2xl bg-stone-200 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden"
                    >
                       <img 
                        src={legend.img} 
                        alt={legend.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-${1544005313 + i}-94ddf0286df2?auto=format&fit=crop&q=80&w=100`; }}
                       />
                    </motion.div>
                  ))}
               </div>
               <p className="text-xs font-black text-stone-600 uppercase tracking-widest">50+ Documented Icons</p>
            </div>

            <Link href="/legends" className="inline-flex items-center gap-6 bg-stone-900 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-saffron-600 transition-all shadow-2xl shadow-stone-900/10 active:scale-95">
               Meet the Legends <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Right Side Grid */}
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-12">
             {legends.map((legend, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: i % 2 === 0 ? 50 : 20 }}
                  whileInView={{ opacity: 1, y: i % 2 === 0 ? 32 : 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={`aspect-square rounded-[2rem] bg-stone-900 border border-white/5 p-6 md:p-8 flex flex-col justify-end group/card hover:shadow-2xl hover:border-saffron-500/30 transition-all duration-500 overflow-hidden relative`}
                >
                   <div className="absolute inset-0 z-0">
                      <img 
                        src={legend.img} 
                        alt={legend.name} 
                        className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-700" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-90" />
                   </div>
                   
                   <div className="relative z-10 space-y-2">
                       <Award size={20} className="text-saffron-500 mb-2 opacity-50 group-hover/card:opacity-100 transition-opacity" />
                       <div>
                          <p className="text-[10px] font-black text-saffron-400 uppercase tracking-widest leading-none mb-1">{legend.title}</p>
                          <h4 className="text-lg md:text-xl font-black text-white group-hover/card:text-saffron-400 transition-colors uppercase tracking-wider leading-tight">{legend.name}</h4>
                       </div>
                       <div className="h-1 w-8 bg-white/20 group-hover/card:w-16 group-hover/card:bg-saffron-500 transition-all" />
                   </div>
                </motion.div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};
