import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, Award, CreditCard, Sparkles, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnniversarySectionProps {
  onOpenMatrimony: () => void;
}

// ── Tier configuration ──────────────────────────────────────────────────────
const TIER_CONFIG: Record<string, { en: string; te: string; hi: string; accent: string; border: string; bg: string }> = {
  chief:     { en: 'Chief Guest',           te: 'ముఖ్య అతిథి',        hi: 'मुख्य अतिथि',         accent: 'text-turmeric',  border: 'border-turmeric/25', bg: 'bg-turmeric/8' },
  govt:      { en: 'Government Officials',  te: 'ప్రభుత్వ అధికారులు',  hi: 'सरकारी अधिकारी',      accent: 'text-saffron-500', border: 'border-saffron-600/25',bg: 'bg-saffron-600/8' },
  vkc:       { en: 'VKC Core Leadership',   te: 'VKC నాయకత్వం',        hi: 'VKC नेतृत्व',          accent: 'text-vermilion', border: 'border-vermilion/25',bg: 'bg-vermilion/8' },
  community: { en: 'Distinguished Guests',  te: 'విశిష్ట అతిథులు',     hi: 'विशिष्ट अतिथिगण',     accent: 'text-gold-500',     border: 'border-gold-600/25',    bg: 'bg-gold-600/8' },
  social:    { en: 'Social Icons',          te: 'సామాజిక ప్రముఖులు',   hi: 'सामाजिक प्रतिष्ठित',  accent: 'text-saffron-400',    border: 'border-saffron-500/25',   bg: 'bg-saffron-500/8' },
};

const TIER_ORDER = ['chief', 'govt', 'vkc', 'community', 'social'] as const;

