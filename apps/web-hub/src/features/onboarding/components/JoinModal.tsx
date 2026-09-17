import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Phone, 
  Briefcase, 
  MapPin, 
  ChevronRight, 
  ChevronDown,
  ArrowLeft, 
  CheckCircle2, 
  Hammer, 
  Heart, 
  Sparkles,
  Award,
  Flag,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { submitToGoogleSheets } from '@/infrastructure/api/googleSheets.api';
import { BaseModal } from '@/shared/ui/BaseModal';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';

export type TrackType = 'yatra' | 'artisan' | 'matrimony' | 'professional' | 'mentor' | 'patron';

const TRADES = [
  "Carpenter (Suthar)", "Boat Maker", "Armourer", "Blacksmith (Lohar)", 
  "Hammer and Tool Kit Maker", "Locksmith", "Goldsmith (Sonar)", 
  "Potter (Kumhaar)", "Sculptor / Stone Carver", "Cobbler (Charmakar)", 
  "Mason (Rajmistri)", "Basket/Mat/Broom Maker", "Doll & Toy Maker", 
  "Barber (Naai)", "Garland maker (Malakaar)", "Washerman (Dhobi)", 
  "Tailor (Darzi)", "Fishing Net Maker"
];

const STATES_AND_DISTRICTS = [
  "Telangana - Mahabubnagar", "Telangana - Hyderabad", "Telangana - Rangareddy", 
  "Telangana - Medchal", "Telangana - Warangal", "Telangana - Karimnagar", 
  "Telangana - Nalgonda", "Telangana - Khammam", "Telangana - Nizamabad",
  "Telangana - Sangareddy", "Telangana - Vikarabad", "Telangana - Adilabad",
  "Andhra Pradesh - Visakhapatnam", "Andhra Pradesh - Vijayawada / Krishna", 
  "Andhra Pradesh - Guntur", "Andhra Pradesh - Tirupati", "Andhra Pradesh - Kurnool",
  "Andhra Pradesh - Anantapur", "Andhra Pradesh - Godavari", "Karnataka - Bengaluru", 
  "Maharashtra", "Delhi / NCR", "Other Region"
];

