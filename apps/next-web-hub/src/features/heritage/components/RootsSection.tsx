import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Book, Bird, Sun } from 'lucide-react';

export const RootsSection = () => {
  const { t, i18n } = useTranslation();
  
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const features = [
    { icon: <Bird className="text-gold-500" />, label: t('heritage.roots.features.lineage'), sub: t('heritage.roots.features.lineage_desc') },
    { icon: <Sun className="text-gold-500" />, label: t('heritage.roots.features.architecture'), sub: t('heritage.roots.features.architecture_desc') },
    { icon: <Book className="text-gold-500" />, label: t('heritage.roots.features.traditions'), sub: t('heritage.roots.features.traditions_desc') }
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-[#fdfcf6]">
      {/* Parchment Texture Overlays */}
      <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
      
      {/* Decorative Mandalas */}
      <div className="absolute -top-20 -left-20 w-80 h-80 border-4 border-gold-100 rounded-full opacity-20 animate-spin-slow" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 border-8 border-gold-100 rounded-full opacity-10 animate-reverse-spin" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="space-y-8"
        >
          <div className="space-y-4 text-center">
            <h2 className="text-xs font-black text-gold-700 uppercase tracking-[0.6em]">
              {t('heritage.roots.badge')}
            </h2>
            <h3 className={`text-3xl md:text-5xl font-black text-stone-900 font-display 
              ${isTelugu ? 'font-telugu leading-relaxed' : isHindi ? 'font-hindi leading-relaxed' : ''}`}>
              {t('heritage.roots.title')}
            </h3>
          </div>

          <div className="relative py-12 px-6 md:px-20 bg-white/40 backdrop-blur-md rounded-[2.5rem] md:rounded-[3rem] border border-gold-100 shadow-inner">
             {/* Quotation Marks */}
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#fdfcf6] px-4 font-serif text-6xl text-gold-200">“</div>
             
             <p className={`text-lg md:text-3xl font-bold text-stone-800 italic leading-relaxed mb-8
               ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
               {t('heritage.roots.excerpt')}
             </p>
             
             <div className="flex flex-col items-center gap-4">
               <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
               <p className="text-sm font-black text-gold-600 uppercase tracking-widest flex items-center gap-3">
                 <Book size={16} />
                 {t('heritage.roots.source')}
               </p>
             </div>
          </div>

          <p className={`text-stone-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium
            ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
            {t('heritage.roots.description')}
          </p>

          <div className="pt-8 md:pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center border-t border-gold-100/50 mt-12">
             {features.map((item, i) => (
               <div key={i} className="space-y-3 p-4 md:p-6 rounded-3xl hover:bg-gold-50 transition-colors group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:shadow-md transition-all">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gold-700">{item.label}</p>
                    <p className={`text-xs text-stone-400 font-bold ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>{item.sub}</p>
                  </div>
               </div>
             ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-reverse-spin {
          animation: reverse-spin 60s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 80s linear infinite;
        }
      `}</style>
    </section>
  );
};
