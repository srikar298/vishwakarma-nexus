import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Briefcase, Lock, ArrowRight, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import type { RegisterPayload } from '@/infrastructure/api/nexus-api';

interface RegistrationFormProps {
  onUpdate: (data: Record<string, string | number | boolean>) => void;
  onComplete: (payload: RegisterPayload) => void;
  isLoading?: boolean;
}

const TELANGANA_DISTRICTS = [
  'Hyderabad', 'Warangal', 'Karimnagar', 'Nalgonda', 'Khammam', 
  'Nizamabad', 'Rangareddy', 'Medak', 'Mahabubnagar', 'Adilabad',
  'Sangareddy', 'Siddipet', 'Suryapet', 'Mancherial', 'Jagtial',
  'Nirmal', 'Kamareddy', 'Bhadradri Kothagudem', 'Mahabubabad',
  'Jangaon', 'Jayashankar Bhupalpally', 'Mulugu', 'Wanaparthy',
  'Nagarkurnool', 'Jogulamba Gadwal', 'Narayanpet', 'Vikarabad',
  'Medchal-Malkajgiri', 'Yadadri Bhuvanagiri', 'Rajanna Sircilla',
  'Peddapalli', 'Komaram Bheem Asifabad'
];

const AP_DISTRICTS = [
  'Visakhapatnam', 'Vijayawada (NTR)', 'Guntur', 'Tirupati', 
  'Kurnool', 'Kakinada', 'Anantapur', 'Nellore', 'Chittoor', 
  'YSR Kadapa', 'Eluru', 'Prakasam', 'Srikakulam', 'Vizianagaram', 
  'West Godavari', 'East Godavari', 'Annamayya', 'Bapatla', 
  'Nandyal', 'Palnadu', 'Alluri Sitharama Raju', 'Parvathipuram Manyam'
];

const KULA_BRANCHES = [
  { value: 'Manus (Blacksmith)', label: 'Manu (Blacksmith / Lohar / Kammarolu)' },
  { value: 'Maya (Carpenter)', label: 'Maya (Carpenter / Wood Artisan / Vadla)' },
  { value: 'Thwashta (Metalworker)', label: 'Thwashta (Bronze & Copper Sculptor / Kanchara)' },
  { value: 'Shilpi (Sculptor)', label: 'Shilpi (Stone Sculptor / Shiplacharya)' },
  { value: 'Vishwajna (Goldsmith)', label: 'Vishwajna (Gold & Gem Artisan / Avasula / Agasale)' },
];

