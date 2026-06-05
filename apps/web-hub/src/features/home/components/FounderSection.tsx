import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Quote, ArrowRight, Award, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FounderSection = () => {
  const { t, i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  return (
    <section className="py-24 bg-stone-50 relative overflow-hidden group">
      {/* Decorative Blueprint Line */}
      <div className="absolute top-0 right-1/3 w-[1px] h-full bg-vermilion/5 hidden lg:block" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left: Dignified Portrait Placeholder */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-2/5 relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group-hover:shadow-vermilion/10 transition-shadow">
                <img
                  src="/images/founder/portrait.webp"
                  srcSet="/images/founder/portrait-400.webp 400w, /images/founder/portrait-800.webp 800w"
                  sizes="(max-width: 768px) 300px, 500px"
                  alt="Founder"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/10 to-transparent" />
            </div>
            
            {/* Trust Badge */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-[2.5rem] shadow-xl border border-stone-100 flex items-center gap-4">
               <div className="bg-vermilion/10 p-4 rounded-2xl text-vermilion">
                 <ShieldCheck size={28} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest leading-none">{t('founder.institutional' as never)}</p>
                  <p className="text-sm font-black text-stone-900 uppercase tracking-tighter">{t('founder.chairman' as never)}</p>
               </div>
            </div>
          </motion.div>

          {/* Right: Visionary Narrative */}
          <div className="lg:w-3/5 space-y-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                 <div className="h-[2px] w-12 bg-vermilion" />
                 <span className="text-xs font-black text-vermilion uppercase tracking-[0.4em]">
                    {t('founder.badge')}
                 </span>
              </div>
              <h2 className={`text-4xl md:text-5xl lg:text-7xl font-black text-stone-900 leading-tight font-display 
                ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                {t('founder.title')}
              </h2>
              <p className="text-stone-500 text-lg md:text-xl font-bold uppercase tracking-widest">
                {t('founder.subtitle')}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative py-10 px-8 bg-white rounded-[2rem] border border-stone-100 shadow-inner group/quote hover:shadow-xl transition-all"
            >
               <Quote className="absolute -top-6 left-12 text-vermilion/20" size={64} />
               <p className={`text-xl md:text-2xl font-black text-stone-800 italic leading-relaxed relative z-10
                 ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                 "{t('founder.quote')}"
               </p>
            </motion.div>

            <div className="space-y-6">
               <p className="text-stone-500 text-lg leading-relaxed font-medium max-w-2xl">
                 {t('founder.bio')}
               </p>
               <p className="border-l-4 border-saffron-500 pl-6 text-stone-600 font-bold italic">
                 {t('founder.padayatra')}
               </p>
               
               <div className="flex flex-wrap gap-8 py-4 border-y border-stone-100">
                  <div className="flex items-center gap-3">
                     <Award className="text-vermilion" size={24} />
                     <p className="text-xs font-black text-stone-600 uppercase tracking-widest">{t('founder.mission')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 bg-saffron-500 rounded-full animate-pulse" />
                     <p className="text-xs font-black text-stone-600 uppercase tracking-widest">{t('founder.visionTitle')}</p>
                  </div>
               </div>

               <Link 
                 to="/founder" 
                 className="inline-flex items-center gap-4 text-vermilion text-xs font-black uppercase tracking-[0.4em] hover:gap-6 transition-all group"
               >
                 {t('founder.readMore')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
