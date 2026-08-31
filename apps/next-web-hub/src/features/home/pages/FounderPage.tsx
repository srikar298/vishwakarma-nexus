"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Quote, 
  Award, 
  Globe, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  Target, 
  Scale, 
  ScrollText
} from 'lucide-react';
import Link from 'next/link';
import { ScrollToTop } from '@/shared/components/ScrollToTop';
import { PageHero } from '@/shared/ui/PageHero';
import { LeadershipRoster } from '@/features/home/components/LeadershipRoster';

const TIMELINE_EVENTS = [
  { year: '2026', date: 'May 31', category: 'milestone', te: 'పదేళ్ళ దశాబ్ది ఉత్సవాల వేడుక - సుందరయ్య విజ్ఞాన కేంద్రం.', hi: '10वीं वर्षगांठ का भव्य उत्सव - सुंदरय्या विज्ञान केंद्र।', en: '10th Anniversary Decennial Celebration at Sundarayya Vignana Kendram.' },
  { year: '2026', date: 'Apr', category: 'movement', te: 'ప్రభుత్వంతో సంప్రదింపులు - విశ్వకర్మలకు ప్రత్యేక కార్పొరేషన్ కోసం పోరాటం.', hi: 'सरकार के साथ संवाद - विश्वकर्मा समुदाय के लिए विशेष निगम की मांग।', en: 'Strategic dialogue with govt for dedicated Vishwakarma Corporation.' },
  { year: '2025', date: 'Oct', category: 'achievement', te: 'తెలంగాణలోని 26 జిల్లాల్లో 2.8 లక్షల నమోదులు పూర్తి.', hi: 'तेलंगाना के 26 जिलों में 2.8 लाख पंजीकरण पूर्ण।', en: 'Reached 2.8 Lakh registrations across 26 districts in Telangana.' },
  { year: '2025', date: 'Jan', category: 'campaign', te: 'గ్రామస్థాయి చైతన్య యాత్ర - 100 గ్రామాల్లో పర్యటన.', hi: 'ग्राम स्तरीय जागरूकता यात्रा - 100 गांवों का दौरा।', en: 'Village-level awareness padayatra across 100 rural locations.' },
  { year: '2024', date: 'Sep', category: 'milestone', te: 'PM విశ్వకర్మ యోజన అమలులో కీలక పాత్ర - రాష్ట్రస్థాయి అవార్డు.', hi: 'पीएम विश्वकर्मा योजना के कार्यान्वयन में महत्वपूर्ण भूमिका - राज्य स्तरीय पुरस्कार।', en: 'Key role in PM Vishwakarma Yojana implementation - State recognition.' },
  { year: '2024', date: 'Feb', category: 'movement', te: 'చలో ఢిల్లీ - జాతీయ స్థాయిలో కళాకారుల హక్కుల కోసం గళం.', hi: 'चलो दिल्ली - राष्ट्रीय स्तर पर शिल्पकारों के अधिकारों के लिए आवाज उठाई।', en: 'Chalo Delhi - Advocated for artisan rights at the National Capital.' },
  { year: '2021-2023', date: '2022', category: 'charity', te: 'కరోనా కష్టకాలంలో కళాకారుల కుటుంబాలకు ఆహార, ఆర్థిక సాయం.', hi: 'कोरोना काल में शिल्पकार परिवारों को भोजन और आर्थिक सहायता।', en: 'Covid-19 Relief: Food and financial aid to 5,000+ artisan families.' },
  { year: '2021-2023', date: '2021', category: 'achievement', te: 'VKC ట్రైనింగ్ సెంటర్ల ప్రారంభం - హైదరాబాద్ మరియు ఖమ్మం.', hi: 'वीकेसी प्रशिक्षण केंद्रों की शुरुआत - हैदराबाद और खम्मम।', en: 'Launched VKC Skill Training Centres in Hyderabad & Khammam.' },
  { year: '2017-2020', date: '2018', category: 'milestone', te: 'సంస్థ అధికారిక నమోదు (VKC ® 336/2018).', hi: 'संस्था का आधिकारिक पंजीकरण (VKC ® 336/2018)।', en: 'Official Registration of VKC as a legal entity (Reg. 336/2018).' },
  { year: '2017-2020', date: '2017', category: 'origin', te: '25.02.2017న విశ్వకర్మ నాలెడ్జ్ సెంటర్ స్థాపన.', hi: '25.02.2017 को विश्वकर्मा ज्ञान केंद्र की स्थापना।', en: 'Foundation of Vishwakarma Knowledge Centre on Feb 25, 2017.' }
];

