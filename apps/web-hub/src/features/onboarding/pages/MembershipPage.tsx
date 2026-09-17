import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Download, Share2, Sparkles, ArrowRight, MapPin, CheckCircle2, X, LogIn, LogOut, KeyRound } from 'lucide-react';
import { MembershipCard } from '../components/MembershipCard';
import { RegistrationForm } from '../components/RegistrationForm';
import { SEO } from '@/shared/components/SEO';
import { ScrollToTop } from '@/shared/components/ScrollToTop';
import { NexusApi, type RegisterPayload } from '@/infrastructure/api/nexus-api';
import { useAuthStore } from '@/infrastructure/state/authStore';
import { useIdCard, useRegisterMutation, useLoginMutation } from '@/infrastructure/api/queries';

export const MembershipPage = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { data: idCardData, isLoading: isCardLoading, refetch: refetchIdCard } = useIdCard();
  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();

  const [errorMessage, setErrorMessage] = useState('');
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'updating' | 'updated' | 'error'>('idle');

  // Login Modal State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginMpin, setLoginMpin] = useState('');
  const [loginError, setLoginError] = useState('');

  const [liveData, setLiveData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : 'Your Name Here',
    phone: user?.phone || '',
    location: user ? `${user.district || 'Telangana'}, ${user.state || 'India'}` : 'Telangana, India',
    profession: user?.trade || 'Traditional Craft',
    kula: user?.kula || 'Artisan Heritage',
    uid: user?.digitalId || 'VKC-2026-DEMO',
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  });

  useEffect(() => {
    if (user) {
      setLiveData({
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone || '',
        location: `${user.district || 'Telangana'}, ${user.state || 'India'}`,
        profession: user.trade || 'Traditional Craft',
        kula: user.kula || 'Artisan Heritage',
        uid: user.digitalId || `VKC-2026-${user.publicId.slice(0, 6).toUpperCase()}`,
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
    }
  }, [user]);

  const handleLiveUpdate = (data: Record<string, string | number | boolean>) => {
    setLiveData(prev => ({ ...prev, ...data }));
  };

  const handleRegistrationComplete = async (payload: RegisterPayload) => {
    setErrorMessage('');

    try {
      const response = await registerMutation.mutateAsync(payload);
      
      const digitalId = response.profile?.digitalId || `VKC-2026-${response.user?.publicId.slice(0, 6).toUpperCase()}`;
      
      setLiveData(prev => ({
        ...prev,
        name: `${response.user.firstName} ${response.user.lastName}`,
        uid: digitalId,
        profession: response.profile.trade,
        kula: response.profile.kula,
        location: `${response.profile.district}, ${response.profile.state}`,
      }));

      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Prompt progressive location refinement after a brief delay
      setTimeout(() => {
        setShowLocationPrompt(true);
      }, 1200);

    } catch (err: any) {
      console.error('Registration failed:', err);
      const serverMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setErrorMessage(serverMsg);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginIdentifier.trim() || !loginMpin.trim()) {
      setLoginError('Please enter your registered Phone/Email and MPIN.');
      return;
    }

    try {
      await loginMutation.mutateAsync({
        identifier: loginIdentifier.trim(),
        mpin: loginMpin.trim(),
      });
      setShowLoginModal(false);
      setLoginIdentifier('');
      setLoginMpin('');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Invalid credentials. Please verify your phone and MPIN.';
      setLoginError(msg);
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
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-3 bg-vermilion/10 px-4 py-1.5 rounded-full text-vermilion">
                   <Shield size={16} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Digital Registry v2.0</span>
                </div>

                {!isAuthenticated ? (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="inline-flex items-center gap-2 bg-white border border-stone-200 hover:border-vermilion px-4 py-2 rounded-2xl text-xs font-black text-stone-700 shadow-xs hover:text-vermilion transition-all cursor-pointer"
                  >
                    <LogIn size={14} className="text-vermilion" />
                    Already Registered? Retrieve Pass
                  </button>
                ) : (
                  <button
                    onClick={() => logout()}
                    className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-stone-900 leading-tight font-display">
                {isAuthenticated ? 'Your Digital' : 'Claim Your'} <span className="text-vermilion underline decoration-vermilion/20 underline-offset-8">Identity</span>
              </h1>
              <p className="text-stone-600 text-lg font-medium leading-relaxed max-w-md">
                {isAuthenticated 
                  ? 'Your membership is active! Your official tamper-evident vector pass is displayed below with zero cloud fees.'
                  : 'Complete the registration to generate your unique Artisan ID pass. Watch it update in real-time.'}
              </p>
            </motion.div>

            {/* Pass Preview or Vector SVG Display */}
            <div className="relative group/card">
               <div className="absolute -inset-4 bg-gradient-to-tr from-saffron-500/10 to-vermilion/10 blur-3xl rounded-[4rem] opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />
               
               {isAuthenticated && idCardData?.svg ? (
                 <div 
                   className="w-full max-w-[450px] aspect-[856/540] rounded-[2rem] overflow-hidden shadow-2xl border border-stone-800"
                   dangerouslySetInnerHTML={{ __html: idCardData.svg }}
                 />
               ) : isAuthenticated && isCardLoading ? (
                 <div className="w-full max-w-[450px] aspect-[856/540] rounded-[2rem] bg-stone-900 flex flex-col items-center justify-center text-white space-y-4 shadow-2xl">
                   <div className="w-10 h-10 border-3 border-vermilion border-t-transparent rounded-full animate-spin" />
                   <span className="text-xs font-black uppercase tracking-widest text-stone-400">Rendering Vector Pass...</span>
                 </div>
               ) : (
                 <MembershipCard memberData={{
                   name: liveData.name || "Your Name Here",
                   uid: liveData.uid,
                   category: liveData.kula ? liveData.kula.split(' (')[0] : "Traditional Trade",
                   joinDate: liveData.joinDate
                 }} />
               )}

               {!isAuthenticated && (
                 <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-stone-900 text-white px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl rotate-12"
                 >
                   Live Preview
                 </motion.div>
               )}
            </div>

            {isAuthenticated && (
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
              {!isAuthenticated ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <RegistrationForm 
                    onUpdate={handleLiveUpdate}
                    onComplete={handleRegistrationComplete} 
                    isLoading={registerMutation.isPending}
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
                        <h2 className="text-3xl font-black text-stone-900 font-display uppercase tracking-tight">Active Membership</h2>
                        <p className="text-emerald-700 font-bold text-sm">
                          Jai Vishwakarma! Your Digital Artisan Pass ({liveData.uid}) is verified.
                        </p>
                     </div>
                     <div className="pt-2 flex flex-col items-center gap-3">
                        <a 
                          href={`/verify/${liveData.uid}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-vermilion underline underline-offset-4"
                        >
                          View Public Verification Certificate <ArrowRight size={14} />
                        </a>
                        <button
                          onClick={() => logout()}
                          className="text-xs font-black text-vermilion hover:underline cursor-pointer pt-2"
                        >
                          Register another community member &rarr;
                        </button>
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

      {/* Retrieve ID Pass Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl space-y-6 relative border border-stone-100"
            >
              <button
                onClick={() => { setShowLoginModal(false); setLoginError(''); }}
                className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-vermilion/10 text-vermilion flex items-center justify-center">
                <KeyRound size={28} />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-stone-900 font-display">Retrieve Digital Pass</h3>
                <p className="text-stone-500 text-xs">Enter your registered Phone Number and MPIN to view or download your ID card.</p>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">Phone Number / Email</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98480 12345"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-vermilion focus:border-vermilion font-medium text-stone-900 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">Security MPIN (4 or 6 Digits)</label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    placeholder="••••"
                    value={loginMpin}
                    onChange={(e) => setLoginMpin(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-12 px-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-vermilion focus:border-vermilion font-mono text-stone-900 text-sm tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-12 bg-vermilion hover:bg-vermilion/90 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-vermilion/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loginMutation.isPending ? 'Verifying...' : 'Sign In & Show Pass'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
