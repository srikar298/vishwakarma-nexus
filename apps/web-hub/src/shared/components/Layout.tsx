import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';
import { 
  Hammer, 
  Menu, 
  X,
  ChevronDown,
  Compass,
  Award,
  Users,
  Flag,
  Calendar
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { JoinModal } from '@/features/onboarding/components/JoinModal';
import { AnnouncementTicker } from './AnnouncementTicker';
import { SocialLinks } from '@/shared/ui/SocialLinks';

export const Layout = () => {
  const { t, i18n } = useTranslation();
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
      {/* Activity Bar */}
      <AnnouncementTicker />

      {/* Navigation */}
      <nav className={`sticky top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl border-stone-100 shadow-sm py-0' 
          : 'bg-white/80 backdrop-blur-md border-transparent py-2'
      }`}>
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" aria-label="Home" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/images/emblem.png" alt="VKC Emblem" className="w-11 h-11 object-contain drop-shadow-md" />
              <span className="text-2xl font-black tracking-tighter text-stone-900 hidden sm:block">
                VKC
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6 mr-4 border-r border-stone-100 pr-8">
                
                {/* Vision Group */}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-stone-600 hover:text-vermilion transition-colors font-semibold py-8 group-hover:text-vermilion">
                    {t('nav.vision')} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </button>
                  <div className="absolute top-full left-0 w-64 bg-white border border-stone-100 shadow-2xl rounded-3xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                    <Link to="/vision" className="flex items-center gap-4 p-4 hover:bg-stone-50 rounded-2xl transition-all group/item">
                      <div className="p-2 bg-saffron-100 rounded-xl text-saffron-600 group-hover/item:bg-saffron-500 group-hover/item:text-white transition-colors">
                        <Compass size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-900 leading-none mb-1">{t('nav.vision_path')}</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{t('nav.vision_mandate')}</p>
                      </div>
                    </Link>
                    <Link to="/heritage" className="flex items-center gap-4 p-4 hover:bg-stone-50 rounded-2xl transition-all group/item">
                      <div className="p-2 bg-vermilion/10 rounded-xl text-vermilion group-hover/item:bg-vermilion group-hover/item:text-white transition-colors">
                        <Hammer size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-900 leading-none mb-1">{t('nav.heritage')}</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{t('nav.heritage_legacy')}</p>
                      </div>
                    </Link>
                    <Link to="/legends" className="flex items-center gap-4 p-4 hover:bg-stone-50 rounded-2xl transition-all group/item">
                      <div className="p-2 bg-stone-100 rounded-xl text-stone-600 group-hover/item:bg-stone-900 group-hover/item:text-white transition-colors">
                        <Award size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-900 leading-none mb-1">{t('nav.legends')}</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{t('nav.legends_icons')}</p>
                      </div>
                    </Link>
                  </div>
                </div>

                <Link to="/knowledge" className="text-stone-600 hover:text-vermilion transition-colors font-semibold">{t('nav.knowledge')}</Link>
                <Link to="/directory" className="text-stone-600 hover:text-vermilion transition-colors font-semibold">{t('nav.directory')}</Link>

                {/* Network Group */}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-stone-600 hover:text-vermilion transition-colors font-semibold py-8 group-hover:text-vermilion">
                    {t('nav.network')} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </button>
                  <div className="absolute top-full left-0 w-64 bg-white border border-stone-100 shadow-2xl rounded-3xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                    <Link to="/events" className="flex items-center gap-4 p-4 hover:bg-stone-50 rounded-2xl transition-all group/item">
                      <div className="p-2 bg-stone-100 rounded-xl text-stone-600 group-hover/item:bg-stone-900 group-hover/item:text-white transition-colors">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-900 leading-none mb-1">{t('nav.events')}</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{t('nav.events_calendar')}</p>
                      </div>
                    </Link>
                    <Link to="/network" className="flex items-center gap-4 p-4 hover:bg-stone-50 rounded-2xl transition-all group/item">
                      <div className="p-2 bg-stone-100 rounded-xl text-stone-600 group-hover/item:bg-stone-900 group-hover/item:text-white transition-colors">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-900 leading-none mb-1">{t('nav.network')}</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Connect & Mentorship</p>
                      </div>
                    </Link>
                    <Link to="/empowerment" className="flex items-center gap-4 p-4 hover:bg-stone-50 rounded-2xl transition-all group/item">
                      <div className="p-2 bg-stone-100 rounded-xl text-stone-600 group-hover/item:bg-stone-900 group-hover/item:text-white transition-colors">
                        <Flag size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-900 leading-none mb-1">Empowerment</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Rights & Advocacy</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <Link to="/donors" className="hidden lg:block text-stone-500 hover:text-vermilion transition-colors font-black uppercase tracking-widest text-xs px-2">{t('donors.page_title' as never, 'Community Donors')}</Link>
                <button 
                  onClick={() => setIsJoinModalOpen(true)}
                  className="bg-vermilion text-white px-8 py-2.5 rounded-full font-black hover:bg-vermilion/90 transition-all shadow-xl shadow-vermilion/20 active:scale-95 text-xs uppercase tracking-[0.2em]"
                >
                  {t('nav.join')}
                </button>
              </div>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="flex items-center gap-6 md:hidden">
              <LanguageSwitcher />
              <button aria-label="Toggle menu" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-stone-900 group">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} className="group-hover:text-vermilion transition-colors" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-stone-100 p-6 flex flex-col max-h-[calc(100vh-80px)] shadow-2xl rounded-b-[2.5rem]"
            >
              {/* Scrollable links */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4">
                 <div>
                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-4 mb-2">{t('nav.vision')}</h4>
                    <div className="grid gap-2">
                       <Link to="/vision" onClick={() => setIsMenuOpen(false)} className="block px-6 py-4 text-stone-600 hover:bg-stone-50 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">{t('nav.vision_path')}</Link>
                       <Link to="/heritage" onClick={() => setIsMenuOpen(false)} className="block px-6 py-4 text-stone-600 hover:bg-stone-50 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">{t('nav.heritage')}</Link>
                       <Link to="/legends" onClick={() => setIsMenuOpen(false)} className="block px-6 py-4 text-stone-600 hover:bg-stone-50 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">{t('nav.legends')}</Link>
                    </div>
                 </div>

                 <Link to="/knowledge" onClick={() => setIsMenuOpen(false)} className="block px-6 py-4 text-stone-600 hover:bg-stone-50 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">{t('nav.knowledge')}</Link>
                 <Link to="/directory" onClick={() => setIsMenuOpen(false)} className="block px-6 py-4 text-stone-600 hover:bg-stone-50 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">{t('nav.directory')}</Link>

                 <div>
                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-4 mb-2">{t('nav.network')}</h4>
                     <div className="grid gap-2">
                       <Link to="/events" onClick={() => setIsMenuOpen(false)} className="block px-6 py-4 text-stone-600 hover:bg-stone-50 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">{t('nav.events')}</Link>
                       <Link to="/gallery" onClick={() => setIsMenuOpen(false)} className="block px-6 py-4 text-stone-600 hover:bg-stone-50 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">{t('nav.gallery')}</Link>
                       <Link to="/donors" onClick={() => setIsMenuOpen(false)} className="block px-6 py-4 text-stone-600 hover:bg-stone-50 rounded-2xl font-black text-sm uppercase tracking-widest transition-all text-vermilion">{t('donors.page_title' as never, 'Community Donors')}</Link>
                     </div>
                  </div>
              </div>

              {/* Static Footer CTA */}
              <div className="pt-4 border-t border-stone-100 bg-white/95 space-y-4 shrink-0">
                <button 
                  onClick={() => { setIsJoinModalOpen(true); setIsMenuOpen(false); }}
                  className="w-full bg-vermilion text-white py-4 rounded-2xl font-black shadow-xl shadow-vermilion/20 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs cursor-pointer"
                >
                  {t("nav.join")}
                </button>
                <div className="flex justify-center gap-6 pb-2">
                   <SocialLinks size={32} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-stone-950 text-white py-20 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-saffron-900/10 blur-[150px] rounded-full -z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <img src="/images/emblem.png" alt="VKC Emblem" className="w-11 h-11 object-contain drop-shadow-md" />
                <span className="text-2xl font-black tracking-tighter text-white">VKC</span>
              </div>
              <p className="text-stone-400 leading-relaxed max-w-sm text-sm">
                {t('footer.description')}
              </p>
              <SocialLinks 
                size={36} 
                iconClassName="hover:scale-110 hover:-translate-y-1 transition-all shadow-sm rounded-full" 
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 col-span-1 md:col-span-2">
              <div>
                <h4 className="text-xs font-black mb-6 text-turmeric uppercase tracking-widest">Knowledge</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li><Link to="/vision" className="text-stone-500 hover:text-white transition-colors">Our Vision</Link></li>
                  <li><Link to="/heritage" className="text-stone-500 hover:text-white transition-colors">Heritage Archive</Link></li>
                  <li><Link to="/legends" className="text-stone-500 hover:text-white transition-colors">Hall of Legends</Link></li>
                  <li><Link to="/knowledge" className="text-stone-500 hover:text-white transition-colors">Shastra Vault</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-black mb-6 text-turmeric uppercase tracking-widest">Platform</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li><Link to="/directory" className="text-stone-500 hover:text-white transition-colors">Artisan Directory</Link></li>
                  <li><Link to="/network" className="text-stone-500 hover:text-white transition-colors">Network Hub</Link></li>
                  <li><Link to="/empowerment" className="text-stone-500 hover:text-white transition-colors">Empowerment</Link></li>
                  <li><Link to="/founder" className="text-stone-500 hover:text-white transition-colors">The Founder</Link></li>
                  <li><Link to="/donors" className="text-stone-500 hover:text-white transition-colors">{t('donors.page_title' as never, 'Community Donors')}</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 pt-16 border-t border-stone-800/50">
            <div>
              <h4 className="text-xs font-black mb-6 text-turmeric uppercase tracking-widest">Connect</h4>
              <p className="text-stone-400 mb-2 text-sm font-bold">Vishwa Karma Knowledge Centre</p>
              <p className="text-stone-500 text-sm leading-relaxed max-w-xs">{t('footer.address')}</p>
              <p className="text-turmeric mt-4 font-black text-sm">info@vkc-community.org</p>
            </div>
            <div className="flex flex-col md:items-end justify-center gap-6">
              <div className="flex gap-8 text-xs font-bold text-stone-400 uppercase tracking-widest">
                <Link to="/events" className="hover:text-white transition-colors">Events</Link>
                <Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link>
                <Link to="/network" className="hover:text-white transition-colors">Contact</Link>
              </div>
              <div className="flex gap-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                <a href="#" className="hover:text-stone-300">Privacy Policy</a>
                <a href="#" className="hover:text-stone-300">Terms of Service</a>
                <Link to="/admin" className="opacity-0">.</Link>
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  © 2026 VKC. Designed for the Five Millennia.
                </p>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Developed by <a href="https://www.linkedin.com/in/kudurmallasrikar/" target="_blank" rel="noreferrer" className="text-saffron-500 hover:text-saffron-400 transition-colors underline decoration-saffron-500/30 underline-offset-4">Srikar and Team</a>
                </p>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Contributions can be supported at <a href="https://github.com/vishwkarma-k-c-dev/vishwakarma-nexus" target="_blank" rel="noreferrer" className="text-saffron-500 hover:text-saffron-400 transition-colors underline decoration-saffron-500/30 underline-offset-4">GitHub</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <JoinModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </div>
  );
};
