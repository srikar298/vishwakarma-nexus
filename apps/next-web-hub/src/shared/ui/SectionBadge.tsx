import { motion } from 'framer-motion';
import React from 'react';

interface SectionBadgeProps {
  label: string;
  variant?: 'line' | 'pill';
  theme?: 'light' | 'dark';
  className?: string;
}

export const SectionBadge = ({ 
  label, 
  variant = 'line', 
  theme = 'light',
  className = ''
}: SectionBadgeProps) => {
  const isDark = theme === 'dark';
  
  if (variant === 'pill') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border backdrop-blur-md ${
          isDark 
            ? 'bg-stone-900/40 border-white/20 text-white shadow-lg' 
            : 'bg-stone-100 border-stone-200 text-stone-900'
        } ${className}`}
      >
        <div className="w-2 h-2 bg-vermilion rounded-full animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em]">{label}</span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`flex items-center gap-4 ${className}`}
    >
      <div className="h-[2px] w-12 bg-vermilion" />
      <span className={`text-xs font-black uppercase tracking-[0.4em] ${
        isDark ? 'text-white/80' : 'text-vermilion'
      }`}>
        {label}
      </span>
    </motion.div>
  );
};
