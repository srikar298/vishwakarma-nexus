"use client";

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  Calendar, 
  ArrowRight
} from 'lucide-react';
import { JoinModal } from '@/features/onboarding/components/JoinModal';

export const EventsPage = () => {
  const { t } = useTranslation();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <div className="bg-stone-50 min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vermilion/10 text-vermilion text-xs font-black uppercase tracking-widest border border-vermilion/20">
            <Calendar size={14} />
            <span>{t('eventsPage.badge', 'Community Summits & Events')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 font-display tracking-tight">
            {t('eventsPage.title', 'VKC Events & National Movements')}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {t('eventsPage.desc', 'Discover national movements, artisan summits, decennial meets, and community gatherings empowering traditional artisans.')}
          </p>
        </div>

        {/* FLAGSHIP HERO EVENT: PUSHPAGIRI CHALO DELHI YATRA */}
        <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white rounded-[2.5rem] p-6 sm:p-10 md:p-14 border border-amber-500/30 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-vermilion/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-gradient-to-r from-vermilion to-amber-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                  {t('eventsPage.flagshipTag', 'Flagship National Movement')}
                </span>
                <span className="text-[10px] text-stone-400 font-bold bg-white/10 px-3 py-1 rounded-full">
                  {t('eventsPage.flagshipSub', '1,700 KM • 74 Days • 6 States')}
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-4xl font-black text-white font-display leading-tight">
                  {t('eventsPage.flagshipTitle', 'Pushpagiri Chalo Delhi Ekta Paadha Yathra (1,700 KM)')}
                </h2>
                <p className="text-stone-300 text-sm leading-relaxed max-w-2xl">
                  {t('eventsPage.flagshipDesc', 'A 74-day historic march from Hyderabad to Parliament in New Delhi via NH-44 traversing Telangana, Maharashtra, MP, UP, Rajasthan, and Haryana.')}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/events/ekta-yatra"
                  className="bg-vermilion hover:bg-vermilion-600 text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-vermilion/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{t('eventsPage.exploreRoute', 'Explore Route & 15 Demands')}</span>
                  <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
                >
                  {t('eventsPage.registerMobile', 'Register Mobile for Pass')}
                </button>
              </div>
            </div>

            {/* Quick Milestone Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-amber-400">
                {t('eventsPage.routeOverview', 'Expedition Route')}
              </p>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-bold text-white">{t('eventsPage.routeStart', 'Sep 17: Flag Off from Hyderabad (TS)')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-stone-300">{t('eventsPage.routeTraverse', 'Traversing MH, MP, UP, RJ, HR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-vermilion" />
                  <span className="font-bold text-white">{t('eventsPage.routeEnd', 'Nov 29: Culmination in New Delhi')}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                {t('chaloDelhiYatra.stats.demandsLabel', '15-Point Charter Memorandum')}
              </div>
            </div>
          </div>
        </div>

        {/* OTHER RECENT & UPCOMING SUMMITS */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <h2 className="text-2xl font-black text-stone-900 font-display">
              {t('eventsPage.recentTitle', 'Recent & Upcoming Summits')}
            </h2>
            <span className="text-xs font-black text-stone-400 uppercase tracking-widest">
              {t('eventsPage.archiveTag', 'Archive')}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Decennial Celebrations Card */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-100">
                    {t('eventsPage.anniversaryTag', 'Successfully Concluded')}
                  </span>
                  <span className="text-xs font-bold text-stone-400">{t('eventsPage.anniversaryLocation', 'Hyderabad')}</span>
                </div>
                <h3 className="text-xl font-black text-stone-900 font-display">
                  {t('eventsPage.anniversaryTitle', '🎉 VKC 10th Anniversary Decennial Celebration')}
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {t('eventsPage.anniversaryDesc', 'Honored with the august presence of Hon\'ble Minister Smt. Seethakka garu, ACP Brahmasri K.M. Kiran Kumar Sir, and esteemed community patrons celebrating 10 years of service.')}
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-black text-stone-400">{t('eventsPage.anniversaryVenue', 'Sundarayya Vignana Kendram')}</span>
                <span className="text-xs font-black text-vermilion flex items-center gap-1">{t('eventsPage.anniversaryMilestone', 'Decennial Milestone')}</span>
              </div>
            </div>

            {/* Parinaya Matrimony Ground Meet */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-rose-100">
                    {t('eventsPage.matrimonyTag', '💍 Matrimony Portal')}
                  </span>
                  <span className="text-xs font-bold text-stone-400">{t('eventsPage.matrimonyStatus', 'Active Service')}</span>
                </div>
                <h3 className="text-xl font-black text-stone-900 font-display">
                  {t('eventsPage.matrimonyTitle', 'Parinaya: Community Matrimony & Gotra Registry')}
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {t('eventsPage.matrimonyDesc', '100% ID-verified matchmaking platform exclusively for the Vishwakarma community to preserve sacred lineage values across Gotras.')}
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <Link href="/network?tab=matrimony" className="text-xs font-black text-rose-600 hover:text-rose-700 flex items-center gap-1">
                  <span>{t('eventsPage.exploreMatches', 'Explore Matches')}</span>
                  <ArrowRight size={12} />
                </Link>
                <span className="text-xs font-bold text-stone-400">{t('eventsPage.verifiedProfiles', 'Verified Profiles')}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <JoinModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
        defaultTrack="yatra" 
      />
    </div>
  );
};
