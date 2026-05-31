import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Network, History, Anchor, Globe, Database, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { SectionBadge } from '@/shared/ui/SectionBadge';

export const VisionSection = () => {
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const isHindi = i18n.language === 'hi';
  const isTelugu = i18n.language === 'te';

  // Parallax transforms for depth
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const pillars = [
    {
      id: 'unity',
      icon: <Network className="w-10 h-10 text-saffron-500" />,
      title_en: "The Unified Artisan Ecosystem",
      title_te: "ఏకీకృత కళాకారుల వ్యవస్థ",
      title_hi: "एकीकृत शिल्पकार पारिस्थितिकी तंत्र",
      desc_en: "Our mission is to digitally unite 10 million Vishwakarma artisans into a single verified network, providing institutional access to credits, global marketplaces, and collective bargaining power.",
      desc_te: "మా లక్ష్యం 10 మిలియన్ల విశ్వకర్మ కళాకారులను ఒకే నెట్‌వర్క్‌గా అనుసందానించడం, తద్వారా వారికి రుణ సౌకర్యాలు మరియు అంతర్జాతీయ మార్కెట్ అందుబాటులోకి తీసుకురావడం.",
      desc_hi: "हमारा लक्ष्य 10 मिलियन विश्वकर्मा शिल्पकारों को एक सत्यापित नेटवर्क में जोड़ना है, जिससे उन्हें संस्थागत ऋण और वैश्विक बाजारों तक पहुंच मिल सके।",
      subgoals: [
        { icon: <Database size={14} />, text: t('vision.pillars.goals.identity') },
        { icon: <Globe size={14} />, text: t('vision.pillars.goals.skill') },
        { icon: <Cpu size={14} />, text: t('vision.pillars.goals.credit') }
      ],
      accent: "from-saffron-500/10 via-saffron-500/5 to-transparent"
    },
    {
      id: 'preservation',
      icon: <History className="w-10 h-10 text-vermilion" />,
      title_en: "The Living Archive & Preservation",
      title_te: "లైవ్ ఆర్కైవ్ & పరిరక్షణ",
      title_hi: "जीवित पुरालेख और संरक्षण",
      desc_en: "We are translating 5,000 years of 'Mouna bhasha' (silent knowledge) into a digital library of 3D-architectural blueprints and restored sacred shastras for future generations.",
      desc_te: "మేము 5,000 సంవత్సరాల 'మౌన భాషా' పరిజ్ఞానాన్ని డిజిటల్ లైబ్రరీగా మరియు 3D నిరమ్మాణ బ్లూప్రింట్లుగా మారుస్తున్నాము.",
      desc_hi: "हम 5,000 वर्षों के 'मौन भाषा' ज्ञान को भविष्य की पीढ़ियों के लिए डिजिटल लाइब्रेरी और 3D ब्लूप्रिंट में बदल रहे हैं।",
      subgoals: [
        { icon: <ShieldCheck size={14} />, text: t('vision.pillars.goals.scanning') },
        { icon: <Database size={14} />, text: t('vision.pillars.goals.digitalization') },
        { icon: <Anchor size={14} />, text: t('vision.pillars.goals.tracking') }
      ],
      accent: "from-vermilion/10 via-vermilion/5 to-transparent"
    }
  ];

  return (
    <section ref={containerRef} className="relative py-40 bg-stone-950 overflow-hidden">
      {/* Immersive Parallax Background */}
      <motion.div style={{ y: y1, opacity }} className="absolute inset-0 pointer-events-none select-none">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] opacity-[0.07]" />
         <div className="flex justify-around items-center h-full opacity-10">
            <Anchor size={600} className="text-white" />
            <motion.div style={{ y: y2 }}>
               <Cpu size={400} className="text-white" />
            </motion.div>
         </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-32 space-y-6">
          <SectionBadge 
            label={t('vision.badge')} 
            variant="pill" 
            theme="dark" 
            className="mx-auto"
          />
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-4xl md:text-7xl font-black text-white leading-tight font-display 
              ${isTelugu ? 'font-telugu leading-relaxed' : isHindi ? 'font-hindi leading-relaxed' : ''}`}
          >
            {t('vision.deepTitle')}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed italic"
          >
            "{t('vision.quote')}"
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: 'spring', stiffness: 100 }}
              className="group relative bg-white/5 backdrop-blur-3xl rounded-[4rem] p-12 md:p-16 border border-white/10 hover:border-vermilion/30 transition-all duration-700 overflow-hidden"
            >
              {/* Dynamic Accent Glow */}
              <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl ${pillar.accent} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10`} />

              <div className="space-y-10 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="w-24 h-24 bg-stone-900 rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-stone-800 group-hover:to-black transition-all duration-500">
                    {pillar.icon}
                  </div>
                  <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest border border-stone-800 px-4 py-2 rounded-full">
                    {t('vision.pillars.pillar')} 0{index + 1}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className={`text-3xl md:text-4xl font-black text-white leading-tight
                    ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                    {isTelugu ? pillar.title_te : isHindi ? pillar.title_hi : pillar.title_en}
                  </h3>
                  <p className="text-stone-400 leading-relaxed text-lg">
                    {isTelugu ? pillar.desc_te : isHindi ? pillar.desc_hi : pillar.desc_en}
                  </p>
                </div>

                {/* Depth Goals */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/5">
                   {pillar.subgoals.map((goal, gi) => (
                     <div key={gi} className="flex items-start gap-3 transition-opacity duration-300">
                        <div className="text-vermilion mt-0.5">{goal.icon}</div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] leading-tight group-hover:text-stone-300 transition-colors">{goal.text}</span>
                     </div>
                   ))}
                </div>

                <Link to="/vision" className="flex items-center gap-4 text-[10px] font-black text-white uppercase tracking-[0.4em] group-hover:gap-6 transition-all duration-500 cursor-pointer w-fit group/btn">
                   <span className="group-hover:text-vermilion transition-colors">{t('vision.pillars.whitepaper')}</span>
                   <ArrowRight size={16} className="text-vermilion group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:opacity-30 transition-opacity">
                <Globe size={150} className="text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing Narrative */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.5 }}
           className="mt-32 text-center"
        >
          <div className="inline-block p-1 bg-gradient-to-r from-saffron-500 via-vermilion to-saffron-500 rounded-full">
             <div className="bg-stone-950 px-12 py-6 rounded-full">
                <p className="text-white font-black uppercase tracking-[0.5em] text-xs">{t('vision.pillars.timeline_hint')}</p>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
