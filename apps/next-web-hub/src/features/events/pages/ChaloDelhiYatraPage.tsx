"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  Flag, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Phone, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  ScrollText, 
  Award, 
  Check, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { JoinModal } from '@/features/onboarding/components/JoinModal';

export const ChaloDelhiYatraPage = () => {
  const { i18n } = useTranslation();
  const lang = (['en', 'te', 'hi'].includes(i18n.language) ? i18n.language : 'en') as 'en' | 'te' | 'hi';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ROUTE_STATIONS = [
    {
      state: lang === 'te' ? 'తెలంగాణ' : lang === 'hi' ? 'तेलंगाना' : 'Telangana',
      flag: '🏛️',
      districts: ['హైదరాబాద్ (Hyderabad - Flag Off)', 'రంగారెడ్డి (Rangareddy)', 'మేడ్చల్-మల్కాజ్‌గిరి (Medchal)', 'కామారెడ్డి (Kamareddy)', 'నిజామాబాద్ (Nizamabad)', 'ఆదిలాబాద్ (Adilabad)'],
      color: 'border-amber-500 bg-amber-50/40 text-amber-900',
      badge: 'Start Point (Sep 17)'
    },
    {
      state: lang === 'te' ? 'మహారాష్ట్ర' : lang === 'hi' ? 'महाराष्ट्र' : 'Maharashtra',
      flag: '🚩',
      districts: ['యవత్మాల్ (Yavatmal)', 'వార్ధా (Wardha)', 'నాగ్‌పూర్ (Nagpur)'],
      color: 'border-orange-500 bg-orange-50/40 text-orange-900',
      badge: 'Central Sector'
    },
    {
      state: lang === 'te' ? 'మధ్యప్రదేశ్' : lang === 'hi' ? 'मध्य प्रदेश' : 'Madhya Pradesh',
      flag: '🌲',
      districts: ['సియోని (Seoni)', 'నర్సింగ్‌పూర్ (Narsinghpur)', 'సాగర్ (Sagar)', 'దతియా (Datia)', 'గ్వాలియర్ (Gwalior)', 'మొరేనా (Morena)'],
      color: 'border-emerald-500 bg-emerald-50/40 text-emerald-900',
      badge: 'Heartland'
    },
    {
      state: lang === 'te' ? 'ఉత్తర ప్రదేశ్' : lang === 'hi' ? 'उत्तर प्रदेश' : 'Uttar Pradesh',
      flag: '🛕',
      districts: ['లలిత్‌పూర్ (Lalitpur)', 'ఝాన్సీ (Jhansi)', 'ఆగ్రా (Agra)', 'మథుర (Mathura)'],
      color: 'border-blue-500 bg-blue-50/40 text-blue-900',
      badge: 'Heritage Corridor'
    },
    {
      state: lang === 'te' ? 'రాజస్థాన్' : lang === 'hi' ? 'राजस्थान' : 'Rajasthan',
      flag: '🏰',
      districts: ['ధోల్‌పూర్ (Dholpur)'],
      color: 'border-rose-500 bg-rose-50/40 text-rose-900',
      badge: 'Artisan Hub'
    },
    {
      state: lang === 'te' ? 'హర్యానా & ఢిల్లీ' : lang === 'hi' ? 'हरियाणा व दिल्ली' : 'Haryana & Delhi',
      flag: '🇮🇳',
      districts: ['పల్వల్ (Palwal)', 'ఫరీదాబాద్ (Faridabad)', 'న్యూ ఢిల్లీ (New Delhi - Culmination)'],
      color: 'border-vermilion bg-vermilion/5 text-stone-900',
      badge: 'Grand Finale (Nov 29)'
    }
  ];

  const DEMANDS_15 = [
    {
      titleEn: "1. Accurate Caste Census & Data Representation",
      titleTe: "1. సమగ్ర కుల గణన & సామాజిక సర్వే",
      titleHi: "1. सटीक जातिगत जनगणना एवं सामाजिक आंकड़े",
      descEn: "Collection of authentic socio-economic and demographic data of the Vishwakarma community across all states."
    },
    {
      titleEn: "2. Equal Opportunities in Education & Government Jobs",
      titleTe: "2. విద్య మరియు ప్రభుత్వ ఉద్యోగాలలో సమాన హక్కులు",
      titleHi: "2. उच्च शिक्षा एवं सरकारी रोजगार में समान अवसर",
      descEn: "Targeted reservations, advanced technical polytechnics, and skill development universities for Vishwakarma youth."
    },
    {
      titleEn: "3. Comprehensive Protection for 18 Traditional Trades",
      titleTe: "3. 18 సాంప్రదాయ చేతివృత్తుల సంరక్షణ & స్వయం ఉపాధి",
      titleHi: "3. 18 पारंपरिक शिल्पों की सुरक्षा व स्वरोजगार सुरक्षा",
      descEn: "Subsidized raw materials, modernized toolkits, zero-interest loans, and market linkage for craftsmen."
    },
    {
      titleEn: "4. Women Artisan Welfare & Entrepreneurship Fund",
      titleTe: "4. మహిళా కళాకారుల సంక్షేమం & వ్యవస్థాపక నిధి",
      titleHi: "4. महिला शिल्पकार कल्याण एवं स्वरोजगार कोष",
      descEn: "Dedicated financial support, micro-credit loans, and digital marketing tools for rural women artisans."
    },
    {
      titleEn: "5. Constitutional, Political & Administrative Representation",
      titleTe: "5. చట్టసభలు మరియు ప్రభుత్వ కమిషన్లలో దామాషా ప్రాతినిధ్యం",
      titleHi: "5. विधायी व प्रशासनिक संस्थाओं में जनसंख्यानुसार भागीदारी",
      descEn: "Fair political nomination in state assemblies, parliament, boards, and national heritage commissions."
    },
    {
      titleEn: "6. Artisan Health Insurance & Pension Security",
      titleTe: "6. వృద్ధ కళాకారులకు పెన్షన్ & ఉచిత ఆరోగ్య బీమా",
      titleHi: "6. वरिष्ठ शिल्पकारों के लिए मासिक पेंशन व स्वास्थ्य बीमा",
      descEn: "Comprehensive social security, monthly artisan pension, and specialized healthcare for traditional guild workers."
    }
  ];

  const shareText = `🚩 జై విశ్వకర్మ! పుష్పగిరి చలో ఢిల్లీ చారిత్రక పాదయాత్ర (1,700 కి.మీ, హైదరాబాద్ నుండి ఢిల్లీ) ప్రారంభం కానుంది.\n\nమన హక్కులు & అస్తిత్వం కోసం మీరూ మొబైల్ నంబర్‌తో నమోదు చేసుకోండి — డిజిటల్ పాస్ పొందండి:\nhttps://vishwakarmaknowledgecentre.org/events/chalo-delhi-yatra`;

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-vermilion/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest border border-amber-500/30">
              <Flag size={14} className="text-amber-400" />
              <span>
                {lang === 'te' ? 'పుష్పగిరి చలో ఢిల్లీ పాదయాత్ర' : lang === 'hi' ? 'पुष्पगिरि चलो दिल्ली पदयात्रा' : 'Historic National Ekta Yatra'}
              </span>
            </div>
            <span className="text-[10px] font-bold bg-white/10 px-3 py-1.5 rounded-full text-stone-300">
              NH-44 Corridor • 1,700 KM
            </span>
          </div>

          {/* Main Title */}
          <div className="max-w-4xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-display tracking-tight leading-[1.15]">
              {lang === 'te' 
                ? 'హైదరాబాద్ నుండి ఢిల్లీ వరకు చారిత్రక పాదయాత్ర: మన హక్కులు & అస్తిత్వ పోరాటం'
                : lang === 'hi'
                  ? 'हैदराबाद से दिल्ली तक की पदयात्रा: विश्वकर्मा समाज उठाएगा अपने हक और वजूद की आवाज'
                  : 'Hyderabad to Delhi 1,700 KM Foot March: Vishwakarma Community Rallies for Constitutional Rights'}
            </h1>

            <p className="text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
              {lang === 'te'
                ? 'విశ్వకర్మ నాలెడ్జ్ సెంటర్ (VKC) ఆధ్వర్యంలో సెప్టెంబర్ 17 విశ్వకర్మ పూజా దినోత్సవం నుండి నవంబర్ 29 వరకు 6 రాష్ట్రాలు, 23+ జిల్లాల మీదుగా సాగే దేశంలోనే అతిపెద్ద విశ్వకర్మ వంశస్థుల ఐక్యతా యాత్ర.'
                : lang === 'hi'
                  ? 'विश्वकर्मा नॉलेज सेंटर (VKC) के तत्वावधान में 17 सितंबर विश्वकर्मा पूजा दिवस से 29 नवंबर तक 6 राज्यों और 23+ जिलों से होकर निकलने वाली देश की सबसे बड़ी विश्वकर्मा एकता पदयात्रा।'
                  : 'Organized under the auspices of Vishwakarma Knowledge Centre (VKC), Hyderabad. A monumental 74-day foot march along NH-44 traversing 6 states to submit a 15-point charter of demands to the Central Government.'}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 my-10 max-w-4xl">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">1,700 KM</p>
              <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-wider mt-1">Total Distance (మొత్తం దూరం)</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-black text-white">74 Days</p>
              <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-wider mt-1">Sep 17 — Nov 29, 2026</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">6 States</p>
              <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-wider mt-1">Traversing NH-44</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-black text-rose-400">15 Points</p>
              <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-wider mt-1">Charter of Demands</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-vermilion to-amber-500 hover:from-vermilion-600 hover:to-amber-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-vermilion/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Phone size={16} />
              <span>{lang === 'te' ? 'మొబైల్ నంబర్‌తో నమోదు చేసుకోండి' : lang === 'hi' ? 'मोबाइल नंबर से रजिस्टर करें' : 'Register with Mobile Number'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Share2 size={16} />
              <span>{lang === 'te' ? 'వాట్సాప్‌లో షేర్ చేయండి' : 'Share on WhatsApp'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. MINISTERIAL DELEGATION BRIEFING */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-50 border border-stone-200/80 rounded-3xl p-6 md:p-10">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck size={12} />
                  <span>Central Government Engagement</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                  {lang === 'te'
                    ? 'కేంద్ర సహాయ మంత్రి శ్రీ అజయ్ టమ్టా గారితో VKC బృందం భేటీ'
                    : lang === 'hi'
                      ? 'केंद्रीय राज्य मंत्री श्री अजय टम्टा से VKC प्रतिनिधिमंडल की शिष्टाचार भेंट'
                      : 'VKC Delegation Meets Union MoS Shri Ajay Tamta'}
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {lang === 'te'
                    ? 'విశ్వకర్మ నాలెడ్జ్ సెంటర్ (VKC) హైదరాబాద్ ప్రతినిధి బృందం విశ్వనాథుల పుష్పగిరి గారి నాయకత్వంలో, రమ్యచారి, నరేష్ చారి, రవి చారితో కలిసి కేంద్ర రోడ్డు రవాణా & జాతీయ రహదారుల శాఖ సహాయ మంత్రి శ్రీ అజయ్ టమ్టా గారిని కలిసి పాదయాత్ర ప్రణాళిక, భద్రత మరియు 15 సూత్రాల డిమాండ్లను వివరించారు.'
                    : lang === 'hi'
                      ? 'विश्वकर्मा नॉलेज सेंटर (VKC), हैदराबाद के पदाधिकारियों ने विश्वनाथुल पुष्पगिरि के नेतृत्व में रमय्याचारी, नरेश चारी व रवि चारी सहित केंद्रीय सड़क परिवहन एवं राजमार्ग राज्य मंत्री श्री अजय टम्टा से शिष्टाचार भेंट कर पदयात्रा की रूपरेखा प्रस्तुत की एवं राष्ट्रीय सुरक्षा व सहयोग का मार्गदर्शन प्राप्त किया।'
                      : 'The VKC delegation led by Vishwanadhula Pushpagiri, alongside Ramyachari, Naresh Chary, and Ravi Chary, formally briefed Union Minister of State for Road Transport and Highways, Shri Ajay Tamta, on the logistics of the 1,700 KM foot march and submitted the charter of socio-economic demands.'}
                </p>
              </div>

              <div className="bg-stone-900 text-white p-6 rounded-2xl space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-amber-400">Yatra Leadership</p>
                <ul className="space-y-2 text-xs font-medium text-stone-300">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-400" />
                    <span>Vishwanadhula Pushpagiri (Leader)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-400" />
                    <span>Mukesh Kumar Jangid (Coordinator)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-400" />
                    <span>Ramyachari & Naresh Chary</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-400" />
                    <span>Ravi Chary & Regional Yatris</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE 6-STATE ROUTE ALONG NH-44 */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              Corridor Traversal Map
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 font-display">
              {lang === 'te' ? 'NH-44 మీదుగా 6 రాష్ట్రాల పాదయాత్ర మార్గదర్శి' : 'Route Roadmap Across 6 States on NH-44'}
            </h2>
            <p className="text-stone-600 text-sm">
              {lang === 'te' 
                ? 'హైదరాబాద్ నుండి బయలుదేరి తెలంగాణ, మహారాష్ట్ర, మధ్యప్రదేశ్, యూపీ, రాజస్థాన్, హర్యానా మీదుగా దేశ రాజధాని ఢిల్లీ వరకు.'
                : 'Traversing 23+ industrial, agricultural, and craft districts from Hyderabad to Parliament in New Delhi.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROUTE_STATIONS.map((station, index) => (
              <div 
                key={index}
                className={`bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{station.flag}</span>
                      <h3 className="text-lg font-black text-stone-900 font-display">{station.state}</h3>
                    </div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {station.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Major Stations:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {station.districts.map((d, di) => (
                        <span key={di} className="text-xs bg-stone-50 border border-stone-200/60 px-2.5 py-1 rounded-lg font-medium text-stone-700">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-500">
                  <span>Stage {index + 1} of 6</span>
                  <span className="text-amber-600 font-black">NH-44 Route</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 15-POINT CHARTER OF DEMANDS */}
      <section className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vermilion/10 text-vermilion text-[10px] font-black uppercase tracking-wider">
              <ScrollText size={12} />
              <span>National Memorandum</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 font-display">
              {lang === 'te' ? 'కేంద్ర ప్రభుత్వానికి 15 సూత్రాల ప్రధాన డిమాండ్లు' : '15-Point Charter of National Demands'}
            </h2>
            <p className="text-stone-600 text-sm">
              {lang === 'te'
                ? 'విశ్వకర్మ వంశస్థుల సాంఘిక, ఆర్థిక, విద్య మరియు రాజకీయ సాధికారతకై రూపొందించిన చారిత్రక డిమాండ్ల పత్రం.'
                : 'Key constitutional, social, and economic rights presented for the upliftment of traditional artisan clans.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMANDS_15.map((demand, index) => (
              <div key={index} className="bg-stone-50 border border-stone-200/80 rounded-3xl p-6 space-y-3">
                <div className="w-8 h-8 rounded-full bg-vermilion text-white font-black text-xs flex items-center justify-center">
                  #{index + 1}
                </div>
                <h3 className="font-black text-stone-900 text-base font-display">
                  {lang === 'te' ? demand.titleTe : lang === 'hi' ? demand.titleHi : demand.titleEn}
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {demand.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 10-SECOND FAST PHONE REGISTRATION EMBED */}
      <section className="py-20 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-vermilion to-amber-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-vermilion/30">
            <Sparkles size={28} />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display">
              {lang === 'te' 
                ? 'పాదయాత్రలో మీరూ భాగస్వామ్యం అవ్వండి' 
                : 'Join the Pushpagiri Chalo Delhi Yatra Network'}
            </h2>
            <p className="text-stone-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {lang === 'te'
                ? 'మీ మొబైల్ నంబర్‌తో నమోదు చేసుకొని అధికారిక డిజిటల్ యాత్రిక్ పాస్ పొందండి. వాట్సాప్ ద్వారా నిరంతరం సమాచారం అందుకోండి.'
                : 'Enter your phone number to generate your instant Digital Yatra Member Pass and receive real-time location updates.'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-vermilion hover:bg-vermilion-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-vermilion/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Phone size={16} />
              <span>{lang === 'te' ? 'ఇప్పుడే ఉచితంగా నమోదు చేసుకోండి' : 'Register Free in 10 Seconds'}</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Share2 size={16} />
              <span>{lang === 'te' ? 'వాట్సాప్‌లో ప్రచారం చేయండి' : 'Share with Local Mandal'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Reusable Onboarding Modal prefilled with Yatra */}
      <JoinModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultTrack="yatra" 
      />
    </div>
  );
};
