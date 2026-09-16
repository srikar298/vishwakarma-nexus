import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Hammer, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { SEO } from '@/shared/components/SEO';
import { NexusApi, type VerificationData } from '@/infrastructure/api/nexus-api';

export const VerifyIdPage = () => {
  const { digitalId } = useParams<{ digitalId: string }>();
  const [data, setData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!digitalId) {
      setError('No Digital ID provided in URL');
      setIsLoading(false);
      return;
    }

    const fetchVerification = async () => {
      setIsLoading(true);
      setError('');
      try {
        const result = await NexusApi.verifyDigitalId(digitalId);
        setData(result);
      } catch (err: any) {
        console.error('Verification failed:', err);
        setError(err.response?.data?.message || 'Digital ID not found or could not be verified.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerification();
  }, [digitalId]);

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 pt-32 pb-24 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      <SEO 
        title={data ? `Verified: ${data.digitalId} | VKC Registry` : 'Verify Artisan Identity'} 
        description="Official public verification record for Vishwakarma Nexus community membership."
      />

      {/* Decorative Sacred Geometry background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-vermilion/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full relative z-10 space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
            <Hammer size={14} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
              Vishwakarma Nexus Official Registry
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight text-white">
            Artisan Identity Verification
          </h1>
        </div>

        {/* State 1: Loading */}
        {isLoading && (
          <div className="bg-stone-800/80 backdrop-blur-md rounded-[2.5rem] p-12 border border-stone-700 text-center space-y-6">
            <div className="w-12 h-12 border-4 border-vermilion border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-stone-300">Querying cryptographic community registry...</p>
          </div>
        )}

        {/* State 2: Error / Invalid */}
        {!isLoading && error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-stone-800/90 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 border border-rose-500/30 text-center space-y-6 shadow-2xl"
          >
            <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-3xl flex items-center justify-center mx-auto border border-rose-500/20">
              <ShieldAlert size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">Record Unverified</h2>
              <p className="text-stone-400 text-xs leading-relaxed max-w-sm mx-auto">
                {error}
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/membership"
                className="inline-flex items-center gap-3 bg-stone-700 hover:bg-stone-600 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Claim Official Pass <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* State 3: Verified Authentic Card */}
        {!isLoading && data && data.isAuthentic && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-stone-800/90 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 border border-emerald-500/30 shadow-2xl space-y-8 relative overflow-hidden"
          >
            {/* Top Verified Ribbon */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={12} /> Authentic Community Pass
                  </div>
                  <div className="text-xl font-black font-mono text-white tracking-wider">
                    {data.digitalId}
                  </div>
                </div>
              </div>

              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-500/20">
                Active Member
              </span>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Artisan Name</span>
                <p className="font-bold text-base text-white">{data.name}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Heritage Lineage</span>
                <p className="font-bold text-amber-300">{data.kula}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Primary Craft / Trade</span>
                <p className="font-bold text-stone-200">{data.trade}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">District Chapter</span>
                <p className="font-bold text-stone-200 flex items-center gap-1.5">
                  <MapPin size={12} className="text-vermilion" /> {data.district}, {data.state}
                </p>
              </div>

              {data.assemblyConstituency && (
                <div className="space-y-1 sm:col-span-2 bg-stone-900/60 p-4 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Constituency Chapter</span>
                  <p className="font-bold text-stone-300 text-xs">
                    Assembly: <span className="text-white">{data.assemblyConstituency}</span> | Parliamentary: <span className="text-white">{data.parliamentaryConstituency}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Verification Footer */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-stone-400 font-medium">
              <span>Timestamp: {new Date(data.verificationTimestamp).toLocaleString('en-IN')}</span>
              <span className="text-stone-300 font-bold">Issued by VKC Digital Identity Authority</span>
            </div>
          </motion.div>
        )}

        {/* Onboarding Call to Action */}
        <div className="bg-stone-800/40 rounded-3xl p-6 border border-white/5 text-center space-y-3">
          <p className="text-xs text-stone-300 font-medium">
            Are you a member of the Vishwakarma community? Claim your digital artisan identity pass today.
          </p>
          <Link
            to="/membership"
            className="inline-flex items-center gap-3 bg-vermilion hover:bg-vermilion/90 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-vermilion/20"
          >
            Register Your Identity <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
};
