"use client";

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Flag, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Phone, 
  Share2, 
  Sparkles, 
  ScrollText, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { JoinModal } from '@/features/onboarding/components/JoinModal';

export const ChaloDelhiYatraPage = () => {
  const { t, i18n } = useTranslation();
  const lang = (['en', 'te', 'hi'].includes(i18n.language) ? i18n.language : 'en') as 'en' | 'te' | 'hi';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statesConfig = [
    { key: 'telangana', flag: '🏛️', color: 'border-amber-500 bg-amber-50/40 text-amber-900' },
    { key: 'maharashtra', flag: '🚩', color: 'border-orange-500 bg-orange-50/40 text-orange-900' },
    { key: 'madhyaPradesh', flag: '🌲', color: 'border-emerald-500 bg-emerald-50/40 text-emerald-900' },
    { key: 'uttarPradesh', flag: '🛕', color: 'border-blue-500 bg-blue-50/40 text-blue-900' },
    { key: 'rajasthan', flag: '🏰', color: 'border-rose-500 bg-rose-50/40 text-rose-900' },
    { key: 'haryanaDelhi', flag: '🇮🇳', color: 'border-vermilion bg-vermilion/5 text-stone-900' }
  ];

  const demandsCount = [0, 1, 2, 3, 4, 5];

  const shareText = lang === 'te' 
    ? `🚩 జై విశ్వకర్మ! పుష్పగిరి చలో ఢిల్లీ చారిత్రక పాదయాత్ర (1,700 కి.మీ, హైదరాబాద్ నుండి ఢిల్లీ) ప్రారంభం కానుంది.\n\nమన హక్కులు & అస్తిత్వం కోసం మీరూ మొబైల్ నంబర్‌తో నమోదు చేసుకోండి — డిజిటల్ పాస్ పొందండి:\nhttps://vishwakarmaknowledgecentre.org/events/chalo-delhi-yatra`
    : lang === 'hi'
      ? `🚩 जय विश्वकर्मा! पुष्पगिरि चलो दिल्ली ऐतिहासिक पदयात्रा (1,700 किमी, हैदराबाद से दिल्ली) शुरू होने जा रही है।\n\nहमारे हक और वजूद के लिए आप भी मोबाइल नंबर से रजिस्टर करें — डिजिटल पास प्राप्त करें:\nhttps://vishwakarmaknowledgecentre.org/events/chalo-delhi-yatra`
      : `🚩 Jai Vishwakarma! Pushpagiri Chalo Delhi Historic Ekta Yatra (1,700 KM, Hyderabad to Delhi) is commencing.\n\nRegister your mobile number to get an official Digital Yatra Pass:\nhttps://vishwakarmaknowledgecentre.org/events/chalo-delhi-yatra`;

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-vermilion/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest border border-amber-500/30">
              <Flag size={14} className="text-amber-400" />
              <span>{t('chaloDelhiYatra.badge', 'Historic National Ekta Yatra')}</span>
            </div>
            <span className="text-[10px] font-bold bg-white/10 px-3 py-1.5 rounded-full text-stone-300">
              {t('chaloDelhiYatra.subBadge', 'NH-44 Corridor • 1,700 KM')}
            </span>
          </div>

          {/* Main Title */}
          <div className="max-w-4xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-display tracking-tight leading-[1.15]">
              {t('chaloDelhiYatra.title', 'Hyderabad to Delhi 1,700 KM Foot March: Vishwakarma Community Rallies for Rights & Existence')}
            </h1>

            <p className="text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
              {t('chaloDelhiYatra.subtitle', 'Organized under the auspices of Vishwakarma Knowledge Centre (VKC), Hyderabad. A monumental 74-day foot march along NH-44 traversing 6 states to submit a 15-point charter of demands to the Central Government.')}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 my-10 max-w-4xl">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">{t('chaloDelhiYatra.stats.distance', '1,700 KM')}</p>
              <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-wider mt-1">{t('chaloDelhiYatra.stats.distanceLabel', 'Total Route Distance')}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-black text-white">{t('chaloDelhiYatra.stats.duration', '74 Days')}</p>
              <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-wider mt-1">{t('chaloDelhiYatra.stats.durationLabel', 'Sep 17 — Nov 29, 2026')}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">{t('chaloDelhiYatra.stats.states', '6 States')}</p>
              <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-wider mt-1">{t('chaloDelhiYatra.stats.statesLabel', 'Traversing NH-44')}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-black text-rose-400">{t('chaloDelhiYatra.stats.demands', '15 Points')}</p>
              <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-wider mt-1">{t('chaloDelhiYatra.stats.demandsLabel', 'National Charter of Demands')}</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-vermilion to-amber-500 hover:from-vermilion-600 hover:to-amber-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-vermilion/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Phone size={16} />
              <span>{t('chaloDelhiYatra.cta.register', 'Register with Mobile Number')}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Share2 size={16} />
              <span>{t('chaloDelhiYatra.cta.shareWhatsApp', 'Share on WhatsApp')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. MINISTERIAL DELEGATION BRIEFING */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-50 border border-stone-200/80 rounded-3xl p-6 md:p-10">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck size={12} />
                  <span>{t('chaloDelhiYatra.delegation.tag', 'Central Government Engagement')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                  {t('chaloDelhiYatra.delegation.title', 'VKC Delegation Meets Union MoS Shri Ajay Tamta')}
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {t('chaloDelhiYatra.delegation.desc', 'The VKC delegation led by Vishwanadhula Pushpagiri, alongside Ramyachari, Naresh Chary, and Ravi Chary, formally briefed Union Minister of State for Road Transport and Highways, Shri Ajay Tamta, on the logistics of the 1,700 KM foot march and submitted the charter of socio-economic demands.')}
                </p>
              </div>

              <div className="bg-stone-900 text-white p-6 rounded-2xl space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-amber-400">
                  {t('chaloDelhiYatra.delegation.leadershipTag', 'Yatra Leadership')}
                </p>
                <ul className="space-y-2 text-xs font-medium text-stone-300">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-400 shrink-0" />
                    <span>{t('chaloDelhiYatra.delegation.leader1', 'Vishwanadhula Pushpagiri (Leadership)')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-400 shrink-0" />
                    <span>{t('chaloDelhiYatra.delegation.leader2', 'Mukesh Kumar Jangid (National Coordinator)')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-400 shrink-0" />
                    <span>{t('chaloDelhiYatra.delegation.leader3', 'Ramyachari & Naresh Chary (State Delegations)')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-400 shrink-0" />
                    <span>{t('chaloDelhiYatra.delegation.leader4', 'Ravi Chary & Regional Yatris (Logistics Coordination)')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE 6-STATE ROUTE ALONG NH-44 */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              {t('chaloDelhiYatra.route.tag', 'Corridor Traversal Map')}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 font-display">
              {t('chaloDelhiYatra.route.title', 'Route Roadmap Across 6 States on NH-44')}
            </h2>
            <p className="text-stone-600 text-sm">
              {t('chaloDelhiYatra.route.desc', 'Traversing 23+ industrial, agricultural, and craft districts from Hyderabad to Parliament in New Delhi.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statesConfig.map((item, index) => {
              const stateName = (t as any)(`chaloDelhiYatra.route.states.${item.key}.name`);
              const stateBadge = (t as any)(`chaloDelhiYatra.route.states.${item.key}.badge`);
              const districts = (t as any)(`chaloDelhiYatra.route.states.${item.key}.districts`, { returnObjects: true }) as string[];

              return (
                <div 
                  key={index}
                  className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.flag}</span>
                        <h3 className="text-lg font-black text-stone-900 font-display">{stateName}</h3>
                      </div>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {stateBadge}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                        {t('chaloDelhiYatra.route.majorStations', 'Major Stations')}:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(districts) && districts.map((d, di) => (
                          <span key={di} className="text-xs bg-stone-50 border border-stone-200/60 px-2.5 py-1 rounded-lg font-medium text-stone-700">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-500">
                    <span>{t('chaloDelhiYatra.route.stage', 'Stage')} {index + 1} {t('chaloDelhiYatra.route.of', 'of')} 6</span>
                    <span className="text-amber-600 font-black">{t('chaloDelhiYatra.route.nh44', 'NH-44 Highway Route')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. 15-POINT CHARTER OF DEMANDS */}
      <section className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vermilion/10 text-vermilion text-[10px] font-black uppercase tracking-wider">
              <ScrollText size={12} />
              <span>{t('chaloDelhiYatra.demands.tag', 'National Memorandum')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 font-display">
              {t('chaloDelhiYatra.demands.title', '15-Point Charter of National Demands')}
            </h2>
            <p className="text-stone-600 text-sm">
              {t('chaloDelhiYatra.demands.desc', 'Key constitutional, social, and economic rights presented for the upliftment of traditional artisan clans.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demandsCount.map((num) => {
              const itemTitle = (t as any)(`chaloDelhiYatra.demands.items.${num}.title`);
              const itemDesc = (t as any)(`chaloDelhiYatra.demands.items.${num}.desc`);

              return (
                <div key={num} className="bg-stone-50 border border-stone-200/80 rounded-3xl p-6 space-y-3">
                  <div className="w-8 h-8 rounded-full bg-vermilion text-white font-black text-xs flex items-center justify-center">
                    #{num + 1}
                  </div>
                  <h3 className="font-black text-stone-900 text-base font-display">
                    {itemTitle}
                  </h3>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    {itemDesc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. 10-SECOND FAST PHONE REGISTRATION EMBED */}
      <section className="py-20 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-vermilion to-amber-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-vermilion/30">
            <Sparkles size={28} />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display">
              {t('chaloDelhiYatra.joinSection.title', 'Join the Pushpagiri Chalo Delhi Yatra Network')}
            </h2>
            <p className="text-stone-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {t('chaloDelhiYatra.joinSection.desc', 'Enter your mobile number to generate your instant Digital Yatra Member Pass and receive real-time location updates.')}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-vermilion hover:bg-vermilion-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-vermilion/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Phone size={16} />
              <span>{t('chaloDelhiYatra.cta.freeRegister', 'Register Free in 10 Seconds')}</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Share2 size={16} />
              <span>{t('chaloDelhiYatra.cta.shareMandal', 'Share with Local Mandal')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Reusable Onboarding Modal prefilled with Yatra */}
      <JoinModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultTrack="yatra" 
      />
    </div>
  );
};
