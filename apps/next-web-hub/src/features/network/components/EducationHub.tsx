import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Briefcase, 
  ExternalLink,
  ArrowRight,
  Sparkles,
  School
} from 'lucide-react';

const RESOURCES = [
  {
    id: '1',
    title: 'Vishwakarma Merit Scholarship 2026',
    type: 'Scholarship',
    deadline: 'July 15, 2026',
    eligibility: 'Top 5% in 12th Standard',
    icon: <Trophy className="text-amber-500" />,
    tag: 'Institutional'
  },
  {
    id: '2',
    title: 'UPSC Civil Services Guide',
    type: 'Exam Resource',
    author: 'Sri Venkatesh Chary, IAS',
    description: 'A strategic roadmap for cracking IAS/IPS for community students.',
    icon: <BookOpen className="text-blue-500" />,
    tag: 'Mentorship'
  },
  {
    id: '3',
    title: 'Precision Engineering Internships',
    type: 'Job Opportunity',
    company: 'VKC Partner Industries',
    location: 'Bangalore / Hyderabad',
    icon: <Briefcase className="text-emerald-500" />,
    tag: 'Careers'
  }
];

export const EducationHub = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-16">
      {/* Search & Intro */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
         <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-3 bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full border border-emerald-100">
               <GraduationCap size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{t('network.education.badge')}</span>
            </div>
            <h2 className="text-4xl font-black text-stone-900 leading-tight">
               {t('network.education.title').split(' ').map((word, i) => 
                 word.toLowerCase().includes('acceleration') ? (
                   <span key={i} className="text-emerald-500"> {word} </span>
                 ) : ` ${word} `
               )}
            </h2>
            <p className="text-stone-500 font-medium text-lg leading-relaxed">
               {t('network.education.subtitle')}
            </p>
         </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {RESOURCES.map((res, i) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-xl hover:shadow-2xl transition-all duration-500 relative flex flex-col justify-between"
          >
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center">
                     {res.icon}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-stone-50 text-stone-400 border border-stone-100">
                     {res.tag}
                  </span>
               </div>
               
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-stone-900 leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-wide">{res.title}</h3>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{res.type}</p>
               </div>

               {res.deadline && (
                 <div className="flex items-center gap-2 text-stone-600 text-xs font-bold bg-amber-50/50 w-fit px-3 py-2 rounded-xl border border-amber-100/50">
                    <Sparkles size={14} className="text-amber-500" />
                    Deadline: {res.deadline}
                 </div>
               )}

               {res.description && (
                  <p className="text-xs text-stone-500 leading-relaxed font-medium">
                    {res.description}
                  </p>
               )}

               <div className="pt-4">
                  <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest py-3 bg-stone-50 rounded-xl hover:bg-stone-900 hover:text-white transition-all text-stone-900">
                     {t('network.education.actions.learn_more')} <ExternalLink size={14} />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Career Guidance Section */}
      <section className="bg-emerald-600 rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 text-white relative overflow-hidden shadow-[0_40px_100px_rgba(16,185,129,0.2)]">
         <div className="absolute -right-20 -bottom-20 opacity-10">
            <School size={300} strokeWidth={1} />
         </div>
         <div className="max-w-2xl space-y-8 relative z-10">
            <h3 className="text-3xl md:text-5xl font-black leading-tight">
               {t('network.education.career_guidance.title').split(' ').map((word, i) => 
                 word.toLowerCase().includes('guidance') ? (
                   <span key={i} className="text-stone-900"> {word} </span>
                 ) : ` ${word} `
               )}
            </h3>
            <p className="text-emerald-100 text-lg font-medium leading-relaxed">
               {t('network.education.career_guidance.subtitle')}
            </p>
            <button className="bg-white text-emerald-600 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">
               {t('network.education.actions.request_guidance')} <ArrowRight size={18} className="inline ml-2" />
            </button>
         </div>
      </section>
    </div>
  );
};
