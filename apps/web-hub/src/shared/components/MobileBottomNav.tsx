import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Search, 
  Heart, 
  Footprints, 
  ShieldCheck 
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { pathname, search } = location;
  const { i18n } = useTranslation();
  const lang = (['en', 'te', 'hi'].includes(i18n.language) ? i18n.language : 'en') as 'en' | 'te' | 'hi';

  const isHomeActive = pathname === '/';
  const isDirectoryActive = pathname === '/directory';
  const isMatrimonyActive = pathname === '/network' && search.includes('matrimony');
  const isYatraActive = pathname === '/founder' || pathname === '/yatra' || pathname === '/ektha-yatra';
  const isMembershipActive = pathname === '/membership';

  return (
    <nav 
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-stone-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] lg:hidden"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)' }}
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
        {/* 1. Home */}
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 touch-manipulation ${
            isHomeActive ? 'text-vermilion font-black' : 'text-stone-500 hover:text-stone-900 font-semibold'
          }`}
        >
          <Home size={20} className={isHomeActive ? 'stroke-[2.5]' : 'stroke-2'} />
          <span className="text-[10px] tracking-tight mt-1">
            {lang === 'te' ? 'హోమ్' : lang === 'hi' ? 'होम' : 'Home'}
          </span>
        </Link>

        {/* 2. Directory */}
        <Link 
          to="/directory" 
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 touch-manipulation ${
            isDirectoryActive ? 'text-vermilion font-black' : 'text-stone-500 hover:text-stone-900 font-semibold'
          }`}
        >
          <Search size={20} className={isDirectoryActive ? 'stroke-[2.5]' : 'stroke-2'} />
          <span className="text-[10px] tracking-tight mt-1">
            {lang === 'te' ? 'డైరెక్టరీ' : lang === 'hi' ? 'शिल्पकार' : 'Directory'}
          </span>
        </Link>

        {/* 3. Matrimony */}
        <Link 
          to="/network?tab=matrimony" 
          className={`flex flex-col items-center justify-center py-1 rounded-xl relative transition-all active:scale-90 touch-manipulation ${
            isMatrimonyActive ? 'text-pink-600 font-black' : 'text-stone-500 hover:text-pink-600 font-semibold'
          }`}
        >
          <span className="absolute -top-1 right-2.5 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <Heart size={20} className={isMatrimonyActive ? 'fill-pink-500 text-pink-500 stroke-[2.5]' : 'stroke-2 text-pink-500'} />
          <span className="text-[10px] tracking-tight mt-1 text-pink-600 font-bold">
            {lang === 'te' ? 'పరిణయ' : lang === 'hi' ? 'परिणय' : 'Matrimony'}
          </span>
        </Link>

        {/* 4. Ektha Yatra (Replacing Vault) */}
        <Link 
          to="/founder" 
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 touch-manipulation ${
            isYatraActive ? 'text-saffron-600 font-black' : 'text-stone-500 hover:text-stone-900 font-semibold'
          }`}
        >
          <Footprints size={20} className={isYatraActive ? 'text-saffron-600 stroke-[2.5]' : 'stroke-2 text-saffron-500'} />
          <span className="text-[10px] tracking-tight mt-1 font-bold text-saffron-700">
            {lang === 'te' ? 'ఐక్యతా యాత్ర' : lang === 'hi' ? 'एकता यात्रा' : 'Ektha Yatra'}
          </span>
        </Link>

        {/* 5. Join / Claim ID Pass */}
        <Link
          to="/membership"
          className="flex flex-col items-center justify-center py-1 rounded-xl active:scale-90 transition-all touch-manipulation cursor-pointer group"
          aria-label="Claim ID Pass"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform ${
            isMembershipActive 
              ? 'bg-vermilion text-white ring-2 ring-vermilion/30' 
              : 'bg-stone-900 text-white group-hover:bg-vermilion'
          }`}>
            <ShieldCheck size={16} />
          </div>
          <span className="text-[9px] font-black tracking-tight mt-0.5 text-stone-900">
            {lang === 'te' ? 'పాస్ ఐడీ' : lang === 'hi' ? 'पास आईडी' : 'Claim ID'}
          </span>
        </Link>
      </div>
    </nav>
  );
};
