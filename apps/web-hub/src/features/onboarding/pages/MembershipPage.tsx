import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Download, Share2, Sparkles, ArrowRight, MapPin, CheckCircle2, X } from 'lucide-react';
import { MembershipCard } from '../components/MembershipCard';
import { RegistrationForm } from '../components/RegistrationForm';
import { SEO } from '@/shared/components/SEO';
import { ScrollToTop } from '@/shared/components/ScrollToTop';
import { NexusApi, type RegisterPayload, type IdCardResponse } from '@/infrastructure/api/nexus-api';

export const MembershipPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [idCardData, setIdCardData] = useState<IdCardResponse | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'updating' | 'updated' | 'error'>('idle');

  const [liveData, setLiveData] = useState({
    name: 'Your Name Here',
    phone: '',
    location: 'Telangana, India',
    profession: 'Traditional Craft',
    kula: 'Artisan Heritage',
    uid: 'VKC-2026-DEMO',
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  });

  const handleLiveUpdate = (data: Record<string, string | number | boolean>) => {
    setLiveData(prev => ({ ...prev, ...data }));
  };

  const handleRegistrationComplete = async (payload: RegisterPayload) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await NexusApi.register(payload);
      
      const digitalId = response.profile?.digitalId || `VKC-2026-${response.user?.publicId.slice(0, 6).toUpperCase()}`;
      
      setLiveData(prev => ({
        ...prev,
        name: `${response.user.firstName} ${response.user.lastName}`,
        uid: digitalId,
        profession: response.profile.trade,
        kula: response.profile.kula,
        location: `${response.profile.district}, ${response.profile.state}`,
      }));

      setIsRegistered(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Fetch official dynamic zero-S3 vector pass
      try {
        const cardRes = await NexusApi.getIdCard();
        setIdCardData(cardRes);
      } catch (cardErr) {
        console.warn('Pass generation queued or in fallback mode', cardErr);
      }

      // Prompt progressive location refinement after a brief delay
      setTimeout(() => {
        setShowLocationPrompt(true);
      }, 1200);

    } catch (err: any) {
      console.error('Registration failed:', err);
      const serverMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setErrorMessage(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllowLocation = () => {
    if (!navigator.geolocation) {
      setShowLocationPrompt(false);
      return;
    }

    setLocationStatus('updating');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await NexusApi.updateLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setLocationStatus('updated');
          setTimeout(() => setShowLocationPrompt(false), 1500);
        } catch (e) {
          console.error('Failed to update coordinates:', e);
          setLocationStatus('error');
          setTimeout(() => setShowLocationPrompt(false), 2000);
        }
      },
      (err) => {
        console.warn('Geolocation denied/unavailable:', err);
        setLocationStatus('error');
        setTimeout(() => setShowLocationPrompt(false), 1500);
      }
    );
  };

  const handleDownloadCard = () => {
    if (idCardData?.svg) {
      const blob = new Blob([idCardData.svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `VKC-Pass-${liveData.uid}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      window.open(NexusApi.getDownloadCardUrl(), '_blank');
    }
  };

  const handleShareWhatsApp = () => {
    if (idCardData?.whatsappShareLink) {
      window.open(idCardData.whatsappShareLink, '_blank');
    } else {
      const verifyUrl = `${window.location.origin}/verify/${liveData.uid}`;
      const shareText = encodeURIComponent(
        `🏛️ *Vishwakarma Nexus Official Digital Pass*\n\n` +
        `Member Name: ${liveData.name}\n` +
        `Digital ID: ${liveData.uid}\n` +
        `Lineage: ${liveData.kula}\n\n` +
        `Verify my official community record:\n${verifyUrl}`
      );
      window.open(`https://wa.me/?text=${shareText}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 group">
      <SEO 
        title="Membership Portal" 
        description="Join the VKC global network and claim your Digital Artisan Identity card."
      />
      <ScrollToTop />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {errorMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="p-1 hover:bg-rose-100 rounded-lg">
              <X size={16} />
            </button>
          </div>
        )}

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
                  ? 'Your membership is active! Your official tamper-evident vector pass has been generated with zero cloud fees.'
                  : 'Complete the registration to generate your unique Artisan ID pass. Watch it update in real-time.'}
              </p>
            </motion.div>

            {/* Pass Preview or Vector SVG Display */}
            <div className="relative group/card">
               <div className="absolute -inset-4 bg-gradient-to-tr from-saffron-500/10 to-vermilion/10 blur-3xl rounded-[4rem] opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />
               
               {isRegistered && idCardData?.svg ? (
                 <div 
                   className="w-full max-w-[450px] aspect-[856/540] rounded-[2rem] overflow-hidden shadow-2xl border border-stone-800"
                   dangerouslySetInnerHTML={{ __html: idCardData.svg }}
                 />
               ) : (
                 <MembershipCard memberData={{
                   name: liveData.name || "Your Name Here",
                   uid: liveData.uid,
                   category: liveData.kula ? liveData.kula.split(' (')[0] : "Traditional Trade",
                   joinDate: liveData.joinDate
                 }} />
               )}

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
               <div className="flex flex-wrap gap-4 w-full max-w-md pt-4">
                  <button 
                    onClick={handleDownloadCard}
                    className="flex-1 min-w-[160px] flex items-center justify-center gap-3 bg-stone-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-vermilion transition-all active:scale-95 text-[10px] uppercase tracking-widest cursor-pointer"
                  >
                    <Download size={18} />
                    Download Pass
                  </button>
                  <button 
                    onClick={handleShareWhatsApp}
                    className="flex-1 min-w-[160px] flex items-center justify-center gap-3 bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95 text-[10px] uppercase tracking-widest cursor-pointer"
                  >
                    <Share2 size={18} />
                    Share WhatsApp
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
                    isLoading={isLoading}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-12"
                >
                  <div className="bg-emerald-50 rounded-[3rem] p-10 md:p-14 border border-emerald-100 text-center space-y-6">
                     <div className="w-20 h-20 bg-white text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/10 rotate-3">
                        <Shield size={40} />
                     </div>
                     <div className="space-y-2">
                        <h2 className="text-3xl font-black text-stone-900 font-display uppercase tracking-tight">Registration Complete</h2>
                        <p className="text-emerald-700 font-bold text-sm">
                          Jai Vishwakarma! Your Digital Artisan Pass ({liveData.uid}) is officially active.
                        </p>
                     </div>
                     <div className="pt-2">
                        <a 
                          href={`/verify/${liveData.uid}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-vermilion underline underline-offset-4"
                        >
                          View Public Verification Certificate <ArrowRight size={14} />
                        </a>
                     </div>
                  </div>

                  <div className="grid gap-6">
                     <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest text-center">Community Network Access</h4>
                     <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { title: 'Artisan Directory', desc: 'Your craft and district chapter are now indexed.', icon: <Sparkles size={18} /> },
                          { title: 'PM Vishwakarma', desc: 'Access toolkits, collateral-free credit, & schemes.', icon: <CheckCircle2 size={18} /> }
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

      {/* Progressive Location Modal (Optional refinement) */}
      <AnimatePresence>
        {showLocationPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6 relative border border-stone-100"
            >
              <button 
                onClick={() => setShowLocationPrompt(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-stone-700"
              >
                <X size={20} />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-vermilion/10 text-vermilion flex items-center justify-center">
                <MapPin size={28} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-stone-900">Pinpoint Your Artisan Workshop</h3>
                <p className="text-stone-500 text-xs leading-relaxed">
                  Would you like to share your GPS coordinates? This helps community members and clients find your workshop on the regional artisan map.
                </p>
              </div>

              {locationStatus === 'updated' && (
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} /> Location successfully recorded!
                </div>
              )}

              {locationStatus === 'error' && (
                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold">
                  Location could not be retrieved. District/Mandal mapping was preserved.
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowLocationPrompt(false)}
                  className="flex-1 py-4 rounded-2xl border border-stone-200 text-stone-500 font-black text-xs uppercase tracking-wider hover:bg-stone-50"
                >
                  Skip for Now
                </button>
                <button
                  disabled={locationStatus === 'updating'}
                  onClick={handleAllowLocation}
                  className="flex-1 py-4 rounded-2xl bg-vermilion text-white font-black text-xs uppercase tracking-wider hover:bg-vermilion/90 shadow-lg shadow-vermilion/20 flex items-center justify-center gap-2"
                >
                  {locationStatus === 'updating' ? 'Saving...' : 'Allow GPS'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
