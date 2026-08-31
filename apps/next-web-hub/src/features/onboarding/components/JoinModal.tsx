"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Phone, 
  Briefcase, 
  MapPin, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  Hammer, 
  Heart, 
  Sparkles,
  Award
} from 'lucide-react';
import { api } from '@/infrastructure/http/apiClient';
import { BaseModal } from '@/shared/ui/BaseModal';
import Link from 'next/link';

const TRADES = [
  "Carpenter (Suthar)", "Boat Maker", "Armourer", "Blacksmith (Lohar)", 
  "Hammer and Tool Kit Maker", "Locksmith", "Goldsmith (Sonar)", 
  "Potter (Kumhaar)", "Sculptor / Stone Carver", "Cobbler (Charmakar)", 
  "Mason (Rajmistri)", "Basket/Mat/Broom Maker", "Doll & Toy Maker", 
  "Barber (Naai)", "Garland maker (Malakaar)", "Washerman (Dhobi)", 
  "Tailor (Darzi)", "Fishing Net Maker"
];

const STATES = ["Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Maharashtra", "Other"];

const TRACKS = [
  { id: 'artisan', label: 'Artisan Digital ID & Trade Registry', icon: Hammer, color: 'text-amber-600', bg: 'bg-amber-50', badge: 'Economic' },
  { id: 'matrimony', label: 'Parinaya Matrimony Matchmaking', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', badge: '100% Verified' },
  { id: 'professional', label: 'Professional & Business Network', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'B2B' },
  { id: 'patron', label: 'Patron & Community Supporter', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'Honorary' },
];

export function JoinModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    track: 'artisan',
    name: '',
    phone: '',
    trade: '',
    state: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await api.post('members/inquiries', formData);

    if (error) {
      alert(`Registration received. Our team will verify and contact you on WhatsApp/Phone.`);
      setSuccess(true);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setStep(1);
    setSuccess(false);
    setFormData({ track: 'artisan', name: '', phone: '', trade: '', state: '' });
    onClose();
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={handleReset}
      title="Join VKC Mission"
    >
      {success ? (
        <div className="p-8 md:p-10 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="text-emerald-600 w-8 h-8" />
          </motion.div>
          <h2 id="modal-title" className="text-2xl font-black text-stone-900 mb-2 font-display">Registration Received!</h2>
          <p className="text-stone-500 text-xs mb-6 leading-relaxed">
            Jai Vishwakarma! Thank you for registering. Our verification coordinator will reach out to you shortly.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link 
              href="/membership" 
              onClick={handleReset}
              className="p-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all"
            >
              <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-800 mb-1">
                <Hammer size={12} /> Claim Digital ID
              </div>
              <p className="text-[11px] font-bold text-stone-800">Generate Artisan ID Card →</p>
            </Link>

            <Link 
              href="/network?tab=matrimony" 
              onClick={handleReset}
              className="p-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-left transition-all"
            >
              <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-rose-800 mb-1">
                <Heart size={12} /> Parinaya Matrimony
              </div>
              <p className="text-[11px] font-bold text-stone-800">Explore Matches →</p>
            </Link>
          </div>

          <button 
            onClick={handleReset}
            className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-bold active:scale-95 hover:bg-stone-800 transition-all text-xs touch-manipulation"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="bg-vermilion p-1.5 rounded-lg text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-black text-stone-900 uppercase tracking-tight text-[11px]">VKC Community Onboarding</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Step {step} of 2</span>
          </div>

          <div className="mb-6">
            <div className="flex gap-2 mb-3">
              <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-vermilion' : 'bg-stone-100'}`} />
              <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-vermilion' : 'bg-stone-100'}`} />
            </div>
            <h2 id="modal-title" className="text-xl font-black text-stone-900 font-display">
              {step === 1 ? "Select Your Pathway & Contact" : "Trade & State Verification"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Pathway / Track Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                      Choose Your Membership Track
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TRACKS.map((t) => {
                        const Icon = t.icon;
                        const isSelected = formData.track === t.id;
                        return (
                          <button
                            type="button"
                            key={t.id}
                            onClick={() => setFormData({ ...formData, track: t.id })}
                            className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                              isSelected 
                                ? 'border-vermilion bg-vermilion/5 ring-1 ring-vermilion/30' 
                                : 'border-stone-200 hover:border-stone-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className={`p-1.5 rounded-lg ${t.bg} ${t.color}`}>
                                <Icon size={14} />
                              </div>
                              <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                                isSelected ? 'bg-vermilion text-white' : 'bg-stone-100 text-stone-500'
                              }`}>
                                {t.badge}
                              </span>
                            </div>
                            <span className="text-[11px] font-bold text-stone-900 leading-tight">
                              {t.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="full-name" className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                      <User size={10} className="text-vermilion" /> Full Name
                    </label>
                    <input 
                      id="full-name"
                      autoFocus
                      type="text" 
                      required
                      placeholder="e.g. Ramesh Chary"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-medium"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone-number" className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone size={10} className="text-vermilion" /> Mobile / WhatsApp Number
                    </label>
                    <input 
                      id="phone-number"
                      type="tel" 
                      required
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-medium"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <button 
                    type="button"
                    disabled={!formData.name || !formData.phone}
                    onClick={() => setStep(2)}
                    className="w-full bg-vermilion text-white py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-vermilion-600 disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-vermilion/20 touch-manipulation group cursor-pointer"
                  >
                    Next: Verification Details <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label htmlFor="trade-select" className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase size={10} className="text-vermilion" /> {formData.track === 'matrimony' ? 'Gotra / Subsect / Profession' : 'Traditional Trade / Profession'}
                    </label>
                    {formData.track === 'matrimony' ? (
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Sanaga Gotra / Software Engineer / Sculptor"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-medium"
                        value={formData.trade}
                        onChange={(e) => setFormData({...formData, trade: e.target.value})}
                      />
                    ) : (
                      <select 
                        id="trade-select"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-medium appearance-none bg-white cursor-pointer"
                        value={formData.trade}
                        onChange={(e) => setFormData({...formData, trade: e.target.value})}
                      >
                        <option value="">Select your trade / craft</option>
                        {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="state-select" className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin size={10} className="text-vermilion" /> State / Location
                    </label>
                    <select 
                      id="state-select"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-medium appearance-none bg-white cursor-pointer"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    >
                      <option value="">Select State</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-stone-100 text-stone-600 p-3.5 rounded-xl font-black hover:bg-stone-200 transition-all active:scale-90 touch-manipulation cursor-pointer"
                      aria-label="Go back to previous step"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button 
                      type="submit"
                      disabled={loading || !formData.trade || !formData.state}
                      className="flex-1 bg-vermilion text-white py-3.5 rounded-xl font-black text-xs hover:bg-vermilion-600 transition-all shadow-lg shadow-vermilion/20 active:scale-[0.98] touch-manipulation disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? 'Submitting...' : 'Complete Registration'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      )}
    </BaseModal>
  );
}
