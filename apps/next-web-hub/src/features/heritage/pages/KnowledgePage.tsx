import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShastraVaultPreview } from '../components/ShastraVaultPreview';
import { ScrollToTop } from '@/shared/components/ScrollToTop';
import { BookOpen, Search, Shield, Info } from 'lucide-react';
import { SEO } from '../../../shared/components/SEO';

export const KnowledgePage = () => {
  const { i18n, t } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  return (
    <div className="min-h-screen bg-stone-50">
      <SEO 
        title={t('knowledge.nav', 'Knowledge Hub')} 
        description="A digital archive of Vishwakarma technical reports, architectural blueprints, and heritage documentation."
      />
      <ScrollToTop />
      
      {/* Header Splash */}
      <section className="relative pt-40 pb-20 bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-6">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full"
           >
             <BookOpen size={16} className="text-vermilion" />
             <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.5em]">Digital Shastra Archive</span>
           </motion.div>
           <h1 className={`text-5xl md:text-7xl font-black text-white font-display leading-[1.1]
             ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
             The <span className="text-vermilion">Vault</span> of Knowledge
           </h1>
           <p className="text-stone-400 text-xl font-medium max-w-2xl mx-auto italic">
             "Translating 5,000 years of 'Mouna Bhasha' (silent knowledge) into digital architectural intelligence."
           </p>
        </div>
      </section>

      {/* Intro Narrative */}
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-8">
         <h2 className="text-3xl md:text-4xl font-black text-stone-900">Restoring Lost Blueprints</h2>
         <p className="text-stone-600 text-lg leading-relaxed font-medium">
            The Vishwakarma Knowledge Centre is digitizing thousands of palm-leaf manuscripts and Sanskrit treatises. Our mission is to convert these ancient geometric principles into modern CAD, 3D models, and architectural standards.
         </p>
         <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-stone-200/50 px-4 py-2 rounded-full text-[10px] font-bold text-stone-600 uppercase tracking-widest">
               <Shield size={14} className="text-vermilion" /> 100% Verified Sources
            </div>
            <div className="flex items-center gap-2 bg-stone-200/50 px-4 py-2 rounded-full text-[10px] font-bold text-stone-600 uppercase tracking-widest">
               <Info size={14} className="text-vermilion" /> Expert Peer Reviewed
            </div>
         </div>
      </div>

      <ShastraVaultPreview />

      {/* Theoretical Framework Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
         <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl border border-stone-100 flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2 space-y-8">
               <h3 className="text-4xl font-black text-stone-900 font-display">The Pancha Brahma Framework</h3>
               <p className="text-stone-600 text-lg leading-relaxed font-medium">
                  Ancient engineering wasn't siloed. The VKC knowledge engine explores how Manu (Iron), Maya (Wood), Thwashta (Metal), Shilpi (Stone), and Vishwajna (Gold/Theory) collaborative to create unified masterpieces like the Jagannath Puri temple.
               </p>
               <button className="flex items-center gap-4 text-xs font-black text-vermilion uppercase tracking-[0.3em] hover:gap-8 transition-all">
                  Read Theoretical Whitepaper <Search size={16} />
               </button>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
               {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-stone-50 rounded-3xl border border-stone-100 p-8 flex flex-col justify-end">
                     <p className="text-[10px] font-black text-stone-400 mb-2">CHAPTER 0{i+1}</p>
                     <p className="font-bold text-stone-800">Sacred Proportions</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer Call to Action */}
      <section className="py-24 bg-stone-900 text-center">
         <div className="max-w-2xl mx-auto px-4 space-y-8">
            <h3 className="text-3xl font-black text-white">Join the Research Team</h3>
            <p className="text-stone-400 font-medium">Are you a Sanskrit scholar or a modern architect interested in heritage restoration? Partner with us in the Shastra Digitization Project.</p>
            <button className="bg-vermilion text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-vermilion/90 transition-all shadow-xl shadow-vermilion/20 active:scale-95">
               Apply as Academic Partner
            </button>
         </div>
      </section>
    </div>
  );
};
