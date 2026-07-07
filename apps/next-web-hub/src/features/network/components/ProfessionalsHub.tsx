import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Stethoscope, 
  Gavel, 
  Cpu, 
  Code,
  GraduationCap,
  MessageCircle,
  Linkedin,
  Clock,
  MapPin,
  Star
} from 'lucide-react';

const PROFESSIONALS = [
  {
    id: '1',
    name: 'Dr. Srinivas Chary, MD',
    role: 'Surgical Oncologist',
    category: 'Medical',
    location: 'Hyderabad, TS',
    experience: '18+ Years',
    mentorship: 'Career in Medicine',
    icon: <Stethoscope size={24} />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    rating: 4.9
  },
  {
    id: '2',
    name: 'Advocate Lakshmi Chary',
    role: 'Constitutional Lawyer',
    category: 'Legal',
    location: 'New Delhi / Vizag',
    experience: '12+ Years',
    mentorship: 'Legal Rights & Advocacy',
    icon: <Gavel size={24} />,
    color: 'text-stone-600',
    bg: 'bg-stone-50',
    rating: 4.8
  },
  {
    id: '3',
    name: 'Sri Rajesh Achary',
    role: 'Senior Staff Engineer @ Google',
    category: 'IT / Tech',
    location: 'Bangalore, KA',
    experience: '15+ Years',
    mentorship: 'System Design & Al Research',
    icon: <Code size={24} />,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    rating: 5.0
  },
  {
    id: '4',
    name: 'Ar. Ananya Vishwakarma',
    role: 'Principal Architect',
    category: 'Architecture',
    location: 'Chennai, TN',
    experience: '10+ Years',
    mentorship: 'Urban Design & Vaastu',
    icon: <Cpu size={24} />,
    color: 'text-saffron-600',
    bg: 'bg-saffron-50',
    rating: 4.7
  }
];

export const ProfessionalsHub = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="space-y-1">
            <h2 className="text-2xl font-black text-stone-900 leading-tight">{t('network.professionals.title')}</h2>
            <p className="text-stone-500 font-medium text-sm">{t('network.professionals.subtitle')}</p>
         </div>
         <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-vermilion bg-vermilion/5 px-6 py-3 rounded-xl hover:bg-vermilion/10 transition-all border border-vermilion/10">
            {t('network.professionals.view_all')} <Linkedin size={14} />
         </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROFESSIONALS.map((prof, i) => (
          <motion.div
            key={prof.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden flex flex-col justify-between"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${prof.bg} -mr-12 -mt-12 rounded-full opacity-50 group-hover:scale-[3] transition-transform duration-700 -z-0`} />
            
            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-4 md:gap-6">
                   <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${prof.bg} ${prof.color} flex items-center justify-center shadow-lg shadow-black/5 shrink-0`}>
                      {prof.icon}
                   </div>
                   <div>
                      <h3 className="text-lg md:text-xl font-black text-stone-900 uppercase tracking-wide leading-tight">{prof.name}</h3>
                      <p className="text-stone-500 text-[10px] md:text-xs font-bold mt-1">{prof.role}</p>
                   </div>
                </div>
                <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
                   <Star size={12} className="text-turmeric fill-turmeric" />
                   <span className="text-[10px] font-black text-stone-900">{prof.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 py-6 border-y border-stone-50">
                 <div className="space-y-1">
                    <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                       <MapPin size={10} /> {t('network.professionals.labels.location')}
                    </p>
                    <p className="text-xs font-bold text-stone-700">{prof.location}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                       <Clock size={10} /> {t('network.professionals.labels.experience')}
                    </p>
                    <p className="text-xs font-bold text-stone-700">{prof.experience}</p>
                 </div>
              </div>

              <div className="space-y-3">
                 <p className="text-[9px] font-black text-vermilion uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap size={12} /> {t('network.professionals.labels.mentorship')}
                 </p>
                 <p className="text-sm text-stone-600 font-medium leading-relaxed italic border-l-2 border-stone-100 pl-4">
                    "{prof.mentorship}"
                 </p>
              </div>

              <div className="flex gap-4 pt-4">
                 <button className="flex-1 bg-stone-900 text-white h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-vermilion transition-all active:scale-95 shadow-lg group/btn">
                    <MessageCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
                    {t('network.professionals.actions.request')}
                 </button>
                 <button className="w-14 h-14 border border-stone-200 rounded-2xl flex items-center justify-center text-stone-400 hover:border-vermilion hover:text-vermilion transition-all active:scale-95">
                    <Linkedin size={20} />
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
