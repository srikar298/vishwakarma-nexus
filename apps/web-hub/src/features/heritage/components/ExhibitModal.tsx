import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Award, Shield, Users, Zap } from 'lucide-react';

interface ExhibitModalProps {
  isOpen: boolean;
  onClose: () => void;
  exhibit: {
    id: string;
    kulaId: string;
    img: string;
  } | null;
}

import { BaseModal } from '@/shared/ui/BaseModal';

export const ExhibitModal = ({ isOpen, onClose, exhibit }: ExhibitModalProps) => {
  const { t, i18n } = useTranslation();

  if (!exhibit) return null;

  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const kulaKey = `heritage.kulas.${exhibit.kulaId}`;
  const itemKey = `${kulaKey}.items.${exhibit.id}`;

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose}
      maxW="max-w-5xl"
      className="!rounded-[2rem] md:!rounded-[3rem]"
      showCloseButton={false} // Custom close button needed for this layout
    >
      <div className="relative w-full flex flex-col md:flex-row max-h-[90vh]">
        {/* Custom Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2.5 bg-stone-100/90 hover:bg-stone-200 active:scale-90 active:bg-stone-300 text-stone-900 hover:text-stone-950 rounded-full transition-all duration-75 border border-stone-200/50 shadow-md cursor-pointer hover:scale-105 flex items-center justify-center min-w-[44px] min-h-[44px]"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Left Side: Visual / Info Overlay */}
        <div className="md:w-2/5 relative h-64 md:h-auto">
          <img src={exhibit.img} alt={t(`${itemKey}.title` as never)} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 space-y-2">
             <div className="flex items-center gap-2">
                <Award size={16} className="text-vermilion" />
                <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em]">
                  {t(`${kulaKey}.name` as never)}
                </span>
             </div>
             <h2 className={`text-2xl md:text-3xl font-black text-white leading-tight
               ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
               {t(`${itemKey}.title` as never)}
             </h2>
          </div>
        </div>

        {/* Right Side: Scrollable Context */}
        <div className="md:w-3/5 bg-white p-8 md:p-14 overflow-y-auto no-scrollbar">
          <div className="space-y-12">
            {/* Intro */}
            <div className="space-y-4">
              <span className="text-[10px] font-black text-vermilion uppercase tracking-[0.5em]">Deep Context Analysis</span>
              <p className={`text-lg md:text-xl text-stone-600 font-medium leading-relaxed italic
                ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                {t(`${itemKey}.shortDesc` as never)}
              </p>
            </div>

            {/* Dynamic Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { icon: <Award className="text-vermilion" />, title: t('heritage.exhibits_labels.cultural_pride' as never), content: t(`${itemKey}.deepContext.culturalPride` as never) },
                { icon: <Shield className="text-blue-600" />, title: t('heritage.exhibits_labels.technical' as never), content: t(`${itemKey}.deepContext.technical` as never) },
                { icon: <Users className="text-stone-900" />, title: t('heritage.exhibits_labels.inclusivity' as never), content: t(`${itemKey}.deepContext.inclusivity` as never) },
                { icon: <Zap className="text-amber-500" />, title: t('heritage.exhibits_labels.drive' as never), content: t(`${itemKey}.shortDesc` as never) }
              ].map((section, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 shadow-sm">
                      {section.icon}
                    </div>
                    <h3 className="text-xs font-black text-stone-900 uppercase tracking-widest">
                      {section.title}
                    </h3>
                  </div>
                  <p className={`text-stone-500 text-sm md:text-base leading-relaxed font-medium pl-[3.5rem]
                    ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                    {section.content as string}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Footer / Badge */}
            <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-white text-[10px] font-black">VKC</div>
                  <div>
                    <p className="text-[10px] font-black text-stone-900 uppercase tracking-widest">{t('heritage.exhibits_labels.authorized' as never)}</p>
                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Registry ID: {exhibit.id.toUpperCase()}-VH-2026</p>
                  </div>
               </div>
               <button 
                onClick={onClose}
                className="bg-vermilion text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-vermilion/20"
               >
                 {t('heritage.exhibits_labels.collapse' as never)}
               </button>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
