import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  Users, 
  BookOpen, 
  ArrowLeft,
  Hammer,
  ShoppingBag,
  Award
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function About({ onBack, onJoinClick }: { onBack: () => void, onJoinClick: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-saffron-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-saffron-100 uppercase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-stone-600 hover:text-vermilion transition-colors font-bold group text-xs tracking-widest"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              {t('nav.about')}
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-vermilion p-1.5 rounded-lg shadow-sm">
                <Hammer className="text-white w-4 h-4" />
              </div>
              <span className="text-sm font-black tracking-tighter text-stone-900">{t('hero.title')} {t('hero.subtitle')}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-100/30 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 rounded-full bg-saffron-50 text-vermilion text-xs font-black uppercase tracking-widest mb-6"
          >
            {t('about.badge')}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-stone-900 mb-8 font-display">
            {t('hero.title')} <span className="text-turmeric">{t('hero.subtitle')}</span>
          </h1>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {t('about.heroDesc')}
          </p>
        </div>
      </section>

      {/* AP & Telangana Focus */}
      <section className="py-24 bg-orange-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 font-display">
                {t('about.regionalTitle')}
              </h2>
              <div className="space-y-6">
                <div className="flex gap-6 p-6 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl transition-all">
                  <div className="bg-vermilion p-4 rounded-2xl h-fit">
                    <MapPin className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-stone-900">{t('about.telanganaHub')}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {t('about.telanganaDesc')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 p-6 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl transition-all">
                  <div className="bg-turmeric p-4 rounded-2xl h-fit">
                    <MapPin className="text-stone-900 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-stone-900">{t('about.andhraOutreach')}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {t('about.andhraDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-4">
                  <div className="aspect-[4/5] bg-saffron-100 rounded-[2rem] overflow-hidden">
                     <div className="p-8 h-full flex flex-col justify-end text-vermilion">
                        <span className="text-4xl font-black">2.8L+</span>
                        <span className="text-xs font-bold uppercase tracking-wider">{t('about.registrations')}</span>
                     </div>
                  </div>
                  <div className="aspect-square bg-stone-900 rounded-[2rem] p-8 text-white flex flex-col justify-center gap-2">
                     <Award className="text-turmeric w-10 h-10" />
                     <span className="text-lg font-bold leading-tight">{t('about.certified')}</span>
                  </div>
               </div>
               <div className="pt-12 space-y-4">
                  <div className="aspect-square bg-turmeric rounded-[2rem] p-8 text-stone-900 flex flex-col justify-center gap-2">
                     <Users className="text-stone-900 w-10 h-10" />
                     <span className="text-lg font-bold leading-tight">{t('about.skillUp')}</span>
                  </div>
                  <div className="aspect-[4/5] bg-stone-100 rounded-[2rem] p-8 flex flex-col justify-end text-stone-900">
                     <span className="text-4xl font-black">85+</span>
                     <span className="text-xs font-bold uppercase tracking-wider">{t('about.centers')}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 underline decoration-turmeric/30 underline-offset-8">
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 font-display">{t('about.benefitsTitle')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: t('about.benefit1Title'), desc: t('about.benefit1Desc') },
              { icon: BookOpen, title: t('about.benefit2Title'), desc: t('about.benefit2Desc') },
              { icon: ShoppingBag, title: t('about.benefit3Title'), desc: t('about.benefit3Desc') },
              { icon: Award, title: t('about.benefit4Title'), desc: t('about.benefit4Desc') }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 hover:border-turmeric/50 transition-all group"
              >
                <item.icon className="text-vermilion mb-6 group-hover:scale-110 transition-transform" size={40} />
                <h3 className="text-xl font-bold text-stone-900 mb-3">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-vermilion relative overflow-hidden text-center text-white">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.2)_100%)]" />
         <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black mb-8 font-display">{t('about.joinTitle')}</h2>
            <p className="text-lg text-stone-100 mb-10 leading-relaxed font-medium">
              {t('about.joinDesc')}
            </p>
            <button 
              onClick={onJoinClick}
              className="bg-turmeric text-stone-900 px-10 py-5 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all focus:ring-4 focus:ring-white/20"
            >
              {t('about.registerNow')}
            </button>
         </div>
      </section>
    </div>
  );
}
