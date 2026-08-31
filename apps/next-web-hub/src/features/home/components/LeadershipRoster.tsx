"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Award, Users, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { LEADERSHIP_MEMBERS, LeadershipMember } from '@/shared/constants/leadershipData';

interface LeadershipRosterProps {
  showAll?: boolean;
  showHeader?: boolean;
  compact?: boolean;
}

export const LeadershipRoster: React.FC<LeadershipRosterProps> = ({
  showAll = true,
  showHeader = true,
  compact = false,
}) => {
  const { i18n } = useTranslation();
  const lang = (['en', 'te', 'hi'].includes(i18n.language) ? i18n.language : 'en') as 'en' | 'te' | 'hi';
  const [filter, setFilter] = useState<'all' | 'national' | 'state' | 'youth'>('all');

  const filteredMembers = LEADERSHIP_MEMBERS.filter(member => {
    if (filter === 'all') return true;
    return member.wing === filter;
  });

  const displayMembers = showAll ? filteredMembers : filteredMembers.slice(0, 4);

  return (
    <section className={`relative ${compact ? 'py-12' : 'py-24'} bg-stone-50 overflow-hidden`}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-vermilion/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-turmeric/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {showHeader && (
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vermilion/10 text-vermilion text-xs font-black uppercase tracking-widest border border-vermilion/20">
              <ShieldCheck size={14} />
              <span>
                {lang === 'te' ? 'సంస్థ నాయకత్వం' : lang === 'hi' ? 'संगठन नेतृत्व' : 'Organizational Governance'}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-stone-900 font-display tracking-tight">
              {lang === 'te' 
                ? 'నాయకత్వం & సలహా మండలి' 
                : lang === 'hi' 
                  ? 'नेतृत्व एवं सलाहकार परिषद' 
                  : 'Leadership & Advisory Council'}
            </h2>
            
            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
              {lang === 'te'
                ? 'విశ్వకర్మ నాలెడ్జ్ సెంటర్ అభివృద్ధికి, సంప్రదాయ కళాకారుల హక్కులు మరియు సాధికారతకు నిరంతరం శ్రమిస్తున్న జాతీయ, రాష్ట్ర మరియు యువజన నాయకత్వం.'
                : lang === 'hi'
                  ? 'विश्वकर्मा नॉलेज सेंटर के विकास, पारंपरिक शिल्पकारों के अधिकारों और सशक्तिकरण के लिए समर्पित राष्ट्रीय, राज्य और युवा विंग नेतृत्व।'
                  : 'The esteemed national leadership, state executives, and youth wing convenors driving the digital sovereignty, recognition, and welfare of traditional artisans.'}
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {[
                { id: 'all', label_en: 'All Leaders', label_te: 'అందరు నాయకులు', label_hi: 'सभी सदस्य' },
                { id: 'national', label_en: 'National Council', label_te: 'జాతీయ కార్యవర్గం', label_hi: 'राष्ट्रीय परिषद' },
                { id: 'state', label_en: 'State Leadership', label_te: 'రాష్ట్ర నాయకత్వం', label_hi: 'राज्य नेतृत्व' },
                { id: 'youth', label_en: 'Youth Wing', label_te: 'యువజన విభాగం', label_hi: 'युवा विंग' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    filter === tab.id
                      ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20 scale-105'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {lang === 'te' ? tab.label_te : lang === 'hi' ? tab.label_hi : tab.label_en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-vermilion/10 hover:-translate-y-1 transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Serial Badge & Wing Tag */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white font-black text-sm flex items-center justify-center shadow-md">
                    #{member.serial}
                  </div>
                  
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${member.badgeColor}`}>
                    {member.wingCategory[lang]}
                  </span>
                </div>

                {/* Member Name */}
                <h3 className="text-lg md:text-xl font-black text-stone-900 group-hover:text-vermilion transition-colors leading-snug mb-2 font-display">
                  {member.name[lang]}
                </h3>

                {/* Subtitle in English if viewing in regional language */}
                {lang !== 'en' && (
                  <p className="text-xs text-stone-400 font-medium mb-3">
                    {member.name.en}
                  </p>
                )}

                {/* Designation / Role */}
                <div className="pt-2 pb-4 border-t border-stone-100">
                  <div className="flex items-center gap-2 text-vermilion font-black text-sm uppercase tracking-wide">
                    <Award size={16} className="shrink-0" />
                    <span>{member.role[lang]}</span>
                  </div>
                  {lang !== 'en' && (
                    <p className="text-[11px] text-stone-500 font-semibold pl-6 mt-0.5">
                      {member.role.en}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer Badge */}
              <div className="pt-4 border-t border-stone-50 flex items-center justify-between text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                <span>VKC Council</span>
                <span className="flex items-center gap-1 text-emerald-600 font-black">
                  <Sparkles size={12} /> Verified Office-Bearer
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Link if in compact mode */}
        {!showAll && (
          <div className="text-center mt-12">
            <Link
              href="/leadership"
              className="inline-flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-vermilion transition-all shadow-xl shadow-stone-900/10 hover:gap-5"
            >
              <span>{lang === 'te' ? 'పూర్తి కార్యవర్గం వివరాలు చూడండి' : lang === 'hi' ? 'पूर्ण कार्यकारिणी देखें' : 'View Full Leadership Council'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
