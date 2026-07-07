import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Network, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Award, 
  ScrollText,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const VisionPage = () => {
  const { i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const sections = [
    {
      id: 'unification',
      icon: <Network className="text-vermilion" />,
      title_en: "The Unified Artisan Ecosystem",
      title_te: "ఏకీకృత కళాకారుల వ్యవస్థ",
      title_hi: "एकीकृत शिल्पकार पारिस्थितिकी तंत्र",
      content_en: "Our flagship initiative is the creation of a 'Universal Artisan ID' (UAID). This blockchain-verifiable identity validates the artisan's lineage, craft proficiency, and project history. By unifying 10 million artisans, we create a collective economic engine capable of direct-to-consumer trade and institutional credit access.",
      content_te: "మా ప్రధాన లక్ష్యం 'యూనివర్సల్ ఆర్టిసాన్ ఐడి' (UAID) సృష్టించడం. ఇది కళాకారుల వంశం, వృత్తి నైపుణ్యం మరియు ప్రాజెక్ట్ చరిత్రను ధృవీకరిస్తుంది.",
      content_hi: "हमारी प्रमुख पहल 'यूनिवर्सल आर्टिसन आईडी' (UAID) का निर्माण है। यह पहचान शिल्पकार के वंश, शिल्प दक्षता और परियोजना इतिहास को प्रमाणित करती है।",
      points: [
         "Blockchain-Verified Portraits & Lineage",
         "Institutional Micro-Credits (Artisan Score)",
         "Global B2B/D2C Marketplace Access"
      ]
    },
    {
      id: 'preservation',
      icon: <Database className="text-saffron-600" />,
      title_en: "The Living Archive: Digital Shastras",
      title_te: "జీవన ఆర్కైవ్: డిజిటల్ శాస్త్రాలు",
      title_hi: "जीवित पुरालेख: डिजिटल शास्त्र",
      content_en: "We are developing an AI-driven NLP engine specifically for palm-leaf manuscripts and ancient Silpa Shastras. This tool restores lost architectural blueprints into modern CAD/3D formats, ensuring that the engineering precision of our ancestors is accessible to the modern world's architects.",
      content_te: "మేము తాళపత్ర గ్రంథాలు మరియు పురాతన శిల్ప శాస్త్రాల కోసం ప్రత్యేకంగా AI-ఆధారిత NLP ఇంజిన్‌ను అభివృద్ధి చేస్తున్నాము.",
      content_hi: "हम ताड़ के पत्तों की पांडुलिपियों और प्राचीन शिल्प शास्त्रों के लिए विशेष रूप से AI-संचालित NLP इंजन विकसित कर रहे हैं।",
      points: [
         "3D Cloud Scanning of Heritage Sites",
         "AI Restoration of 3,000+ Lost Blueprints",
         "Oral Traditions Archive (Video/Audio Repository)"
      ]
    },
    {
       id: 'sovereignty',
       icon: <ShieldCheck className="text-emerald-600" />,
       title_en: "Digital Sovereignty & IP Protection",
       title_te: "డిజిటల్ సార్వభౌమాధికారం & IP రక్షణ",
       title_hi: "डिजिटल संप्रभुता और आईपी संरक्षण",
       content_en: "Traditional designs are often plagiarized by mass-producers. The VKC platform implements a Decentralized Registry of Artisanal Designs, allowing craftsmen to timestamp and copyright their original innovations on the blockchain.",
       content_te: "సంప్రదాయ డిజైన్లు తరచుగా ఇతరులచే దొంగిలించబడుతున్నాయి. వికెసి ప్లాట్‌ఫాం హస్తకళాకారుల డిజైన్ల కోసం వికేంద్రీకృత రిజిస్ట్రీని అమలు చేస్తుంది.",
       content_hi: "पारंपरिक डिजाइनों को अक्सर बड़े उत्पादकों द्वारा चुराया जाता है। वीकेसी प्लेटफॉर्म शिल्पकारों को अपने डिजाइनों को पंजीकृत करने की अनुमति देता है।",
       points: [
          "Geometric Intellectual Property Protection",
          "Regional Design Traceability",
          "Direct Fair-Trade Licensing Engine"
       ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Splash */}
      <section className="relative pt-40 pb-20 bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-6">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full"
           >
             <ScrollText size={16} className="text-vermilion" />
             <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.5em]">Institutional Roadmap v1.0</span>
           </motion.div>
           <h1 className={`text-5xl md:text-7xl font-black text-white font-display leading-[1.1]
             ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
             The Full Vision: <span className="text-vermilion">2026—2030</span>
           </h1>
           <p className="text-stone-400 text-xl font-medium max-w-2xl mx-auto italic">
             "From Sacred Geometry to Digital Sovereignty: The roadmap to institutionalizing the Pancha Brahma mastery."
           </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 py-32 grid lg:grid-cols-4 gap-20">
        
        {/* Sticky Nav */}
        <aside className="hidden lg:block lg:sticky lg:top-40 h-fit space-y-8">
           <h4 className="text-xs font-black text-stone-900 uppercase tracking-widest border-b border-stone-100 pb-4">
             Whitepaper Contents
           </h4>
           <div className="flex flex-col gap-4">
             {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="flex items-center gap-3 text-stone-500 hover:text-vermilion font-bold transition-all text-sm group">
                   <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   {isTelugu ? s.title_te : isHindi ? s.title_hi : s.title_en}
                </a>
             ))}
           </div>
           
           <div className="pt-12">
              <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100">
                 <Cpu className="text-stone-400 mb-4" />
                 <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Technical Status</p>
                 <p className="text-xs text-stone-600 leading-relaxed font-bold">
                    Alpha Implementation Stage: Unified Registry Engine (Live)
                 </p>
              </div>
           </div>
        </aside>

        {/* Content Stream */}
        <div className="lg:col-span-3 space-y-20">
           {sections.map((section, index) => (
             <motion.section 
               key={section.id} 
               id={section.id}
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="space-y-12"
             >
               <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner">
                     {section.icon}
                  </div>
                  <div className="space-y-6">
                    <h2 className={`text-4xl font-black text-stone-900 font-display 
                      ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                      {isTelugu ? section.title_te : isHindi ? section.title_hi : section.title_en}
                    </h2>
                    <p className="text-xl text-stone-600 leading-relaxed font-medium">
                      {isTelugu ? section.content_te : isHindi ? section.content_hi : section.content_en}
                    </p>
                  </div>
               </div>

               <div className="grid md:grid-cols-3 gap-6">
                  {section.points.map((point, pi) => (
                    <div key={pi} className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 hover:border-vermilion/10 hover:shadow-xl transition-all group">
                       <Award className="text-stone-300 mb-4 group-hover:text-vermilion transition-colors" />
                       <p className="text-sm font-black text-stone-800 leading-snug">{point}</p>
                    </div>
                  ))}
               </div>

               {index < sections.length - 1 && <div className="h-[2px] w-full bg-stone-50 mt-12" />}
             </motion.section>
           ))}

           {/* Call to Action */}
           <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-vermilion rounded-[3rem] p-12 md:p-20 text-center text-white space-y-8"
           >
              <div className="inline-block p-4 bg-white/10 rounded-3xl backdrop-blur-md mb-4">
                 <BookOpen size={40} />
              </div>
              <h3 className="text-3xl md:text-5xl font-black font-display tracking-tight">Support the Mission</h3>
              <p className="text-white/80 text-lg max-w-2xl mx-auto font-medium">
                The VKC is a community-funded initiative. Your engagement ensures the success of the Digital Sovereignty engine.
              </p>
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                 <button className="bg-white text-vermilion px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">Submit Feedback</button>
                 <button className="bg-black/20 border border-white/20 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">Donate to Archive</button>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};
