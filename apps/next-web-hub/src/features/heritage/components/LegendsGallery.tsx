import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Award, Quote, Star } from 'lucide-react';

export const LegendsGallery = () => {
  const { t, i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const legends = [
    {
      id: 'veerabrahma',
      name_en: "Sri Pothuluru Veerabrahmendra Swamy",
      name_te: "శ్రీ పోతులూరి వీరబ్రహ్మేంద్ర స్వామి",
      name_hi: "श्री पोथुलुरु वीरब्रह्मेंद्र स्वामी",
      contribution_en: "Great Saint, Prophet, and Social Reformer who united the community.",
      contribution_te: "సమాజాన్ని ఏకం చేసిన గొప్ప సెయింట్, ప్రవక్త మరియు సామాజిక సంస్కర్త.",
      contribution_hi: "महान संत, पैगंबर और समाज सुधारक जिन्होंने समुदाय को एकजुट किया।",
      field_en: "Spirituality & Reform",
      field_te: "ఆధ్యాత్మికత & సంస్కరణ",
      field_hi: "अध्यात्म और सुधार",
      image: "/images/legends/veerabrahma.jpg"
    },
    {
      id: 'jakanachari',
      name_en: "Amarashilpi Jakanachari",
      name_te: "అమరశిల్పి జకనాచారి",
      name_hi: "అమరశిల్పి జకనాచారి",
      contribution_en: "Legendary master sculptor of the Hoysala temples (Belur & Halebidu).",
      contribution_te: "హోయసల దేవాలయాల (బేలూరు & హళేబీడు) పురాణ ప్రధాన శిల్పి.",
      contribution_hi: "होयसल मंदिरों (बेलूर और हलेबिडु) के प्रसिद्ध मास्टर शिल्पकार।",
      field_en: "Architecture & Sculpture",
      field_te: "నిర్మాణం & శిల్పకళ",
      field_hi: "वास्तुकला और मूर्तिकला",
      image: "/images/legends/jakanachari.jpg"
    },
    {
      id: 'maroju',
      name_en: "Sri Maroju Veeranna",
      name_te: "శ్రీ మరోజు వీరన్న",
      name_hi: "श्री मरोजु वीरन्ना",
      contribution_en: "Legendary Freedom Fighter and Community Reformer.",
      contribution_te: "పురాణ స్వాతంత్ర్య సమరయోధుడు మరియు సామాజిక సంస్కర్త.",
      contribution_hi: "प्रसिद्ध स्वतंत्रता सेनानी और समाज सुधारक।",
      field_en: "Politics & Reform",
      field_te: "రాజకీయాలు & సంస్కరణ",
      field_hi: "राजनीति और सुधार",
      image: "/images/legends/maroju_veeranna.jpg"
    },
    {
      id: 'rammurthy',
      name_en: "Sri Ganala Rammurthy",
      name_te: "శ్రీ గణాల రామ్మూర్తి",
      name_hi: "శ్రీ గణాల రామ్మూర్తి",
      contribution_en: "Architectural Visionary and Preserver of Silpa Shastras.",
      contribution_te: "శిల్ప శాస్త్రాల పరిరక్షకుడు మరియు నిర్మాణ దార్శనికుడు.",
      contribution_hi: "శిల్ప శాస్త్రాల పరిరక్షకుడు మరియు నిర్మాణ దార్శనికుడు.",
      field_en: "Architecture & Shastras",
      field_te: "నిర్మాణం & శాస్త్రాలు",
      field_hi: "वास्तुकला और शास्त्र",
      image: "/images/legends/ganala_rammurthy.jpg"
    },
    {
      id: 'modern_achiever',
      name_en: "Modern Masters",
      name_te: "ఆధునిక ఆవిష్కర్తలు",
      name_hi: "आधुनिक नवाचार",
      contribution_en: "The thousands of engineers and artists continuing the 5,000-year legacy.",
      contribution_te: "5,000 ఏళ్ల వారసత్వాన్ని కొనసాగిస్తున్న వేలాది మంది ఇంజనీర్లు మరియు కళాకారులు.",
      contribution_hi: "5,000 साल की विरासत को जारी रखने वाले हजारों इंजीनियर and कलाकार।",
      field_en: "Science & Engineering",
      field_te: "సైన్స్ & ఇంజనీరింగ్",
      field_hi: "विज्ञान और इंजीनियरिंग",
      image: "/images/legends/modern_achiever.jpg"
    }
  ];

  const mentions = [
    { name_en: "Smt. Tarigonda Vengamamba", title_en: "Saint & Poetess", img: "/images/legends/vengamamba.jpg" },
    { name_en: "Sri K.S. Brahmarshi", title_en: "Social Reformer", img: "/images/legends/brahmarshi.jpg" },
    { name_en: "Modern Visionaries", title_en: "Local Leadership", img: "/images/legends/visionaries.jpg" },
    { name_en: "Historical Craftsmen", title_en: "Anonymous Masters", img: "/images/legends/craftsmen.jpg" }
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20 space-y-4">
           <h2 className="text-xs font-black text-saffron-600 uppercase tracking-[0.6em]">
             {t('legends.heritage', 'Icons of Excellence')}
           </h2>
           <h3 className={`text-4xl md:text-5xl font-black text-stone-900 font-display 
             ${isTelugu ? 'font-telugu leading-relaxed' : isHindi ? 'font-hindi leading-relaxed' : ''}`}>
             {t('legends.title', 'The Hall of Legends')}
           </h3>
           <div className="h-1 w-24 bg-vermilion mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {legends.map((legend, index) => (
            <motion.div
              key={legend.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-stone-50 rounded-[2.5rem] p-8 border border-stone-100 hover:border-saffron-300 hover:bg-white hover:shadow-2xl transition-all duration-500 group overflow-hidden relative"
            >
              <div className="absolute -top-4 right-4 text-stone-100 group-hover:text-saffron-50 text-8xl font-serif transition-colors">
                 <Quote />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-24 h-24 bg-stone-100 rounded-3xl overflow-hidden border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                     <img 
                       src={legend.image} 
                       alt={legend.name_en} 
                       className="w-full h-full object-cover transition-all duration-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'; }}
                     />
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="text-saffron-400 fill-saffron-400" />
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-stone-100 group-hover:border-saffron-100 transition-colors">
                  <h4 className={`text-2xl font-black text-stone-900 leading-tight
                    ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                    {isTelugu ? legend.name_te : isHindi ? legend.name_hi : legend.name_en}
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-saffron-600">
                    {isTelugu ? legend.field_te : isHindi ? legend.field_hi : legend.field_en}
                  </p>
                  <p className="text-stone-500 text-sm leading-relaxed font-medium">
                    {isTelugu ? legend.contribution_te : isHindi ? legend.contribution_hi : legend.contribution_en}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 group-hover:text-vermilion transition-colors cursor-pointer">
                   <Award size={14} />
                   <span>View Legacy</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 border-t border-stone-100 pt-20">
           <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
              <div className="space-y-2">
                 <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]">Notable Mentions</h4>
                 <h5 className="text-3xl font-black text-stone-900 font-display">Community Reformers</h5>
              </div>
              <p className="text-stone-500 text-sm max-w-md font-medium">
                 Honoring the local leaders and visionary reformers who have tirelessly worked for the betterment of the Vishwakarma community.
              </p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {mentions.map((mention, i) => (
                <div key={i} className="group p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:border-saffron-200 transition-all flex flex-col items-center text-center">
                   <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm mb-4 group-hover:scale-110 transition-transform bg-stone-200">
                      <img 
                        src={mention.img} 
                        alt={mention.name_en} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'; }}
                      />
                   </div>
                   <h6 className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">{mention.title_en}</h6>
                   <p className="text-xs font-black text-stone-900 group-hover:text-saffron-600 transition-colors">{mention.name_en}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="mt-20 text-center">
           <button className="bg-stone-900 text-white px-10 py-5 rounded-3xl font-black hover:bg-vermilion transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest">
              Explore All Historical Figures
           </button>
        </div>
      </div>
    </section>
  );
};