export const RegistrationForm = ({ onUpdate, onComplete, isLoading = false }: RegistrationFormProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [validationError, setValidationError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    dob: '',
    age: '',
    bloodGroup: '',
    aadhaar: '',
    kula: '',
    trade: '',
    experience: '5+ years',
    state: 'Telangana',
    district: 'Hyderabad',
    mandal: '',
    houseStreet: '',
    phone: '',
    mpin: '',
    confirmMpin: '',
    acceptTerms: true,
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
        setFormData(prev => ({ ...prev, age: calculatedAge.toString() }));
      }
    }
  }, [formData.dob]);

  const nextStep = () => {
    setValidationError('');
    setStep(s => s + 1);
  };
  const prevStep = () => {
    setValidationError('');
    setStep(s => s - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    
    // Live update preview card
    const fullName = `${newData.firstName} ${newData.lastName}`.trim();
    onUpdate({
      name: fullName || 'Your Name',
      phone: newData.phone,
      kula: newData.kula,
      profession: newData.trade,
      location: `${newData.district}, ${newData.state}`,
    });
  };

  const handleFinalSubmit = () => {
    setValidationError('');
    if (!formData.mpin || formData.mpin.length < 4 || formData.mpin.length > 6) {
      setValidationError('Please enter a secure 4 to 6 digit MPIN.');
      return;
    }
    if (formData.mpin !== formData.confirmMpin) {
      setValidationError('MPIN and Confirm MPIN do not match.');
      return;
    }

    const payload: RegisterPayload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim() || formData.fatherName.trim() || 'Chary',
      phone: formData.phone.startsWith('+91') ? formData.phone.trim() : `+91${formData.phone.replace(/\D/g, '')}`,
      kula: formData.kula,
      trade: formData.trade,
      district: formData.district,
      mandal: formData.mandal.trim() || undefined,
      state: formData.state,
      mpin: formData.mpin,
      source: 'WEB',
    };

    onComplete(payload);
  };

  const steps = [
    { title: 'Personal Details', icon: <User size={16} /> },
    { title: 'Artisan Trade', icon: <Briefcase size={16} /> },
    { title: 'Location & Phone', icon: <MapPin size={16} /> },
    { title: 'Pass Security', icon: <Lock size={16} /> },
  ];

  const isContinueDisabled = () => {
    if (step === 1) {
      return !formData.firstName || !formData.dob;
    }
    if (step === 2) {
      return !formData.kula || !formData.trade;
    }
    if (step === 3) {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      return !formData.district || cleanPhone.length < 10;
    }
    if (step === 4) {
      return !formData.mpin || formData.mpin.length < 4 || !formData.confirmMpin;
    }
    return false;
  };

  const availableDistricts = formData.state === 'Andhra Pradesh' ? AP_DISTRICTS : TELANGANA_DISTRICTS;

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl border border-stone-100 relative overflow-hidden">
      {/* Step Indicator Labels */}
      <div className="flex justify-between items-center mb-8 px-2">
         <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
           Step {step} of {steps.length}
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

      {validationError && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          {validationError}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
           key={step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           className="space-y-8"
        >
          {/* STEP 1: PERSONAL DETAILS */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900">Personal Information</h3>
                <p className="text-stone-500 text-sm">Please provide your legal name as per government ID for registry records.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">First Name *</label>
                   <input 
                     type="text" 
                     name="firstName"
                     value={formData.firstName}
                     onChange={handleInputChange}
                     placeholder="e.g. Bhaskar"
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Surname / Last Name</label>
                   <input 
                     type="text" 
                     name="lastName"
                     value={formData.lastName}
                     onChange={handleInputChange}
                     placeholder="e.g. Chary"
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Father's Name / Guardian</label>
                   <input 
                     type="text" 
                     name="fatherName"
                     value={formData.fatherName}
                     onChange={handleInputChange}
                     placeholder="e.g. Shankara Chary"
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Date of Birth *</label>
                   <input 
                     type="date" 
                     name="dob"
                     value={formData.dob}
                     onChange={handleInputChange}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Blood Group</label>
                   <select 
                     name="bloodGroup"
                     value={formData.bloodGroup}
                     onChange={handleInputChange}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   >
                      <option value="">Select Blood Group</option>
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
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Aadhaar / Gov ID (Optional)</label>
                   <input 
                     type="text" 
                     name="aadhaar"
                     value={formData.aadhaar}
                     onChange={handleInputChange}
                     maxLength={12}
                     placeholder="12-digit Aadhaar Number"
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ARTISAN TRADE & KULA */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900">Artisan Heritage & Trade</h3>
                <p className="text-stone-500 text-sm">Select your traditional lineage and primary craft specialization.</p>
              </div>
              <div className="grid gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Kula Branch (Lineage) *</label>
                   <select 
                     name="kula"
                     value={formData.kula}
                     onChange={handleInputChange}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   >
                      <option value="">Select Traditional Kula</option>
                      {KULA_BRANCHES.map(b => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Primary Craft / Specialization *</label>
                   <input 
                     type="text" 
                     name="trade"
                     value={formData.trade}
                     onChange={handleInputChange}
                     placeholder="e.g. Temple Architecture, Wood Carving, Gold Filigree"
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Experience in Craft</label>
                   <select 
                     name="experience"
                     value={formData.experience}
                     onChange={handleInputChange}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   >
                      <option value="1-3 years">1 - 3 Years</option>
                      <option value="3-5 years">3 - 5 Years</option>
                      <option value="5-10 years">5 - 10 Years</option>
                      <option value="10-20 years">10 - 20 Years</option>
                      <option value="20+ years">20+ Years (Master Craftsman)</option>
                   </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION & CONTACT */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900">Regional Location & Contact</h3>
                <p className="text-stone-500 text-sm">Your district and mandal automatically resolve your parliamentary & assembly community chapter.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">State *</label>
                   <select 
                     name="state"
                     value={formData.state}
                     onChange={handleInputChange}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   >
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Other">Other State</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">District *</label>
                   <select 
                     name="district"
                     value={formData.district}
                     onChange={handleInputChange}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   >
                      {availableDistricts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Mandal / Tehsil</label>
                   <input 
                     type="text" 
                     name="mandal"
                     value={formData.mandal}
                     onChange={handleInputChange}
                     placeholder="e.g. Hanamkonda, Kukatpally, Secunderabad"
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Mobile Number (Login Identifier) *</label>
                   <input 
                     type="tel" 
                     name="phone"
                     value={formData.phone}
                     onChange={handleInputChange}
                     placeholder="e.g. 9876543210"
                     maxLength={14}
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
                <div className="space-y-2 md:col-span-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Workshop / House Address</label>
                   <input 
                     type="text" 
                     name="houseStreet"
                     value={formData.houseStreet}
                     onChange={handleInputChange}
                     placeholder="Street / Colony / Landmark"
                     className="w-full h-14 px-6 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-xs md:text-sm"
                   />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PASS SECURITY (MPIN) */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900">Digital Pass Security</h3>
                <p className="text-stone-500 text-sm">Create a secret 4-to-6 digit MPIN to protect your account and unlock your digital pass.</p>
              </div>
              
              <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200/60 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Create 4-6 Digit MPIN *</label>
                       <input 
                         type="password" 
                         name="mpin"
                         value={formData.mpin}
                         onChange={handleInputChange}
                         maxLength={6}
                         placeholder="••••"
                         className="w-full h-14 px-6 bg-white rounded-2xl border border-stone-200 focus:ring-2 focus:ring-vermilion text-center font-mono text-xl tracking-[0.5em]"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Confirm MPIN *</label>
                       <input 
                         type="password" 
                         name="confirmMpin"
                         value={formData.confirmMpin}
                         onChange={handleInputChange}
                         maxLength={6}
                         placeholder="••••"
                         className="w-full h-14 px-6 bg-white rounded-2xl border border-stone-200 focus:ring-2 focus:ring-vermilion text-center font-mono text-xl tracking-[0.5em]"
                       />
                    </div>
                 </div>

                 <div className="flex items-center gap-3 pt-2 text-stone-600">
                    <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                    <span className="text-[11px] font-medium leading-tight">
                      Your MPIN is securely scrypt-hashed. You will use this MPIN along with your phone number to log into Vishwakarma Nexus.
                    </span>
                 </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/50 flex items-start gap-3">
                 <input 
                   type="checkbox"
                   id="acceptTerms"
                   checked={formData.acceptTerms}
                   onChange={(e) => setFormData(p => ({ ...p, acceptTerms: e.target.checked }))}
                   className="mt-1 rounded text-vermilion focus:ring-vermilion"
                 />
                 <label htmlFor="acceptTerms" className="text-[11px] text-stone-600 font-medium leading-normal cursor-pointer">
                   I certify that the information provided is true to my knowledge and I belong to the Vishwakarma artisan community.
                 </label>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-4 mt-12 pt-8 border-t border-stone-100">
        {step > 1 && (
          <button 
            type="button"
            disabled={isLoading}
            onClick={prevStep}
            className="flex-1 h-16 rounded-2xl border-2 border-stone-100 text-stone-400 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-stone-50 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}
        <button 
          type="button"
          disabled={isContinueDisabled() || isLoading}
          onClick={step === 4 ? handleFinalSubmit : nextStep}
          className="flex-[2] h-16 rounded-2xl bg-stone-900 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-vermilion transition-all shadow-xl shadow-stone-900/10 active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Issuing Digital Pass...</span>
            </div>
          ) : step === 4 ? (
            <>Complete & Issue Pass <CheckCircle size={16} /></>
          ) : (
            <>Continue <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
};
