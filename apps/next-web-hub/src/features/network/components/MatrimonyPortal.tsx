import { useTranslation } from 'react-i18next';
import { 
  Heart, 
  ShieldCheck, 
  Lock, 
  Sparkles,
  Users,
  ArrowRight
} from 'lucide-react';

const MOCK_PROFILES = [
  { id: '1', age: 28, height: "5'10\"", profession: 'Software Engineer', location: 'Hyderabad', education: 'M.Tech', kula: 'Manus' },
  { id: '2', age: 26, height: "5'4\"", profession: 'Doctor (MD)', location: 'Bangalore', education: 'MBBS, MD', kula: 'Vishwajna' },
  { id: '3', age: 30, height: "5'11\"", profession: 'Civil Engineer', location: 'Vizag', education: 'B.E', kula: 'Shilpi' }
];

export const MatrimonyPortal = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-16">
      {/* Hero Branding */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 border border-rose-100 flex flex-col md:flex-row items-center gap-12 md:gap-16 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/20 blur-[100px] rounded-full" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200/20 blur-[100px] rounded-full" />
         
         <div className="md:w-1/2 space-y-8 relative z-10">
            <div className="inline-flex items-center gap-3 bg-white px-4 py-1.5 rounded-full text-rose-600 shadow-sm border border-rose-100">
               <Heart size={16} fill="currentColor" />
               <span className="text-[10px] font-black uppercase tracking-widest">{t('network.matrimony.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 font-display leading-tight">
               {t('network.matrimony.title').split(' ').map((word, i) => 
                 word.toLowerCase().includes('connections') ? (
                   <span key={i} className="text-rose-500"> {word} </span>
                 ) : ` ${word} `
               )}
            </h2>
            <p className="text-stone-600 text-lg font-medium leading-relaxed">
               {t('network.matrimony.subtitle')}
            </p>
            <div className="flex gap-4">
               <button className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-200 active:scale-95">
                  {t('network.matrimony.actions.create_profile')}
               </button>
               <button className="bg-white text-stone-900 border border-rose-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95">
                  {t('network.matrimony.actions.search_criteria')}
               </button>
            </div>
         </div>

         <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 w-full">
            {MOCK_PROFILES.map((p, i) => (
               <div key={p.id} className={`p-6 bg-white/80 backdrop-blur-md rounded-3xl border border-rose-100 shadow-xl ${i === 1 ? 'mt-8' : ''}`}>
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
                     <Users size={20} />
                  </div>
                  <h4 className="font-black text-stone-900 text-sm mb-1">{p.profession}</h4>
                  <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-3">{p.kula} • {p.age} Yrs</p>
                  <div className="h-[1px] bg-rose-50 w-full mb-3" />
                  <p className="text-[10px] text-stone-500 font-medium">Verified Community Member</p>
               </div>
            ))}
         </div>
      </div>

      {/* Safety & Trust Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {[
           { icon: <Lock className="text-blue-600" />, title: t('network.matrimony.safety.privacy.title'), desc: t('network.matrimony.safety.privacy.desc') },
           { icon: <ShieldCheck className="text-emerald-600" />, title: t('network.matrimony.safety.backgrounds.title'), desc: t('network.matrimony.safety.backgrounds.desc') },
           { icon: <Sparkles className="text-saffron-600" />, title: t('network.matrimony.safety.matches.title'), desc: t('network.matrimony.safety.matches.desc') }
         ].map((item, i) => (
           <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-lg space-y-4">
              <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-2">
                 {item.icon}
              </div>
              <h5 className="text-lg font-black text-stone-900">{item.title}</h5>
              <p className="text-stone-500 text-sm leading-relaxed font-medium">{item.desc}</p>
           </div>
         ))}
      </div>

      {/* Membership Lock CTA */}
      <section className="bg-stone-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 text-center text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
         <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <h3 className="text-3xl font-black leading-tight flex items-center justify-center gap-4">
               <Lock size={32} className="text-rose-500" />
               {t('network.matrimony.lock.title')}
            </h3>
            <p className="text-stone-400 font-medium leading-relaxed">
               {t('network.matrimony.lock.desc')}
            </p>
            <button className="bg-rose-600 text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-2xl shadow-rose-600/20 flex items-center gap-3 mx-auto">
               {t('network.matrimony.actions.register_membership')} <ArrowRight size={18} />
            </button>
         </div>
      </section>
    </div>
  );
};
