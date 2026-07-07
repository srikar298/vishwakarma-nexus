import { motion } from 'framer-motion';
import React from 'react';

interface GeometryDividerProps {
  theme?: 'light-to-dark' | 'dark-to-light';
  className?: string;
}

export const GeometryDivider = ({ 
  theme = 'light-to-dark',
  className = ''
}: GeometryDividerProps) => {
  const isLightToDark = theme === 'light-to-dark';
  
  return (
    <div className={`relative h-32 md:h-48 overflow-hidden pointer-events-none ${className}`}>
      {/* Background fill to ensure no gaps */}
      <div className={`absolute inset-0 ${isLightToDark ? 'bg-stone-50' : 'bg-stone-950'}`} />
      
      <svg 
        viewBox="0 0 1440 320" 
        className={`absolute bottom-0 w-full h-full preserve-3d ${isLightToDark ? 'text-stone-950' : 'text-stone-50'}`}
        preserveAspectRatio="none"
      >
        <path 
          fill="currentColor" 
          d={isLightToDark 
            ? "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,213.3C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            : "M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,170.7C672,171,768,117,864,106.7C960,96,1056,128,1152,154.7C1248,181,1344,203,1392,213.3L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          }
        ></path>
      </svg>

      {/* Sacred Geometry Mandala over the curve */}
      <motion.div
        initial={{ rotate: 0, opacity: 0 }}
        whileInView={{ rotate: 360, opacity: 0.15 }}
        viewport={{ once: true }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 pointer-events-none"
      >
        <img 
          src="/images/features/home/hero/mandala-motif.webp" 
          alt="" 
          className={`w-full h-full object-contain ${isLightToDark ? 'invert' : ''}`}
        />
      </motion.div>
    </div>
  );
};
