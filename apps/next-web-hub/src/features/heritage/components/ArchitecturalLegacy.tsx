import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Map, ArrowRight, Layers } from 'lucide-react';

export const ArchitecturalLegacy = () => {
  const { t, i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const monuments = [
    {
      id: 'hampi',
      title_en: "Hampi: The Monolithic Marvel",
      title_te: "హంపి: ఏకశిలా అద్భుతం",
      title_hi: "हम्पी: अखंड चमत्कार",
      desc_en: "A fusion of Shilpi (Stone) and Maya (Wood) engineering, where structural precision met monolithic grandeur.",
      desc_te: "శిల్పి (రాయి) మరియు మాయ (కలప) ఇంజనీరింగ్ కలయిక, ఇక్కడ నిర్మాణ ఖచ్చితత్వం మరియు ఏకశిలా వైభవం కలిశాయి.",
      desc_hi: "शिल्पी (पत्थर) और माया (लकड़ी) इंजीनियरिंग का एक संगम, जहाँ संरचनात्मक सटीकता और अखंड भव्यता का मिलन हुआ।",
      image: "https://images.unsplash.com/photo-1590737190104-1b77f9f30b20?auto=format&fit=crop&q=80&w=800",
      secret_en: "Vastu Harmony: Perfectly aligned with solar transits for spiritual energy.",
      secret_te: "వాస్తు సామరస్యం: ఆధ్యాత్మిక శక్తి కోసం సౌర సంచారాలతో సంపూర్ణంగా సరిపోలింది.",
      secret_hi: "वास्तु सामंजस्य: आध्यात्मिक ऊर्जा के लिए सौर पारगमन के साथ पूरी तरह से संरेखित।"
    },
    {
      id: 'ramappa',
      title_en: "Ramappa: The Floating Brilliance",
      title_te: "రామప్ప: తేలే తేజస్సు",
      title_hi: "रामप्पा: तैरती चमक",
      desc_en: "A masterpiece where Thwashta (Metal) and Shilpi (Stone) expertise created earthquake-resistant floating heritage.",
      desc_te: "త్వష్ట (లోహం) మరియు శిల్పి (రాయి) నైపుణ్యం కలిసిన చోట భూకంపాలను తట్టుకునే తేలే వారసత్వం పుట్టింది.",
      desc_hi: "एक उत्कृष्ट कृति जहाँ त्वष्टा (धातु) और शिल्पी (पत्थर) की विशेषज्ञता ने भूकंप प्रतिरोधी तैरती विरासत का निर्माण किया।",
      image: "https://images.unsplash.com/photo-1600673891404-399a91437340?auto=format&fit=crop&q=80&w=800",
      secret_en: "Pancha-Metal Casting: Use of advanced alloys in structural reinforcement.",
      secret_te: "పంచ-లోహ కాస్టింగ్: నిర్మాణ బలోపేతంలో అధునాతన మిశ్రమ లోహాల వినియోగం.",
      secret_hi: "पंच-लोहा कास्टिंग: संरचनात्मक सुदृढ़ीकरण में उन्नत मिश्र धातुओं का उपयोग।"
    },
    {
      id: 'konark',
      title_en: "Konark: The Solar Wheel",
      title_te: "కోణార్క్: సౌర చక్రం",
      title_hi: "कोणार्क: सौर चक्र",
      desc_en: "The ultimate synthesis of Manu, Maya, Thwashta, Shilpi, and Vishwajna mastery into a single cosmic chariot.",
      desc_te: "మను, మయ, త్వష్ట, శిల్పి మరియు విశ్వజ్ఞ నైపుణ్యాల అంతిమ సంశ్లేషణ - ఒకే ఒక దివ్య రథం.",
      desc_hi: "मनु, माया, त्वष्टा, शिल्पी और विश्वज्ञ महारत का अंतिम संश्लेषण - एक एकल ब्रह्मांडीय रथ।",
      image: "https://images.unsplash.com/photo-1619623067139-335b7194883d?auto=format&fit=crop&q=80&w=800",
      secret_en: "Cosmic Integration: 24 wheels representing the 24 hours of a solar day.",
      secret_te: "కాస్మిక్ ఇంటిగ్రేషన్: సౌర రోజులోని 24 గంటలను సూచించే 24 చక్రాలు.",
      secret_hi: "ब्रह्मांडीय एकीकरण: 24 पहिये जो सौर दिवस के 24 घंटों का प्रतिनिधित्व करते हैं।"
    }
  ];

  return (
    <section className="py-32 bg-stone-900 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Technical Drawing Border */}
      <div className="absolute inset-y-0 right-0 w-[1px] bg-white/5 hidden 2xl:block" />

      <div className="max-w-none mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
           <div className="space-y-4 max-w-2xl">
              <h2 className="text-xs font-black text-vermilion uppercase tracking-[0.6em]">
                {t('legacy.heritage', 'Pancha Brahma Identity')}
              </h2>
              <h3 className={`text-4xl md:text-6xl font-black text-white leading-tight font-display 
                ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                {t('legacy.title', 'Architects of the Five Elements.')}
              </h3>
           </div>
           <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
             <Layers className="text-vermilion w-6 h-6" />
             <p className="text-stone-400 text-xs font-bold leading-relaxed">
               Acknowledging the collective mastery of Manu, Maya, Thwashta, Shilpi, and Vishwajna in building civilization.
             </p>
           </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {monuments.map((mon, index) => (
            <motion.div
              key={mon.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative h-[600px] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl"
            >
              <img src={mon.image} alt={mon.title_en} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-all" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-[1px] bg-vermilion group-hover:w-20 transition-all" />
                   <span className="text-[10px] font-black text-vermilion uppercase tracking-[0.4em]">Integrated Mastery</span>
                </div>

                <h4 className={`text-3xl font-black text-white leading-tight group-hover:text-vermilion transition-colors
                  ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                  {isTelugu ? mon.title_te : isHindi ? mon.title_hi : mon.title_en}
                </h4>

                <p className="text-stone-300 text-sm leading-relaxed font-medium">
                  {isTelugu ? mon.desc_te : isHindi ? mon.desc_hi : mon.desc_en}
                </p>

                <div className="pt-6 border-t border-white/10 mt-6 opacity-0 group-hover:opacity-100 transition-all delay-200">
                   <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
                      <ShieldCheck className="text-vermilion w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Craft Interaction</p>
                        <p className="text-white text-xs font-bold">
                           {isTelugu ? mon.secret_te : isHindi ? mon.secret_hi : mon.secret_en}
                        </p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform pt-6">
                   Explore Craft Fusion <ArrowRight size={14} className="text-vermilion" />
                </div>
              </div>

              <div className="absolute top-8 right-8 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                 <Map size={12} className="text-vermilion" />
                 <span className="text-[8px] font-black text-white uppercase tracking-widest">Pancha Brahma Heritge</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
