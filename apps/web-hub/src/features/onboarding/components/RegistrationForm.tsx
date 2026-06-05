import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Briefcase, ArrowRight, ArrowLeft, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';

interface RegistrationFormProps {
  onUpdate: (data: Record<string, string | number | boolean>) => void;
  onComplete: () => void;
}

export const RegistrationForm = ({ onUpdate, onComplete }: RegistrationFormProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    dob: '',
    age: '',
    bloodGroup: '',
    aadhaar: '',
    kula: '',
    profession: '',
    houseStreet: '',
    constituency: '',
    mandalDistrict: '',
    phone: '',
    nomineeName: '',
    nomineeAge: '',
    relation: '',
    transactionId: ''
  });

  // Automatically calculate age when DOB changes
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge >= 0) {
        setFormData(prev => {
          const updated = { ...prev, age: calculatedAge.toString() };
          onUpdate(updated);
          return updated;
        });
      }
    }
  }, [formData.dob]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    
    // Construct location string for compatibility with parent and card components
    const addressParts = [newData.houseStreet, newData.constituency, newData.mandalDistrict].filter(Boolean);
    const locationString = addressParts.length > 0 ? addressParts.join(', ') : '';
    
    setFormData(newData);
    onUpdate({ ...newData, location: locationString });
  };

  const steps = [
    { title: t('onboarding.steps.personal'), icon: <User size={16} /> },
    { title: t('onboarding.steps.trade'), icon: <Briefcase size={16} /> },
    { title: t('onboarding.steps.address'), icon: <MapPin size={16} /> },
    { title: t('onboarding.steps.nominee'), icon: <ShieldCheck size={16} /> },
    { title: t('onboarding.steps.fee'), icon: <CreditCard size={16} /> }
  ];

  const handleSimulatedPayment = () => {
    setIsSimulatingPayment(true);
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  const isContinueDisabled = () => {
    if (step === 1) {
      return !formData.name || !formData.fatherName || !formData.dob || !formData.aadhaar;
    }
    if (step === 2) {
      return !formData.kula || !formData.profession;
    }
    if (step === 3) {
      return !formData.houseStreet || !formData.constituency || !formData.mandalDistrict || !formData.phone;
    }
    if (step === 4) {
      return false; // Nominee fields are optional
    }
    if (step === 5) {
      return !formData.transactionId;
    }
    return false;
  };

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl border border-stone-100 relative overflow-hidden">
      {/* Step Indicator Labels */}
      <div className="flex justify-between items-center mb-8 px-2">
         <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
           {t('onboarding.step_indicator', { step, total: steps.length })}
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
                <h3 className="text-2xl font-black text-stone-900">{t('onboarding.personal_details')}</h3>
                <p className="text-stone-500 text-sm">{t('onboarding.personal_subtitle')}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.full_name')} *</label>
                   <input 
                     type="text" 
                     name="name"
                     value={formData.name}
                     onChange={handleInputChange}
                     placeholder={t('onboarding.placeholder_name')}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.father_name')} *</label>
                   <input 
                     type="text" 
                     name="fatherName"
                     value={formData.fatherName}
                     onChange={handleInputChange}
                     placeholder={t('onboarding.placeholder_father')}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.dob')} *</label>
                   <input 
                     type="date" 
                     name="dob"
                     value={formData.dob}
                     onChange={handleInputChange}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.age')}</label>
                   <input 
                     type="number" 
                     name="age"
                     value={formData.age}
                     onChange={handleInputChange}
                     placeholder="Age"
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.blood_group')}</label>
                   <select 
                     name="bloodGroup"
                     value={formData.bloodGroup}
                     onChange={handleInputChange}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium appearance-none text-xs md:text-sm"
                   >
                      <option value="">{t('onboarding.select_blood_group')}</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.aadhaar')} *</label>
                   <input 
                     type="text" 
                     name="aadhaar"
                     value={formData.aadhaar}
                     onChange={handleInputChange}
                     maxLength={12}
                     placeholder={t('onboarding.placeholder_aadhaar')}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900">{t('onboarding.trade_details')}</h3>
                <p className="text-stone-500 text-sm">{t('onboarding.trade_subtitle')}</p>
              </div>
              <div className="grid gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.kula_branch')} *</label>
                   <select 
                     name="kula"
                     value={formData.kula}
                     onChange={handleInputChange}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium appearance-none text-xs md:text-sm"
                   >
                      <option value="">{t('onboarding.select_kula')}</option>
                      <option value="Manus (Blacksmith)">Manus (Blacksmith)</option>
                      <option value="Maya (Carpenter)">Maya (Carpenter)</option>
                      <option value="Thwashta (Metalworker)">Thwashta (Metalworker)</option>
                      <option value="Shilpi (Sculptor)">Shilpi (Sculptor)</option>
                      <option value="Vishwajna (Goldsmith)">Vishwajna (Goldsmith)</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.specialization')} *</label>
                   <input 
                     type="text" 
                     name="profession"
                     value={formData.profession}
                     onChange={handleInputChange}
                     placeholder={t('onboarding.placeholder_specialization')}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900">{t('onboarding.address_details')}</h3>
                <p className="text-stone-500 text-sm">{t('onboarding.address_subtitle')}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.house_street')} *</label>
                   <input 
                     type="text" 
                     name="houseStreet"
                     value={formData.houseStreet}
                     onChange={handleInputChange}
                     placeholder={t('onboarding.placeholder_house')}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.constituency')} *</label>
                   <input 
                     type="text" 
                     name="constituency"
                     value={formData.constituency}
                     onChange={handleInputChange}
                     placeholder={t('onboarding.placeholder_constituency')}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.mandal_district')} *</label>
                   <input 
                     type="text" 
                     name="mandalDistrict"
                     value={formData.mandalDistrict}
                     onChange={handleInputChange}
                     placeholder={t('onboarding.placeholder_mandal_district')}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.phone')} *</label>
                   <input 
                     type="tel" 
                     name="phone"
                     value={formData.phone}
                     onChange={handleInputChange}
                     placeholder={t('onboarding.placeholder_phone')}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900">{t('onboarding.nominee_details')}</h3>
                <p className="text-stone-500 text-sm">{t('onboarding.nominee_subtitle')}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.nominee_name')}</label>
                   <input 
                     type="text" 
                     name="nomineeName"
                     value={formData.nomineeName}
                     onChange={handleInputChange}
                     placeholder={t('onboarding.placeholder_nominee')}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.nominee_age')}</label>
                   <input 
                     type="number" 
                     name="nomineeAge"
                     value={formData.nomineeAge}
                     onChange={handleInputChange}
                     placeholder="Age"
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.relation')}</label>
                   <input 
                     type="text" 
                     name="relation"
                     value={formData.relation}
                     onChange={handleInputChange}
                     placeholder={t('onboarding.placeholder_relation')}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900">{t('onboarding.payment_step')}</h3>
                <p className="text-stone-500 text-sm">{t('onboarding.payment_subtitle')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-stone-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-vermilion/20 blur-3xl rounded-full" />
                 
                 <div className="flex flex-col items-center space-y-3 relative z-10 bg-white/5 p-4 rounded-3xl border border-white/10">
                    <img 
                      src="/images/qr-payment.jpg" 
                      alt="Payment QR Code" 
                      className="w-40 h-auto rounded-2xl shadow-xl object-contain border border-stone-800"
                    />
                    <div className="text-center">
                       <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">{t('onboarding.upi_id')}</p>
                       <p className="text-[10px] font-mono font-bold text-turmeric mt-0.5">9440095412@hdfc</p>
                    </div>
                 </div>
                 
                 <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">{t('onboarding.official_fee')}</span>
                       <span className="text-2xl font-black text-turmeric">₹500.00</span>
                    </div>
                    <p className="text-[11px] text-stone-300 leading-relaxed font-medium">
                       {t('onboarding.payment_desc')}
                    </p>
                    <div className="space-y-3 border-t border-white/10 pt-4">
                       <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-stone-300">Digital Registry Entry</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-stone-300">Member ID Issuance</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-stone-300">Govt. Scheme Assistance</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('onboarding.transaction_id')} *</label>
                 <input 
                   type="text" 
                   name="transactionId"
                   value={formData.transactionId}
                   onChange={handleInputChange}
                   placeholder={t('onboarding.placeholder_transaction')}
                   className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                 />
              </div>

              <div className="flex items-center gap-3 justify-center text-stone-400">
                 <ShieldCheck size={14} className="text-stone-300" />
                 <span className="text-[9px] font-black uppercase tracking-widest">{t('onboarding.secure_payment')}</span>
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
                <ArrowLeft size={16} /> {t('onboarding.back')}
              </button>
            )}
            <button 
              disabled={isContinueDisabled()}
              onClick={step === 5 ? handleSimulatedPayment : nextStep}
              className="flex-[2] h-16 rounded-2xl bg-stone-900 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-vermilion transition-all shadow-xl shadow-stone-900/10 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {step === 5 ? t('onboarding.pay_submit') : t('onboarding.continue')} <ArrowRight size={16} />
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
             <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">{t('onboarding.processing_payment')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
