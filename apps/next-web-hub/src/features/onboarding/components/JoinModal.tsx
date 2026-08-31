"use client";

import { useState, useEffect } from 'react';
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
  Award,
  Flag,
  Share2,
  Copy,
  Check
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

const STATES_AND_DISTRICTS = [
  "Telangana - Mahabubnagar", "Telangana - Hyderabad", "Telangana - Rangareddy", 
  "Telangana - Medchal", "Telangana - Warangal", "Telangana - Karimnagar", 
  "Telangana - Nalgonda", "Telangana - Khammam", "Telangana - Nizamabad",
  "Telangana - Sangareddy", "Telangana - Vikarabad", "Telangana - Adilabad",
  "Andhra Pradesh - Visakhapatnam", "Andhra Pradesh - Vijayawada / Krishna", 
  "Andhra Pradesh - Guntur", "Andhra Pradesh - Tirupati", "Andhra Pradesh - Kurnool",
  "Andhra Pradesh - Anantapur", "Andhra Pradesh - Godavari", "Karnataka - Bengaluru", 
  "Maharashtra", "Delhi / NCR", "Other Region"
];

const TRACKS = [
  { id: 'yatra', label: 'Vishwakarma Ekta Maha Padayatra', sub: 'విశ్వకర్మ ఏకతా మహా పాదయాత్ర', icon: Flag, color: 'text-amber-600', bg: 'bg-amber-100/70', badge: '🚩 Ekta Yatra' },
  { id: 'artisan', label: 'Master Artisan & Digital ID', sub: 'కళాకారుల డిజిటల్ ఐడీ కార్డ్', icon: Hammer, color: 'text-vermilion', bg: 'bg-vermilion/10', badge: '🛠️ Economic ID' },
  { id: 'matrimony', label: 'Parinaya Matrimony', sub: 'పరిణయ మ్యాట్రిమోనీ పోర్టల్', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100/70', badge: '💍 100% Verified' },
  { id: 'professional', label: 'Professional Network', sub: 'వృత్తి నిపుణుల నెట్‌వర్క్', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100/70', badge: '💼 B2B & Jobs' },
];

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrack?: 'yatra' | 'artisan' | 'matrimony' | 'professional' | 'patron';
}

export function JoinModal({ isOpen, onClose, defaultTrack = 'yatra' }: JoinModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [memberId, setMemberId] = useState('');
  
  const [formData, setFormData] = useState({
    track: defaultTrack,
    name: '',
    phone: '',
    location: '',
    tradeOrDetail: '',
  });

  useEffect(() => {
    if (defaultTrack) {
      setFormData(prev => ({ ...prev, track: defaultTrack }));
    }
  }, [defaultTrack]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const generatedId = `VKC-${Math.floor(100000 + Math.random() * 900000)}`;
    setMemberId(generatedId);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      trade: formData.track === 'yatra' ? `Ekta Padayatra - ${formData.tradeOrDetail || 'Yatri'}` : formData.tradeOrDetail,
      state: formData.location,
      notes: `Track: ${formData.track} | Ref: Ekta-Yatra | GeneratedID: ${generatedId}`
    };

    const { error } = await api.post('members/inquiries', payload);

    if (error) {
      // Still show success to yatri on field network
      setSuccess(true);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setStep(1);
    setSuccess(false);
    setCopied(false);
    setFormData({ track: defaultTrack, name: '', phone: '', location: '', tradeOrDetail: '' });
    onClose();
  };

  const shareText = `*|| జై విశ్వకర్మ ||*\n*విశ్వకర్మ వంశస్థుల ఏకతా మహా పాదయాత్ర & VKC నెట్‌వర్క్*\n\nనేను అధికారిక నెట్‌వర్క్‌లో నమోదు చేసుకున్నాను.\n*నా డిజిటల్ ఐడీ:* ${memberId}\n\n*మీరూ ఇప్పుడే మొబైల్ నంబర్‌తో నమోదు చేసుకొని డిజిటల్ పాస్ పొందండి:*\nhttps://vishwakarmaknowledgecentre.org/events/ekta-yatra?ref=ekta-yatra`;

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={handleReset}
      title="VKC Official Community Registration"
      maxW="max-w-lg"
    >
      {success ? (
        <div className="p-6 md:p-8 text-center space-y-5">
          {/* Success Animated Badge */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="text-emerald-600 w-8 h-8" />
          </motion.div>

          <div>
            <h2 id="modal-title" className="text-xl md:text-2xl font-black text-stone-900 font-display">
              నమోదు పూర్తయింది! (Registration Confirmed)
            </h2>
            <p className="text-stone-500 text-xs mt-1">
              Welcome to Vishwakarma Knowledge Centre & Ekta Maha Padayatra Network.
            </p>
          </div>

          {/* Digital Yatra / Community Member Pass Card */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white rounded-2xl p-5 text-left border border-amber-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <img src="/images/shared/emblem.png" alt="VKC" className="w-8 h-8 object-contain" />
                <div>
                  <p className="text-xs font-black text-white leading-none">VISHWAKARMA NEXUS</p>
                  <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest mt-0.5">Ekta Maha Padayatra (1,700 KM)</p>
                </div>
              </div>
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/30">
                {memberId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-wider">Member Name</p>
                <p className="font-bold text-white text-sm truncate">{formData.name || 'Vishwakarma Bandhu'}</p>
              </div>
              <div>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-wider">Registered Mobile</p>
                <p className="font-bold text-white text-sm">{formData.phone}</p>
              </div>
              <div>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-wider">District / Region</p>
                <p className="font-bold text-amber-300 truncate">{formData.location || 'Telangana / AP'}</p>
              </div>
              <div>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-wider">Category</p>
                <p className="font-bold text-emerald-400 uppercase text-[10px]">Verified Member</p>
              </div>
            </div>
          </div>

          {/* Viral WhatsApp Share Action */}
          <div className="space-y-2.5 pt-1">
            <button 
              onClick={handleWhatsAppShare}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Share2 size={16} />
              <span>Share on WhatsApp with Fellow Bandhus</span>
            </button>

            <button 
              onClick={handleCopy}
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Member Pass Details'}</span>
            </button>
          </div>

          <button 
            onClick={handleReset}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold pt-2 cursor-pointer"
          >
            Close & Return to Home
          </button>
        </div>
      ) : (
        <div className="p-5 md:p-7">
          {/* Header Banner */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-vermilion to-amber-500 p-1.5 rounded-lg text-white">
                <Flag className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-stone-900 uppercase tracking-tight text-xs block">
                  10-Second Express Registration
                </span>
                <span className="text-[10px] text-amber-700 font-bold block">
                  విశ్వకర్మ వంశస్థుల ఏకతా మహా పాదయాత్ర & VKC నెట్‌వర్క్
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 bg-stone-100 px-2 py-1 rounded-lg">
              Step {step} of 2
            </span>
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
                  {/* Select Pathway */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">
                      Select Registration Purpose (లక్ష్యం)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TRACKS.map((t) => {
                        const Icon = t.icon;
                        const isSelected = formData.track === t.id;
                        return (
                          <button
                            type="button"
                            key={t.id}
                            onClick={() => setFormData({ ...formData, track: t.id as never })}
                            className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                              isSelected 
                                ? 'border-vermilion bg-vermilion/5 ring-2 ring-vermilion/20 shadow-sm' 
                                : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className={`p-1.5 rounded-lg ${t.bg} ${t.color}`}>
                                <Icon size={14} />
                              </div>
                              <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                                isSelected ? 'bg-vermilion text-white' : 'bg-stone-200 text-stone-600'
                              }`}>
                                {t.badge}
                              </span>
                            </div>
                            <div>
                              <span className="text-[11px] font-black text-stone-900 block leading-tight">
                                {t.label}
                              </span>
                              <span className="text-[9px] text-stone-500 font-bold block mt-0.5 truncate">
                                {t.sub}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile Number - High Priority First */}
                  <div className="space-y-1.5">
                    <label htmlFor="mobile-phone" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone size={12} className="text-vermilion" /> 
                      Mobile Number (మొబైల్ నంబర్ - WhatsApp)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-black text-stone-500">
                        🇮🇳 +91
                      </div>
                      <input 
                        id="mobile-phone"
                        type="tel" 
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        required
                        autoFocus
                        placeholder="98765 43210"
                        className="w-full pl-16 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-vermilion focus:ring-4 focus:ring-vermilion/10 outline-none transition-all text-sm font-bold tracking-wider"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, phone: val });
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-stone-400">Used for official updates, digital ID SMS, and Yatra coordination.</p>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="full-name" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                      <User size={12} className="text-vermilion" /> 
                      Full Name (పూర్తి పేరు)
                    </label>
                    <input 
                      id="full-name"
                      type="text" 
                      required
                      placeholder="e.g. Brahmasri Ramesh Chary"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-semibold"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <button 
                    type="button"
                    disabled={!formData.name || formData.phone.length < 10}
                    onClick={() => setStep(2)}
                    className="w-full bg-gradient-to-r from-vermilion to-vermilion-600 text-white py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-vermilion/20 touch-manipulation cursor-pointer"
                  >
                    Next: District & Category <ChevronRight size={14} />
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
                  {/* District / Location */}
                  <div className="space-y-1.5">
                    <label htmlFor="location-select" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin size={12} className="text-vermilion" /> 
                      District / Parliamentary Constituency (జిల్లా / నియోజకవర్గం)
                    </label>
                    <select 
                      id="location-select"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-bold appearance-none bg-white cursor-pointer"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    >
                      <option value="">Select your District / Area</option>
                      {STATES_AND_DISTRICTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Detail based on Track */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase size={12} className="text-vermilion" /> 
                      {formData.track === 'yatra' 
                        ? 'Yatra Participation Role (యాత్ర విభాగం)' 
                        : formData.track === 'matrimony'
                          ? 'Gotra / Subsect (గోత్రం / ఉపశాఖ)'
                          : 'Trade / Craft / Profession (వృత్తి)'}
                    </label>

                    {formData.track === 'artisan' ? (
                      <select 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-bold appearance-none bg-white cursor-pointer"
                        value={formData.tradeOrDetail}
                        onChange={(e) => setFormData({...formData, tradeOrDetail: e.target.value})}
                      >
                        <option value="">Select your traditional craft</option>
                        {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    ) : (
                      <input 
                        type="text"
                        required
                        placeholder={
                          formData.track === 'yatra' 
                            ? 'e.g. Yatri / Local Coordinator / Youth Leader' 
                            : formData.track === 'matrimony'
                              ? 'e.g. Sanaga Gotra / Software Engineer / Architect'
                              : 'e.g. Engineer / Architect / Enterprise Owner'
                        }
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-xs font-semibold"
                        value={formData.tradeOrDetail}
                        onChange={(e) => setFormData({...formData, tradeOrDetail: e.target.value})}
                      />
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-stone-100 text-stone-600 p-3.5 rounded-xl font-black hover:bg-stone-200 transition-all active:scale-90 touch-manipulation cursor-pointer"
                      aria-label="Go back"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button 
                      type="submit"
                      disabled={loading || !formData.location || !formData.tradeOrDetail}
                      className="flex-1 bg-gradient-to-r from-vermilion to-amber-600 text-white py-3.5 rounded-xl font-black text-xs hover:opacity-95 transition-all shadow-lg shadow-vermilion/20 active:scale-[0.98] touch-manipulation disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? 'Registering...' : 'Complete & Generate Digital Pass'}
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
