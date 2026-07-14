"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hammer, QrCode, ShieldCheck, Globe, Calendar } from 'lucide-react';

interface MembershipCardProps {
  memberData?: {
    name: string;
    uid: string;
    category: string;
    photo?: string;
    joinDate: string;
  };
}

export const MembershipCard: React.FC<MembershipCardProps> = ({ memberData }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Fallback data
  const data = memberData || {
    name: "Sri Bhaskar Chary",
    uid: "VKC-2026-0428",
    category: "Manus - Iron & Steel",
    joinDate: "March 2026",
  };

  return (
    <div 
      className="relative w-full max-w-[450px] aspect-[1.58/1] cursor-pointer group perspective-1000 select-none touch-none"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-700 preserve-3d will-change-transform"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        {/* FRONT FACE */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-black p-1 shadow-2xl relative">
            {/* Holographic Shimmer Overlay */}
            <motion.div 
              animate={{ 
                backgroundPosition: ['0% 0%', '200% 200%'],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay bg-[length:200%_200%] bg-gradient-to-tr from-transparent via-white/20 to-transparent"
            />

            <div className="absolute top-0 right-0 w-40 h-40 bg-vermilion/10 blur-[60px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-saffron-600/10 blur-[60px] rounded-full" />
            
            <div className="w-full h-full bg-stone-900/40 backdrop-blur-sm rounded-[1.8rem] p-6 flex flex-col justify-between border border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-vermilion p-2 rounded-lg shadow-lg">
                    <Hammer className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-[10px] font-black text-vermilion uppercase tracking-[0.3em] leading-none mb-1">Vishwakarma</h2>
                    <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest leading-none">Knowledge Centre</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-stone-800/50 px-3 py-1.5 rounded-full border border-white/5">
                  <ShieldCheck className="text-saffron-500 w-3 h-3" />
                  <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest">Premium Member</span>
                </div>
              </div>

              <div className="flex gap-6 items-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-700 border-2 border-vermilion/20 flex items-center justify-center relative overflow-hidden group-hover:border-vermilion/50 transition-colors">
                  <div className="text-stone-600 font-black text-2xl uppercase opacity-20 select-none">VKC</div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-white font-display leading-tight mb-1 truncate max-w-[200px]">{data.name}</h3>
                  <p className="text-saffron-500 text-[10px] font-black uppercase tracking-widest mb-4 truncate">{data.category}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[7px] text-stone-500 uppercase font-black tracking-widest mb-1">Member ID</p>
                      <p className="text-[10px] text-white font-mono font-bold tracking-wider">{data.uid}</p>
                    </div>
                    <div>
                      <p className="text-[7px] text-stone-500 uppercase font-black tracking-widest mb-1">Status</p>
                      <p className="text-[10px] text-emerald-400 font-black tracking-widest flex items-center gap-1 uppercase">Active<span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <Calendar size={10} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">{data.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-500 font-bold">
                    <Globe size={10} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">vkc-portal.org</span>
                  </div>
                </div>
                <div className="w-10 h-7 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md shadow-inner border border-white/10 opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full rounded-[2rem] overflow-hidden bg-stone-900 p-8 shadow-2xl flex flex-col justify-between border-4 border-stone-800">
            <div className="text-center space-y-4">
               <h3 className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em]">Digital Identity Verification</h3>
               <div className="bg-white p-4 rounded-3xl inline-block shadow-inner">
                  <QrCode size={120} className="text-stone-900" />
               </div>
               <p className="text-stone-500 text-[8px] font-bold max-w-[200px] mx-auto leading-relaxed">
                 Scan this code to verify artisan credentials on the official VKC Registry at <span className="text-white">verify.vkc-community.org</span>
               </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-left border-t border-stone-800 pt-6">
               <div>
                  <p className="text-[7px] text-stone-600 uppercase font-black tracking-widest mb-2">Terms of Usage</p>
                  <ul className="text-[6px] text-stone-500 space-y-1 list-disc pl-3">
                     <li>Valid only for registered AP/TS Artisans</li>
                     <li>Non-Transferable legal Digital ID</li>
                     <li>Required for Institutional grants</li>
                  </ul>
               </div>
               <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-8 border-b border-stone-700 italic text-stone-600 text-[10px] flex items-end justify-center pb-1">Signature</div>
                  <p className="text-[6px] text-stone-700 uppercase font-black tracking-widest mt-1">Authorized Seal</p>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">Tap to Flip</div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