const MODAL_TEXTS = {
  en: {
    badge: '10-Second Express Registration',
    subtitle: 'Vishwakarma Ekta Maha Padayatra & VKC Network',
    stepIndicator: (current: number, total: number) => `Step ${current} of ${total}`,
    purposeLabel: 'Select Registration Purpose / Category',
    phoneLabel: 'Mobile Number (WhatsApp)',
    phonePlaceholder: '98765 43210',
    phoneNote: 'Used for official updates, digital pass SMS, and coordination.',
    nameLabel: 'Full Name',
    namePlaceholder: 'e.g. Brahmasri Ramesh Chary',
    nextBtn: 'Next: District & Category Details',
    locationLabel: 'District / Parliamentary Constituency',
    locationPlaceholder: 'Select your District / Area',
    craftLabelArtisan: 'Traditional Craft Specialization',
    craftPlaceholderArtisan: 'Select your traditional craft',
    craftLabelMatrimony: 'Gotra / Subsect & Profession',
    craftPlaceholderMatrimony: 'e.g. Sanaga Gotra / Software Architect',
    craftLabelMentor: 'Area of Mentorship / Expertise',
    craftPlaceholderMentor: 'e.g. Civil Services Coaching, Enterprise, Tech',
    craftLabelProfessional: 'Profession / Designation / Business',
    craftPlaceholderProfessional: 'e.g. Software Engineer / Architect / Contractor',
    craftLabelYatra: 'Yatra Participation Role',
    craftPlaceholderYatra: 'e.g. Yatri / District Coordinator / Youth Leader',
    craftLabelPatron: 'Community Contribution / Support Interest',
    craftPlaceholderPatron: 'e.g. Cultural Patron, Philanthropy, Education Sponsor',
    lookingForLabel: 'Looking For Alliance',
    lookingForGroom: 'Looking for Groom',
    lookingForBride: 'Looking for Bride',
    pmSchemeTitle: 'PM Vishwakarma Scheme Assistance',
    pmSchemeDesc: 'Assistance for free ₹15,000 modern toolkit e-voucher & low-interest credit.',
    backBtn: 'Go back',
    submitBtn: 'Complete & Generate Digital Pass',
    submitting: 'Registering...',
    confirmedTitle: 'Registration Confirmed!',
    confirmedSub: 'Welcome to Vishwakarma Knowledge Centre & Community Network.',
    passTitle: 'VISHWAKARMA NEXUS',
    passSub: 'Official Verified Member Registry',
    memberName: 'Member Name',
    registeredMobile: 'Registered Mobile',
    districtRegion: 'District / Region',
    category: 'Category',
    verifiedMember: 'Verified Member',
    shareWhatsApp: 'Share on WhatsApp with Fellow Bandhus',
    copyPass: 'Copy Member Pass Details',
    copied: 'Copied to Clipboard!',
    closeReturn: 'Close & Return to Home',
    tracks: {
      professional: 'Professional Network',
      mentor: 'Register as Mentor',
      matrimony: 'Parinaya Matrimony',
      artisan: 'Master Artisan & Digital ID',
      yatra: 'Vishwakarma Ekta Maha Padayatra',
      patron: 'Community Member / Patron'
    }
  },
  te: {
    badge: '10-సెకన్ల ఎక్స్‌ప్రెస్ రిజిస్ట్రేషన్',
    subtitle: 'విశ్వకర్మ వంశస్థుల ఏకతా మహా పాదయాత్ర & VKC నెట్‌వర్క్',
    stepIndicator: (current: number, total: number) => `దశ ${current} / ${total}`,
    purposeLabel: 'నమోదు విభాగం / ప్రయోజనం ఎంచుకోండి',
    phoneLabel: 'మొబైల్ నంబర్ (వాట్సాప్)',
    phonePlaceholder: '98765 43210',
    phoneNote: 'అధికారిక అప్‌డేట్స్, డిజిటల్ పాస్ మరియు సమన్వయం కోసం ఉపయోగించబడుతుంది.',
    nameLabel: 'పూర్తి పేరు',
    namePlaceholder: 'ఉదా: బ్రహ్మశ్రీ రమేష్ చారి',
    nextBtn: 'తరువాత: జిల్లా & వివరాలు',
    locationLabel: 'జిల్లా / నియోజకవర్గం',
    locationPlaceholder: 'మీ జిల్లా లేదా ప్రాంతాన్ని ఎంచుకోండి',
    craftLabelArtisan: 'సాంప్రదాయ వృత్తి నైపుణ్యం',
    craftPlaceholderArtisan: 'మీ సాంప్రదాయ వృత్తిని ఎంచుకోండి',
    craftLabelMatrimony: 'గోత్రం / ఉపశాఖ మరియు వృత్తి',
    craftPlaceholderMatrimony: 'ఉదా: సనగ గోత్రం / సాఫ్ట్‌వేర్ ఆర్కిటెక్ట్',
    craftLabelMentor: 'మార్గదర్శకత్వం / మెంటార్‌షిప్ రంగం',
    craftPlaceholderMentor: 'ఉదా: సివిల్ సర్వీసెస్, ఉన్నత విద్య, వ్యాపారం',
    craftLabelProfessional: 'వృత్తి / ఉద్యోగం / వ్యాపారం',
    craftPlaceholderProfessional: 'ఉదా: ఇంజనీర్ / ఆర్కిటెక్ట్ / కాంట్రాక్టర్',
    craftLabelYatra: 'పాదయాత్ర భాగస్వామ్య విభాగం',
    craftPlaceholderYatra: 'ఉదా: యాత్రికుడు / జిల్లా సమన్వయకర్త / యువజన నాయకుడు',
    craftLabelPatron: 'సంఘ సహకారం / పోషక రంగం',
    craftPlaceholderPatron: 'ఉదా: సాంస్కృతిక పోషకులు, విద్యా ప్రోత్సాహకం',
    lookingForLabel: 'సంబంధం ఎవరి కోసం?',
    lookingForGroom: 'అబ్బాయి కావాలి (Groom)',
    lookingForBride: 'అమ్మాయి కావాలి (Bride)',
    pmSchemeTitle: 'PM విశ్వకర్మ పథకం సహాయం',
    pmSchemeDesc: 'ఉచిత ₹15,000 టూల్‌కిట్ ఈ-వోచర్ & తక్కువ వడ్డీ రుణం కొరకు దరఖాస్తు సహాయం.',
    backBtn: 'వెనుకకు',
    submitBtn: 'పూర్తి చేసి డిజిటల్ పాస్ పొందండి',
    submitting: 'నమోదు అవుతోంది...',
    confirmedTitle: 'నమోదు విజయవంతంగా పూర్తయింది!',
    confirmedSub: 'విశ్వకర్మ నాలెడ్జ్ సెంటర్ & సంఘ నెట్‌వర్క్‌కు స్వాగతం.',
    passTitle: 'విశ్వకర్మ నెక్సస్',
    passSub: 'అధికారిక ధృవీకరించబడిన సభ్యుల రిజిస్ట్రీ',
    memberName: 'సభ్యుని పేరు',
    registeredMobile: 'నమోదైన మొబైల్',
    districtRegion: 'జిల్లా / ప్రాంతం',
    category: 'విభాగం',
    verifiedMember: 'ధృవీకరించబడిన సభ్యుడు',
    shareWhatsApp: 'తోటి బంధువులతో వాట్సాప్‌లో పంచుకోండి',
    copyPass: 'సభ్యత్వ పాస్ వివరాలు కాపీ చేయండి',
    copied: 'క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది!',
    closeReturn: 'ముగించి హోమ్‌కు వెళ్లండి',
    tracks: {
      professional: 'వృత్తి నిపుణుల నెట్‌వర్క్',
      mentor: 'గౌరవ మెంటార్‌గా నమోదు',
      matrimony: 'పరిణయ మ్యాట్రిమోనీ పోర్టల్',
      artisan: 'కళాకారుల డిజిటల్ ఐడీ కార్డ్',
      yatra: 'విశ్వకర్మ ఏకతా మహా పాదయాత్ర',
      patron: 'సంఘ పోషకులు / సభ్యులు'
    }
  },
  hi: {
    badge: '10-सेकंड त्वरित पंजीकरण',
    subtitle: 'विश्वकर्मा एकता महा पदयात्रा एवं VKC नेटवर्क',
    stepIndicator: (current: number, total: number) => `चरण ${current} / ${total}`,
    purposeLabel: 'पंजीकरण का उद्देश्य / श्रेणी चुनें',
    phoneLabel: 'मोबाइल नंबर (व्हाट्सएप)',
    phonePlaceholder: '98765 43210',
    phoneNote: 'आधिकारिक अपडेट, डिजिटल पास और समन्वय के लिए उपयोग किया जाएगा।',
    nameLabel: 'पूरा नाम',
    namePlaceholder: 'उदा. ब्रह्मश्री रमेश चारी',
    nextBtn: 'अगला: जिला एवं विवरण',
    locationLabel: 'जिला / क्षेत्र',
    locationPlaceholder: 'अपना जिला या क्षेत्र चुनें',
    craftLabelArtisan: 'पारंपरिक शिल्प विशेषता',
    craftPlaceholderArtisan: 'अपना पारंपरिक शिल्प चुनें',
    craftLabelMatrimony: 'गोत्र / उपशाखा एवं व्यवसाय',
    craftPlaceholderMatrimony: 'उदा. सनग गोत्र / सॉफ्टवेयर इंजीनियर',
    craftLabelMentor: 'मार्गदर्शन / मेंटरशिप क्षेत्र',
    craftPlaceholderMentor: 'उदा. सिविल सेवा, उच्च शिक्षा, उद्यम',
    craftLabelProfessional: 'पेशा / पद / व्यवसाय',
    craftPlaceholderProfessional: 'उदा. इंजीनियर / वास्तुकार / उद्यमी',
    craftLabelYatra: 'पदयात्रा सहभागिता भूमिका',
    craftPlaceholderYatra: 'उदा. यात्री / जिला समन्वयक / युवा नेता',
    craftLabelPatron: 'सामुदायिक सहयोग / संरक्षक क्षेत्र',
    craftPlaceholderPatron: 'उदा. सांस्कृतिक संरक्षक, शिक्षा सहयोग',
    lookingForLabel: 'रिश्ता किसके लिए है?',
    lookingForGroom: 'वर चाहिए (Groom)',
    lookingForBride: 'वधू चाहिए (Bride)',
    pmSchemeTitle: 'PM विश्वकर्मा योजना सहायता',
    pmSchemeDesc: 'मुफ्त ₹15,000 टूलकिट ई-वाउचर और कम ब्याज पर ऋण के लिए मार्गदर्शन।',
    backBtn: 'वापस जाएं',
    submitBtn: 'पंजीकरण पूर्ण करें और डिजिटल पास प्राप्त करें',
    submitting: 'पंजीकरण हो रहा है...',
    confirmedTitle: 'पंजीकरण सफलतापूर्वक पूर्ण हुआ!',
    confirmedSub: 'विश्वकर्मा नॉलेज सेंटर नेटवर्क में आपका स्वागत है।',
    passTitle: 'विश्वकर्मा नेक्सस',
    passSub: 'आधिकारिक सत्यापित सदस्य रजिस्ट्री',
    memberName: 'सदस्य का नाम',
    registeredMobile: 'पंजीकृत मोबाइल',
    districtRegion: 'जिला / क्षेत्र',
    category: 'श्रेणी',
    verifiedMember: 'सत्यापित सदस्य',
    shareWhatsApp: 'विश्वकर्मा बंधुओं के साथ व्हाट्सएप पर साझा करें',
    copyPass: 'पास विवरण कॉपी करें',
    copied: 'क्लिपबोर्ड पर कॉपी किया गया!',
    closeReturn: 'बंद करें और वापस जाएं',
    tracks: {
      professional: 'व्यावसायिक नेटवर्क',
      mentor: 'मेंटर के रूप में पंजीकरण',
      matrimony: 'परिणय मैट्रिमोनी पोर्टल',
      artisan: 'शिल्पकार डिजिटल आईडी कार्ड',
      yatra: 'विश्वकर्मा एकता महा पदयात्रा',
      patron: 'समुदाय संरक्षक / सदस्य'
    }
  }
};

