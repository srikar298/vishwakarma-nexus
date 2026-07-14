"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { SocialLinks } from '@/shared/ui/SocialLinks';

const SONS_KEYS = ['manu', 'maya', 'thwashta', 'shilpi', 'vishwajna'];

const SONS_METADATA = {
  manu: {
    image: '/images/features/home/hero/manu.webp',
    color: 'from-orange-500/20 to-red-500/20',
    borderColor: 'group-hover:border-orange-500/50'
  },
  maya: {
    image: '/images/features/home/hero/maya.webp',
    color: 'from-amber-600/20 to-yellow-600/20',
    borderColor: 'group-hover:border-amber-600/50'
  },
  thwashta: {
    image: '/images/features/home/hero/thwashta.webp',
    color: 'from-blue-500/20 to-indigo-500/20',
    borderColor: 'group-hover:border-blue-500/50'
  },
  shilpi: {
    image: '/images/features/home/hero/shilpi.webp',
    color: 'from-stone-500/20 to-slate-500/20',
    borderColor: 'group-hover:border-stone-500/50'
  },
  vishwajna: {
    image: '/images/features/home/hero/vishwajna.webp',
    color: 'from-yellow-400/20 to-gold-500/20',
    borderColor: 'group-hover:border-yellow-500/50'
  }
};

