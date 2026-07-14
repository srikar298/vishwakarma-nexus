"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Download, Share2, Sparkles, ArrowRight, Globe } from 'lucide-react';
import { MembershipCard } from '../components/MembershipCard';
import { RegistrationForm } from '../components/RegistrationForm';
import { ScrollToTop } from '@/shared/components/ScrollToTop';

export const MembershipPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [liveData, setLiveData] = useState({
    name: '',
    phone: '',
    location: '',
    profession: '',
    kula: '',
    experience: '',
    uid: 'VKC-2026-TEMP',
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  });

  const handleLiveUpdate = (data: Record<string, string | number | boolean>) => {
    setLiveData(prev => ({ ...prev, ...data }));
  };

  const handleRegistrationComplete = () => {
    const generatedUid = `VKC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalRecord = {
      ...liveData,
      uid: generatedUid
    };

    setLiveData(finalRecord);
    setIsRegistered(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Seed data to Google Sheets via Apps Script Web App
    const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      fetch(appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalRecord),
      }).catch(err => console.error("Error sending data to Google Sheets:", err));
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 group">
      <ScrollToTop />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Side: Live Preview & Branding */}
          <div className="lg:w-1/2 space-y-10 lg:sticky lg:top-40">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3 bg-vermilion/10 px-4 py-1.5 rounded-full text-vermilion">
                 <Shield size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Digital Registry v2.0</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 leading-tight font-display">
                {isRegistered ? 'Your Digital' : 'Claim Your'} <span className="text-vermilion underline decoration-vermilion/20 underline-offset-8">Identity</span>
              </h1>
              <p className="text-stone-600 text-lg font-medium leading-relaxed max-w-md">
                {isRegistered 
                  ? 'Your membership is now active. You can download or share your verified digital ID below.'
                  : 'Complete the registration to generate your unique Artisan ID card. Watch it update in real-time.'}
              </p>
            </motion.div>

            {/* Live ID Preview */}
            <div className="relative group/card">
               <div className="absolute -inset-4 bg-gradient-to-tr from-saffron-500/10 to-vermilion/10 blur-3xl rounded-[4rem] opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />
               <MembershipCard memberData={{
                 name: liveData.name || "Your Name Here",
                 uid: liveData.uid,
                 category: liveData.kula ? liveData.kula.split(' (')[0] : "Traditional Trade",
                 joinDate: liveData.joinDate
               }} />
               {!isRegistered && (
                 <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-stone-900 text-white px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl rotate-12"
                 >
                   Live Preview
                 </motion.div>
               )}
            </div>

            {isRegistered && (
               <div className="flex flex-wrap gap-6 w-full max-w-md pt-4">
                  <button className="flex-1 min-w-[180px] flex items-center justify-center gap-3 bg-stone-900 text-white font-black py-4 rounded-2xl shadow-2xl hover:bg-vermilion transition-all active:scale-95 text-[10px] uppercase tracking-widest cursor-pointer">
                    <Download size={18} />
                    Download ID
                  </button>
                  <button className="flex-1 min-w-[180px] flex items-center justify-center gap-3 bg-white text-stone-900 font-black py-4 rounded-2xl border border-stone-200 shadow-sm hover:bg-stone-50 transition-all active:scale-95 text-[10px] uppercase tracking-widest cursor-pointer">
                    <Share2 size={18} />
                    Verify Link
                  </button>
               </div>
            )}
          </div>

          {/* Right Side: Step-by-Step Portal */}
          <div className="lg:w-1/2 w-full">
            <AnimatePresence mode="wait">
              {!isRegistered ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <RegistrationForm 
                    onUpdate={handleLiveUpdate}
                    onComplete={handleRegistrationComplete} 
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-12"
                >
                  <div className="bg-emerald-50 rounded-[3rem] p-10 md:p-16 border border-emerald-100 text-center space-y-6">
                     <div className="w-20 h-20 bg-white text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/10 rotate-3">
                        <Shield size={40} />
                     </div>
                     <div className="space-y-2">
                        <h2 className="text-3xl font-black text-stone-900 font-display uppercase tracking-tight">Registration Complete</h2>
                        <p className="text-emerald-700 font-bold text-sm">Jai Vishwakarma! Your identity has been issued.</p>
                     </div>
                     <div className="pt-4">
                        <button className="bg-stone-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 mx-auto hover:gap-6 transition-all shadow-xl shadow-black/20 cursor-pointer">
                           Unlock Network Hub <ArrowRight size={16} />
                        </button>
                     </div>
                  </div>

                  <div className="grid gap-6">
                     <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest text-center">Next Strategic Steps</h4>
                     <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { title: 'Global Directory', desc: 'Your profile is being listed for buyers.', icon: <Globe size={18} /> },
                          { title: 'Skill Training', desc: 'Access advanced 3D & Design courses.', icon: <Sparkles size={18} /> }
                        ].map((step, i) => (
                          <div key={i} className="p-6 bg-white rounded-3xl border border-stone-100 shadow-sm hover:border-vermilion/20 transition-all group">
                             <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-vermilion transition-colors mb-4">
                                {step.icon}
                             </div>
                             <h5 className="font-black text-stone-900 text-sm mb-1 uppercase tracking-tight">{step.title}</h5>
                             <p className="text-stone-500 text-[11px] leading-relaxed font-medium">{step.desc}</p>
                          </div>
                        ))}
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};
