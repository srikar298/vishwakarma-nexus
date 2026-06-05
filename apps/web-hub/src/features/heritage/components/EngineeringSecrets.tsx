import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Ruler, Info, Zap, Music, Sun, Flame, Shield } from 'lucide-react';

export const EngineeringSecrets = () => {
  const [activeSecret, setActiveSecret] = useState(0);
  const { t, i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const secrets = [
    { id: 'ramappa_science', icon: <Zap size={64} className="text-vermilion mb-4" /> },
    { id: 'hampi_acoustics', icon: <Music size={64} className="text-vermilion mb-4" /> },
    { id: 'konark_precision', icon: <Sun size={64} className="text-vermilion mb-4" /> },
    { id: 'wootz_metallurgy', icon: <Flame size={64} className="text-vermilion mb-4" /> },
    { id: 'misawite_passivation', icon: <Shield size={64} className="text-vermilion mb-4" /> }
  ];

  const labelDataMap: Record<string, string> = {
    density: '< 0.9 g/cm³',
    composition: 'Porous Cer.',
    property: 'Buoyant',
    material: 'Res. Granite',
    frequency: 'Octaves',
    engineering: 'Hollow C.',
    accuracy: '± 2 Min',
    geometry: 'Solar G.',
    feature: 'Sundial',
    carbon: 'Nanotubes',
    process: 'Crucible',
    strength: 'High Tensile',
    phosphorus: 'High P',
    layer: 'Misawite',
    resistance: 'Anti-Rust'
  };

  const currentSecret = secrets[activeSecret];
  const secretKey = `heritage.secrets_section.items.${currentSecret.id}`;

  return (
    <section className="py-16 md:py-32 bg-stone-950 relative overflow-hidden">
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-[1700px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 items-center">
          
          {/* Left Side: The "Blueprint" Visualizer */}
          <div className="lg:col-span-5 relative aspect-square bg-stone-900 rounded-[2.5rem] md:rounded-[3rem] border border-white/10 overflow-hidden group">
             <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSecret}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="w-full h-full p-6 md:p-12 flex items-center justify-center"
                  >
                     <div className="relative w-full h-full border-2 border-dashed border-vermilion/20 rounded-full animate-spin-slow">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                           <Ruler size={300} strokeWidth={0.5} className="text-vermilion" />
                        </div>
                     </div>
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                        >
                           {currentSecret.icon}
                        </motion.div>
                        <h4 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">
                          {t('heritage.secrets_section.technical_analysis')}
                        </h4>
                        <p className="text-vermilion text-[10px] font-black uppercase tracking-[0.5em]">
                          {t(`${secretKey}.visual_hint` as never)}
                        </p>
                     </div>
                  </motion.div>
                </AnimatePresence>
             </div>

             {/* UI Markers */}
             <div className="absolute top-8 left-8 flex gap-2">
                <div className="w-2 h-2 bg-vermilion rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                  {t('heritage.secrets_section.scan_label')}
                </span>
             </div>
          </div>

          {/* Right Side: Content Area */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4 text-center lg:text-left">
               <h2 className="text-xs font-black text-vermilion uppercase tracking-[0.6em]">
                 {t('heritage.secrets_section.badge')}
               </h2>
               <h3 className={`text-4xl md:text-5xl font-black text-white font-display leading-[1.1]
                 ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                 {t('heritage.secrets_section.title')}
               </h3>
               <p className={`text-stone-400 text-lg leading-relaxed italic border-l-2 border-vermilion pl-6 text-left mx-auto lg:mx-0 max-w-fit
                 ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                 {t('heritage.secrets_section.subtitle')}
               </p>
            </div>

            <div className="space-y-4">
               {secrets.map((secret, index) => (
                 <button
                   key={secret.id}
                   onClick={() => setActiveSecret(index)}
                   className={`w-full text-left p-6 md:p-8 rounded-2xl md:rounded-3xl transition-all border ${
                     activeSecret === index 
                     ? 'bg-white/10 border-vermilion/50 shadow-2xl md:translate-x-4' 
                     : 'bg-white/5 border-white/5 hover:bg-white/5 hover:border-white/10'
                   }`}
                 >
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">
                         {t(`heritage.secrets_section.items.${secret.id}.location` as never)}
                       </span>
                       <Info size={14} className={activeSecret === index ? 'text-vermilion' : 'text-stone-600'} />
                    </div>
                    <h4 className={`text-2xl font-black text-white 
                      ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                      {t(`heritage.secrets_section.items.${secret.id}.title` as never)}
                    </h4>
                    
                    <AnimatePresence>
                      {activeSecret === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                           <p className={`text-stone-400 text-sm mt-4 leading-relaxed font-medium
                             ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                             {t(`heritage.secrets_section.items.${secret.id}.description` as never)}
                           </p>
                           <div className="flex gap-4 mt-8">
                              {Object.entries((t as never)(`heritage.secrets_section.items.${secret.id}.labels`, { returnObjects: true }) as Record<string, string>).map(([key, label], di) => (
                                <div key={di} className="bg-stone-900 border border-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl flex-1">
                                   <p className="text-[10px] font-black text-vermilion uppercase tracking-widest mb-1">{label as string}</p>
                                   <p className="text-xs font-black text-white">
                                      {labelDataMap[key] || 'DATA'}
                                   </p>
                                </div>
                              ))}
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </button>
               ))}
            </div>

            <button className="bg-vermilion text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-vermilion/90 transition-all shadow-xl shadow-vermilion/20 active:scale-95">
               {t('heritage.secrets_section.access_btn')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
