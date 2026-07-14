"use client";

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Scroll, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const KnowledgeTeaser = () => {
  const { i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  return (
    <section className="py-24 bg-stone-50 overflow-hidden group">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 space-y-8"
          >
            <div className="space-y-4">
               <div className="flex items-center gap-3 bg-stone-200/50 w-fit px-4 py-1 rounded-full text-stone-600">
                  <BookOpen size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Digital Repository</span>
               </div>
               <h3 className={`text-4xl md:text-5xl font-black text-stone-900 leading-tight
                  ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                  The <span className="text-vermilion underline decoration-vermilion/30 underline-offset-8">Shastra</span> Vault
               </h3>
               <p className="text-stone-600 text-lg leading-relaxed max-w-xl font-medium">
                  Unlocking the secrets of the ancient treatises. From Mayamata&apos;s sacred geometry to the architectural logic of the Manasara.
               </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.4 }}
                 className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 group-hover:shadow-md transition-all"
               >
                  <Scroll size={24} className="text-vermilion" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Chapters</p>
                    <p className="font-bold text-stone-900">70+ Treatises</p>
                  </div>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.5 }}
                 className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 group-hover:shadow-md transition-all"
               >
                  <Shield size={24} className="text-vermilion" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Status</p>
                    <p className="font-bold text-stone-900">Verified Access</p>
                  </div>
               </motion.div>
            </div>

            <Link href="/knowledge" className="inline-flex items-center gap-6 bg-stone-900 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-vermilion transition-all shadow-2xl shadow-stone-900/10 active:scale-95">
               Access Shastra Vault <ArrowRight size={18} />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: 'spring' }}
            className="lg:w-1/2 relative aspect-video bg-white rounded-[4rem] overflow-hidden border border-stone-200 shadow-2xl group-hover:border-vermilion/40 transition-all duration-1000 p-2"
          >
             <div className="absolute inset-0 bg-stone-900 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=1200" 
                  alt="Ancient Shastra Manuscript" 
                  className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000"
                />
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent z-10" />
             
             <div className="relative z-20 w-full h-full border-2 border-white/20 rounded-[3.5rem] flex flex-col items-center justify-center text-center p-8 space-y-6 backdrop-blur-[2px]">
                <div className="relative">
                   <motion.div 
                     animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                     transition={{ duration: 4, repeat: Infinity }}
                     className="absolute inset-0 bg-vermilion/20 blur-2xl rounded-full"
                   />
                   <Scroll size={80} className="text-white relative z-10 drop-shadow-2xl" />
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.5em]">Classified Shastra Archive</p>
                   <div className="h-[2px] w-24 bg-vermilion mx-auto group-hover:w-48 transition-all duration-1000" />
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
