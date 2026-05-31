import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Quote, Award, Globe, ShieldCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../../../shared/components/SEO';
import { ScrollToTop } from '@/shared/components/ScrollToTop';

export const FounderPage = () => {
  const { t, i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const milestones = [
    { year: "Phase 1", title: "Padayatra Initiation", desc: "Started the journey to connect with the grassroots." },
    { year: "Phase 2", title: "National Outreach", desc: "Taking the movement to the national capital in Delhi." },
    { year: "1,000 km", title: "Milestone Reached", desc: "Successfully completed the monumental walking journey." },
    { year: "2024", title: "VKC Expansion", desc: "Consolidating the vision of the Knowledge Centre." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={t('founder.title', 'Founder')} 
        description={t('founder.bio', 'The visionary leader behind the Vishwakarma Knowledge Centre.')}
      />
      <ScrollToTop />
      
      {/* Hero Header - Dignified & High-Impact */}
      <section className="relative pt-40 pb-20 bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/3"
            >
              <div className="aspect-[3/4] rounded-[4rem] overflow-hidden border-8 border-stone-800 shadow-3xl shadow-black/50 rotate-[-2deg] hover:rotate-0 transition-transform duration-700 group">
                <img 
                  src="/images/founder/portrait_full.webp" 
                  alt="Founder" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </motion.div>

            <div className="lg:w-2/3 space-y-8">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full"
               >
                 <div className="w-2 h-2 bg-vermilion rounded-full animate-pulse" />
                 <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.5em]">The Visionary Voice</span>
               </motion.div>
               <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight font-display 
                 ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                 {t('founder.title')}
               </h1>
               <div className="flex flex-col md:flex-row gap-8 items-start md:items-center py-8 border-t border-white/5">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest leading-none">Founder & Chairman</p>
                     <p className="text-xl font-black text-vermilion uppercase tracking-tighter">Hon. VKC Board</p>
                  </div>
                  <div className="hidden md:block w-[1px] h-10 bg-white/10" />
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest leading-none">Vision Mandate</p>
                     <p className="text-xl font-black text-white uppercase tracking-tighter">Global Excellence</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-16">
           <div className="relative py-12 px-10 md:px-20 bg-stone-50 rounded-[3rem] border border-stone-100 shadow-inner overflow-hidden">
              <Quote className="absolute -top-6 left-12 text-vermilion/5" size={120} />
              <p className={`text-2xl md:text-3xl font-black text-stone-800 italic leading-relaxed relative z-10 text-center
                ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                "{t('founder.quote')}"
              </p>
           </div>
           
           <div className="grid md:grid-cols-2 gap-16 items-start">
              <div className="space-y-6">
                 <h3 className="text-3xl font-black text-stone-900">The Journey</h3>
                 <p className="text-stone-600 leading-relaxed font-medium">
                   {t('founder.bio')}
                 </p>
                 <p className="text-stone-600 leading-relaxed font-medium font-bold">
                   {t('founder.padayatra')}
                 </p>
                 <p className="text-stone-600 leading-relaxed font-medium">
                   His unwavering resolve has redefined empowerment for the community, turning a local mission into a national movement.
                 </p>
              </div>

              <div className="space-y-8 bg-stone-50 p-10 rounded-[3rem] border border-stone-100 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-vermilion/5 rounded-full blur-3xl -mr-16 -mt-16" />
                 <h4 className="text-xl font-black text-stone-900 border-l-4 border-vermilion pl-6">Founder's Impact</h4>
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                       <ShieldCheck className="text-vermilion mt-1" size={20} />
                       <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">1,000+ km Walk for Change</p>
                    </div>
                    <div className="flex items-start gap-4">
                       <Globe className="text-vermilion mt-1" size={20} />
                       <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Village-to-Delhi Connection</p>
                    </div>
                    <div className="flex items-start gap-4">
                       <Award className="text-vermilion mt-1" size={20} />
                       <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">National Empowerment Stage</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-stone-50 overflow-hidden group">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-20 space-y-4">
              <h2 className="text-[10px] font-black text-vermilion uppercase tracking-[0.5em]">The Roadmap</h2>
              <h3 className="text-4xl md:text-5xl font-black text-stone-900 uppercase tracking-tighter">Visionary Timeline</h3>
           </div>

           <div className="relative">
              {/* Horizontal Line */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-stone-200 hidden md:block" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                 {milestones.map((m, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-500 group/card text-center flex flex-col items-center"
                    >
                       <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center text-white mb-6 group-hover/card:bg-vermilion transition-colors font-black text-xl font-mono">
                          {m.year}
                       </div>
                       <h4 className="text-xl font-black text-stone-900 mb-2 uppercase tracking-wide">{m.title}</h4>
                       <p className="text-stone-500 text-xs leading-relaxed font-bold uppercase tracking-widest">{m.desc}</p>
                    </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-stone-900 rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 text-center text-white relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
              <div className="relative z-10 space-y-12">
                 <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-10 py-4 rounded-full">
                    <Mail className="text-vermilion" size={20} />
                    <span className="text-xs font-black uppercase tracking-[0.4em]">Get in Touch</span>
                 </div>
                 <h3 className="text-4xl md:text-7xl font-black leading-tight max-w-4xl mx-auto tracking-tighter">
                   For inquiries regarding the Vision 2030 Mandate.
                 </h3>
                 <div className="flex flex-wrap justify-center gap-6">
                    <a href="mailto:founder@vkc-community.org" className="bg-vermilion text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl shadow-vermilion/20 active:scale-95">
                       Email the Chairman
                    </a>
                    <Link to="/vision" className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all backdrop-blur-md">
                       Read Vision 2030
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};
