"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Share2, 
  Check, 
  MapPin, 
  Calendar, 
  Crown, 
  Star, 
  Shield, 
  Quote,
  Heart,
  ExternalLink
} from 'lucide-react';
import { Donor } from '../constants/donorsData';

interface DonorProfilePageProps {
  donor: Donor;
}

const TIER_CONFIGS = {
  patron: {
    badge: "Legacy Patron",
    icon: <Crown size={18} className="text-stone-950" />,
    color: "from-gold-400 via-saffron-500 to-gold-600",
    glow: "shadow-gold-500/30",
    bg: "bg-gradient-to-br from-gold-50/50 via-stone-50 to-cream/30",
    badgeBg: "bg-gradient-to-r from-gold-400 to-gold-600 text-stone-950"
  },
  gold: {
    badge: "Gold Sponsor",
    icon: <Star size={18} className="text-white" fill="currentColor" />,
    color: "from-stone-700 via-stone-800 to-stone-900",
    glow: "shadow-stone-900/20",
    bg: "bg-gradient-to-br from-stone-50 via-white to-stone-100/40",
    badgeBg: "bg-stone-900 text-white"
  },
  silver: {
    badge: "Silver Supporter",
    icon: <Shield size={18} className="text-stone-800" fill="currentColor" />,
    color: "from-stone-300 via-stone-400 to-stone-500",
    glow: "shadow-stone-400/20",
    bg: "bg-gradient-to-br from-stone-50 via-white to-stone-50",
    badgeBg: "bg-gradient-to-r from-stone-200 to-stone-400 text-stone-900"
  },
  honorary: {
    badge: "Honorary Supporter",
    icon: <Heart size={18} className="text-orange-500" fill="currentColor" />,
    color: "from-orange-500 via-amber-500 to-amber-700",
    glow: "shadow-orange-500/20",
    bg: "bg-gradient-to-br from-orange-50/40 via-white to-amber-50/20",
    badgeBg: "bg-gradient-to-r from-orange-500 to-amber-600 text-white"
  }
};