// ── Dignitaries — ordered hierarchically by tier ─────────────────────────────
const DIGNITARIES = [
  // ── TIER: chief ─ Chief Guest ─────────────────────────────────────────────
  {
    tier: 'chief',
    nameEn: "Brahmasri K.M. Kiran Kumar Sir",
    nameTe: "బ్రహ్మశ్రీ K.M కిరణ్ కుమార్ సర్",
    nameHi: "ब्रह्मश्री के.एम. किरण कुमार सर",
    subEn: "ACP, EOW-CCS, Hyderabad",
    subTe: "ACP, EOW-CCS, హైదరాబాద్",
    subHi: "एसीपी, EOW-CCS, हैदराबाद",
    photo: "/images/guests/km_kiran_kumar.jpg",
  },
  // ── TIER: govt ─ Government Officials ────────────────────────────────────


  {
    tier: 'govt',
    nameEn: "Dasoju Sravan garu",
    nameTe: "దాసోజు శ్రవణ్ గారు",
    nameHi: "दासोझु श्रवण गारू",
    subEn: "Member of Legislative Council, Telangana",
    subTe: "శాసన మండలి సభ్యులు, తెలంగాణ",
    subHi: "विधान परिषद सदस्य, तेलंगाना",
    photo: "/images/guests/dasoju_sravan.jpg",
  },
  {
    tier: 'govt',
    nameEn: "Brahmasri Edukoju VenkataChary garu",
    nameTe: "బ్రహ్మశ్రీ ఎడుకోజు వెంకటాచారి గారు",
    nameHi: "ब्रह्मश्री एडुकोजु वेंकटचारी गारू",
    subEn: "Addl. Collector, Vikarabad District",
    subTe: "అడిషనల్ కలెక్టర్, వికారాబాద్ జిల్లా",
    subHi: "अतिरिक्त कलेक्टर, विकाराबाद जिला",
    photo: "/images/guests/e_venkatachary.jpg",
  },
  // ── TIER: vkc ─ VKC Core Leadership ─────────────────────────────────────
  {
    tier: 'vkc',
    nameEn: "Brahmasri Kondoju Praveen Kumar Chary garu",
    nameTe: "బ్రహ్మశ్రీ కొండోజు ప్రవీణ్ కుమార్ చారి గారు",
    nameHi: "ब्रह्मश्री कोंडोजु प्रवीण कुमार चारी गारू",
    subEn: "President, VKC Telangana",
    subTe: "అధ్యక్షులు, VKC తెలంగాణ",
    subHi: "अध्यक्ष, VKC तेलंगाना",
    photo: "/images/guests/praveen_kumar.jpg",
  },
  {
    tier: 'vkc',
    nameEn: "Brahmasri Solleti Prabhakara Chary garu",
    nameTe: "బ్రహ్మశ్రీ సొల్లేటి ప్రభాకర్ చారి గారు",
    nameHi: "ब्रह्मश्री सोल्लेटी प्रभाकर चारी गारू",
    subEn: "National Joint Secretary, VKC",
    subTe: "జాతీయ సంయుక్త కార్యదర్శి, VKC",
    subHi: "राष्ट्रीय संयुक्त सचिव, VKC",
    photo: "/images/guests/solleti_prabhakara.jpg",
  },
  // ── TIER: community ─ Distinguished Guests ───────────────────────────────
  {
    tier: 'community',
    nameEn: "Dr. P. Harikanth Acharya garu",
    nameTe: "డాక్టర్ పి. హరికాంత్ ఆచార్య గారు",
    nameHi: "डॉ. पी. हरिकांत आचार्य गारू",
    subEn: "Famous Public Doctor & Social Activist",
    subTe: "ప్రముఖ వైద్యులు & సామాజిక కార్యకర్త",
    subHi: "प्रसिद्ध चिकित्सक एवं सामाजिक कार्यकर्ता",
    photo: "/images/guests/harikanth_acharya.jpg",
  },
  {
    tier: 'community',
    nameEn: "Brahmasri Puligilla Prakash Achary garu",
    nameTe: "బ్రహ్మశ్రీ పులిగిల్ల ప్రకాష్ ఆచారి గారు",
    nameHi: "ब्रह्मश्री पुलिगिल्ला प्रकाश आचारी गारू",
    subEn: "State Vishwakarma Leader & Senior Politician",
    subTe: "రాష్ట్ర విశ్వకర్మ నాయకులు & సీనియర్ రాజకీయవేత్త",
    subHi: "राज्य विश्वकर्मा नेता एवं वरिष्ठ राजनेता",
    photo: "/images/guests/puligilla_prakash.jpg",
  },
  {
    tier: 'community',
    nameEn: "Brahmasri Thalloju Achary garu",
    nameTe: "బ్రహ్మశ్రీ తాళ్ళోజు ఆచారి గారు",
    nameHi: "ब्रह्मश्री ताल्लोजु आचारी गारू",
    subEn: "Ex-National BC Commission Member",
    subTe: "మాజీ జాతీయ బీసీ కమిషన్ సభ్యులు",
    subHi: "पूर्व राष्ट्रीय पिछड़ा वर्ग आयोग सदस्य",
    photo: "/images/guests/thalloju_achary.jpg",
  },
  {
    tier: 'community',
    nameEn: "Brahmasri Varnoju Balakrishna Chary garu",
    nameTe: "బ్రహ్మశ్రీ వర్ణోజు బాలకృష్ణ చారి గారు",
    nameHi: "ब्रह्मश्री वर्णोजु बालकृष्ण चारी गारू",
    subEn: "Senior Congress Party Leader",
    subTe: "సీనియర్ కాంగ్రెస్ పార్టీ నాయకులు",
    subHi: "वरिष्ठ कांग्रेस पार्टी नेता",
    photo: "/images/guests/varnoju_balakrishna.jpg",
  },
  {
    tier: 'community',
    nameEn: "Brahmasri Vadla Laxminarayana Chary garu",
    nameTe: "బ్రహ్మశ్రీ వడ్ల లక్ష్మీనారాయణ చారి గారు",
    nameHi: "ब्रह्मश्री वडला लक्ष्मीनारायण चारी गारू",
    subEn: "Senior BJP Leader, Mahabubnagar",
    subTe: "సీనియర్ బీజేపీ నాయకులు, మహబూబ్‌నగర్",
    subHi: "वरिष्ठ भाजपा नेता, महबूबनगर",
    photo: "/images/guests/vadla_laxminarayana.jpg",
  },
  {
    tier: 'community',
    nameEn: "Brahmasri Ravi Chary garu",
    nameTe: "బ్రహ్మశ్రీ రవి చారి గారు",
    nameHi: "ब्रह्मश्री रवि चारी गारू",
    subEn: "Ex-Corporator GHMC & BJP Senior Leader",
    subTe: "మాజీ కార్పొరేటర్ GHMC & బీజేపీ సీనియర్ నాయకులు",
    subHi: "पूर्व पार्षद GHMC एवं भाजपा वरिष्ठ नेता",
    photo: "/images/guests/ravi_chary.jpg",
  },
  {
    tier: 'community',
    nameEn: "Smt Bibinagar Anuradha garu",
    nameTe: "శ్రీమతి బీబినగర్ అనురాధ గారు",
    nameHi: "श्रीमती बीबीनगर अनुराधा गारू",
    subEn: "Senior BJP Leader",
    subTe: "సీనియర్ బీజేపీ నాయకురాలు",
    subHi: "वरिष्ठ भाजपा नेत्री",
    photo: "/images/guests/bibinagar_anuradha.jpg",
  },
  {
    tier: 'community',
    nameEn: "Brahmasri Yemnnagandla Ramesh Chary garu",
    nameTe: "బ్రహ్మశ్రీ యెమ్నగండ్ల రమేష్ చారి గారు",
    nameHi: "ब्रह्मश्री येमनागंडला रमेश चारी गारू",
    subEn: "President, Swarnakara Sangham, Mahabubnagar",
    subTe: "అధ్యక్షులు, స్వర్ణకార సంఘం, మహబూబ్‌నగర్",
    subHi: "अध्यक्ष, स्वर्णकार संघ, महबूबनगर",
    photo: "/images/guests/ramesh_chary.jpg",
  },
  {
    tier: 'community',
    nameEn: "Brahmasri Chandramouli Chary garu",
    nameTe: "బ్రహ్మశ్రీ చంద్రమౌళి చారి గారు",
    nameHi: "ब्रह्मश्री चंद्रमौली चारी गारू",
    subEn: "Sarpanch, Social Activist & Senior Leader",
    subTe: "సర్పంచ్, సామాజిక కార్యకర్త & సీనియర్ నాయకులు",
    subHi: "सरपंच, सामाजिक कार्यकर्ता एवं वरिष्ठ नेता",
    photo: "/images/guests/chandramouli_chary.jpg",
  },
  {
    tier: 'community',
    nameEn: "Brahmasri Naveen Achary garu",
    nameTe: "బ్రహ్మశ్రీ నవీన్ ఆచారి గారు",
    nameHi: "ब्रह्मश्री नवीन आचारी गारू",
    subEn: "General Secretary, Telangana Jagruthi",
    subTe: "సాధారణ కార్యదర్శి, తెలంగాణ జాగృతి",
    subHi: "महासचिव, तेलंगाना जागृति",
    photo: "/images/guests/naveen_achary.jpg",
  },
  {
    tier: 'community',
    nameEn: "Brahmasri Vannoj Sai Prakash Chary garu",
    nameTe: "బ్రహ్మశ్రీ వన్నోజు సాయి ప్రకాష్ చారి గారు",
    nameHi: "ब्रह्मश्री वन्नोजु साई प्रकाश चारी गारू",
    subEn: "Vishwakarma Leader & Social Activist",
    subTe: "విశ్వకర్మ నాయకులు & సామాజిక కార్యకర్త",
    subHi: "विश्वकर्मा नेता एवं सामाजिक कार्यकर्ता",
    photo: "/images/guests/sai_prakash.jpg",
  },
  {
    tier: 'community',
    nameEn: "Brahmasri Avusala Bhanu Prakash Avadhani garu",
    nameTe: "బ్రహ్మశ్రీ అవుసల భాను ప్రకాష్ అవధాని గారు",
    nameHi: "ब्रह्मश्री अवुसला भानु प्रकाश अवधनी गारू",
    subEn: "Adhyakshulu, PadhaSaraswata Peetam, Telangana",
    subTe: "అధ్యక్షులు, పాదసరస్వత పీఠం, తెలంగాణ",
    subHi: "अध्यक्ष, पादसरस्वत पीठम, तेलंगाना",
    photo: "/images/guests/bhanu_prakash.jpg",
  },
  // ── TIER: social ─ Social Icons ───────────────────────────────────────────
  {
    tier: 'social',
    nameEn: "Brahmasri Nallanagula Sriman garu",
    nameTe: "బ్రహ్మశ్రీ నల్లంగుల శ్రీమన్ గారు",
    nameHi: "ब्रह्मश्री नल्लानगुला श्रीमन गारू",
    subEn: "Social Activist",
    subTe: "సామాజిక కార్యకర్త",
    subHi: "सामाजिक कार्यकर्ता",
    photo: "/images/guests/nallanagula_sriman.jpg",
  },
  {
    tier: 'social',
    nameEn: "Brahmasri Sada Shiva Chary garu",
    nameTe: "బ్రహ్మశ్రీ సదాశివ చారి గారు",
    nameHi: "ब्रह्मश्री सदा शिव चारी गारू",
    subEn: "Social Activist",
    subTe: "సామాజిక కార్యకర్త",
    subHi: "सामाजिक कार्यकर्ता",
    photo: "/images/guests/sadashiva_chary.jpg",
  },
  {
    tier: 'social',
    nameEn: "Smt Geetha Rani Sudhakar garu",
    nameTe: "శ్రీమతి గీతా రాణి సుధాకర్ గారు",
    nameHi: "श्रीमती गीता रानी सुधाकर गारू",
    subEn: "Sarpanch, Nawabpet & Social Activist",
    subTe: "సర్పంచ్, నవాబ్‌పేట & సామాజిక కార్యకర్త",
    subHi: "सरपंच, नवाबपेट एवं सामाजिक कार्यकर्ता",
    photo: "/images/guests/geetha_rani.jpg",
  },
];

