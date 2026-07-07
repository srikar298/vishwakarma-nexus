import { 
  ShieldAlert, 
  BarChart3, 
  Flag, 
  Gavel, 
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { SEO } from '@/shared/components/SEO';
import { ScrollToTop } from '@/shared/components/ScrollToTop';

const ADVOCACY_DATA = [
  { label: 'Reservation Rights', value: 'OBC Category Support', desc: 'Advocating for fair representation in education and employment.' },
  { label: 'Political Census', desc: 'Data-backed representation in legislative assembly and local bodies.' },
  { label: 'Artisan Grants', value: 'PM Vishwakarma', desc: 'Facilitating access to government tools and credit facilities.' }
];

export const EmpowermentPage = () => {

  return (
    <div className="min-h-screen bg-stone-50 pt-24 md:pt-32 pb-24 group">
      <SEO 
        title="Political Empowerment & Rights" 
        description="Data and discussions regarding Vishwakarma community reservations, rights, and political representation."
      />
      <ScrollToTop />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Hero Section */}
        <div className="max-w-4xl space-y-8 mb-20 text-center md:text-left">
           <div className="inline-flex items-center gap-3 bg-stone-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
              <Flag size={14} className="text-vermilion" />
              Community Advocacy
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-stone-900 leading-tight font-display tracking-tight">
              Political <span className="text-vermilion underline decoration-vermilion/20 underline-offset-8">Empowerment</span> & Rights
           </h1>
           <p className="text-stone-600 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              Building a unified platform for the Vishwakarma community to understand, advocate, and secure our collective social and political rights.
           </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
           {/* Left: Key Focus Areas */}
           <div className="lg:col-span-2 space-y-12">
              <section className="bg-white rounded-[3rem] p-10 md:p-16 border border-stone-100 shadow-xl overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <BarChart3 size={200} />
                 </div>
                 <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                       <h2 className="text-3xl font-black text-stone-900 uppercase">Core Advocacy Pillars</h2>
                       <p className="text-stone-500 font-medium">Data-driven approaches to community representation.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                       {ADVOCACY_DATA.map((item, i) => (
                         <div key={i} className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100 group transition-all hover:bg-white hover:shadow-xl">
                            <h4 className="text-lg font-black text-stone-900 mb-2 uppercase tracking-tight">{item.label}</h4>
                            {item.value && <p className="text-vermilion text-xs font-black uppercase tracking-widest mb-4">{item.value}</p>}
                            <p className="text-stone-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                         </div>
                       ))}
                       <div className="p-8 bg-vermilion text-white rounded-[2rem] flex flex-col justify-between">
                          <Gavel size={32} className="mb-6 opacity-60" />
                          <div className="space-y-4">
                             <h4 className="text-lg font-black uppercase">Legal Support Cell</h4>
                             <p className="text-white/80 text-sm leading-relaxed font-medium">Access community lawyers for guidance on rights and institutional representation.</p>
                             <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white text-vermilion px-6 py-3 rounded-xl hover:scale-105 transition-all">
                                Get Legal Aid
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              </section>

              {/* Data Visualization Placeholder */}
              <section className="bg-stone-900 rounded-[3rem] p-10 md:p-16 text-white overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-stone-800 to-stone-900 opacity-50" />
                 <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-center">
                       <h3 className="text-2xl font-black uppercase tracking-[0.2em]">Community Demographics</h3>
                       <button className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2 hover:text-white transition-colors">
                          Download Report <ExternalLink size={14} />
                       </button>
                    </div>
                    <div className="h-[1px] bg-white/10 w-full" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                       {[
                         { label: 'Registered Members', value: '45.2K+' },
                         { label: 'States Represented', value: '28 States' },
                         { label: 'Economic Impact', value: '$2.4B+' },
                         { label: 'Voter Base (Est)', value: '1.2M+' }
                       ].map((stat, i) => (
                         <div key={i} className="space-y-2">
                            <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black text-turmeric">{stat.value}</p>
                         </div>
                       ))}
                    </div>
                    <p className="text-stone-500 text-xs font-bold leading-relaxed max-w-2xl border-l-2 border-vermilion pl-4">
                       Based on internally collected community survey data—aiming to build a stronger case for institutional representation across AP and TS.
                    </p>
                 </div>
              </section>
           </div>

           {/* Right: Resources & Updates */}
           <div className="space-y-12">
              <div className="p-10 bg-white rounded-[3rem] border border-stone-100 shadow-xl space-y-8">
                 <h4 className="text-xl font-black text-stone-900 uppercase flex items-center gap-3">
                    <ShieldAlert className="text-vermilion" size={24} />
                    Active Alerts
                 </h4>
                 <div className="space-y-4">
                    {[
                      { title: 'OBC-Reservation Update', time: '2 days ago', status: 'Priority' },
                      { title: 'PM Vishwakarma Scheme Application', time: '5 days ago', status: 'Notice' }
                    ].map((alert, i) => (
                      <div key={i} className="p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:border-vermilion/20 transition-all cursor-pointer group">
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[8px] font-black uppercase bg-white text-stone-400 px-2 py-0.5 rounded border border-stone-100">{alert.status}</span>
                            <span className="text-[8px] font-bold text-stone-400">{alert.time}</span>
                         </div>
                         <h5 className="text-sm font-black text-stone-800 leading-tight group-hover:text-vermilion transition-colors">{alert.title}</h5>
                      </div>
                    ))}
                 </div>
                 <button className="w-full flex items-center justify-center gap-3 py-5 bg-stone-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-vermilion transition-all active:scale-95">
                    View News Hub <ArrowRight size={18} />
                 </button>
              </div>

              <div className="p-10 bg-saffron-50 rounded-[3rem] border border-saffron-100 space-y-6">
                 <Info className="text-saffron-600" size={32} />
                 <h4 className="text-2xl font-black text-stone-900">Get Involved</h4>
                 <p className="text-stone-600 font-medium text-sm leading-relaxed">
                   Your voice matters. Participate in upcoming community census and advocacy surveys to help us represent you better.
                 </p>
                 <button className="text-saffron-700 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                    Register Your Vote <ArrowRight size={16} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
