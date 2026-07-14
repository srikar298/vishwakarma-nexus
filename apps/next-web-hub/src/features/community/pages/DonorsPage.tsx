"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { 
  Heart, 
  Crown, 
  Star, 
  Shield, 
  ArrowRight,
  TrendingUp,
  Percent,
  Search,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { mockDonors, Donor } from '../constants/donorsData';

const GOAL_AMOUNT = 2000000; // ₹20 Lakhs

export const DonorsPage = () => {
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<'generous' | 'recent' | 'honorary'>('honorary');
  const [sliderAmount, setSliderAmount] = useState<number>(5000);
  const [raisedAmount, setRaisedAmount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync tab state from URL parameter if available
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'sponsors') {
      setActiveTab('generous');
    } else if (tabParam === 'recents') {
      setActiveTab('recent');
    } else if (tabParam === 'honorary') {
      setActiveTab('honorary');
    }
  }, [searchParams]);

  // Handler for changing tabs that updates URL
  const handleTabChange = (tab: 'generous' | 'recent' | 'honorary') => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    const tabUrlValue = tab === 'generous' ? 'sponsors' : tab === 'recent' ? 'recents' : 'honorary';
    params.set('tab', tabUrlValue);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  // Calculate actual total raised from donor data
  const totalRaised = mockDonors.reduce((sum, donor) => sum + donor.amount, 0);
  const progressPercent = Math.min(Math.round((totalRaised / GOAL_AMOUNT) * 100), 100);

  // Animated count up to totalRaised on mount
  useEffect(() => {
    let start = 0;
    const end = totalRaised;
    if (end === 0) return;
    
    const duration = 1.5; // seconds
    const totalMiliseconds = duration * 1000;
    const incrementTime = 30; // ms
    const step = (end / totalMiliseconds) * incrementTime;
    
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(timer);
        setRaisedAmount(end);
      } else {
        setRaisedAmount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [totalRaised]);

  // Sort logic for Leaderboard
  const sortedDonors = [...mockDonors]
    .filter(donor => {
      if (activeTab === 'honorary') {
        return donor.tier === 'honorary';
      } else {
        return donor.tier !== 'honorary';
      }
    })
    .sort((a, b) => {
      if (activeTab === 'generous') {
        return b.amount - a.amount; // highest amount first
      } else if (activeTab === 'recent') {
        // Recent logic: parse custom joinDate strings to sort (or use hardcoded index order)
        const months = { 'January': 1, 'March': 3, 'June': 6, 'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11 };
        const getScore = (d: Donor) => {
          const parts = d.joinDate.split(' ');
          const monthNum = months[parts[0] as keyof typeof months] || 1;
          const yearNum = parseInt(parts[1]) || 2026;
          return yearNum * 12 + monthNum;
        };
        return getScore(b) - getScore(a); // latest date first
      } else {
        // Honorary supporters keep default order (custom ranking)
        return 0;
      }
    });

  // Filter list based on search queries
  const filteredDonors = sortedDonors.filter(donor => 
    donor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    donor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donor.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Split calculations (40% Heritage, 35% Directory, 25% Advocacy)
  const allocation = {
    heritage: sliderAmount * 0.40,
    directory: sliderAmount * 0.35,
    advocacy: sliderAmount * 0.25
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'patron':
        return <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-gold-100 text-gold-700 px-2.5 py-0.5 rounded-full border border-gold-200"><Crown size={10} /> Patron</span>;
      case 'gold':
        return <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-stone-900 text-white px-2.5 py-0.5 rounded-full"><Star size={10} fill="currentColor" /> Gold</span>;
      case 'honorary':
        return <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200"><Heart size={10} fill="currentColor" /> Honorary</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full border border-stone-200"><Shield size={10} fill="currentColor" /> Silver</span>;
    }
  };

  return (
    <>
      
      {/* 1. HERO SECTION & LIVE TICKER */}
      <section className="bg-stone-950 pt-36 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-15 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gold-500/10 blur-[180px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center space-y-12">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-5 py-1.5 rounded-full backdrop-blur-md">
              <Heart className="text-gold-500" size={14} fill="currentColor" />
              <span className="text-[9px] font-black text-white uppercase tracking-[0.25em]">VKC Collective Action</span>
            </div>
            
            <h1 className={`text-4xl md:text-6xl font-black text-white leading-tight font-display max-w-4xl mx-auto ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
              {t('donors.title' as never, 'The Pillar of Our Legacy')}
            </h1>
          </div>

          {/* Real-time money raised stats card */}
          <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-12 max-w-4xl mx-auto backdrop-blur-md shadow-2xl space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-center border-b border-white/5 pb-8">
              <div className="text-center md:text-left space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total Money Sourced</span>
                <div className="text-4xl md:text-5xl font-black text-turmeric tracking-tight font-display">
                  {formatCurrency(raisedAmount)}
                </div>
              </div>
              <div className="text-center md:text-right space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Target Milestone Goal</span>
                <div className="text-3xl md:text-4xl font-black text-white tracking-tight font-display">
                  {formatCurrency(GOAL_AMOUNT)}
                </div>
              </div>
            </div>

            {/* Goal Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-stone-400 uppercase tracking-widest">
                <span>Milestone Campaign</span>
                <span className="text-turmeric">{progressPercent}% Completed</span>
              </div>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-gold-500 via-saffron-500 to-vermilion rounded-full shadow-lg shadow-saffron-500/20"
                />
              </div>
              <p className="text-[10px] text-stone-500 font-medium italic text-center md:text-left">
                *Next milestone funds the digitalization of 100+ ancient Shastras and onboarding of 1,000 verified rural artisans.
              </p>
            </div>
          </div>

        </div>
      </section>
      {/* 2. GAMIFIED LEADERBOARD SECTION */}
      <section className="py-24 bg-stone-50 border-y border-stone-200/50">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 font-display">VKC Sponsor Leaderboard</h2>
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mt-1">Recognizing our esteemed supporters</p>
            </div>

            {/* Search Leaderboard */}
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-vermilion transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search donors..."
                className="w-full h-11 pl-11 pr-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-vermilion transition-all text-xs font-medium text-stone-700 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Toggle Tabs & List */}
          <div className="bg-white border border-stone-200/60 rounded-[2.5rem] shadow-xl overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-stone-100 bg-stone-50/50 p-2 gap-2">
              <button 
                onClick={() => handleTabChange('honorary')}
                className={`flex-1 py-4 text-center rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all
                  ${activeTab === 'honorary' 
                    ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-900/5' 
                    : 'text-stone-400 hover:text-stone-600'
                  }
                `}
              >
                🤝 Honorary
              </button>
              <button 
                onClick={() => handleTabChange('generous')}
                className={`flex-1 py-4 text-center rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all
                  ${activeTab === 'generous' 
                    ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-900/5' 
                    : 'text-stone-400 hover:text-stone-600'
                  }
                `}
              >
                🏆 Donors
              </button>
              <button 
                onClick={() => handleTabChange('recent')}
                className={`flex-1 py-4 text-center rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all
                  ${activeTab === 'recent' 
                    ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-900/5' 
                    : 'text-stone-400 hover:text-stone-600'
                  }
                `}
              >
                ⚡ Recents
              </button>
            </div>

            {/* List Body */}
            <div className="sm:divide-y sm:divide-stone-100 bg-stone-50/40 sm:bg-transparent p-2 sm:p-0">
              <AnimatePresence mode="popLayout">
                {filteredDonors.length === 0 ? (
                  <div className="p-16 text-center text-stone-400 space-y-2">
                    <p className="text-xs font-black uppercase tracking-widest">No Donors Found</p>
                    <p className="text-[10px]">Try typing a different name or location query.</p>
                  </div>
                ) : (
                  filteredDonors.map((donor, index) => {
                    const isGenerousTab = activeTab === 'generous';
                    const isTopThree = isGenerousTab && index < 3;

                    return (
                      <Link href={`/donors/${donor.id}`} key={donor.id} className="block">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={`
                            p-4 flex flex-col gap-3 rounded-2xl border shadow-sm relative my-3 mx-1 transition-all group cursor-pointer
                            ${isGenerousTab && index === 0 ? 'bg-amber-50/25 border-amber-300 shadow-md ring-1 ring-amber-100/30' : ''}
                            ${isGenerousTab && index === 1 ? 'bg-stone-50/45 border-stone-300 shadow-sm' : ''}
                            ${isGenerousTab && index === 2 ? 'bg-orange-50/15 border-orange-200' : ''}
                            ${!isGenerousTab || index > 2 ? 'bg-white border-stone-200/60' : ''}
                            sm:p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:bg-transparent sm:border-0 sm:border-b sm:border-stone-100 sm:rounded-none sm:shadow-none sm:my-0 sm:mx-0 sm:ring-0
                            hover:bg-stone-50/60
                          `}
                        >
                          <div className="flex sm:items-center gap-3 sm:gap-6 flex-1 min-w-0 flex-col sm:flex-row">
                            
                            {/* Top line on Mobile: Avatar & Rank & Mobile Chevron */}
                            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                              <div className="flex items-center gap-3">
                                {/* Rank indicator (only on Most Generous) */}
                                {activeTab === 'generous' && (
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black font-display text-center flex-shrink-0
                                    ${index === 0 ? 'bg-amber-100 text-amber-800' : index === 1 ? 'bg-stone-200 text-stone-850' : index === 2 ? 'bg-stone-100 text-stone-600' : 'bg-stone-50 text-stone-400'}
                                  `}>
                                    #{index + 1}
                                  </span>
                                )}

                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                  <img 
                                    src={donor.avatar} 
                                    alt={donor.name} 
                                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border border-stone-200 shadow-sm"
                                  />
                                </div>
                              </div>

                              {/* Chevron on Mobile (top-right of card) */}
                              <ChevronRight size={16} className="text-stone-355 group-hover:text-vermilion group-hover:translate-x-1 transition-all sm:hidden" />
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1 w-full">
                              <h3 className="font-black text-stone-900 text-sm sm:text-base leading-snug group-hover:text-vermilion transition-colors break-words">
                                {donor.name}
                              </h3>
                              
                              {/* Mobile Designation and Location */}
                              <div className="sm:hidden flex flex-col gap-1 mt-1 text-[11px] leading-relaxed">
                                <span className="text-stone-500 font-medium break-words">{donor.role}</span>
                                <div className="flex items-center gap-1 text-[10px] text-stone-400 font-bold mt-0.5">
                                  <MapPin size={10} className="text-stone-300" />
                                  <span>{donor.location}</span>
                                </div>
                              </div>

                              {/* Desktop Designation and Location */}
                              <div className="hidden sm:flex sm:flex-row sm:items-center gap-y-1 sm:gap-x-4 mt-1 text-[10px] text-stone-400 font-bold leading-normal">
                                <span className="text-stone-500">{donor.role}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-200" />
                                <span className="text-stone-350">{donor.location}</span>
                              </div>

                              {/* Auto-generated Description */}
                              <p className="text-[10.5px] sm:text-xs text-stone-550 mt-2 leading-relaxed font-medium italic">
                                {donor.description}
                              </p>
                            </div>
                          </div>

                          {/* Amount & Nav Action */}
                          <div className="flex items-center justify-end flex-shrink-0 sm:mt-0 mt-1 w-full sm:w-auto">
                            <span className={`text-xs sm:text-sm font-black px-3.5 py-2.5 sm:py-2 rounded-xl border transition-all w-full sm:w-auto text-center sm:text-left shadow-sm
                              ${donor.tier === 'honorary'
                                ? 'text-amber-800 bg-amber-50/70 border-amber-100 group-hover:bg-amber-100 group-hover:border-amber-200'
                                : isTopThree
                                  ? index === 0
                                    ? 'bg-amber-500 text-white border-amber-600 group-hover:bg-amber-600 group-hover:border-amber-700'
                                    : index === 1
                                      ? 'bg-stone-600 text-white border-stone-700 group-hover:bg-stone-700 group-hover:border-stone-800'
                                      : 'bg-orange-500 text-white border-orange-600 group-hover:bg-orange-600 group-hover:border-orange-700'
                                  : 'text-vermilion bg-vermilion/[0.03] border-vermilion/10 group-hover:bg-vermilion/[0.06] group-hover:border-vermilion/20'
                              }
                            `}>
                              {donor.formattedAmount}
                            </span>
                            <ChevronRight size={16} className={`group-hover:text-vermilion group-hover:translate-x-1 transition-all hidden sm:block ml-4
                              ${isTopThree ? 'text-stone-400' : 'text-stone-300'}
                            `} />
                          </div>

                        </motion.div>
                      </Link>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE IMPACT CALCULATOR */}
      <section className="py-20 bg-cream/30">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-vermilion/5 text-vermilion px-4.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              <TrendingUp size={12} /> Live Impact Splitter
            </div>
            <h2 className="text-3xl font-black text-stone-900 font-display">See Your Contribution In Action</h2>
            <p className="text-stone-500 text-sm max-w-lg mx-auto leading-relaxed">
              Drag the slider below to see exactly how your donation amount is distributed across our active foundation programs.
            </p>
          </div>

          <div className="bg-white border border-stone-200/60 rounded-[2.5rem] p-8 md:p-12 shadow-xl space-y-10">
            {/* Slider Widget */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-stone-400">Contribution Amount</span>
                <span className="text-2xl font-black text-vermilion font-display">{formatCurrency(sliderAmount)}</span>
              </div>
              <input 
                type="range" 
                min={1000} 
                max={50000} 
                step={1000}
                value={sliderAmount} 
                onChange={(e) => setSliderAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-vermilion"
              />
              <div className="flex justify-between text-[10px] font-black text-stone-400">
                <span>Min: ₹1,000</span>
                <span>Max: ₹50,000</span>
              </div>
            </div>

            {/* Split Visualization */}
            <div className="grid md:grid-cols-3 gap-6 pt-4">
              {/* Allocation Card 1 */}
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 space-y-3 relative overflow-hidden">
                <div className="absolute right-2 top-2 opacity-5 text-stone-900"><Percent size={48} /></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Heritage Digitization (40%)</h4>
                <div className="text-xl font-black text-stone-900">{formatCurrency(allocation.heritage)}</div>
                <p className="text-[10px] text-stone-500 leading-relaxed font-medium">Sponsors high-resolution camera gear and scanning teams for ancient scriptures.</p>
              </div>
              {/* Allocation Card 2 */}
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 space-y-3 relative overflow-hidden">
                <div className="absolute right-2 top-2 opacity-5 text-stone-900"><Percent size={48} /></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Artisan Directory (35%)</h4>
                <div className="text-xl font-black text-stone-900">{formatCurrency(allocation.directory)}</div>
                <p className="text-[10px] text-stone-500 leading-relaxed font-medium">Funds verification visits, photography, and creating digital portfolio links for artisans.</p>
              </div>
              {/* Allocation Card 3 */}
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 space-y-3 relative overflow-hidden">
                <div className="absolute right-2 top-2 opacity-5 text-stone-900"><Percent size={48} /></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Welfare & Legal (25%)</h4>
                <div className="text-xl font-black text-stone-900">{formatCurrency(allocation.advocacy)}</div>
                <p className="text-[10px] text-stone-500 leading-relaxed font-medium">Supplements advocacy efforts for OBC reservation rights and education support funds.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};
