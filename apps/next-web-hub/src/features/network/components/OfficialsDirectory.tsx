import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Gavel, 
  MapPin, 
  Flag,
  Award,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Building2
} from 'lucide-react';

const OFFICIALS = [
  {
    id: '1',
    name: 'Sri Venkatesh Chary, IAS',
    role: 'District Collector',
    department: 'Revenue & Administration',
    impact: 'Infrastructure Development',
    location: 'Telangana State',
    icon: <Building2 size={24} />,
    color: 'text-saffron-600',
    bg: 'bg-saffron-50',
    tag: 'Executive'
  },
  {
    id: '2',
    name: 'Sri Rama Murthy Achary',
    role: 'MLA Representative',
    department: 'Legislative Assembly',
    impact: 'Artisan Rights Advocacy',
    location: 'Coastal Andhra Pradesh',
    icon: <Gavel size={24} />,
    color: 'text-stone-600',
    bg: 'bg-stone-50',
    tag: 'Political'
  },
  {
    id: '3',
    name: 'Sri Krishna Chary',
    role: 'National President, V.M.S',
    department: 'Social Reform',
    impact: 'Community Unity & Skills',
    location: 'Pan-India / Delhi',
    icon: <Flag size={24} />,
    color: 'text-vermilion',
    bg: 'bg-vermilion/5',
    tag: 'Social'
  }
];

export const OfficialsDirectory = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="space-y-1 text-center md:text-left">
            <h2 className="text-2xl font-black text-stone-900 leading-tight">{t('network.officials.title')}</h2>
            <p className="text-stone-500 font-medium text-sm">{t('network.officials.subtitle')}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {OFFICIALS.map((official, i) => (
          <motion.div
            key={official.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-xl overflow-hidden relative flex flex-col justify-between"
          >
            <div className="space-y-6 relative z-10">
               <div className="flex justify-between items-center">
                  <div className={`w-14 h-14 rounded-2xl ${official.bg} ${official.color} flex items-center justify-center`}>
                     {official.icon}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${official.color} border-current opacity-60`}>
                     {official.tag}
                  </span>
               </div>

               <div className="space-y-2">
                  <h3 className="text-xl font-black text-stone-900 leading-tight group-hover:text-vermilion transition-colors">{official.name}</h3>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{official.role}</p>
               </div>

               <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100 space-y-4">
                  <div className="flex items-start gap-4">
                     <Building2 size={16} className="text-stone-300 shrink-0 mt-1" />
                     <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{t('network.officials.labels.department')}</p>
                        <p className="text-xs font-bold text-stone-800">{official.department}</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <Award size={16} className="text-stone-300 shrink-0 mt-1" />
                     <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{t('network.officials.labels.impact')}</p>
                        <p className="text-xs font-bold text-stone-800">{official.impact}</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <MapPin size={16} className="text-stone-300 shrink-0 mt-1" />
                     <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{t('network.officials.labels.region')}</p>
                        <p className="text-xs font-bold text-stone-800">{official.location}</p>
                     </div>
                  </div>
               </div>

               <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest py-3 border border-stone-100 rounded-xl hover:bg-stone-50 transition-all text-stone-400 hover:text-stone-900">
                  {t('network.officials.actions.contact')} <ExternalLink size={14} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-vermilion/5 border border-vermilion/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
         <div className="w-16 h-16 md:w-20 md:h-20 bg-vermilion text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-vermilion/20">
            <ShieldAlert size={28} className="md:w-8 md:h-8" />
         </div>
         <div className="flex-1 space-y-2">
            <h4 className="text-xl md:text-2xl font-black text-stone-900">{t('network.officials.advocacy_title')}</h4>
            <p className="text-stone-600 font-medium text-sm">{t('network.officials.advocacy_subtitle')}</p>
         </div>
         <button className="w-full md:w-auto bg-stone-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:gap-6 transition-all">
            {t('network.officials.actions.advocacy')} <ChevronRight size={18} />
         </button>
      </div>
    </div>
  );
};