export const FounderPage = () => {
  const { t, i18n } = useTranslation();
  const isTelugu = i18n.language === 'te';
  const isHindi = i18n.language === 'hi';
  const [selectedYear, setSelectedYear] = useState('2024');

  const yearFilters = ['2017-2020', '2021-2023', '2024', '2025', '2026'];

  const filteredEvents = TIMELINE_EVENTS.filter(e => e.year === selectedYear);

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'origin': return <ScrollText size={16} />;
      case 'milestone': return <Target size={16} />;
      case 'achievement': return <Award size={16} />;
      case 'movement': return <Scale size={16} />;
      case 'charity': return <Globe size={16} />;
      default: return <Calendar size={16} />;
    }
  };

  const getCategoryStyle = (cat: string) => {
    switch(cat) {
      case 'origin': return 'bg-vermilion/10 border-vermilion/20 text-vermilion';
      case 'milestone': return 'bg-turmeric/10 border-turmeric/20 text-turmeric-700';
      case 'achievement': return 'bg-amber-500/10 border-amber-500/20 text-amber-600';
      case 'movement': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'charity': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'campaign': return 'bg-violet-500/10 border-violet-500/20 text-violet-400';
      default: return 'bg-stone-500/10 border-stone-500/20 text-stone-400';
    }
  };

    const founderSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Viswanadhula Pushpagiri",
    "jobTitle": "Founder & Chairman",
    "affiliation": {
      "@type": "Organization",
      "name": "Vishwakarma Knowledge Centre",
      "foundingDate": "2017-02-25",
      "description": "A dedicated institution for the holistic support and recognition of traditional artisans."
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      
      <PageHero
        texture="grid"
        align="left"
        className="!pb-16"
        badgeLabel="The Founder's Journey"
        title={isTelugu ? 'విశ్వనాథుల పుష్పగిరి' : 'Viswanadhula Pushpagiri'}
      >
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/3"
          >
            <div className="aspect-[3/4] rounded-[4rem] overflow-hidden border-8 border-stone-800 shadow-3xl shadow-black/50 rotate-[-2deg] hover:rotate-0 transition-transform duration-700 group">
              <img 
                src="/images/features/home/founder/portrait-full.webp" 
                alt="Founder" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </motion.div>

          <div className="lg:w-2/3 space-y-8">
             <div className="flex flex-col md:flex-row gap-8 items-start md:items-center py-8 border-t border-white/5">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest leading-none">Founder & Chairman</p>
                   <p className="text-xl font-black text-vermilion uppercase tracking-tighter">VKC Board</p>
                </div>
                <div className="hidden md:block w-[1px] h-10 bg-white/10" />
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest leading-none">Registration ID</p>
                   <p className="text-xl font-black text-white uppercase tracking-tighter">
                     {isTelugu ? 'VKC ® 336/2018 (నమోదిత)' : 'VKC ® 336/2018'}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </PageHero>

      {/* Biography Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-16">
           <div className="relative py-12 px-10 md:px-20 bg-stone-50 rounded-[3rem] border border-stone-100 shadow-inner overflow-hidden">
              <Quote className="absolute -top-6 left-12 text-vermilion/5" size={120} />
              <p className={`text-2xl md:text-3xl font-black text-stone-800 italic leading-relaxed relative z-10 text-center
                ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                 &quot;{t('founder.quote')}&quot;
              </p>
           </div>
           
           <div className="grid md:grid-cols-2 gap-16 items-start">
              <div className="space-y-6">
                 <h3 className="text-3xl font-black text-stone-900">The Journey</h3>
                 <p className="text-stone-600 leading-relaxed font-medium">
                   {t('founder.bio')}
                 </p>
                 <p className="text-stone-600 leading-relaxed font-medium font-bold">
                   {t('founder.padayatra')}
                 </p>
                 <p className="text-stone-600 leading-relaxed font-medium">
                   His unwavering resolve has redefined empowerment for the community, turning a local mission into a national movement.
                 </p>
              </div>

              <div className="space-y-8 bg-stone-50 p-10 rounded-[3rem] border border-stone-100 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-vermilion/5 rounded-full blur-3xl -mr-16 -mt-16" />
                 <h4 className="text-xl font-black text-stone-900 border-l-4 border-vermilion pl-6">Founder&apos;s Impact</h4>
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                       <ShieldCheck className="text-vermilion mt-1" size={20} />
                       <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">1,000+ km Walk for Change</p>
                    </div>
                    <div className="flex items-start gap-4">
                       <Globe className="text-vermilion mt-1" size={20} />
                       <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Village-to-Delhi Connection</p>
                    </div>
                    <div className="flex items-start gap-4">
                       <Award className="text-vermilion mt-1" size={20} />
                       <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">National Empowerment Stage</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Idea & Aims Section */}
      <section className="py-24 bg-stone-50 border-t border-b border-stone-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-16">
               {/* Left: Idea/ఆలోచన */}
               <div className="lg:col-span-1 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-vermilion/10 text-vermilion px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                     {isTelugu ? 'ఆలోచన' : isHindi ? 'विचार' : 'The Origin Idea'}
                  </div>
                  <h3 className="text-3xl font-black text-stone-900 leading-tight">
                     {isTelugu ? 'సమాజ రక్షణే ధ్యేయంగా...' : 'Securing Community Roots'}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed font-medium">
                     {isTelugu ? (
                        'విశ్వకర్మ తాత్వికత కలిగిన రచయితగా మొదలైన నా ప్రయాణం కేవలం సాహితీ రంగంలోనే కాకుండా పోరాట వ్యూహం తెలిసిన విశ్వకర్మ ఉద్యమ నాయకుడిగా నిలబడితేనే చారిత్రాత్మక విశ్వకర్మ సమాజం యొక్క మూలాల్ని, మనుగడను కాపాడుకోగలను అని నిర్ణయించుకొని "రుంజ" విశ్వకర్మ కవులు రచయితల కళాకారుల వేదికకు రాజీనామా చేసి 25.02.2017 న శ్రీ వీరబ్రహ్మేంద్ర స్వామి నుండి మారోజు వీరన్న వరకు గల తాత్విక భూమికను అనుసరిస్తూ విశ్వకర్మ నాలెడ్జ్ సెంటర్ ప్రారంభించాను.'
                     ) : (
                        'My journey began as a writer grounded in Vishwakarma philosophy. However, I realized that to protect the roots and survival of the historical Vishwakarma society, I had to stand as a movement leader who understood strategic struggle. Hence, I resigned from the "Runja" poets, writers, and artists forum, and on 25.02.2017, following the philosophical foundations from Sri Veerabrahmendra Swami to Maroju Veeranna, I established the Vishwakarma Knowledge Centre.'
                     )}
                  </p>
                  <div className="pt-4 text-xs font-bold text-stone-400">
                     Registered Organization: VKC ® 336/2018
                  </div>
               </div>

               {/* Right: Aims/ఆశయాలు */}
               <div className="lg:col-span-2 space-y-8">
                  <div className="inline-flex items-center gap-2 bg-saffron-500/10 text-saffron-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                     {isTelugu ? 'ఆశయాలు' : isHindi ? 'उद्देश्य' : 'Our Aims & Mission'}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                     {[
                        {
                           num: "1",
                           te: "ప్రపంచీకరణ మత్తులో మనం మూల సంస్కృతిని కోల్పోతున్న తరుణంలో విశ్వకర్మ సమాజపు సంస్కృతి సంప్రదాయాలు కాపాడేందుకు కృషి చేయడం.",
                           en: "Striving to protect the culture and traditions of the Vishwakarma community in an era where globalization is causing us to lose our root heritage."
                        },
                        {
                           num: "2",
                           te: "విశ్వకర్మలు నాగరికతకు వెన్నుముకగా నిలిచారు కానీ వారి కృషి చరిత్రలో నమోదు కాలేదు. అందుబాటులో ఉన్న సమాచారాన్ని డిజిటలైజ్ చేసి రేపటి తరాలకు అందించడం.",
                           en: "Preserving and digitizing the historical contributions and creative works of Vishwakarmas as creators of civilization for future generations."
                        },
                        {
                           num: "3",
                           te: "కుటుంబం చేత నిరాదరించబడ్డ లేదా తల్లిదండ్రులను కోల్పోయిన విశ్వకర్మ సమాజపు పిల్లలను చేరదీసి ఉన్నత లక్ష్యాలు గల భావి పౌరులుగా తీర్చిద్దడం.",
                           en: "Supporting neglected or orphaned children within the community and shaping them into future citizens with high ambitions."
                        },
                        {
                           num: "4",
                           te: "విశ్వకర్మ విద్యార్థులకు రాష్ట్రస్థాయిలో స్టడీ సర్కిల్లను / పాఠశాలలు ఏర్పాటు చేసి విద్యాసంబంధ సహాయాన్ని అందించడం, పోటీ పరీక్షలకు సమాయత్తం చేయడం.",
                           en: "Establishing study circles and schools for Vishwakarma students to provide academic support and training for competitive exams."
                        },
                        {
                           num: "5",
                           te: "విశ్వకర్మల సమగ్ర సాధికారతే లక్ష్యంగా గ్రామస్థాయిలో చైతన్యం చేయడం, నూతన కార్యాచరణతో అభివృద్ధిని సాధించడం.",
                           en: "Mobilizing and raising awareness among Vishwakarmas at the village level, helping them adapt to modern changes and achieve holistic development."
                        },
                        {
                           num: "6",
                           te: "రాజ్యాధికారమే లక్ష్యంగా క్షేత్రస్థాయిలో విశ్వకర్మ నెట్వర్క్ని ఏర్పాటు చేసి విశ్వకర్మ ప్రజల్ని రాజకీయ శక్తిగా మార్చేందుకు కృషి చేయడం.",
                           en: "Building a grassroot political network to raise political awareness, striving to transform the community into an empowered political force."
                        }
                     ].map((aim, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-100 flex gap-4 hover:shadow-md transition-shadow">
                           <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                              {aim.num}
                           </div>
                           <p className="text-stone-600 text-xs font-semibold leading-relaxed">
                              {isTelugu ? aim.te : aim.en}
                           </p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-24 bg-white overflow-hidden group">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-[10px] font-black text-vermilion uppercase tracking-[0.5em]">{isTelugu ? 'ప్రస్థానం' : isHindi ? 'यात्रा' : 'The Journey'}</h2>
              <h3 className="text-4xl font-black text-stone-900 uppercase tracking-tighter">
                {isTelugu ? 'చారిత్రాత్మక ప్రస్థానం' : isHindi ? 'संस्थागत समयरेखा' : 'Institutional Timeline'}
              </h3>
              <p className="text-stone-500 text-sm font-medium max-w-lg mx-auto">
                {isTelugu 
                  ? '2017 లో స్థాపించినప్పటి నుండి విశ్వకర్మ హక్కుల కోసం, సంస్కృతి పరిరక్షణ కోసం చేపట్టిన ప్రధాన మైలురాళ్ళు.' 
                  : isHindi
                  ? '2017 में स्थापना के बाद से विश्वकर्मा अधिकारों और संस्कृति संरक्षण के लिए किए गए प्रमुख प्रयास और मील के पत्थर।'
                  : 'Key struggles, campaigns, awards, and milestones of VKC from 2017 to 2026.'}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-stone-100 pb-6">
              {yearFilters.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${
                    selectedYear === year 
                      ? 'bg-stone-900 text-white shadow-md scale-105' 
                      : 'bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            <div className="relative border-l-2 border-stone-100 pl-6 ml-4 space-y-8">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedYear}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {filteredEvents.map((event, index) => (
                    <div 
                      key={index}
                      className="relative flex flex-col md:flex-row md:items-start gap-4 md:gap-8 group/event"
                    >
                      {/* Timeline Dot with Category Icon */}
                      <div className="absolute -left-[39px] w-6 h-6 rounded-full bg-white border-2 border-stone-200 flex items-center justify-center group-hover/event:border-stone-900 transition-colors z-10 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-400 group-hover/event:bg-stone-900 transition-colors" />
                      </div>

                      {/* Left: Date Badge */}
                      <div className="md:w-28 shrink-0 flex items-center gap-2.5">
                        <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none bg-stone-50 px-2.5 py-1 rounded border border-stone-100/50 group-hover/event:bg-stone-900 group-hover/event:text-white transition-all">
                          {event.date}
                        </div>
                      </div>

                      {/* Right: Content details */}
                      <div className="flex-1 bg-stone-50 hover:bg-stone-100/30 p-5 rounded-2xl border border-stone-100/80 hover:border-stone-200/50 transition-all flex gap-4 items-start shadow-sm">
                        {/* Category Badge & Icon */}
                        <div className={`p-2.5 rounded-xl border shrink-0 ${getCategoryStyle(event.category)}`}>
                          {getCategoryIcon(event.category)}
                        </div>

                        <div className="space-y-1">
                          <span className={`text-[8px] font-black uppercase tracking-widest inline-block border-b pb-0.5 mb-1 opacity-70`}>
                            {event.category}
                          </span>
                          <p className={`text-stone-700 text-xs md:text-sm font-semibold leading-relaxed 
                            ${isTelugu ? 'font-telugu' : isHindi ? 'font-hindi' : ''}`}>
                            {isTelugu ? event.te : isHindi ? event.hi : event.en}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredEvents.length === 0 && (
                    <div className="text-center py-12 text-stone-400 font-bold text-xs uppercase tracking-widest">
                      {isTelugu ? 'ఈ కాలానికి ఎటువంటి మైలురాళ్లు లేవు' : isHindi ? 'इस अवधि के लिए कोई मील के पत्थर दर्ज नहीं हैं' : 'No events registered for this phase'}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
        </div>
      </section>

      {/* Governing Council & Leadership Section */}
      <LeadershipRoster showAll={true} showHeader={true} />

      {/* Call to Action */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-stone-900 rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 text-center text-white relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
              <div className="relative z-10 space-y-12">
                 <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-10 py-4 rounded-full">
                    <Mail className="text-vermilion" size={20} />
                    <span className="text-xs font-black uppercase tracking-[0.4em]">Get in Touch</span>
                 </div>
                 <h3 className="text-4xl md:text-7xl font-black leading-tight max-w-4xl mx-auto tracking-tighter">
                   For inquiries regarding the Vision 2030 Mandate.
                 </h3>
                 <div className="flex flex-wrap justify-center gap-6">
                    <a href="mailto:founder@vkc-community.org" className="bg-vermilion text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl shadow-vermilion/20 active:scale-95">
                       Email the Chairman
                    </a>
                    <Link href="/vision" className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all backdrop-blur-md">
                       Read Vision 2030
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};