// Per-person photo crop config — analyzed from each invitation flyer image
// objectPosition: where to anchor within the container (CSS object-position)
// scale: zoom factor applied via transform
const PHOTO_CONFIG: Record<string, { objectPosition: string; scale: number }> = {
  '/images/guests/km_kiran_kumar.jpg':        { objectPosition: '75% 8%',  scale: 1.6 },
  '/images/guests/seethakka.jpg':             { objectPosition: '72% 20%', scale: 1.5 },
  '/images/guests/sirikonda_madhusudhana.jpg':{ objectPosition: '65% 30%', scale: 1.45 },
  '/images/guests/dasoju_sravan.jpg':         { objectPosition: '72% 5%',  scale: 1.7 },
  '/images/guests/e_venkatachary.jpg':        { objectPosition: '72% 28%', scale: 1.5 },
  '/images/guests/praveen_kumar.jpg':         { objectPosition: '72% 38%', scale: 1.55 },
  '/images/guests/solleti_prabhakara.jpg':    { objectPosition: '68% 50%', scale: 1.65 },
  '/images/guests/harikanth_acharya.jpg':     { objectPosition: '72% 25%', scale: 1.5 },
  '/images/guests/puligilla_prakash.jpg':     { objectPosition: '72% 8%',  scale: 1.65 },
  '/images/guests/thalloju_achary.jpg':       { objectPosition: '72% 3%',  scale: 1.8 },
  '/images/guests/varnoju_balakrishna.jpg':   { objectPosition: '28% 22%', scale: 1.6 },
  '/images/guests/vadla_laxminarayana.jpg':   { objectPosition: '72% 8%',  scale: 1.7 },
  '/images/guests/ravi_chary.jpg':            { objectPosition: '72% 12%', scale: 1.6 },
  '/images/guests/bibinagar_anuradha.jpg':    { objectPosition: '72% 12%', scale: 1.55 },
  '/images/guests/ramesh_chary.jpg':          { objectPosition: '72% 33%', scale: 1.5 },
  '/images/guests/chandramouli_chary.jpg':    { objectPosition: '72% 28%', scale: 1.6 },
  '/images/guests/naveen_achary.jpg':         { objectPosition: '68% 28%', scale: 1.5 },
  '/images/guests/sai_prakash.jpg':           { objectPosition: '72% 8%',  scale: 1.7 },
  '/images/guests/bhanu_prakash.jpg':         { objectPosition: '68% 25%', scale: 1.5 },
  '/images/guests/nallanagula_sriman.jpg':    { objectPosition: '65% 52%', scale: 1.65 },
  '/images/guests/sadashiva_chary.jpg':       { objectPosition: '68% 35%', scale: 1.55 },
  '/images/guests/geetha_rani.jpg':           { objectPosition: '38% 5%',  scale: 1.75 },
};