export const DonorProfilePage = ({ donor }: DonorProfilePageProps) => {
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);
  const cfg = TIER_CONFIGS[donor.tier];
  
  const currentLang = i18n.language as 'en' | 'te' | 'hi';
  const donorQuote = donor.quote[currentLang] || donor.quote.en;

  const [shareUrl, setShareUrl] = useState('');
  React.useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const shareText = donor.tier === 'honorary'
    ? `Check out ${donor.name}'s profile! They are providing ${donor.formattedAmount} to the Vishwakarma Knowledge Centre to support traditional artisans.`
    : `Check out ${donor.name}'s profile! They contributed ${donor.formattedAmount} to the Vishwakarma Knowledge Centre to support traditional artisans.`;

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  };

  const handleShare = async () => {
    const shareData = {
      title: `${donor.name} - VKC Supporter`,
      text: shareText,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 group relative overflow-hidden">
        {/* Animated Background Textures */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-saffron-500/5 blur-[120px] rounded-full pointer-events-none`} />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          
          {/* Back Navigation Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
            <Link 
              href="/donors"
              className="inline-flex items-center gap-2 text-stone-500 hover:text-vermilion transition-colors font-bold text-xs uppercase tracking-widest self-start sm:self-auto"
            >
              <ArrowLeft size={16} />
              {t('common.back_to_donors' as never, 'Back to Donors')}
            </Link>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* Social share icons */}
              <div className="flex items-center gap-2 bg-stone-100/80 border border-stone-200/50 p-1.5 rounded-2xl">
                {/* WhatsApp */}
                <a 
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-white hover:bg-emerald-50 text-emerald-600 rounded-xl border border-stone-200/60 shadow-sm active:scale-95 transition-all"
                  title="Share on WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.597-1.012-5.04-2.85-6.88A9.832 9.832 0 0 0 12.008 1.24c-5.446 0-9.875 4.375-9.879 9.738a9.69 9.69 0 0 0 1.503 5.176l-1.02 3.722 3.829-1.002-.375-.224zm11.365-5.4c-.299-.149-1.772-.875-2.046-.975-.275-.1-.475-.149-.675.15-.2.299-.773.975-.949 1.174-.175.2-.35.224-.649.075-2.979-1.49-4.9-5.146-5.163-5.597-.263-.451-.028-.696.197-.92.203-.203.45-.525.675-.788.225-.262.299-.45.449-.75.15-.299.075-.562-.037-.762-.112-.2-1.003-2.425-1.374-3.325-.36-.87-.728-.752-.998-.766-.258-.014-.554-.017-.852-.017-.298 0-.783.112-1.192.562-.41.45-1.564 1.525-1.564 3.719 0 2.194 1.597 4.312 1.82 4.613.223.3 3.14 4.8 7.607 6.729 1.062.459 1.892.733 2.539.939 1.066.339 2.037.29 2.805.176.855-.128 1.772-.724 2.022-1.388.251-.662.251-1.225.176-1.388-.075-.162-.275-.262-.574-.412z"/>
                  </svg>
                </a>
                {/* Twitter / X */}
                <a 
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-white hover:bg-stone-50 text-stone-900 rounded-xl border border-stone-200/60 shadow-sm active:scale-95 transition-all font-black text-xs"
                  title="Share on X (Twitter)"
                >
                  𝕏
                </a>
                {/* Facebook */}
                <a 
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-white hover:bg-blue-50 text-blue-600 rounded-xl border border-stone-200/60 shadow-sm active:scale-95 transition-all"
                  title="Share on Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>
              </div>

              <button 
                onClick={handleShare}
                className="inline-flex items-center gap-2 bg-white border border-stone-200 px-4.5 py-2.5 rounded-xl hover:bg-stone-50 text-stone-600 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-600">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 size={14} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Shareable Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`bg-white rounded-[2.5rem] border border-stone-100 shadow-2xl ${cfg.glow} p-8 md:p-14 relative overflow-hidden`}
          >
            {/* Holographic Border Shimmer effect */}
            <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${cfg.color}`} />
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-12">
              
              {/* Profile Image & Avatar Glow */}
              <div className="relative">
                <div className={`absolute -inset-1.5 bg-gradient-to-tr ${cfg.color} rounded-full blur-[8px] opacity-75`} />
                <img 
                  src={donor.avatar} 
                  alt={donor.name} 
                  className="w-40 h-40 rounded-full object-cover border-4 border-white relative z-10 shadow-lg"
                />
              </div>

              {/* Donor Core Info */}
              <div className="flex-1 text-center md:text-left space-y-6">
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-5xl font-black text-stone-900 leading-none font-display tracking-tight">
                    {donor.name}
                  </h1>
                  <p className="text-stone-500 font-bold text-sm md:text-base">{donor.role}</p>
                </div>

                {/* Amount Contribution Callout */}
                <div className="inline-flex flex-col bg-stone-900 text-white rounded-3xl p-5 md:px-8 md:py-6 shadow-xl relative overflow-hidden w-full max-w-sm text-left">
                  <div className="absolute right-3 bottom-3 opacity-10 text-white pointer-events-none">
                    <Heart size={80} fill="currentColor" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-stone-400">
                    {donor.tier === 'honorary' ? 'VKC Support Type' : 'Total VKC Contribution'}
                  </span>
                  <span className="text-3xl md:text-4xl font-black text-turmeric mt-1 font-display tracking-tight">
                    {donor.tier === 'honorary' ? 'Community Patronage' : donor.formattedAmount}
                  </span>
                </div>

                {/* Metadata details */}
                <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 pt-2">
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-bold">
                    <MapPin size={14} className="text-gold-500" />
                    {donor.location}
                  </div>
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-bold">
                    <Calendar size={14} className="text-vermilion" />
                    Joined {donor.joinDate}
                  </div>
                </div>

                {/* Role-Specific Description */}
                <p className="text-stone-600 font-medium text-sm italic leading-relaxed border-l-2 border-orange-500 pl-4 py-1 max-w-xl text-left">
                  {donor.description}
                </p>

              </div>
            </div>

            <hr className="border-stone-100 my-10" />

            {/* Blockquote Quote Section */}
            <div className="space-y-6 text-center md:text-left relative max-w-3xl mx-auto">
              <Quote className="text-saffron-200/50 absolute -top-8 -left-6 md:-left-12 w-16 h-16 pointer-events-none" />
              <p className="text-stone-700 text-lg md:text-xl font-medium leading-relaxed italic relative z-10 px-4">
                "{donorQuote}"
              </p>
            </div>

          </motion.div>

          {/* Social Invitation / Call to Action */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 bg-stone-900 rounded-[2rem] p-8 md:p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-xl md:text-2xl font-black font-display text-white">
                Sponsor Traditional Arts & Heritage
              </h3>
              <p className="text-stone-400 text-xs md:text-sm max-w-lg mx-auto font-medium leading-relaxed">
                Join {donor.name} and hundreds of community leaders in digitizing 5,000+ Shastras and providing toolkits to rural artisan clans.
              </p>
              <div className="pt-2">
                <Link 
                  href="/membership" 
                  className="inline-flex items-center gap-2 bg-vermilion hover:bg-vermilion/90 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-vermilion/20 active:scale-95"
                >
                  Join the Mission
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
  );
};
