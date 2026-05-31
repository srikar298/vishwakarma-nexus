import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Briefcase, Camera, ArrowRight, ArrowLeft, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';

interface RegistrationFormProps {
  onUpdate: (data: any) => void;
  onComplete: () => void;
}

export const RegistrationForm = ({ onUpdate, onComplete }: RegistrationFormProps) => {
  const [step, setStep] = useState(1);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    profession: '',
    kula: '',
    experience: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    onUpdate(newData);
  };

  const steps = [
    { title: 'Personal', icon: <User size={16} /> },
    { title: 'Trade', icon: <Briefcase size={16} /> },
    { title: 'Verify', icon: <MapPin size={16} /> },
    { title: 'Fee', icon: <CreditCard size={16} /> }
  ];

  const handleSimulatedPayment = () => {
    setIsSimulatingPayment(true);
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl border border-stone-100 relative overflow-hidden">
      {/* Step Indicator Labels */}
      <div className="flex justify-between items-center mb-8 px-2">
         <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
           Step {step} of 4
         </span>
         <span className="text-[10px] font-black text-vermilion uppercase tracking-widest">
           {steps[step - 1].title}
         </span>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between mb-12 relative">
         <div className="absolute top-1/2 left-0 w-full h-[2px] bg-stone-100 -translate-y-1/2 z-0" />
         <div 
           className="absolute top-1/2 left-0 h-[2px] bg-vermilion -translate-y-1/2 z-0 transition-all duration-500"
           style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
         />
         {steps.map((s, i) => (
           <div key={i} className={`relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
             step > i + 1 ? 'bg-vermilion border-vermilion text-white' : 
             step === i + 1 ? 'bg-white border-vermilion text-vermilion shadow-lg shadow-vermilion/20' : 
             'bg-white border-stone-200 text-stone-300'
           }`}>
             {step > i + 1 ? <CheckCircle size={14} /> : <span className="scale-75 md:scale-90">{s.icon}</span>}
           </div>
         ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           className="space-y-8"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900">Personal Details</h3>
                <p className="text-stone-500 text-sm">Watch your card update on the left as you type.</p>
              </div>
              <div className="grid gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Full Name</label>
                   <input 
                     type="text" 
                     name="name"
                     value={formData.name}
                     onChange={handleInputChange}
                     placeholder="e.g. Sri Bhaskar Chary"
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Phone Number</label>
                   <input 
                     type="tel" 
                     name="phone"
                     value={formData.phone}
                     onChange={handleInputChange}
                     placeholder="+91 98480 XXXXX"
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium"
                   />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900">Profession & Kula</h3>
                <p className="text-stone-500 text-sm">Select your branch of the 5-original clans.</p>
              </div>
              <div className="grid gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Pancha-Kula Branch</label>
                   <select 
                     name="kula"
                     value={formData.kula}
                     onChange={handleInputChange}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium appearance-none"
                   >
                      <option value="">Select Branch</option>
                      <option value="Manus (Blacksmith)">Manus (Blacksmith)</option>
                      <option value="Maya (Carpenter)">Maya (Carpenter)</option>
                      <option value="Thwashta (Metalworker)">Thwashta (Metalworker)</option>
                      <option value="Shilpi (Sculptor)">Shilpi (Sculptor)</option>
                      <option value="Vishwajna (Goldsmith)">Vishwajna (Goldsmith)</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Specialization</label>
                   <input 
                     type="text" 
                     name="profession"
                     value={formData.profession}
                     onChange={handleInputChange}
                     placeholder="e.g. Traditional Temple Architecture"
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium"
                   />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900">Lineage Verification</h3>
                <p className="text-stone-500 text-sm">Your Digital ID requires geographic verification.</p>
              </div>
              <div className="grid gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Location (Village/District)</label>
                   <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input 
                        type="text" 
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Warangal Rural, TS"
                        className="w-full h-14 pl-14 pr-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium"
                      />
                   </div>
                </div>
                <div className="p-6 bg-saffron-50 rounded-3xl border border-saffron-100 flex items-start gap-4">
                   <ShieldCheck className="text-saffron-600 shrink-0 mt-1" size={20} />
                   <p className="text-stone-700 text-xs leading-relaxed font-medium italic">
                     "Your identity is your heritage. We verify each member to maintain the sanctity of the Vishwakarma Nexus."
                   </p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900">Verification Fee</h3>
                <p className="text-stone-500 text-sm">One-time fee for physical toolkit support and registry maintenance.</p>
              </div>
              
              <div className="bg-stone-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-vermilion/20 blur-3xl rounded-full" />
                 <div className="relative z-10 flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Official Registration Fee</span>
                    <span className="text-2xl font-black text-turmeric">₹336.00</span>
                 </div>
                 <div className="space-y-4 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-emerald-400" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">Digital Registry Entry</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-emerald-400" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">Member ID Issuance</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-emerald-400" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">Govt. Scheme Assistance</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-3 justify-center text-stone-400">
                 <ShieldCheck size={14} className="text-stone-300" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Secure 256-bit Encrypted Payment</span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-4 mt-12 pt-8 border-t border-stone-100">
        {!isSimulatingPayment && (
          <>
            {step > 1 && (
              <button 
                onClick={prevStep}
                className="flex-1 h-16 rounded-2xl border-2 border-stone-100 text-stone-400 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-stone-50 transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button 
              disabled={step === 1 && (!formData.name || !formData.phone)}
              onClick={step === 4 ? handleSimulatedPayment : nextStep}
              className="flex-[2] h-16 rounded-2xl bg-stone-900 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-vermilion transition-all shadow-xl shadow-stone-900/10 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {step === 4 ? 'Pay & Issue ID' : 'Continue'} <ArrowRight size={16} />
            </button>
          </>
        )}

        {isSimulatingPayment && (
          <div className="w-full h-16 rounded-2xl bg-stone-100 flex items-center justify-center gap-4 px-8 overflow-hidden relative">
             <motion.div 
               initial={{ x: '-100%' }}
               animate={{ x: '100%' }}
               transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
               className="absolute inset-0 bg-gradient-to-r from-transparent via-vermilion/5 to-transparent"
             />
             <div className="w-4 h-4 border-2 border-vermilion border-t-transparent rounded-full animate-spin" />
             <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">Processing Secure Payment...</span>
          </div>
        )}
      </div>
    </div>
  );
};