const getInitials = (name: string) => {
  const clean = name
    .replace(/^(Smt\.?|Smt|Dr\.?|Dr|ACP|Brahmasri|Varnoju|Vannoj|Vadla|Avusala)\s+/i, '')
    .replace(/\s+garu$/i, '')
    .replace(/\s+Sir$/i, '')
    .trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0] ? parts[0][0].toUpperCase() : 'V';
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for potential re-use
function GuestCard({
  g,
  lang,
  size = 'sm',
}: {
  g: (typeof DIGNITARIES)[0];
  lang: string;
  size?: 'sm' | 'lg';
}) {
  const cfg = TIER_CONFIG[g.tier];
  const name = lang === 'te' ? g.nameTe : lang === 'hi' ? g.nameHi : g.nameEn;
  const sub  = lang === 'te' ? g.subTe  : lang === 'hi' ? g.subHi  : g.subEn;
  const initials = getInitials(g.nameEn);
  const photoCfg = g.photo ? (PHOTO_CONFIG[g.photo] ?? { objectPosition: 'center top', scale: 1.4 }) : null;

  const photoEl = g.photo && photoCfg ? (
    <img
      src={g.photo}
      alt={g.nameEn}
      className="absolute inset-0 w-full h-full object-cover"
      style={{
        objectPosition: photoCfg.objectPosition,
      }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  ) : null;

  if (size === 'lg') {
    return (
      <div className={`flex flex-col items-center gap-3 rounded-3xl p-5 border ${cfg.border} bg-white/5 text-center`}>
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-yellow-500/40 shrink-0">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-900/60 to-stone-900 text-yellow-400 text-2xl font-black">
            {initials}
          </div>
          {photoEl}
        </div>
        <div>
          <p className="text-sm font-black text-white leading-tight">{name}</p>
          <p className={`text-[10px] font-semibold mt-0.5 ${cfg.accent} leading-snug`}>{sub}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 rounded-2xl p-2.5 border ${cfg.border} bg-white/5`}>
      <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-white/10 shrink-0">
        <div className="absolute inset-0 flex items-center justify-center bg-stone-800 text-stone-400 text-xs font-black">
          {initials}
        </div>
        {photoEl}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-white leading-tight line-clamp-2">{name}</p>
        <p className={`text-[8px] font-semibold mt-0.5 ${cfg.accent} leading-snug line-clamp-2`}>{sub}</p>
      </div>
    </div>
  );
}

export const AnniversarySection: React.FC<AnniversarySectionProps> = ({ onOpenMatrimony }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isConcluded, setIsConcluded] = useState(false);

  useEffect(() => {
    const targetDate = new Date("2026-05-31T17:00:00+05:30");
    const endDate = new Date("2026-05-31T21:30:00+05:30");
    const updateTimer = () => {
      const now = new Date().getTime();
      if (now >= endDate.getTime()) {
        setIsConcluded(true);
        setIsLive(false);
        setTimeLeft(null);
      } else if (now >= targetDate.getTime()) {
        setIsLive(true);
        setIsConcluded(false);
        setTimeLeft(null);
      } else {
        const difference = targetDate.getTime() - now;
        setTimeLeft({
          hours:   Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsLive(false);
        setIsConcluded(false);
      }
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = () => {
    const shareText = lang === 'te'
      ? `విశ్వకర్మ నాలెడ్జ్ సెంటర్ (VKC) 10వ వార్షికోత్సవ దశాబ్ది ఉత్సవాల విజయవంతమైన ముగింపు!🎉\n\n` +
        `📅 తేదీ: 31 మే 2026 (ఆదివారం)\n⏰ సమయం: సాయంత్రం 05:00 – రాత్రి 09:30\n` +
        `📍 వేదిక: మెయిన్ హాల్, సుందరయ్య విజ్ఞాన కేంద్రం, బాగ్ లింగంపల్లి, హైదరాబాద్\n` +
        `👑 ముఖ్య అతిథి: ACP బ్రహ్మశ్రీ K.M కిరణ్ కుమార్ సర్ మరియు 22 మంది ప్రముఖులు\n\nదయచేసి షేర్ చేయండి! 🔄`
      : lang === 'hi'
      ? `विश्वकर्मा नॉलेज सेंटर (VKC) के 10वें वार्षिक दशकीय समारोह का सफल समापन!🎉\n\n` +
        `📅 31 मई 2026 (रविवार) | ⏰ शाम 05:00 – रात 09:30\n` +
        `📍 मुख्य हॉल, सुंदरैया विज्ञान केंद्र, बाग लिंगमपल्ली, हैदराबाद\n` +
        `👑 मुख्य अतिथि: एसीपी ब्रह्मश्री के.एम. किरण कुमार सर एवं 22 गणमान्य अतिथि\n\nसाझा करें! 🔄`
      : `VKC 10th Anniversary Decennial Celebrations successfully concluded! 🎉\n\n` +
        `📅 May 31, 2026 (Sunday) | ⏰ 05:00 PM – 09:30 PM IST\n` +
        `📍 Main Hall, Sundarayya Vignana Kendram, Bagh Lingampally, Hyderabad\n` +
        `👑 Chief Guest: ACP Brahmasri K.M. Kiran Kumar Sir & 22 Distinguished Dignitaries\n\nPlease share! 🔄`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <section className="py-24 relative overflow-hidden bg-white border-y border-stone-100">
      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
          <div className="inline-flex items-center gap-3 bg-saffron-550/10 border border-saffron-500/20 px-4 py-1.5 rounded-full text-saffron-700">
            <Sparkles size={14} className="animate-spin-slow text-saffron-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {lang === 'te' ? 'వికెసి దశాబ్ది ఉత్సవాలు' : lang === 'hi' ? 'वीकेसी दशकीय स्थापना दिवस' : 'VKC Decennial Celebration'}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight font-display">
            {lang === 'te' ? '10 సంవత్సరాల వైభవ ప్రస్థానం!' : lang === 'hi' ? 'वीकेसी दशकीय समारोह: 10 वर्षों की विरासत' : 'Celebrating 10 Years of Legacy & Empowerment'}
          </h2>
          <p className="text-stone-600 text-base md:text-lg font-medium leading-relaxed">
            {lang === 'te'
              ? 'ఒక దశాబ్దపు ఉత్కృష్టత, వారసత్వ పరిరక్షణ మరియు సంఘ నాయకత్వ ప్రస్థానానికి గుర్తుగా Hyderabad లో మే 31, 2026న విజయవంతంగా ముగిసిన మహా వేడుక.'
              : lang === 'hi'
              ? 'हैदराबाद में 31 मई 2026 को उत्कृष्टता, विरासत संरक्षण और सामुदायिक नेतृत्व के एक दशक का ऐतिहासिक समारोह सफलतापूर्वक संपन्न हुआ।'
              : 'A historic milestone celebrating a decade of excellence, heritage preservation, and community leadership which successfully concluded on May 31, 2026, in Hyderabad.'}
          </p>
        </div>

        {/* ── DARK PANEL: Timer + Dignitaries Gallery ─────────────────────── */}
        <div className="max-w-5xl mx-auto mb-16 bg-stone-900 rounded-[2.5rem] overflow-hidden border border-stone-800 shadow-2xl relative">
          {/* ambient glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-saffron-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />

          {/* ── Timer ── */}
          <div className="relative z-10 px-8 md:px-12 pt-10 pb-8 text-white text-center space-y-6 border-b border-white/8">
            {isConcluded ? (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-turmeric/10 border border-turmeric/20 text-turmeric rounded-full text-xs font-black uppercase tracking-widest">
                  <div className="w-2.5 h-2.5 bg-turmeric rounded-full" />
                  {lang === 'te' ? 'విజయవంతంగా ముగిసాయి' : lang === 'hi' ? 'सफलतापूर्वक संपन्न' : 'Successfully Concluded'}
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  {lang === 'te'
                    ? '10వ వార్షికోత్సవ దశాబ్ది ఉత్సవాలు అట్టహాసంగా ముగిసాయి!'
                    : lang === 'hi'
                    ? '10वीं वर्षगांठ दशकीय समारोह सफलतापूर्वक संपन्न हुआ!'
                    : 'The 10th Anniversary Decennial Celebrations successfully concluded!'}
                </h3>
              </div>
            ) : isLive ? (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  {lang === 'te' ? 'వేడుకలు ప్రారంభమయ్యాయి' : lang === 'hi' ? 'उत्सव लाइव है' : 'Celebrations are Live'}
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight">
                  {lang === 'te' ? 'హైదరాబాద్‌లో దశాబ్ది ఉత్సవాలు అట్టహాసంగా ప్రారంభమయ్యాయి!' : lang === 'hi' ? 'दशकीय समारोह शुरू हो गया है!' : 'The Decennial Celebration has commenced in Hyderabad!'}
                </h3>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-saffron-400 uppercase tracking-[0.3em]">
                  {lang === 'te' ? 'వేడుకలు ప్రారంభమగు సమయం' : lang === 'hi' ? 'उत्सव शुरू होने में समय' : 'Celebrations Start In'}
                </p>
                {timeLeft && (
                  <div className="flex justify-center gap-6 md:gap-10">
                    {[
                      { label: lang === 'te' ? 'గంటలు'    : lang === 'hi' ? 'घंटे'   : 'Hours',   value: timeLeft.hours   },
                      { label: lang === 'te' ? 'నిమిషాలు' : lang === 'hi' ? 'मिनट'   : 'Minutes', value: timeLeft.minutes },
                      { label: lang === 'te' ? 'సెకన్లు'  : lang === 'hi' ? 'సెకండ్'  : 'Seconds', value: timeLeft.seconds },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="text-4xl md:text-5xl font-black font-mono text-white bg-white/5 border border-white/10 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center">
                          {String(item.value).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest mt-2">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <p className="text-stone-400 text-xs md:text-sm max-w-xl mx-auto font-medium">
              {isConcluded
                ? (lang === 'te'
                  ? 'ముఖ్య అతిథి ACP బ్రహ్మశ్రీ K.M కిరణ్ కుమార్ గారికి, అడిషనల్ కలెక్టర్ (వికారాబాద్) శ్రీ ఎడుకోజు వెంకటాచారి గారికి, మరియు ఈ దశాబ్ది ఉత్సవాలను జయప్రదం చేసిన సంఘ సభ్యులందరికీ ధన్యవాదాలు.'
                  : lang === 'hi'
                  ? 'मुख्य अतिथि एसीपी ब्रह्मश्री के.एम. किरण कुमार सर, अतिरिक्त कलेक्टर (विकाराबाद) श्री एडुकोजु वेंकटचारी गारू और सभी समाज बंधुओं का हार्दिक आभार।'
                  : "We express our deepest gratitude to Chief Guest ACP Brahmasri K.M. Kiran Kumar Sir, Additional District Collector (Vikarabad) Sri Edukoju VenkataChary garu, and all community leaders and members.")
                : (lang === 'te'
                  ? 'ACP బ్రహ్మశ్రీ K.M కిరణ్ కుమార్ సర్, అడిషనల్ కలెక్టర్ శ్రీ ఎడుకోజు వెంకటాచారి గారు మరియు 20+ ప్రముఖ అతిథులు.'
                  : lang === 'hi'
                  ? 'एसीपी ब्रह्मश्री के.एम. किरण कुमार सर, अतिरिक्त कलेक्टर श्री एडुकोजु वेंकटचारी गारू एवं 20+ विशिष्ट अतिथिगण।'
                  : "ACP Brahmasri K.M. Kiran Kumar Sir, Additional District Collector (Vikarabad) Sri Edukoju VenkataChary garu & 20+ Distinguished Dignitaries.")}
            </p>
          </div>
          
          {/* ── Dignitaries Carousel ── */}
          <div className="relative z-10 pt-8 pb-6">

            {/* heading */}
            <div className="text-center px-8 md:px-12 mb-6">
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-[0.25em] mb-1">
                {lang === 'te' ? 'గౌరవనీయ అతిథులు' : lang === 'hi' ? 'माननीय अतिथिगण' : 'Honourable Guests'}
              </p>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {lang === 'te' ? '22 మంది ప్రముఖులు' : lang === 'hi' ? '22 गणमान्य अतिथि' : '22 Distinguished Dignitaries'}
              </h3>
            </div>

            {/* scroll track */}
            <div
              className="flex gap-0 overflow-x-auto pb-6"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {/* hide webkit scrollbar via inline pseudo — handled by global CSS; safe fallback above */}
              <style>{`.dignitary-scroll::-webkit-scrollbar { display: none; }`}</style>

              {/* leading padding */}
              <div className="shrink-0 w-8 md:w-12" />

              {TIER_ORDER.map((tier) => {
                const guests = DIGNITARIES.filter(g => g.tier === tier);
                if (!guests.length) return null;
                const cfg = TIER_CONFIG[tier];
                const tierLabel = lang === 'te' ? cfg.te : lang === 'hi' ? cfg.hi : cfg.en;

                return (
                  <div key={tier} className="flex items-stretch gap-0">
                    {/* ── Tier separator pill ── */}
                    <div className="shrink-0 flex flex-col items-center justify-center px-3 gap-3">
                      <div className="w-px flex-1 bg-white/10" />
                      <span
                        className={`text-[8px] font-black uppercase tracking-widest ${cfg.accent} whitespace-nowrap`}
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                      >
                        {tierLabel}
                      </span>
                      <div className="w-px flex-1 bg-white/10" />
                    </div>

                    {/* ── Guest cards ── */}
                    {guests.map((g, idx) => {
                      const name = lang === 'te' ? g.nameTe : lang === 'hi' ? g.nameHi : g.nameEn;
                      const sub  = lang === 'te' ? g.subTe  : lang === 'hi' ? g.subHi  : g.subEn;
                      const initials = getInitials(g.nameEn);
                      const photoCfg = g.photo
                        ? (PHOTO_CONFIG[g.photo] ?? { objectPosition: 'center top', scale: 1.4 })
                        : null;

                      return (
                        <motion.div
                          key={idx}
                          className="shrink-0 flex flex-col items-center gap-3 px-3"
                          style={{ scrollSnapAlign: 'start', width: 148 }}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '0px -80px' }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
                        >
                          {/* photo */}
                          <div
                            className={`relative w-full rounded-2xl overflow-hidden border-2 ${cfg.border} bg-stone-800 shrink-0`}
                            style={{ height: 168 }}
                          >
                            {/* initials fallback */}
                            <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-stone-500">
                              {initials}
                            </div>
                            {g.photo && photoCfg && (
                              <img
                                src={g.photo}
                                alt={g.nameEn}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{
                                  objectPosition: photoCfg.objectPosition,
                                }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            )}
                            {/* subtle gradient footer on photo */}
                            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>

                          {/* text below photo */}
                          <div className="text-center space-y-0.5 w-full">
                            <p className="text-[11px] font-black text-white leading-snug line-clamp-2">
                              {name}
                            </p>
                            <p className={`text-[9px] font-semibold leading-snug line-clamp-2 ${cfg.accent}`}>
                              {sub}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}

              {/* trailing padding */}
              <div className="shrink-0 w-8 md:w-12" />
            </div>

            {/* scroll hint */}
            <p className="text-center text-[9px] text-stone-600 font-semibold uppercase tracking-widest mt-1">
              ← {lang === 'te' ? 'స్క్రోల్ చేయండి' : lang === 'hi' ? 'स्क्रॉल करें' : 'Scroll to explore'} →
            </p>
          </div>

        </div>
        {/* ── end dark panel ──────────────────────────────────────────────── */}

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Live Event Invite */}
          <div className="bg-stone-50 border border-stone-100 p-8 rounded-[2.5rem] relative overflow-hidden group flex flex-col justify-between hover:shadow-2xl transition-all duration-500 hover:border-saffron-500/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-saffron-500/5 -mr-12 -mt-12 rounded-full group-hover:scale-[3] transition-transform duration-700 -z-0" />
            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 bg-saffron-550/10 rounded-2xl flex items-center justify-center text-saffron-600">
                <Calendar size={20} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-stone-900 font-display">
                  {lang === 'te' ? 'హైదరాబాద్ వేడుకలు' : lang === 'hi' ? 'हैदराबाद समारोह' : 'Hyderabad Celebrations'}
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed font-semibold">
                  {lang === 'te'
                    ? 'వేడుకలలో అధికారిక సంఘ సభ్యత్వ కార్డులు విజయవంతంగా విడుదల చేయబడ్డాయి. మీ డిజిటల్ కార్డు కోసం ఆన్‌లైన్ దరఖాస్తు చేసుకోండి.'
                    : lang === 'hi'
                    ? 'दशकीय समारोह में आधिकारिक सामुदायिक कार्डों का विमोचन किया गया। अपने डिजिटल कार्ड के लिए आज ही ऑनलाइन आवेदन करें।'
                    : 'Official community cards launched at the event. Apply online to get your verified Digital Member ID!'}
                </p>
              </div>
            </div>
            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-2 text-stone-600 text-xs font-bold bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                <MapPin size={14} className="text-saffron-600 shrink-0" />
                <span className="truncate">
                  {lang === 'te' ? 'సుందరయ్య విజ్ఞాన కేంద్రం' : lang === 'hi' ? 'सुंदरैया विज्ञान केंद्र' : 'Sundarayya Vignana Kendram'}
                </span>
              </div>
              <button
                onClick={handleShare}
                className="w-full bg-saffron-600 text-white h-12 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-saffron-700 transition-all cursor-pointer"
              >
                <Share2 size={12} />
                {lang === 'te' ? 'ఆహ్వానాన్ని షేర్ చేయండి' : lang === 'hi' ? 'निमंत्रण साझा करें' : 'Share Invitation'}
              </button>
            </div>
          </div>

          {/* Card 2: Parinaya Matrimony */}
          <div
            onClick={onOpenMatrimony}
            className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm relative overflow-hidden group flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-all duration-500 hover:border-pink-500/20"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50/50 -mr-12 -mt-12 rounded-full group-hover:scale-[3] transition-transform duration-700 -z-0" />
            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500">
                <Sparkles size={20} />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-pink-500/10 border border-pink-500/20 px-2.5 py-0.5 rounded-full text-pink-500 text-[8px] font-black uppercase tracking-widest">
                  {lang === 'te' ? 'అట్టహాసంగా ప్రారంభం' : lang === 'hi' ? 'भव्य शुभारंभ' : 'Grand Launch'}
                </div>
                <h3 className="text-xl font-black text-stone-900 font-display">💍 {lang === 'hi' ? 'परिणय' : lang === 'te' ? 'పరిణయ' : 'Parinaya'} Matrimony</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-semibold">
                  {lang === 'te'
                    ? 'మన సంఘం కోసం ప్రత్యేకంగా రూపొందించిన అధికారిక మ్యాట్రిమోనీ ప్లాట్‌ఫారమ్ దశాబ్ది ఉత్సవాల వేడుకలో ప్రారంభించబడుతుంది.'
                    : lang === 'hi'
                    ? 'दशकीय समारोह में हमारे समाज के लिए विशेष रूप से बने मैट्रिमोनी प्लेटफॉर्म का शुभारंभ।'
                    : 'The official community-exclusive matrimony platform launches at the decennial celebration event.'}
                </p>
              </div>
            </div>
            <div className="pt-8 relative z-10">
              <span className="inline-flex items-center gap-2 text-[10px] font-black text-pink-500 uppercase tracking-widest group-hover:gap-3.5 transition-all">
                {lang === 'te' ? 'వెయిట్‌లిస్ట్‌లో నమోదు చేసుకోండి' : lang === 'hi' ? 'प्रतीक्षा सूची में शामिल हों' : 'Register Waitlist'} <span className="text-pink-500">→</span>
              </span>
            </div>
          </div>

          {/* Card 3: Membership Cards */}
          <Link
            to="/membership"
            className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm relative overflow-hidden group flex flex-col justify-between hover:shadow-2xl transition-all duration-500 hover:border-vermilion/20"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-vermilion/5 -mr-12 -mt-12 rounded-full group-hover:scale-[3] transition-transform duration-700 -z-0" />
            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 bg-vermilion/5 rounded-2xl flex items-center justify-center text-vermilion">
                <CreditCard size={20} />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-vermilion/10 border border-vermilion/20 px-2.5 py-0.5 rounded-full text-vermilion text-[8px] font-black uppercase tracking-widest">
                  {lang === 'te' ? 'ప్రత్యక్ష పంపిణీ' : lang === 'hi' ? 'लाइव वितरण' : 'Live Distribution'}
                </div>
                <h3 className="text-xl font-black text-stone-900 font-display">
                  {lang === 'te' ? 'VKC సభ్యత్వ కార్డులు' : lang === 'hi' ? 'VKC सदस्यता कार्ड' : 'VKC Membership Cards'}
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed font-semibold">
                  {lang === 'te'
                    ? 'విడుదల మరియు పంపిణీ ఈరోజు ప్రారంభం. మీ కార్డు కోసం ఆన్‌లైన్ దరఖాస్తు చేసుకోండి.'
                    : lang === 'hi'
                    ? 'आज समारోह में आधिकारिक सामुदायिक कार्डों का वितरण शुरू हो रहा है।'
                    : 'Distribution of official community cards begins at the event today. Apply online!'}
                </p>
              </div>
            </div>
            <div className="pt-8 relative z-10">
              <span className="inline-flex items-center gap-2 text-[10px] font-black text-vermilion uppercase tracking-widest group-hover:gap-3.5 transition-all">
                {lang === 'te' ? 'కార్డు కోసం దరఖాస్తు చేసుకోండి' : lang === 'hi' ? 'कार्ड के लिए आवेदन करें' : 'Apply for Card'} <span className="text-vermilion">→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Schedule & Event Agenda */}
        <div className="bg-stone-50 border border-stone-100 p-8 md:p-12 rounded-[2.5rem] grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h4 className="text-xs font-black text-saffron-600 uppercase tracking-widest flex items-center gap-2">
              <Award size={16} /> {lang === 'te' ? 'కార్యక్రమ ముఖ్యాంశాలు' : lang === 'hi' ? 'कार्यक्रम की मुख्य विशेषताएं' : 'Event Agenda'}
            </h4>
            <ul className="space-y-4 text-xs font-bold text-stone-600 uppercase tracking-wider">
              {[
                { te: '🏛️ వివిధ రాష్ట్రాల నాయకులతో జాతీయ సదస్సు',         hi: '🏛️ विभिन्न राज्यों के नेताओं के साथ राष्ट्रीय सम्मेलन',  en: '🏛️ National Conference with state leaders' },
                { te: '🏆 విశ్వకర్మ లెజెండరీ & లీడర్ అవార్డుల ప్రధానోత్సవం', hi: '🏆 विश्वकर्मा लेजेंडरी और लीडर पुरस्कारों का वितरण',       en: '🏆 Vishwakarma Legendary & Leader Awards' },
                { te: '🎓 ఉత్తమ విద్యార్థులకు పురస్కారాలు (10వ తరగతి/ఇంటర్)', hi: '🎓 मेधावी छात्रों के लिए पुरस्कार (10वीं/इंटर)',           en: '🎓 Student Excellence Awards (10th/Inter)' },
                { te: '💍 పరిణయ మ్యాట్రిమోనీ ప్రారంభోత్సవం',                 hi: '💍 परिणय मैट्रिमोनी का भव्य शुभारंभ',                      en: '💍 Parinaya Matrimony Launch' },
                { te: '🌐 అధికారిక వెబ్‌సైట్ ప్రారంభోత్సవ వేడుక',            hi: '🌐 आधिकारिक वेबसाइट का उद्घाटन समारोह',                   en: '🌐 Official Website Launch Ceremony' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-saffron-550 rounded-full shrink-0" />
                  {lang === 'te' ? item.te : lang === 'hi' ? item.hi : item.en}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6 flex flex-col justify-center">
            <h4 className="text-xs font-black text-stone-900 uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-saffron-600" /> {lang === 'te' ? 'తేదీ & సమయాలు' : lang === 'hi' ? 'दिनांक और समय' : 'Date & Timings'}
            </h4>
            <p className="text-stone-500 text-xs leading-relaxed font-bold uppercase tracking-widest">
              {lang === 'te' ? 'మే 31, 2026 (ఆదివారం)' : lang === 'hi' ? '31 मई 2026 (रविवार)' : 'Sunday, May 31, 2026 (Concluded)'}
              <br />
              {lang === 'te' ? 'సాయంత్రం 05:00 నుండి రాత్రి 09:30 వరకు IST' : lang === 'hi' ? 'शाम 05:00 बजे से रात 09:30 बजे IST तक' : '05:00 PM to 09:30 PM IST'}
            </p>
            <div className="h-[1px] bg-stone-200 w-full" />
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
              {lang === 'te' ? 'ఆహ్వానాల కొరకు సంప్రదించండి: 9700960815, 8886469469' : lang === 'hi' ? 'आरएसवीपी: 9700960815, 8886469469' : 'RSVP: 9700960815, 8886469469'}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
