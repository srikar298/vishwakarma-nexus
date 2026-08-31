"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  Hammer, 
  Menu, 
  X, 
  ChevronDown, 
  Compass, 
  Award, 
  Users, 
  Flag, 
  Calendar,
  ShieldCheck,
  BookOpen,
  ScrollText,
  Heart,
  Image as ImageIcon,
  LogIn,
  UserPlus,
  Briefcase
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { JoinModal } from '@/features/onboarding/components/JoinModal';
import { AnnouncementTicker } from './AnnouncementTicker';
import { SocialLinks } from '@/shared/ui/SocialLinks';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t, i18n } = useTranslation();
  const lang = (['en', 'te', 'hi'].includes(i18n.language) ? i18n.language : 'en') as 'en' | 'te' | 'hi';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen font-sans selection:bg-saffron-200 bg-white flex flex-col">
      {/* Top Activity / Announcement Bar */}
      <AnnouncementTicker />

      {/* Main Navigation Header */}
      <nav className={`sticky top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl border-stone-100 shadow-sm py-0' 
          : 'bg-white/90 backdrop-blur-md border-transparent py-2'
      }`}>
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link href="/" aria-label="Home" className="flex items-center gap-3 hover:opacity-85 transition-opacity shrink-0">
              <img src="/images/shared/emblem.png" alt="VKC Emblem" className="w-11 h-11 object-contain drop-shadow-md" />
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-stone-900 leading-none">
                  VKC
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-vermilion hidden sm:block">
                  Knowledge Centre
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {/* Pillar 1: About VKC */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-stone-700 hover:text-vermilion transition-colors font-bold text-sm py-8 group-hover:text-vermilion cursor-pointer">
                  <span>{lang === 'te' ? 'సంస్థ పరిచయం' : lang === 'hi' ? 'संस्था परिचय' : 'About VKC'}</span>
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform text-stone-400 group-hover:text-vermilion" />
                </button>
                <div className="absolute top-full left-0 w-72 bg-white border border-stone-100 shadow-2xl rounded-3xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                  <Link href="/vision" className="flex items-center gap-3.5 p-3 hover:bg-stone-50 rounded-2xl transition-all group/item">
                    <div className="p-2 bg-saffron-100 rounded-xl text-saffron-600 group-hover/item:bg-saffron-500 group-hover/item:text-white transition-colors">
                      <Compass size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 leading-none mb-1">{t('nav.vision_path', 'Our Vision & Mandate')}</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Roadmap 2026—2030</p>
                    </div>
                  </Link>

                  <Link href="/leadership" className="flex items-center gap-3.5 p-3 hover:bg-stone-50 rounded-2xl transition-all group/item">
                    <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                      <ShieldCheck size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 leading-none mb-1">Leadership & Council</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Governing Office-Bearers</p>
                    </div>
                  </Link>

                  <Link href="/founder" className="flex items-center gap-3.5 p-3 hover:bg-stone-50 rounded-2xl transition-all group/item">
                    <div className="p-2 bg-amber-50 rounded-xl text-amber-700 group-hover/item:bg-amber-600 group-hover/item:text-white transition-colors">
                      <Award size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 leading-none mb-1">The Founder</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Brahmasri Praveen Kumar</p>
                    </div>
                  </Link>

                  <Link href="/heritage" className="flex items-center gap-3.5 p-3 hover:bg-stone-50 rounded-2xl transition-all group/item">
                    <div className="p-2 bg-vermilion/10 rounded-xl text-vermilion group-hover/item:bg-vermilion group-hover/item:text-white transition-colors">
                      <Hammer size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 leading-none mb-1">{t('nav.heritage', 'Sacred Heritage')}</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Pancha Kula History & Lore</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Pillar 2: Knowledge & Vault */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-stone-700 hover:text-vermilion transition-colors font-bold text-sm py-8 group-hover:text-vermilion cursor-pointer">
                  <span>{lang === 'te' ? 'జ్ఞాన భాండాగారం' : lang === 'hi' ? 'ज्ञान भंडार' : 'Knowledge'}</span>
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform text-stone-400 group-hover:text-vermilion" />
                </button>
                <div className="absolute top-full left-0 w-72 bg-white border border-stone-100 shadow-2xl rounded-3xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                  <Link href="/knowledge" className="flex items-center gap-3.5 p-3 hover:bg-stone-50 rounded-2xl transition-all group/item">
                    <div className="p-2 bg-stone-100 rounded-xl text-stone-700 group-hover/item:bg-stone-900 group-hover/item:text-white transition-colors">
                      <BookOpen size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 leading-none mb-1">Shastra Vault</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Ancient CAD & Manuscripts</p>
                    </div>
                  </Link>

                  <Link href="/legends" className="flex items-center gap-3.5 p-3 hover:bg-stone-50 rounded-2xl transition-all group/item">
                    <div className="p-2 bg-saffron-100 rounded-xl text-saffron-700 group-hover/item:bg-saffron-600 group-hover/item:text-white transition-colors">
                      <ScrollText size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 leading-none mb-1">Hall of Legends</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Scholars & Master Sculptors</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Pillar 3: Directory (Direct Link) */}
              <Link 
                href="/directory" 
                className="flex items-center gap-2 text-stone-700 hover:text-vermilion transition-colors font-bold text-sm py-8 cursor-pointer group"
              >
                <span>{t('nav.directory', 'Artisans Directory')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-vermilion group-hover:scale-125 transition-transform" />
              </Link>

              {/* Pillar 4: Community & Welfare */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-stone-700 hover:text-vermilion transition-colors font-bold text-sm py-8 group-hover:text-vermilion cursor-pointer">
                  <span>{lang === 'te' ? 'కమ్యూనిటీ & సంక్షేమం' : lang === 'hi' ? 'समुदाय एवं कल्याण' : 'Community'}</span>
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform text-stone-400 group-hover:text-vermilion" />
                </button>
                <div className="absolute top-full right-0 w-72 bg-white border border-stone-100 shadow-2xl rounded-3xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                  <Link href="/network" className="flex items-center gap-3.5 p-3 hover:bg-stone-50 rounded-2xl transition-all group/item">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                      <Users size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 leading-none mb-1">Network Hub</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Mentorship & Collaborations</p>
                    </div>
                  </Link>

                  <Link href="/donors" className="flex items-center gap-3.5 p-3 hover:bg-stone-50 rounded-2xl transition-all group/item">
                    <div className="p-2 bg-rose-50 rounded-xl text-rose-600 group-hover/item:bg-rose-600 group-hover/item:text-white transition-colors">
                      <Heart size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 leading-none mb-1">Community Donors</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Sponsors & Leaderboard</p>
                    </div>
                  </Link>

                  <Link href="/empowerment" className="flex items-center gap-3.5 p-3 hover:bg-stone-50 rounded-2xl transition-all group/item">
                    <div className="p-2 bg-stone-100 rounded-xl text-stone-700 group-hover/item:bg-stone-900 group-hover/item:text-white transition-colors">
                      <Flag size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 leading-none mb-1">Rights & Empowerment</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Advocacy & Census</p>
                    </div>
                  </Link>

                  <Link href="/events" className="flex items-center gap-3.5 p-3 hover:bg-stone-50 rounded-2xl transition-all group/item">
                    <div className="p-2 bg-amber-50 rounded-xl text-amber-600 group-hover/item:bg-amber-600 group-hover/item:text-white transition-colors">
                      <Calendar size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 leading-none mb-1">Events & Calendar</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Summits & Celebrations</p>
                    </div>
                  </Link>

                  <Link href="/gallery" className="flex items-center gap-3.5 p-3 hover:bg-stone-50 rounded-2xl transition-all group/item">
                    <div className="p-2 bg-stone-50 rounded-xl text-stone-600 group-hover/item:bg-stone-900 group-hover/item:text-white transition-colors">
                      <ImageIcon size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 leading-none mb-1">Media Gallery</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Photo Archives</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Action Area: Language + Sign In + Join VKC (Sign Up) */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher />

              {/* Sign In Link */}
              <Link 
                href="/admin" 
                className="text-stone-600 hover:text-stone-900 font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-xl hover:bg-stone-100 transition-all flex items-center gap-1.5"
              >
                <LogIn size={14} className="text-stone-400" />
                <span>{lang === 'te' ? 'లాగిన్' : lang === 'hi' ? 'लॉग इन' : 'Sign In'}</span>
              </Link>

              {/* Join VKC / Sign Up Button */}
              <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="bg-gradient-to-r from-vermilion to-vermilion-600 hover:from-vermilion-600 hover:to-vermilion text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-[0.18em] shadow-lg shadow-vermilion/25 hover:shadow-xl hover:shadow-vermilion/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <UserPlus size={14} />
                <span>{t('nav.join', 'Join VKC')}</span>
              </button>
            </div>

            {/* Mobile Nav Trigger */}
            <div className="flex items-center gap-3 lg:hidden">
              <LanguageSwitcher />
              <button 
                aria-label="Toggle menu" 
                aria-expanded={isMenuOpen} 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 text-stone-900 hover:text-vermilion transition-colors rounded-xl hover:bg-stone-50"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/98 backdrop-blur-2xl border-t border-stone-100 p-5 flex flex-col max-h-[calc(100vh-80px)] shadow-2xl rounded-b-[2rem]"
            >
              {/* Primary Mobile CTA at top */}
              <div className="pb-4 mb-4 border-b border-stone-100">
                <button 
                  onClick={() => { setIsJoinModalOpen(true); setIsMenuOpen(false); }}
                  className="w-full bg-vermilion text-white py-3.5 rounded-2xl font-black shadow-xl shadow-vermilion/20 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus size={16} />
                  <span>{t("nav.join", "Join VKC / Sign Up")}</span>
                </button>
              </div>

              {/* Scrollable links grouped by Pillar */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                {/* 1. About Section */}
                <div>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-3 mb-2 flex items-center gap-1.5">
                    <Compass size={12} className="text-vermilion" />
                    <span>{lang === 'te' ? 'సంస్థ పరిచయం' : lang === 'hi' ? 'संस्था परिचय' : 'About VKC'}</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/vision" onClick={() => setIsMenuOpen(false)} className="p-3 text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl font-bold text-xs transition-all">
                      {t('nav.vision_path', 'Vision & Roadmap')}
                    </Link>
                    <Link href="/leadership" onClick={() => setIsMenuOpen(false)} className="p-3 text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl font-bold text-xs transition-all text-emerald-700">
                      Leadership Council
                    </Link>
                    <Link href="/founder" onClick={() => setIsMenuOpen(false)} className="p-3 text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl font-bold text-xs transition-all">
                      The Founder
                    </Link>
                    <Link href="/heritage" onClick={() => setIsMenuOpen(false)} className="p-3 text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl font-bold text-xs transition-all">
                      {t('nav.heritage', 'Sacred Heritage')}
                    </Link>
                  </div>
                </div>

                {/* 2. Knowledge Section */}
                <div>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-3 mb-2 flex items-center gap-1.5">
                    <BookOpen size={12} className="text-saffron-600" />
                    <span>{lang === 'te' ? 'జ్ఞాన భాండాగారం' : lang === 'hi' ? 'ज्ञान भंडार' : 'Knowledge'}</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/knowledge" onClick={() => setIsMenuOpen(false)} className="p-3 text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl font-bold text-xs transition-all">
                      Shastra Vault
                    </Link>
                    <Link href="/legends" onClick={() => setIsMenuOpen(false)} className="p-3 text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl font-bold text-xs transition-all">
                      Hall of Legends
                    </Link>
                  </div>
                </div>

                {/* 3. Core Directory Link */}
                <div>
                  <Link 
                    href="/directory" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="flex items-center justify-between p-3.5 bg-stone-900 text-white hover:bg-vermilion rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md"
                  >
                    <span>{t('nav.directory', 'Artisans Directory')}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Search Master Artisans →</span>
                  </Link>
                </div>

                {/* 4. Community Section */}
                <div>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-3 mb-2 flex items-center gap-1.5">
                    <Users size={12} className="text-blue-600" />
                    <span>{lang === 'te' ? 'కమ్యూనిటీ' : lang === 'hi' ? 'समुदाय' : 'Community & Welfare'}</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/network" onClick={() => setIsMenuOpen(false)} className="p-3 text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl font-bold text-xs transition-all">
                      Network Hub
                    </Link>
                    <Link href="/donors" onClick={() => setIsMenuOpen(false)} className="p-3 text-vermilion bg-rose-50/60 hover:bg-rose-100 rounded-xl font-black text-xs transition-all">
                      Community Donors
                    </Link>
                    <Link href="/empowerment" onClick={() => setIsMenuOpen(false)} className="p-3 text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl font-bold text-xs transition-all">
                      Empowerment
                    </Link>
                    <Link href="/events" onClick={() => setIsMenuOpen(false)} className="p-3 text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl font-bold text-xs transition-all">
                      Events & Meets
                    </Link>
                    <Link href="/gallery" onClick={() => setIsMenuOpen(false)} className="p-3 text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl font-bold text-xs transition-all col-span-2">
                      Media Gallery & Photo Archive
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
                <Link 
                  href="/admin" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-stone-500 hover:text-stone-900 font-bold text-xs flex items-center gap-1.5"
                >
                  <LogIn size={14} />
                  <span>Already a member? Sign In</span>
                </Link>
                <SocialLinks size={26} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>

      {/* Footer Matrix */}
      <footer className="bg-stone-950 text-white py-20 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-saffron-900/10 blur-[150px] rounded-full -z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Identity & Socials */}
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <img src="/images/shared/emblem.png" alt="VKC Emblem" className="w-11 h-11 object-contain drop-shadow-md" />
                <span className="text-2xl font-black tracking-tighter text-white">VKC</span>
              </div>
              <p className="text-stone-400 leading-relaxed max-w-sm text-sm">
                {t('footer.description', 'Dedicated to the recognition, skill upgradation, and holistic support of traditional artisans.')}
              </p>
              <SocialLinks 
                size={36} 
                iconClassName="hover:scale-110 hover:-translate-y-1 transition-all shadow-sm rounded-full" 
              />
            </div>

            {/* Knowledge & Platform Columns */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 col-span-1 md:col-span-2">
              <div>
                <h4 className="text-xs font-black mb-6 text-turmeric uppercase tracking-widest">About & Knowledge</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li><Link href="/vision" className="text-stone-400 hover:text-white transition-colors">Our Vision & Mandate</Link></li>
                  <li><Link href="/leadership" className="text-stone-400 hover:text-white transition-colors">Leadership & Council</Link></li>
                  <li><Link href="/founder" className="text-stone-400 hover:text-white transition-colors">The Founder</Link></li>
                  <li><Link href="/heritage" className="text-stone-400 hover:text-white transition-colors">Heritage Archive</Link></li>
                  <li><Link href="/knowledge" className="text-stone-400 hover:text-white transition-colors">Shastra Vault</Link></li>
                  <li><Link href="/legends" className="text-stone-400 hover:text-white transition-colors">Hall of Legends</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-black mb-6 text-turmeric uppercase tracking-widest">Platform & Community</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li><Link href="/directory" className="text-stone-400 hover:text-white transition-colors">Artisan Directory</Link></li>
                  <li><Link href="/membership" className="text-stone-400 hover:text-white transition-colors">Claim Digital ID</Link></li>
                  <li><Link href="/network" className="text-stone-400 hover:text-white transition-colors">Network Hub</Link></li>
                  <li><Link href="/donors" className="text-stone-400 hover:text-white transition-colors">Community Donors</Link></li>
                  <li><Link href="/empowerment" className="text-stone-400 hover:text-white transition-colors">Empowerment & Rights</Link></li>
                  <li><Link href="/events" className="text-stone-400 hover:text-white transition-colors">Events & Calendar</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Connect, Legal & Credits */}
          <div className="grid md:grid-cols-2 gap-12 pt-16 border-t border-stone-800/50">
            <div>
              <h4 className="text-xs font-black mb-6 text-turmeric uppercase tracking-widest">Connect</h4>
              <p className="text-stone-400 mb-2 text-sm font-bold">Vishwakarma Knowledge Centre</p>
              <p className="text-stone-500 text-sm leading-relaxed max-w-xs">{t('footer.address', 'Shivam Rd, Prashanti Nagar, Bagh Amberpet, Hyderabad, Telangana 500013')}</p>
              <p className="text-turmeric mt-4 font-black text-sm">info@vkc-community.org</p>
            </div>
            <div className="flex flex-col md:items-end justify-center gap-6">
              <div className="flex gap-8 text-xs font-bold text-stone-400 uppercase tracking-widest">
                <Link href="/events" className="hover:text-white transition-colors">Events</Link>
                <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
                <Link href="/network" className="hover:text-white transition-colors">Contact</Link>
              </div>
              <div className="flex gap-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                <a href="#" className="hover:text-stone-300">Privacy Policy</a>
                <a href="#" className="hover:text-stone-300">Terms of Service</a>
                <Link href="/admin" className="opacity-0">.</Link>
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  © 2026 VKC. Designed for the Five Millennia.
                </p>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Developed by <a href="https://www.linkedin.com/in/kudurmallasrikar/" target="_blank" rel="noreferrer" className="text-saffron-500 hover:text-saffron-400 transition-colors underline decoration-saffron-500/30 underline-offset-4">Srikar and Team</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Onboarding & Signup Modal */}
      <JoinModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </div>
  );
};
