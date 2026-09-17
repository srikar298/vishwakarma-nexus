"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Search, 
  Heart, 
  Footprints, 
  Sparkles 
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenJoinModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenJoinModal }) => {
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const lang = (['en', 'te', 'hi'].includes(i18n.language) ? i18n.language : 'en') as 'en' | 'te' | 'hi';

  const isHomeActive = pathname === '/';
  const isDirectoryActive = pathname === '/directory';
  const isMatrimonyActive = pathname === '/network';
  const isYatraActive = pathname === '/events/ekta-yatra' || pathname === '/founder' || pathname === '/yatra';

  return (
    <nav 
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-stone-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] lg:hidden transition-transform duration-300"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)' }}
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {/* 1. Home */}
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 touch-manipulation ${
            isHomeActive ? 'text-vermilion font-black' : 'text-stone-500 hover:text-stone-900 font-semibold'
          }`}
        >
          <Home size={20} className={isHomeActive ? 'stroke-[2.5]' : 'stroke-2'} />
          <span className="text-[10px] tracking-tight mt-1">
            {lang === 'te' ? 'హోమ్' : lang === 'hi' ? 'होम' : 'Home'}
          </span>
        </Link>

        {/* 2. Artisan Directory */}
        <Link 
          href="/directory" 
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 touch-manipulation ${
            isDirectoryActive ? 'text-vermilion font-black' : 'text-stone-500 hover:text-stone-900 font-semibold'
          }`}
        >
          <Search size={20} className={isDirectoryActive ? 'stroke-[2.5]' : 'stroke-2'} />
          <span className="text-[10px] tracking-tight mt-1">
            {lang === 'te' ? 'డైరెక్టరీ' : lang === 'hi' ? 'शिल्पकार' : 'Directory'}
          </span>
        </Link>

        {/* 3. Parinaya Matrimony (Highlight) */}
        <Link 
          href="/network?tab=matrimony" 
          className={`flex flex-col items-center justify-center py-1 rounded-xl relative transition-all active:scale-95 touch-manipulation ${
            isMatrimonyActive ? 'text-rose-600 font-black' : 'text-stone-500 hover:text-rose-600 font-semibold'
          }`}
        >
          <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <Heart size={20} className={isMatrimonyActive ? 'fill-rose-500 text-rose-500 stroke-[2.5]' : 'stroke-2 text-rose-500'} />
          <span className="text-[10px] tracking-tight mt-1 text-rose-600 font-bold">
            {lang === 'te' ? 'పరిణయ' : lang === 'hi' ? 'परिणय' : 'Matrimony'}
          </span>
        </Link>

        {/* 4. Ektha Yatra (Replacing Vault) */}
        <Link 
          href="/events/ekta-yatra" 
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 touch-manipulation ${
            isYatraActive ? 'text-saffron-600 font-black' : 'text-stone-500 hover:text-stone-900 font-semibold'
          }`}
        >
          <Footprints size={20} className={isYatraActive ? 'text-saffron-600 stroke-[2.5]' : 'stroke-2 text-saffron-500'} />
          <span className="text-[10px] tracking-tight mt-1 font-bold text-saffron-700">
            {lang === 'te' ? 'ఐక్యతా యాత్ర' : lang === 'hi' ? 'एकता यात्रा' : 'Ektha Yatra'}
          </span>
        </Link>

        {/* 5. Join VKC / Sign Up Action Button */}
        <button
          type="button"
          onClick={onOpenJoinModal}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-vermilion active:scale-95 transition-all touch-manipulation cursor-pointer group"
          aria-label="Join VKC"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-vermilion to-saffron-500 text-white flex items-center justify-center shadow-md shadow-vermilion/30 group-hover:scale-105 transition-transform">
            <Sparkles size={16} />
          </div>
          <span className="text-[9px] font-black tracking-tight mt-0.5 text-stone-900">
            {lang === 'te' ? 'చేరండి' : lang === 'hi' ? 'जुड़ें' : 'Join ID'}
          </span>
        </button>
      </div>
    </nav>
  );
};
