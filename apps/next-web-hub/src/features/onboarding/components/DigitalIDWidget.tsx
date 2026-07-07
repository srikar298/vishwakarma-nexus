"use client";

import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { ShieldCheck, ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import { MembershipCard } from './MembershipCard';
import { JoinModal } from './JoinModal';

export const DigitalIDWidget = () => {
  const { i18n } = useTranslation();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const lang = i18n.language;

  // Static preview mock data for the card
  const previewData = {
    name: lang === 'te' ? "రామచంద్ర చారి" : lang === 'hi' ? "रामचंद्र चारी" : "Ramachandra Chary",
    uid: "VKC-2026-PREVIEW",
    category: lang === 'te' ? "మయ - కట్టె & శిల్పం" : lang === 'hi' ? "मय - काष्ठ और शिल्प" : "Maya - Wood & Sculpture",
    joinDate: "2026",
  };

  return (
    <section className="py-20 bg-gradient-to-b from-cream to-white border-y border-stone-100 relative overflow-hidden group">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Column: Lineage Hook & Value Prop */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 bg-vermilion/5 px-4 py-1.5 rounded-full border border-vermilion/10">
              <Sparkles size={14} className="text-vermilion animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-vermilion">
                {lang === 'te' ? 'డిజిటల్ ఐడెంటిటీ' : lang === 'hi' ? 'डिजिटल पहचान' : 'Digital Identity Hook'}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-stone-900 leading-tight font-display">
              {lang === 'te' ? 'మీ సాంస్కృతిక వారసత్వాన్ని క్లెయిమ్ చేయండి' : 
               lang === 'hi' ? 'अपनी सांस्कृतिक विरासत का दावा करें' : 
               'Claim Your Digital Vishwakarma Identity'}
            </h2>

            <p className="text-stone-600 text-base md:text-lg leading-relaxed font-medium">
              {lang === 'te' ? 'గణనార్హమైన మన విశ్వకర్మ కమ్యూనిటీలో ఒకరిగా మీ గుర్తింపును ధృవీకరించుకోండి. ఉచిత డిజిటల్ సభ్యత్వ కార్డును సృష్టించుకుని, సంఘ ప్రయోజనాలను అందుకోండి.' : 
               lang === 'hi' ? 'हमारे विश्वकर्मा समुदाय में अपनी पहचान सत्यापित करें। एक निःशुल्क डिजिटल सदस्यता कार्ड बनाएं और विशेष सामुदायिक सुविधाओं का लाभ उठाएं।' : 
               'Verify your heritage lineage under the five ancestral Rishis. Instantly generate your premium glassmorphic Digital Membership Card to access secure verification channels.'}
            </p>

            {/* Benefit Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { label: lang === 'te' ? 'ఉచిత లైఫ్ టైమ్ ఐడి కార్డ్' : lang === 'hi' ? 'निशुल्क लाइफटाइम आईडी' : 'Free Lifetime Digital ID' },
                { label: lang === 'te' ? 'గోత్ర & శాఖ ధృవీకరణ' : lang === 'hi' ? 'गोत्र और शाखा सत्यापन' : 'Gotra & Clan Verification' },
                { label: lang === 'te' ? 'మ్యాట్రిమోనీ పోర్టల్ యాక్సెస్' : lang === 'hi' ? 'मैट्रिमोनी पोर्टल एक्सेस' : 'Secure Matrimony Access' },
                { label: lang === 'te' ? 'అధికారిక సభ్యత్వ గుర్తింపు' : lang === 'hi' ? 'आधिकारिक सदस्यता पहचान' : 'Official Community Badge' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck size={12} className="text-emerald-600" />
                  </div>
                  <span className="text-stone-700 text-sm font-semibold">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Primary Action Button */}
            <div className="pt-4">
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-850 text-white font-black text-xs uppercase tracking-[0.2em] px-8 h-14 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <UserPlus size={16} />
                {lang === 'te' ? 'ఇప్పుడే నమోదు చేసుకోండి' : lang === 'hi' ? 'अभी पंजीकरण करें' : 'Generate Your Card'}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Premium Card Preview with Interactive Glow */}
          <div className="w-full lg:w-1/2 flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-gradient-to-br from-vermilion/5 to-saffron-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            
            <div className="relative w-full max-w-[450px]">
              <MembershipCard memberData={previewData} />
              
              {/* Hint Overlay badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-stone-900/90 text-white text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 shadow-lg pointer-events-none">
                {lang === 'te' ? 'కార్డును తిప్పడానికి క్లిక్ చేయండి 🔄' : lang === 'hi' ? 'कार्ड पलटने के लिए क्लिक करें 🔄' : 'Click Card to Flip 🔄'}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Registration Modal */}
      <JoinModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </section>
  );
};
