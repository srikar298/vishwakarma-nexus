"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Compass, Award, ExternalLink } from 'lucide-react';
import { ExhibitModal } from './ExhibitModal';

interface ExhibitItem {
  id: string;
  img: string;
}

interface Kula {
  id: string;
  color: string;
  items: ExhibitItem[];
}

export const PanchaKulaExhibits = () => {
  const { t, i18n } = useTranslation();
  const [selectedExhibit, setSelectedExhibit] = useState<{ id: string; kulaId: string; img: string } | null>(null);

  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const kulas: Kula[] = [
    {
      id: 'manu',
      color: "text-stone-500",
      items: [
        { id: 'iron-pillar', img: "/images/features/heritage/exhibits/manu-iron-pillar.jpg" },
        { id: 'wootz-steel', img: "/images/features/heritage/exhibits/manu-wootz-steel.jpg" },
        { id: 'furnaces', img: "/images/features/heritage/exhibits/manu-furnaces.jpg" }
      ]
    },
    {
      id: 'maya',
      color: "text-amber-800",
      items: [
        { id: 'ramappa', img: "/images/features/heritage/exhibits/maya-ramappa.jpg" },
        { id: 'puri-rathas', img: "/images/features/heritage/exhibits/maya-puri-ratha.jpg" },
        { id: 'padmanabhapuram', img: "/images/features/heritage/exhibits/maya-padmanabhapuram.jpg" }
      ]
    },
    {
      id: 'twashta',
      color: "text-orange-600",
      items: [
        { id: 'hampi-musical', img: "/images/features/heritage/exhibits/twashta-hampi-pillars.jpg" },
        { id: 'chola-nataraja', img: "/images/features/heritage/exhibits/twashta-nataraja.jpg" },
        { id: 'aranmula-mirror', img: "/images/features/heritage/exhibits/twashta-mirror.jpg" }
      ]
    },
    {
      id: 'shilpi',
      color: "text-stone-700",
      items: [
        { id: 'kailasa-temple', img: "/images/features/heritage/exhibits/shilpi-kailasa.jpg" },
        { id: 'konark-wheel', img: "/images/features/heritage/exhibits/shilpi-konark.webp" },
        { id: 'madanikas-belur', img: "/images/features/heritage/exhibits/shilpi-madanika.jpg" }
      ]
    },
    {
      id: 'vishvajnya',
      color: "text-yellow-600",
      items: [
        { id: 'mangala-sutra', img: "/images/features/heritage/exhibits/vishvajnya-mangalasutra.jpg" },
        { id: 'thanjavur-nakshi', img: "/images/features/heritage/exhibits/vishvajnya-jewellery.jpg" },
        { id: 'golden-vimana', img: "/images/features/heritage/exhibits/vishvajnya-golden-vimana.jpg" }
      ]
    }
  ];

  return (
    <div className="space-y-40 w-full">
      {kulas.map((kula, kIdx) => (
        <section key={kula.id} id={kula.id} className="space-y-12 w-full">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-100 pb-8 text-center md:text-left"
          >
             <div className="flex flex-col md:flex-row items-center gap-6">
                <span className="text-[10px] font-black font-mono text-stone-200 tracking-widest">{`[ 0${kIdx + 1} ]`}</span>
                <div className="space-y-1">
                   <h2 className="text-xl md:text-2xl font-black text-stone-900 font-display uppercase tracking-wider">
                     {t(`heritage.kulas.${kula.id}.name` as never)}
                   </h2>
                   <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${kula.color}`}>
                     {t(`heritage.kulas.${kula.id}.craft` as never)}
                   </p>
                </div>
             </div>
             <div className="flex items-center justify-center md:justify-end gap-2 text-stone-400 text-[10px] font-black uppercase tracking-widest">
                <Compass size={12} className="text-stone-300" /> {t('heritage.exhibits_labels.authorized' as never)}
             </div>
          </motion.div>

          {/* Snap Slider Container */}
          <div className="relative w-full overflow-hidden px-4 -mx-4 md:px-0 md:mx-0">
            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 pb-8 md:pb-0 md:grid md:grid-cols-3 md:gap-8 w-full">
              {kula.items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedExhibit({ ...item, kulaId: kula.id })}
                  className="group relative flex-shrink-0 w-[85vw] md:w-auto snap-center flex flex-col bg-stone-50 rounded-[2.5rem] md:rounded-[2.5rem] overflow-hidden border border-stone-200 hover:border-vermilion/20 transition-all duration-500 hover:shadow-2xl cursor-pointer"
                >
                  {/* Image Layer */}
                  <div className="relative aspect-square overflow-hidden">
                    <img src={item.img} alt={t(`heritage.kulas.${kula.id}.items.${item.id}.title` as never)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 flex gap-2">
                        <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white/20">
                            <Award size={14} className={kula.color} />
                        </div>
                    </div>
                  </div>

                  {/* Content Layer */}
                  <div className="p-8 md:p-8 space-y-4 bg-white grow flex flex-col justify-between text-center md:text-left">
                    <div className="space-y-4">
                        <h3 className={`text-base md:text-lg font-black text-stone-900 leading-tight group-hover:text-vermilion transition-colors ${isTelugu ? 'font-telugu leading-relaxed' : isHindi ? 'font-hindi leading-relaxed' : ''}`}>
                          {t(`heritage.kulas.${kula.id}.items.${item.id}.title` as never)}
                        </h3>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">
                          {t('heritage.exhibits_labels.technical' as never)}: {t(`heritage.kulas.${kula.id}.items.${item.id}.tech` as never)}
                        </p>
                    </div>

                    <div className="pt-4 flex items-center justify-center md:justify-start gap-3">
                         <div className="text-[10px] font-black text-vermilion uppercase tracking-widest group-hover:gap-4 transition-all">
                            {t('heritage.exhibits_labels.technical_report' as never)}
                         </div>
                         <ExternalLink size={12} className="text-vermilion opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Detail Modal Integration */}
      <ExhibitModal 
        isOpen={!!selectedExhibit}
        onClose={() => setSelectedExhibit(null)}
        exhibit={selectedExhibit}
      />
    </div>
  );
};
