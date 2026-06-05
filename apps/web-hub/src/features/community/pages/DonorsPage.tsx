import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart, Crown, Shield, Star, CheckCircle } from 'lucide-react';
import { SEO } from '@/shared/components/SEO';

const tiers = [
  { id: 'patron', icon: <Crown className="text-stone-900" size={24} />, color: "bg-gradient-to-br from-gold-400 to-gold-600", text: "text-stone-900" },
  { id: 'gold', icon: <Star className="text-white" size={24} />, color: "bg-gradient-to-br from-stone-800 to-stone-900", text: "text-white" },
  { id: 'silver', icon: <Shield className="text-stone-800" size={24} />, color: "bg-gradient-to-br from-stone-200 to-stone-400", text: "text-stone-900" }
];

const mockDonors = [
  { name: 'Dr. Ramesh Vishwakarma', tier: 'patron' },
  { name: 'Smt. Lakshmi Devi Foundation', tier: 'patron' },
  { name: 'Aravind Manufacturing Group', tier: 'gold' },
  { name: 'Srikanth Chari', tier: 'gold' },
  { name: 'Vijay Kumar Acharya', tier: 'silver' },
  { name: 'Praveen Shilpi', tier: 'silver' },
  { name: 'Hari Prasad', tier: 'silver' }
];

export const DonorsPage = () => {
  const { t, i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';

  return (
    <>
      <SEO 
        title={t('donors.page_title' as never, 'Community Donors')} 
        description={t('donors.page_desc' as never, 'Honor roll of our community supporters.')}
      />
      
      {/* Hero Section */}
      <section className="bg-stone-950 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold-500/10 blur-[150px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-8 backdrop-blur-md"
          >
            <Heart className="text-gold-500" size={18} fill="currentColor" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{t('donors.badge' as never, 'Community Support')}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-5xl md:text-7xl font-black text-white mb-6 leading-tight font-display ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}
          >
            {t('donors.title' as never, 'The Pillar of Our Legacy')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-xl text-stone-400 max-w-3xl mx-auto leading-relaxed mb-12 ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}
          >
            {t('donors.subtitle' as never, 'Every contribution builds the foundation for our next five millennia. Join the ranks of visionaries empowering the Vishwakarma community.')}
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-gold-400 to-gold-600 text-stone-900 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all shadow-2xl shadow-gold-500/20"
          >
            {t('donors.cta_contribute' as never, 'Make a Contribution')}
          </motion.button>
        </div>
      </section>

      {/* Wall of Honor */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-5xl font-black text-stone-900 mb-4 font-display ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
              {t('donors.wall_title' as never, 'Wall of Honor')}
            </h2>
            <p className="text-stone-500 uppercase tracking-widest text-xs font-bold">
              {t('donors.wall_subtitle' as never, 'Recognizing our esteemed sponsors')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div key={tier.id} className="space-y-6">
                 <div className={`p-6 rounded-3xl ${tier.color} ${tier.text} flex items-center gap-4 shadow-xl`}>
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md text-inherit">
                      {tier.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-widest">{t(`donors.tiers.${tier.id}.name` as never, tier.id)}</h3>
                      <p className="opacity-80 text-xs font-bold">{t(`donors.tiers.${tier.id}.amount` as never, 'Amount')}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                   {mockDonors.filter(d => d.tier === tier.id).map((donor, idx) => (
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: idx * 0.1 }}
                       key={idx} 
                       className="bg-white p-6 rounded-2xl border border-stone-100 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow group cursor-default"
                     >
                       <div className="flex items-center gap-3">
                          <CheckCircle size={16} className="text-vermilion opacity-0 group-hover:opacity-100 transition-opacity" />
                          <p className="font-bold text-stone-800">{donor.name}</p>
                       </div>
                     </motion.div>
                   ))}
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
