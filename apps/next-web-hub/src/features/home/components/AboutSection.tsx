"use client";

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Compass, 
  BookOpen, 
  Ruler, 
  MapPin, 
  Users, 
  Award,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { SectionBadge } from '@/shared/ui/SectionBadge';
import Link from 'next/link';

export const AboutSection = () => {
  const { t, i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const corePillars = [
    { 
      icon: <Compass className="text-vermilion" size={32} />, 
      title: t('about.card1Title'), 
      desc: t('about.card1Desc') 
    },
    { 
      icon: <BookOpen className="text-vermilion" size={32} />, 
      title: t('about.card2Title'), 
      desc: t('about.card2Desc') 
    },
    { 
      icon: <Ruler className="text-vermilion" size={32} />, 
      title: t('about.card3Title'), 
      desc: t('about.card3Desc') 
    }
  ];

  const impactStats = [
    { label: t('about.registrations'), value: "2.8L+", icon: <Users size={20} />, color: "bg-vermilion" },
    { label: t('about.centers'), value: "85+", icon: <MapPin size={20} />, color: "bg-turmeric" },
    { label: t('about.certified'), value: "100%", icon: <Award size={20} />, color: "bg-stone-900" }
  ];

  return (
    <section id="about" className="py-24 bg-stone-50 relative overflow-hidden group">
      {/* Blueprint Grid Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
      
      {/* Decorative Blueprint Line */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-vermilion/10 hidden lg:block" />
      <div className="absolute top-1/3 left-0 w-full h-[1px] bg-vermilion/10 hidden lg:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Narrative & Pillars */}
          <div className="lg:w-3/5 space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <SectionBadge label={t('about.badge')} />
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 leading-tight font-display 
                ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                {t('about.title')}
              </h2>
              <p className="text-stone-600 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
                {t('about.description')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {corePillars.map((pillar, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-white rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-xl hover:border-vermilion/20 transition-all group/card"
                >
                  <div className="mb-6 group-hover/card:scale-110 transition-transform duration-500">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">{pillar.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{pillar.desc}</p>
                </motion.div>
              ))}
              
              {/* Mission Cornerstone Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-8 bg-stone-900 rounded-[2rem] text-white flex flex-col justify-center relative overflow-hidden"
              >
                <div className="absolute -top-4 -right-4 text-white/5 text-9xl font-serif">&quot;</div>
                <p className="text-lg font-bold italic leading-relaxed relative z-10">
                  {t('about.mission')}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Impact Stats & Regional Focus */}
          <div className="lg:w-2/5 space-y-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] border border-stone-200 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-turmeric/10 rounded-full blur-3xl -mr-16 -mt-16" />
              
              <h3 className="text-2xl font-black text-stone-900 mb-8 border-l-4 border-vermilion pl-6">
                {t('about.regionalTitle')}
              </h3>

              <div className="space-y-8">
                {impactStats.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.4 }}
                    className="flex items-center gap-6"
                   >
                     <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>
                        {stat.icon}
                     </div>
                     <div>
                        <p className="text-3xl font-black text-stone-900 tracking-tighter">{stat.value}</p>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none mt-1">
                          {stat.label}
                        </p>
                     </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-stone-100">
                <p className="text-stone-500 text-sm leading-relaxed mb-6 font-medium">
                  {t('about.telanganaDesc')}
                </p>
                <Link href="/vision" className="inline-flex items-center gap-4 text-vermilion text-xs font-black uppercase tracking-widest hover:gap-6 transition-all group">
                   {t('about.mandate_link' as never)} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Verification Badge */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-stone-100/50 p-6 rounded-3xl border border-dashed border-stone-200 flex items-center gap-4"
            >
              <ShieldCheck className="text-stone-400" size={32} />
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-tight">
                {t('about.authority' as never)}
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
