"use client";

import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';
import { SectionBadge } from './SectionBadge';
import { useTranslation } from 'react-i18next';

interface PageHeroProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  badgeLabel?: string;
  badgeVariant?: 'line' | 'pill';
  children?: ReactNode;
  texture?: 'grid' | 'marble' | 'none';
  className?: string;
  containerClassName?: string;
  align?: 'center' | 'left';
}

export const PageHero = ({ 
  title, 
  subtitle, 
  badgeLabel, 
  badgeVariant = 'pill',
  children,
  texture = 'grid',
  className = '',
  containerClassName = '',
  align = 'center'
}: PageHeroProps) => {
  const { i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  const textureUrls = {
    grid: "/images/shared/textures/grid-me.png",
    marble: "/images/shared/textures/marble-similar.png",
    none: ""
  };

  return (
    <header className={`relative pt-32 pb-16 md:pt-44 md:pb-24 bg-stone-900 overflow-hidden ${className}`}>
      {/* Background Texture */}
      {texture !== 'none' && (
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: `url("${textureUrls[texture]}")` }} 
        />
      )}
      
      <div className={`max-w-7xl mx-auto px-6 relative z-10 ${align === 'center' ? 'text-center' : 'text-left'} ${containerClassName}`}>
        <div className={`space-y-6 md:space-y-8 ${align === 'center' ? 'flex flex-col items-center' : ''}`}>
          {badgeLabel && (
            <SectionBadge 
              label={badgeLabel} 
              variant={badgeVariant} 
              theme="dark" 
              className={align === 'center' ? 'mx-auto' : ''}
            />
          )}

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-4xl md:text-7xl font-black text-white font-display leading-[1.1] tracking-tight
              ${isTelugu ? 'font-telugu leading-relaxed' : isHindi ? 'font-hindi leading-relaxed' : ''}`}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-stone-400 text-lg md:text-xl font-medium max-w-2xl italic
                ${align === 'center' ? 'mx-auto' : ''}
                ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}
            >
              {subtitle}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};