export function HeroFiveSons() {
  const { t, i18n } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      cancelAnimationFrame(handle);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleSnap = () => {
    if (navigator.vibrate) {
      navigator.vibrate(30); 
    }
  };

  return (
    <header className="relative min-h-screen w-full bg-cream overflow-hidden flex flex-col pt-20 md:pt-28 lg:pt-32">
      
      {/* Background Texture - Subtle Marble/Parchment feel */}
      <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" 
           style={{ backgroundImage: `url("/images/shared/textures/marble-similar.png")` }} />

      {/* Decorative Rotating Mandalas */}
      <motion.img
        src="/images/features/home/hero/mandala-motif.webp"
        srcSet="/images/features/home/hero/mandala-motif-400.webp 400w, /images/features/home/hero/mandala-motif-800.webp 800w"
        sizes="(max-width: 768px) 400px, 800px"
        alt="Decorative Mandala Motif"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] opacity-[0.15] pointer-events-none mix-blend-multiply z-0"
        fetchPriority="high"
        loading="eager"
        decoding="async"
      />
      <motion.img
        src="/images/features/home/hero/mandala-motif.webp"
        srcSet="/images/features/home/hero/mandala-motif-400.webp 400w, /images/features/home/hero/mandala-motif-800.webp 800w"
        sizes="(max-width: 768px) 400px, 800px"
        alt="Decorative Mandala Motif"
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-48 -right-48 w-[800px] h-[800px] opacity-[0.12] pointer-events-none mix-blend-multiply z-0"
        loading="lazy"
        decoding="async"
      />

      {/* Trilingual Regional Motifs Overlay */}
      {mounted && (
        <AnimatePresence mode="wait">
          {i18n.language === 'en' && (
            <motion.div
              key="en-motif"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply bg-no-repeat bg-right-top p-20"
              style={{ 
                backgroundImage: 'url(/images/features/home/hero/universal-motif.webp)', 
                backgroundSize: '35%',
              }}
            />
          )}
          {i18n.language === 'te' && (
            <motion.div
              key="te-motif"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply bg-no-repeat bg-contain bg-right-bottom"
              style={{ backgroundImage: 'url(/images/features/home/hero/kakatiya-thoranam.png)' }}
            />
          )}
          {i18n.language === 'hi' && (
            <motion.div
              key="hi-motif"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply bg-no-repeat bg-top"
              style={{ backgroundImage: 'url(/images/features/home/hero/nagara-shikhara.png)' }}
            />
          )}
        </AnimatePresence>
      )}

      <div className="relative z-20 w-full max-w-[1700px] mx-auto px-6 md:px-12 flex flex-col md:flex-row-reverse items-center md:items-start justify-center md:justify-start gap-10 md:gap-20 shrink-0 pb-10">
        
        {/* Left: Lord Vishwakarma Emblem */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="w-56 h-72 md:w-[40%] md:h-[80vh] md:max-w-md shrink-0 relative rounded-xl md:rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(227,66,52,0.1)] ring-12 ring-white ring-offset-4 ring-offset-saffron-50 border-1 border-white group"
        >
          <img 
            src="/images/features/home/hero/vishwakarma-bg.webp" 
            srcSet="/images/features/home/hero/vishwakarma-bg-400.webp 400w, /images/features/home/hero/vishwakarma-bg-800.webp 800w, /images/features/home/hero/vishwakarma-bg-1200.webp 1200w"
            sizes="(max-width: 768px) 224px, (max-width: 1280px) 40vw, 448px"
            alt="Lord Vishwakarma Emblem"
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-[3s] ease-out"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vermilion/30 via-transparent to-transparent pointer-events-none mix-blend-overlay" />
        </motion.div>

        {/* Right: Trilingual Typography */}
        <div className="flex flex-col text-center md:text-left flex-1 md:max-w-[65%] pt-6 md:pt-16 relative">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center md:justify-start gap-4 mb-6"
          >
            <span className="w-12 h-[2px] bg-vermilion" />
            <p className="text-vermilion font-black tracking-[0.3em] uppercase text-xs md:text-sm">
              {t('hero.welcome')}
            </p>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-outfit text-stone-900 mb-6 md:mb-8 tracking-tighter leading-[1.2] drop-shadow-sm"
          >
            {t('hero.title')}<br/>
            <span className="text-vermilion">{t('hero.subtitle')}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-stone-600 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-medium mx-auto md:mx-0 max-w-2xl text-pretty"
          >
            {t('hero.description')}
          </motion.p>
          
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
             className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-8 md:mt-12 justify-center md:justify-start"
          >
            <Link href="/network" className="group relative bg-vermilion text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(227,66,52,0.3)] block text-center">
              <span className="relative z-10">Explore Services</span>
              <div className="absolute inset-0 bg-gradient-to-r from-saffron to-vermilion opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
            </Link>
            <Link 
              href="/heritage"
              className="bg-white/40 backdrop-blur-md text-stone-900 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg border-2 border-white/60 hover:bg-white/60 transition-all shadow-xl block text-center"
            >
              Explore Legacy
            </Link>
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6 }}
             className="flex flex-col sm:flex-row gap-6 sm:gap-5 mt-8 md:mt-10 justify-center md:justify-start items-center"
          >
            <SocialLinks 
              showLabel 
              className="flex gap-4 items-center sm:border-r sm:border-white/20 sm:pr-5" 
            />
            <Link 
              href="/gallery" 
              className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 flex items-center gap-2 transition-all hover:translate-x-1 border border-white/10 px-4 py-2 rounded-full hover:bg-white/5"
            >
              View Gallery <span className="text-saffron-500">→</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Interactive Accordion / Carousel */}
      <div className="relative z-10 w-full max-w-[1700px] mx-auto mt-auto overflow-x-auto snap-x snap-mandatory flex md:gap-4 pt-10 pb-12 hide-scrollbar"
           onScroll={isMobile ? handleSnap : undefined}>
        {SONS_KEYS.map((key, index) => {
          const son_meta = SONS_METADATA[key as keyof typeof SONS_METADATA];
          const heroSons = t('heroSons', { returnObjects: true }) as Record<string, { name: string; craft: string; gotra: string; veda: string; desc: string }>;
          const son_data = heroSons[key];
          const isActive = hoveredIndex === index;
          
          return (
            <motion.div
              key={key}
              className={`flex-shrink-0 w-[85vw] md:w-auto h-[45vh] md:h-[50vh] snap-center rounded-[3rem] overflow-hidden relative cursor-pointer mx-4 md:mx-0 group shadow-2xl transition-all duration-500 border-4 border-transparent ${son_meta.borderColor} ${isActive ? 'shadow-vermilion/10 ring-2 ring-vermilion/20' : 'hover:shadow-xl'}`}
              style={{ flex: isMobile ? 'none' : isActive ? 3 : 1 }}
              onHoverStart={() => !isMobile && setHoveredIndex(index)}
              onHoverEnd={() => !isMobile && setHoveredIndex(null)}
              onClick={() => isMobile && setHoveredIndex(isActive ? null : index)}
              layout
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              {/* Premium Background Layer */}
              <div className="absolute inset-0 bg-stone-50 transition-colors duration-500" />
              <div className={`absolute inset-0 bg-gradient-to-br ${son_meta.color} opacity-40 mix-blend-multiply transition-opacity duration-1000`} />

              {/* Senior UI/UX: Rotating Divine Halo (Mandala) */}
              <motion.div 
                animate={{ rotate: isActive ? 360 : 0 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none`}
              >
                <img 
                  src="/images/features/home/hero/mandala-motif.webp" 
                  srcSet="/images/features/home/hero/mandala-motif-400.webp 400w, /images/features/home/hero/mandala-motif-800.webp 800w"
                  sizes="400px"
                  className="w-full h-full object-contain filter invert opacity-50" 
                  alt="Decorative Mandala Motif" 
                />
              </motion.div>

              {/* Son Portrait Image with Parallax Depth */}
              <motion.img 
                src={son_meta.image}
                alt={son_data.name}
                initial={{ scale: 1 }}
                animate={{ scale: isActive ? 1.05 : 1, y: isActive ? -20 : 0 }}
                className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 group-hover:scale-105"
              />

              {/* Senior UI/UX: Legibility Layer - Subtle dark gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-stone-950/5 to-transparent pointer-events-none" />

              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                {/* Inactive State Identity (Gold Saffron Honorifics) */}
                <motion.div 
                  initial={false}
                  animate={{ 
                    y: isActive ? -320 : 0,
                    opacity: isActive ? 0 : 1 
                  }}
                  className="absolute inset-x-0 bottom-12 flex flex-col items-center pointer-events-none px-6"
                >
                  <h2 className={`text-xl md:text-2xl font-black text-white uppercase tracking-tighter text-center leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${i18n.language === 'te' ? 'font-ramaraja' : i18n.language === 'hi' ? 'font-rozha' : 'font-outfit'}`}>
                    {son_data.name.replace(/^(SRI |శ్రీ |श्री |Sri )/i, '')}
                  </h2>
                </motion.div>

                {/* Expanded Content (Bottom Sheet Meta) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-stone-900/60 backdrop-blur-2xl p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] mb-4"
                    >
                      <div className="mb-4 md:mb-6 text-left">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="w-8 h-[2px] bg-vermilion" />
                           <h3 className="text-vermilion text-[10px] md:text-xs font-bold uppercase tracking-widest font-outfit">
                             {son_data.craft}
                           </h3>
                        </div>
                        <h2 className={`text-xl md:text-4xl font-black text-white leading-tight ${i18n.language === 'te' ? 'font-ramaraja' : i18n.language === 'hi' ? 'font-rozha' : 'font-outfit'}`}>
                          {son_data.name.replace(/^(SRI |శ్రీ |Sri )/i, '')}
                        </h2>
                      </div>

                      <div className="space-y-4 md:space-y-6">
                        <div className="flex flex-col gap-2 md:gap-2.5 items-start">
                          <div className="flex items-baseline gap-3">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Gotra</span>
                             <span className="text-sm md:text-base font-black text-white uppercase tracking-widest leading-none">
                               {son_data.gotra}
                             </span>
                          </div>
                          <div className="flex items-baseline gap-3">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Veda</span>
                             <span className="text-sm md:text-base font-black text-vermilion uppercase tracking-widest leading-none">
                               {son_data.veda}
                             </span>
                          </div>
                        </div>
                        
                        <p className="text-stone-300 font-medium text-sm md:text-base leading-relaxed text-pretty italic border-l-2 border-vermilion/30 pl-4">
                          &quot;{son_data.desc}&quot;
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* Scroll Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-stone-400 to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ y: [-16, 48] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-4 bg-vermilion"
          />
        </div>
      </motion.div>
    </header>
  );
}
