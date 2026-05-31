import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Phone, 
  Briefcase, 
  MapPin, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle2,
  Hammer
} from 'lucide-react';
import { supabase } from '@/infrastructure/config/supabaseClient';

const TRADES = [
  "Carpenter (Suthar)", "Boat Maker", "Armourer", "Blacksmith (Lohar)", 
  "Hammer and Tool Kit Maker", "Locksmith", "Goldsmith (Sonar)", 
  "Potter (Kumhaar)", "Sculptor / Stone Carver", "Cobbler (Charmakar)", 
  "Mason (Rajmistri)", "Basket/Mat/Broom Maker", "Doll & Toy Maker", 
  "Barber (Naai)", "Garland maker (Malakaar)", "Washerman (Dhobi)", 
  "Tailor (Darzi)", "Fishing Net Maker"
];

const STATES = ["Andhra Pradesh", "Telangana"];

export function JoinModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    trade: '',
    state: ''
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus management & Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small delay to allow animation to start
      setTimeout(() => firstInputRef.current?.focus(), 100);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  // Focus Trap Logic
  const handleTabKey = (e: React.KeyboardEvent) => {
    if (!modalRef.current) return;
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from('inquiries')
      .insert([formData]);

    if (error) {
      alert("Error submitting registration: " + error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onKeyDown={handleTabKey}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-stone-100"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors z-10 bg-stone-50 rounded-full border border-stone-100 shadow-md cursor-pointer hover:scale-105 active:scale-90"
              aria-label="Close Modal"
            >
              <X size={18} />
            </button>

            {success ? (
              <div className="p-8 md:p-10 text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-16 h-16 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="text-saffron-600 w-8 h-8" />
                </motion.div>
                <h2 id="modal-title" className="text-2xl font-black text-stone-900 mb-3 font-display">Registration Received!</h2>
                <p className="text-stone-500 text-xs mb-6 leading-relaxed">
                  Jai Vishwakarma! Thank you for joining the mission. Our local representative will contact you soon for further verification.
                </p>
                <button 
                  onClick={onClose}
                  className="w-full bg-saffron-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-saffron-600/20 active:scale-95 hover:bg-saffron-700 transition-all text-xs touch-manipulation"
                >
                  Back to Community
                </button>
              </div>
            ) : (
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="bg-saffron-600 p-1.5 rounded-lg">
                    <Hammer className="text-white w-4 h-4" />
                  </div>
                  <span className="font-black text-stone-900 uppercase tracking-tight text-[11px]">Mission Registration</span>
                </div>

                <div className="mb-6">
                  <div className="flex gap-2 mb-3">
                    <div className={`h-1 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-saffron-600' : 'bg-stone-100'}`} />
                    <div className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-saffron-600' : 'bg-stone-100'}`} />
                  </div>
                  <h2 id="modal-title" className="text-xl font-black text-stone-900 font-display">
                    {step === 1 ? "Basic Information" : "Trade & Location"}
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
                        <div className="space-y-1.5">
                           <label htmlFor="full-name" className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                              <User size={10} className="text-saffron-500" /> Full Name
                           </label>
                           <input 
                             id="full-name"
                             ref={firstInputRef}
                             type="text" 
                             required
                             placeholder="e.g. Ramesh Kumar"
                             className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-50/50 outline-none transition-all text-xs font-medium"
                             value={formData.name}
                             onChange={(e) => setFormData({...formData, name: e.target.value})}
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label htmlFor="phone-number" className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Phone size={10} className="text-saffron-500" /> Mobile Number
                           </label>
                           <input 
                             id="phone-number"
                             type="tel" 
                             required
                             placeholder="e.g. +91 98765 43210"
                             className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-50/50 outline-none transition-all text-xs font-medium"
                             value={formData.phone}
                             onChange={(e) => setFormData({...formData, phone: e.target.value})}
                           />
                        </div>
                        <button 
                          type="button"
                          disabled={!formData.name || !formData.phone}
                          onClick={() => setStep(2)}
                          className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-stone-800 disabled:opacity-50 transition-all active:scale-[0.98] touch-manipulation group"
                        >
                          Next Step <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
                              <Briefcase size={10} className="text-saffron-500" /> Traditional Trade
                           </label>
                           <select 
                             id="trade-select"
                             required
                             className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-50/50 outline-none transition-all text-xs font-medium appearance-none bg-white cursor-pointer"
                             value={formData.trade}
                             onChange={(e) => setFormData({...formData, trade: e.target.value})}
                           >
                             <option value="">Select your trade</option>
                             {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                           </select>
                        </div>
                        <div className="space-y-1.5">
                           <label htmlFor="state-select" className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                              <MapPin size={10} className="text-saffron-500" /> State
                           </label>
                           <select 
                             id="state-select"
                             required
                             className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-50/50 outline-none transition-all text-xs font-medium appearance-none bg-white cursor-pointer"
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
                            className="bg-stone-100 text-stone-500 p-3.5 rounded-xl font-black hover:bg-stone-200 transition-all active:scale-90 touch-manipulation"
                            aria-label="Go back to previous step"
                          >
                            <ArrowLeft size={18} />
                          </button>
                          <button 
                            type="submit"
                            disabled={loading || !formData.trade || !formData.state}
                            className="flex-1 bg-saffron-600 text-white py-3.5 rounded-xl font-black text-xs hover:bg-saffron-700 transition-all shadow-lg shadow-saffron-600/20 active:scale-[0.98] touch-manipulation disabled:opacity-50"
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
