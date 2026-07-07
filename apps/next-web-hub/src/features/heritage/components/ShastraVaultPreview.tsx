import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BookOpen, Scroll, Shield, Search, ArrowRight } from 'lucide-react';

export const ShastraVaultPreview = () => {
  const { i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const shastras = [
    {
      id: 'manasara',
      name_en: "Manasara: The Master Treatise",
      name_te: "మానసారం: ప్రధాన గ్రంథం",
      name_hi: "मानसार: मुख्य ग्रंथ",
      focus_en: "Comprehensive guide to city planning and temple architecture.",
      focus_te: "నగర ప్రణాళిక మరియు దేవాలయ నిర్మాణంపై సమగ్ర మార్గదర్శి.",
      focus_hi: "शहर नियोजन और मंदिर वास्तुकला के लिए व्यापक मार्गदर्शिका।",
      chapters_en: "70 Chapters",
      chapters_te: "70 అధ్యాయాలు",
      chapters_hi: "70 अध्याय",
      tag: "Archi-Logic"
    },
    {
      id: 'mayamata',
      name_en: "Mayamata: Sacred Geometry",
      name_te: "మయమతం: పవిత్ర జ్యామితి",
      name_hi: "मयमत: पवित्र ज्यामिति",
      focus_en: "The profound science of proportions and spatial orientation (Vastu).",
      focus_te: "నిష్పత్తులు మరియు ప్రాదేశిక ధోరణి (వాస్తు) యొక్క లోతైన శాస్త్రం.",
      focus_hi: "अनुपात और स्थानिक अभिविन्यास (वास्तु) का गहन विज्ञान।",
      chapters_en: "36 Chapters",
      chapters_te: "36 అధ్యాయాలు",
      chapters_hi: "36 अध्याय",
      tag: "Spatial-Science"
    },
    {
      id: 'shilpa_ratna',
      name_en: "Shilpa Ratna: The Gems of Art",
      name_te: "శిల్ప రత్న: కళల రత్నాలు",
      name_hi: "शिल्प रत्न: कला के रत्न",
      focus_en: "The definitive text on iconography and metal casting techniques.",
      focus_te: "విగ్రహాల తయారీ మరియు లోహ కాస్టింగ్ పద్ధతులపై నిశ్చయాత్మక గ్రంథం.",
      focus_hi: "प्रतिमा विज्ञान और धातु कास्टिंग तकनीकों पर निश्चित पाठ।",
      chapters_en: "46 Chapters",
      chapters_te: "46 అధ్యాయాలు",
      chapters_hi: "46 अध्याय",
      tag: "Metallurgy"
    }
  ];

  return (
    <section className="py-24 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
           <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3 bg-stone-200/50 w-fit px-4 py-1 rounded-full text-stone-600">
                 <BookOpen size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Digital Repository</span>
              </div>
              <h3 className={`text-4xl md:text-5xl font-black text-stone-900 leading-tight
                ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                The Shastra Vault: <span className="text-vermilion">Living Manuscripts</span>
              </h3>
           </div>
           <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-vermilion transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search ancient texts..."
                className="w-full bg-white border border-stone-200 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/10 focus:border-vermilion transition-all placeholder:text-stone-400 font-medium"
              />
           </div>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide px-2">
          {shastras.map((shastra, index) => (
            <motion.div
              key={shastra.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[320px] md:min-w-[400px] bg-white rounded-[2.5rem] p-10 shadow-sm border border-stone-100 hover:shadow-2xl hover:border-vermilion/10 transition-all duration-500 group relative"
            >
              {/* Decorative Palm-Leaf Motif */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-[5rem] opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-stone-50 rounded-2xl text-stone-400 group-hover:text-vermilion transition-colors">
                  <Scroll size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-vermilion/50 px-3 py-1 bg-vermilion/5 rounded-full">
                  {shastra.tag}
                </span>
              </div>

              <div className="space-y-6">
                 <div>
                   <h4 className={`text-2xl font-black text-stone-900 mb-2 leading-tight
                     ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                     {isTelugu ? shastra.name_te : isHindi ? shastra.name_hi : shastra.name_en}
                   </h4>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
                     {isTelugu ? shastra.chapters_te : isHindi ? shastra.chapters_hi : shastra.chapters_en} — Sanskrit Commentary
                   </p>
                 </div>

                 <p className="text-stone-500 text-sm leading-relaxed font-normal">
                    {isTelugu ? shastra.focus_te : isHindi ? shastra.focus_hi : shastra.focus_en}
                 </p>

                 <div className="pt-6 flex justify-between items-center border-t border-stone-100">
                    <div className="flex -space-x-2">
                       {[...Array(3)].map((_, i) => (
                         <div key={i} className="w-6 h-6 rounded-full bg-stone-200 border-2 border-white" />
                       ))}
                       <span className="text-[8px] font-black text-stone-400 self-center ml-4">+4 Scholars Reviewing</span>
                    </div>
                    <div className="w-10 h-10 bg-stone-950 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all cursor-pointer">
                       <ArrowRight size={16} />
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 bg-stone-900 p-12 rounded-[3.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-vermilion/10 blur-[100px] rounded-full" />
          <div className="flex items-center gap-6 relative z-10">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/5">
                <Shield className="text-vermilion" />
             </div>
             <div>
                <h5 className="text-white font-black text-lg">Institutional Heritage Access</h5>
                <p className="text-stone-400 text-sm font-medium">Verified members get full access to translated PDFs & 3D renders.</p>
             </div>
          </div>
          <button className="bg-white text-stone-900 px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-vermilion hover:text-white transition-all shadow-xl active:scale-95 relative z-10">
             Unlock Full Archive
          </button>
        </div>
      </div>
    </section>
  );
};