const TRACK_CONFIGS: Array<{
  id: TrackType;
  icon: typeof Briefcase;
  color: string;
  bg: string;
  badge: string;
}> = [
  { id: 'professional', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100/70', badge: '💼 B2B & Jobs' },
  { id: 'mentor', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100/70', badge: '🎓 Mentor' },
  { id: 'matrimony', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100/70', badge: '💍 100% Verified' },
  { id: 'artisan', icon: Hammer, color: 'text-vermilion', bg: 'bg-vermilion/10', badge: '🛠️ Economic ID' },
  { id: 'yatra', icon: Flag, color: 'text-amber-600', bg: 'bg-amber-100/70', badge: '🚩 Ekta Yatra' },
  { id: 'patron', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-100/70', badge: '🌟 Community' },
];

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrack?: TrackType;
}

export function JoinModal({ isOpen, onClose, defaultTrack = 'yatra' }: JoinModalProps) {
  const { i18n } = useTranslation();
  const currentLang = (['en', 'te', 'hi'].includes(i18n.language) ? i18n.language : 'en') as 'en' | 'te' | 'hi';
  const tModal = MODAL_TEXTS[currentLang] || MODAL_TEXTS.en;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [memberId, setMemberId] = useState('');
  
  const [formData, setFormData] = useState({
    track: defaultTrack,
    name: '',
    phone: '',
    location: '',
    tradeOrDetail: '',
    matrimonyLookingFor: 'groom' as 'groom' | 'bride',
    pmVishwakarmaInterest: true,
  });

  useEffect(() => {
    if (defaultTrack) {
      setFormData(prev => (prev.track === defaultTrack ? prev : { ...prev, track: defaultTrack }));
    }
  }, [defaultTrack]);

  const handleReset = useCallback(() => {
    setStep(1);
    setSuccess(false);
    setCopied(false);
    setFormData({
      track: defaultTrack,
      name: '',
      phone: '',
      location: '',
      tradeOrDetail: '',
      matrimonyLookingFor: 'groom',
      pmVishwakarmaInterest: true,
    });
    onClose();
  }, [defaultTrack, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const prefix = formData.track === 'matrimony' ? 'VKC-M' : formData.track === 'mentor' ? 'VKC-L' : formData.track === 'professional' ? 'VKC-P' : 'VKC';
    const generatedId = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    setMemberId(generatedId);

    const payload = {
      uid: generatedId,
      memberId: generatedId,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      track: formData.track,
      trade: formData.track === 'yatra' ? `Ekta Padayatra - ${formData.tradeOrDetail || 'Yatri'}` : (formData.tradeOrDetail || 'Member'),
      location: formData.location || 'India',
      state: formData.location || 'India',
      matrimonyLookingFor: formData.track === 'matrimony' ? formData.matrimonyLookingFor : undefined,
      pmVishwakarmaInterest: formData.track === 'artisan' ? (formData.pmVishwakarmaInterest ? 'Yes' : 'No') : undefined,
      notes: `Track: ${formData.track} | Ref: Direct-Registration | GeneratedID: ${generatedId}${
        formData.track === 'matrimony' ? ` | LookingFor: ${formData.matrimonyLookingFor}` : ''
      }${
        formData.track === 'artisan' ? ` | PMVishwakarma: ${formData.pmVishwakarmaInterest ? 'Interested' : 'No'}` : ''
      }`
    };

    await submitToGoogleSheets(payload);
    setSuccess(true);
    setLoading(false);
  };

  const getShareText = () => {
    const categoryName = tModal.tracks[formData.track] || 'Vishwakarma Nexus';
    if (currentLang === 'te') {
      return `*|| జై విశ్వకర్మ ||*\n*${categoryName} — VKC అధికారిక రిజిస్ట్రీ*\n\nనేను అధికారిక నెట్‌వర్క్‌లో నమోదు చేసుకున్నాను.\n*నా డిజిటల్ ఐడీ:* ${memberId}\n*విభాగం:* ${categoryName}\n\n*మీరూ ఇప్పుడే మొబైల్ నంబర్‌తో నమోదు చేసుకొని డిజిటల్ పాస్ పొందండి:*\nhttps://vishwakarmaknowledgecentre.org/membership`;
    }
    if (currentLang === 'hi') {
      return `*|| जय विश्वकर्मा ||*\n*${categoryName} — VKC आधिकारिक रजिस्ट्री*\n\nमैंने आधिकारिक नेटवर्क पर पंजीकरण कर लिया है।\n*मेरी डिजिटल आईडी:* ${memberId}\n*श्रेणी:* ${categoryName}\n\n*आप भी अपने मोबाइल नंबर से तुरंत पंजीकरण करें और डिजिटल पास पाएं:*\nhttps://vishwakarmaknowledgecentre.org/membership`;
    }
    return `*|| Jai Vishwakarma ||*\n*${categoryName} — Official VKC Network*\n\nI have successfully registered with Vishwakarma Nexus.\n*My Digital ID:* ${memberId}\n*Category:* ${categoryName}\n\n*Register your mobile number and claim your Verified Digital Pass:*\nhttps://vishwakarmaknowledgecentre.org/membership`;
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(getShareText())}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryBadgeLabel = () => {
    return tModal.tracks[formData.track] || tModal.verifiedMember;
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={handleReset}
      title={tModal.badge}
      maxW="max-w-lg"
    >
      {success ? (
        <div className="p-6 md:p-8 text-center space-y-5">
          {/* Success Animated Badge */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="text-emerald-600 w-8 h-8" />
          </motion.div>

          <div>
            <h2 id="modal-title" className="text-xl md:text-2xl font-black text-stone-900 font-display">
              {tModal.confirmedTitle}
            </h2>
            <p className="text-stone-500 text-xs mt-1">
              {tModal.confirmedSub}
            </p>
          </div>

          {/* Digital Member Pass Card */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white rounded-2xl p-5 text-left border border-amber-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <img src="/images/shared/emblem.png" alt="VKC" className="w-8 h-8 object-contain" />
                <div>
                  <p className="text-xs font-black text-white leading-none">{tModal.passTitle}</p>
                  <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest mt-0.5">{getCategoryBadgeLabel()}</p>
                </div>
              </div>
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/30">
                {memberId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-wider">{tModal.memberName}</p>
                <p className="font-bold text-white text-sm truncate">{formData.name || 'Vishwakarma Bandhu'}</p>
              </div>
              <div>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-wider">{tModal.registeredMobile}</p>
                <p className="font-bold text-white text-sm">{formData.phone}</p>
              </div>
              <div>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-wider">{tModal.districtRegion}</p>
                <p className="font-bold text-amber-300 truncate">{formData.location || 'Telangana / AP'}</p>
              </div>
              <div>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-wider">{tModal.category}</p>
                <p className="font-bold text-emerald-400 uppercase text-[10px] truncate">{getCategoryBadgeLabel()}</p>
              </div>
            </div>

            {formData.track === 'matrimony' && (
              <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider">Alliance Preference</span>
                <span className="text-[10px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {formData.matrimonyLookingFor === 'groom' ? `🤵 ${tModal.lookingForGroom}` : `👰 ${tModal.lookingForBride}`}
                </span>
              </div>
            )}

            {formData.track === 'artisan' && formData.pmVishwakarmaInterest && (
              <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider">Govt Scheme Assistance</span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  🏛️ PM Vishwakarma Enrolled
                </span>
              </div>
            )}
          </div>

          {/* WhatsApp Share Action */}
          <div className="space-y-2.5 pt-1">
            <button 
              onClick={handleWhatsAppShare}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Share2 size={16} />
              <span>{tModal.shareWhatsApp}</span>
            </button>

            <button 
              onClick={handleCopy}
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? tModal.copied : tModal.copyPass}</span>
            </button>
          </div>

          <button 
            onClick={handleReset}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold pt-2 cursor-pointer"
          >
            {tModal.closeReturn}
          </button>
        </div>
      ) : (
        <div className="p-5 md:p-7">
          {/* Header Banner with Language Switcher */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100 pr-12">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-vermilion to-amber-500 p-1.5 rounded-lg text-white">
                <Flag className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-stone-900 uppercase tracking-tight text-xs block">
                  {tModal.badge}
                </span>
                <span className="text-[10px] text-amber-700 font-bold block">
                  {tModal.subtitle}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
            </div>
          </div>

          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 bg-stone-100 px-2 py-1 rounded-lg">
              {tModal.stepIndicator(step, 2)}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Category Dropdown (Automated selection & user switchable) */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-purpose-select" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center justify-between">
                      <span>{tModal.purposeLabel}</span>
                    </label>
                    <div className="relative">
                      <select
                        id="reg-purpose-select"
                        value={formData.track}
                        onChange={(e) => setFormData({ ...formData, track: e.target.value as TrackType })}
                        className="w-full h-11 pl-4 pr-10 rounded-xl border-2 border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/20 outline-none transition-all text-xs font-bold bg-white cursor-pointer appearance-none text-stone-800"
                      >
                        <option value="professional">{tModal.tracks.professional}</option>
                        <option value="mentor">{tModal.tracks.mentor}</option>
                        <option value="matrimony">{tModal.tracks.matrimony}</option>
                        <option value="artisan">{tModal.tracks.artisan}</option>
                        <option value="yatra">{tModal.tracks.yatra}</option>
                        <option value="patron">{tModal.tracks.patron}</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Quick Category Selector Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
                    {TRACK_CONFIGS.map((t) => {
                      const Icon = t.icon;
                      const isSelected = formData.track === t.id;
                      return (
                        <button
                          type="button"
                          key={t.id}
                          onClick={() => setFormData({ ...formData, track: t.id })}
                          className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected 
                              ? 'border-vermilion bg-vermilion/5 ring-2 ring-vermilion/20 shadow-sm' 
                              : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className={`p-1 rounded-md ${t.bg} ${t.color}`}>
                              <Icon size={12} />
                            </div>
                            <span className={`text-[8px] font-black uppercase px-1 py-0.5 rounded ${
                              isSelected ? 'bg-vermilion text-white' : 'bg-stone-200 text-stone-600'
                            }`}>
                              {t.badge}
                            </span>
                          </div>
                          <span className="text-[10px] font-black text-stone-900 block leading-tight truncate">
                            {tModal.tracks[t.id]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile Number - Stable input without autoFocus */}
                  <div className="space-y-1.5">
                    <label htmlFor="mobile-phone" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone size={12} className="text-vermilion" /> 
                      {tModal.phoneLabel}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-black text-stone-500">
                        🇮🇳 +91
                      </div>
                      <input 
                        id="mobile-phone"
                        type="tel" 
                        inputMode="numeric"
                        autoComplete="tel"
                        enterKeyHint="next"
                        pattern="[0-9]{10}"
                        required
                        placeholder={tModal.phonePlaceholder}
                        className="w-full pl-16 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-vermilion focus:ring-4 focus:ring-vermilion/10 outline-none transition-all text-base md:text-sm font-bold tracking-wider"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData(prev => ({ ...prev, phone: val }));
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-stone-400">{tModal.phoneNote}</p>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="full-name" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                      <User size={12} className="text-vermilion" /> 
                      {tModal.nameLabel}
                    </label>
                    <input 
                      id="full-name"
                      type="text" 
                      required
                      autoComplete="name"
                      autoCapitalize="words"
                      enterKeyHint="next"
                      placeholder={tModal.namePlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-base md:text-sm font-semibold"
                      value={formData.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => ({ ...prev, name: val }));
                      }}
                    />
                  </div>

                  <button 
                    type="button"
                    disabled={!formData.name.trim() || formData.phone.length < 10}
                    onClick={() => setStep(2)}
                    className="w-full bg-gradient-to-r from-[#E34234] via-[#D33326] to-[#C92A1C] hover:from-[#C92A1C] hover:to-[#A51D10] text-white py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-red-500/25 touch-manipulation cursor-pointer"
                  >
                    {tModal.nextBtn} <ChevronRight size={14} />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* District / Location */}
                  <div className="space-y-1.5">
                    <label htmlFor="location-select" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin size={12} className="text-vermilion" /> 
                      {tModal.locationLabel}
                    </label>
                    <select 
                      id="location-select"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-base md:text-xs font-bold appearance-none bg-white cursor-pointer"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    >
                      <option value="">{tModal.locationPlaceholder}</option>
                      {STATES_AND_DISTRICTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Matrimony Looking For Alliance Selector */}
                  {formData.track === 'matrimony' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Heart size={12} className="text-rose-500" />
                        {tModal.lookingForLabel}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, matrimonyLookingFor: 'groom' }))}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            formData.matrimonyLookingFor === 'groom'
                              ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20 shadow-sm'
                              : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50'
                          }`}
                        >
                          🤵 {tModal.lookingForGroom}
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, matrimonyLookingFor: 'bride' }))}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            formData.matrimonyLookingFor === 'bride'
                              ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20 shadow-sm'
                              : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50'
                          }`}
                        >
                          👰 {tModal.lookingForBride}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Dynamic detail input based on track */}
                  <div className="space-y-1.5">
                    <label htmlFor="detail-input" className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase size={12} className="text-vermilion" /> 
                      {formData.track === 'artisan'
                        ? tModal.craftLabelArtisan
                        : formData.track === 'matrimony'
                          ? tModal.craftLabelMatrimony
                          : formData.track === 'mentor'
                            ? tModal.craftLabelMentor
                            : formData.track === 'professional'
                              ? tModal.craftLabelProfessional
                              : formData.track === 'yatra'
                                ? tModal.craftLabelYatra
                                : tModal.craftLabelPatron}
                    </label>

                    {formData.track === 'artisan' ? (
                      <select 
                        id="detail-input"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-base md:text-xs font-bold appearance-none bg-white cursor-pointer"
                        value={formData.tradeOrDetail}
                        onChange={(e) => setFormData(prev => ({ ...prev, tradeOrDetail: e.target.value }))}
                      >
                        <option value="">{tModal.craftPlaceholderArtisan}</option>
                        {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    ) : (
                      <input 
                        id="detail-input"
                        type="text" 
                        required
                        autoComplete="off"
                        enterKeyHint="done"
                        placeholder={
                          formData.track === 'matrimony'
                            ? tModal.craftPlaceholderMatrimony
                            : formData.track === 'mentor'
                              ? tModal.craftPlaceholderMentor
                              : formData.track === 'professional'
                                ? tModal.craftPlaceholderProfessional
                                : formData.track === 'yatra'
                                  ? tModal.craftPlaceholderYatra
                                  : tModal.craftPlaceholderPatron
                        }
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 outline-none transition-all text-base md:text-xs font-semibold"
                        value={formData.tradeOrDetail}
                        onChange={(e) => setFormData(prev => ({ ...prev, tradeOrDetail: e.target.value }))}
                      />
                    )}
                  </div>

                  {/* PM Vishwakarma Scheme Assistance for Artisans */}
                  {formData.track === 'artisan' && (
                    <label className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 cursor-pointer hover:bg-amber-100/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.pmVishwakarmaInterest}
                        onChange={(e) => setFormData(prev => ({ ...prev, pmVishwakarmaInterest: e.target.checked }))}
                        className="mt-0.5 w-4 h-4 text-vermilion rounded border-stone-300 focus:ring-vermilion cursor-pointer"
                      />
                      <div className="text-left">
                        <p className="text-[11px] font-black text-amber-950 leading-tight">
                          {tModal.pmSchemeTitle}
                        </p>
                        <p className="text-[9px] text-amber-800 leading-snug mt-0.5">
                          {tModal.pmSchemeDesc}
                        </p>
                      </div>
                    </label>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-stone-100 text-stone-600 p-3.5 rounded-xl font-black hover:bg-stone-200 transition-all active:scale-90 touch-manipulation cursor-pointer"
                      aria-label={tModal.backBtn}
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button 
                      type="submit"
                      disabled={loading || !formData.location || !formData.tradeOrDetail.trim()}
                      className="flex-1 bg-gradient-to-r from-vermilion to-amber-600 text-white py-3.5 rounded-xl font-black text-xs hover:opacity-95 transition-all shadow-lg shadow-vermilion/20 active:scale-[0.98] touch-manipulation disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? tModal.submitting : tModal.submitBtn}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      )}
    </BaseModal>
  );
}
