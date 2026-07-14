import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, Share2, Navigation } from 'lucide-react';

interface AnniversaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DIGNITARIES = [
  {
    nameEn: "ACP Brahmasri K.M. Kiran Kumar Sir",
    nameTe: "ACP బ్రహ్మశ్రీ K.M కిరణ్ కుమార్ సర్",
    nameHi: "एसीपी ब्रह्मश्री के.एम. किरण कुमार सर",
    subEn: "Chief Guest, ACP Hyderabad",
    subTe: "ముఖ్య అతిథి, ACP హైదరాబాద్",
    subHi: "मुख्य अतिथि, एसीपी हैदराबाद",
    photo: "/images/guests/km_kiran_kumar.jpg"
  },
  {
    nameEn: "Edukoju VenkataChary garu",
    nameTe: "ఎడుకోజు వెంకటాచారి గారు",
    nameHi: "एडुकोजु वेंकटचारी गारू",
    subEn: "Additional Collector",
    subTe: "అడిషనల్ కలెక్టర్",
    subHi: "अतिरिक्त कलेक्टर",
    photo: "/images/guests/e_venkatachary.jpg"
  },
  {
    nameEn: "Brahmasri Kondoju Praveen Kumar Chary garu",
    nameTe: "బ్రహ్మశ్రీ కొండోజు ప్రవీణ్ కుమార్ చారి గారు",
    nameHi: "ब्रह्मश्री कोंडोजु प्रवीण कुमार चारी गारू",
    subEn: "President, VKC Telangana",
    subTe: "అధ్యక్షులు, VKC తెలంగాణ",
    subHi: "अध्यक्ष, VKC तेलंगाना",
    photo: "/images/guests/praveen_kumar.jpg"
  },
  {
    nameEn: "Brahmasri Solleti Prabhakara Chary garu",
    nameTe: "బ్రహ్మశ్రీ సొల్లేటి ప్రభాకర్ చారి గారు",
    nameHi: "ब्रह्मश्री सोल्लेटी प्रभाकर चारी गारू",
    subEn: "National Joint Secretary, VKC",
    subTe: "జాతీయ సంయుక్త కార్యదర్శి, VKC",
    subHi: "राष्ट्रीय संयुक्त सचिव, VKC",
    photo: "/images/guests/solleti_prabhakara.jpg"
  },
  {
    nameEn: "Dr. P. Harikanth Acharya garu",
    nameTe: "డాక్టర్ పి. హరికాంత్ ఆచార్య గారు",
    nameHi: "डॉ. पी. हरिकांत आचार्य गारू",
    subEn: "Public Doctor & Social Activist",
    subTe: "వైద్యులు & సామాజిక కార్యకర్త",
    subHi: "सार्वजनिक चिकित्सक एवं सामाजिक कार्यकर्ता",
    photo: "/images/guests/harikanth_acharya.jpg"
  },
  {
    nameEn: "Brahmasri Puligilla Prakash Achary garu",
    nameTe: "బ్రహ్మశ్రీ పులిగిల్ల ప్రకాష్ ఆచారి గారు",
    nameHi: "ब्रह्मश्री पुलिगिल्ला प्रकाश चारी गारू",
    subEn: "State Vishwakarma Leader",
    subTe: "రాష్ట్ర విశ్వకర్మ నాయకులు",
    subHi: "राज्य विश्वकर्मा नेता",
    photo: "/images/guests/puligilla_prakash.jpg"
  },
  {
    nameEn: "Brahmasri Thalloju Achary garu",
    nameTe: "బ్రహ్మశ్రీ తాళ్ళోజు ఆచారి గారు",
    nameHi: "ब्रह्मश्री ताल्लोजु चारी गारू",
    subEn: "Former BC Commission Member",
    subTe: "మాజీ బీసీ కమిషన్ సభ్యులు",
    subHi: "पूर्व पिछड़ा वर्ग आयोग सदस्य",
    photo: "/images/guests/thalloju_achary.jpg"
  },
  {
    nameEn: "Brahmasri Ravi Chary garu",
    nameTe: "బ్రహ్మశ్రీ రవి చారి గారు",
    nameHi: "ब्रह्मश्री रवि चारी गारू",
    subEn: "BJP Senior Leader",
    subTe: "బీజేపీ సీనియర్ నాయకులు",
    subHi: "भाजपा वरिष्ठ नेता",
    photo: "/images/guests/ravi_chary.jpg"
  },
  {
    nameEn: "Brahmasri Chandramouli Chary garu",
    nameTe: "బ్రహ్మశ్రీ చంద్రమౌళి చారి గారు",
    nameHi: "ब्रह्मश्री चंद्रमौली चारी गारू",
    subEn: "Sarpanch & Social Activist",
    subTe: "సర్పంచ్ & సామాజిక కార్యకర్త",
    subHi: "सरपंच एवं सामाजिक कार्यकर्ता",
    photo: "/images/guests/chandramouli_chary.jpg"
  },
  {
    nameEn: "Brahmasri Yemnnagandla Ramesh Chary garu",
    nameTe: "బ్రహ్మశ్రీ యెమ్నగండ్ల రమేష్ చారి గారు",
    nameHi: "ब्रह्मश्री येमनागंडला रमेश चारी गारू",
    subEn: "President, Swarnakara Sangham",
    subTe: "అధ్యక్షులు, స్వర్ణకార సంఘం",
    subHi: "अध्यक्ष, स्वर्णकार संघ",
    photo: "/images/guests/ramesh_chary.jpg"
  },
  {
    nameEn: "Dasoju Sravan garu",
    nameTe: "దాసోజు శ్రవణ్ గారు",
    nameHi: "दासोझु श्रवण गारू",
    subEn: "MLC & Senior Leader",
    subTe: "MLC & సీనియర్ నాయకులు",
    subHi: "एमएलसी एवं वरिष्ठ नेता",
    photo: "/images/guests/dasoju_sravan.jpg"
  },
  {
    nameEn: "Vadla Laxminarayana Chary garu",
    nameTe: "వడ్ల లక్ష్మీనారాయణ చారి గారు",
    nameHi: "वडला लक्ष्मीनारायण चारी गारू",
    subEn: "Community Leader",
    subTe: "సంఘ నాయకులు",
    subHi: "सामुदायिक नेता",
    photo: "/images/guests/vadla_laxminarayana.jpg"
  },
  {
    nameEn: "Varnoju Balakrishna Chary garu",
    nameTe: "వర్ణోజు బాలకృష్ణ చారి గారు",
    nameHi: "वर्णोजु बालकृष्ण चारी गारू",
    subEn: "Community Leader",
    subTe: "సంఘ నాయకులు",
    subHi: "सामुदायिक नेता",
    photo: "/images/guests/varnoju_balakrishna.jpg"
  },
  {
    nameEn: "Smt Bibinagar Anuradha garu",
    nameTe: "శ్రీమతి బీబినగర్ అనురాధ గారు",
    nameHi: "श्रीमती बीबीनगर अनुराधा गारू",
    subEn: "Community Leader",
    subTe: "సంఘ నాయకురాలు",
    subHi: "सामुदायिक नेता",
    photo: "/images/guests/bibinagar_anuradha.jpg"
  },
  {
    nameEn: "Naveen Achary garu",
    nameTe: "నవీన్ ఆచారి గారు",
    nameHi: "नवीन आचार्य गारू",
    subEn: "Community Leader",
    subTe: "సంఘ నాయకులు",
    subHi: "सामुदायिक नेता",
    photo: "/images/guests/naveen_achary.jpg"
  },
  {
    nameEn: "Vannoj Sai Prakash Chary garu",
    nameTe: "వన్నోజు సాయి ప్రకాష్ చారి గారు",
    nameHi: "वन्नोजु साई प्रकाश चारी गारू",
    subEn: "Social Contributor",
    subTe: "సామాజిక కార్యకర్త",
    subHi: "सामाजिक कार्यकर्ता",
    photo: "/images/guests/sai_prakash.jpg"
  },
  {
    nameEn: "Sada Shiva Chary garu",
    nameTe: "సదాశివ చారి గారు",
    nameHi: "सदा शिव चारी गारू",
    subEn: "Social Contributor",
    subTe: "సామాజిక కార్యకర్త",
    subHi: "सामाजिक कार्यकर्ता",
    photo: "/images/guests/sadashiva_chary.jpg"
  },
  {
    nameEn: "Nallanagula Sriman garu",
    nameTe: "నల్లంగుల శ్రీమన్ గారు",
    nameHi: "नल्लानगुला श्रीमन गारू",
    subEn: "Social Contributor",
    subTe: "సామాజిక కార్యకర్త",
    subHi: "सामाजिक कार्यकर्ता",
    photo: "/images/guests/nallanagula_sriman.jpg"
  },
  {
    nameEn: "Geetha Rani Sudhakar garu",
    nameTe: "గీతా రాణి సుధాకర్ గారు",
    nameHi: "गीता रानी साक्षी गारू",
    subEn: "Social Contributor",
    subTe: "సామాజిక కార్యకర్త",
    subHi: "सामाजिक कार्यकर्ता",
    photo: "/images/guests/geetha_rani.jpg"
  },
  {
    nameEn: "Avusala Bhanu Prakash Avadhani garu",
    nameTe: "అవుసల భాను ప్రకాష్ అవధాని గారు",
    nameHi: "अवुसला भानु प्रकाश अवधनी गारू",
    subEn: "Social Contributor",
    subTe: "సామాజిక కార్యకర్త",
    subHi: "सामाजिक कार्यकर्ता",
    photo: "/images/guests/bhanu_prakash.jpg"
  }
];

const getInitials = (name: string) => {
  const cleanName = name
    .replace(/^(Smt\.?|Smt|Dr\.?|Dr|ACP|Brahmasri|Varnoju|Vannoj|Vadla|Avusala)\s+/i, '')
    .replace(/\s+garu$/i, '')
    .trim();
  const parts = cleanName.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0] ? parts[0][0].toUpperCase() : 'V';
};

import { BaseModal } from '@/shared/ui/BaseModal';

export const AnniversaryModal: React.FC<AnniversaryModalProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();

  const handleShare = () => {
    const shareText = i18n.language === 'te'
      ? `విశ్వకర్మ నాలెడ్జ్ సెంటర్ (VKC) 10వ వార్షికోత్సవ దశాబ్ది ఉత్సవాలకు సాదర ఆహ్వానం!🎉\n\n` +
        `📅 తేదీ: 31 మే 2026 (ఆదివారం)\n` +
        `⏰ సమయం: సాయంత్రం 05:00 నుండి రాత్రి 09:30 వరకు\n` +
        `📍 వేదిక: మెయిన్ హాల్, సుందరయ్య విజ్ఞాన కేంద్రం, బాగ్ లింగంపల్లి, హైదరాబాద్.\n` +
        `👑 ముఖ్య అతిథులు: మంత్రి శ్రీమతి సీతక్క గారు, ACP బ్రహ్మశ్రీ K.M కిరణ్ కుమార్ సర్ మరియు ప్రముఖులు\n\n` +
        `దయచేసి ఈ ఆహ్వానాన్ని మన బంధుమిత్రులకు షేర్ చేయండి! 🔄\n` +
        `#VKC10Years #VishwakarmaPride`
      : i18n.language === 'hi'
      ? `विश्वकर्मा नॉलेज सेंटर (VKC) के 10वें वार्षिक दशकीय समारोह में आपका सादर आमंत्रण!🎉\n\n` +
        `📅 दिनांक: 31 मई 2026 (रविवार)\n` +
        `⏰ समय: शाम 05:00 बजे से रात 09:30 बजे तक\n` +
        `📍 स्थान: मुख्य हॉल, सुंदरैया विज्ञान केंद्र, बाग लिंगमपल्ली, हैदराबाद।\n` +
        `👑 मुख्य अतिथि: माननीय मंत्री श्रीमती सीतक्का गारू, एसीपी ब्रह्मश्री के.एम. किरण कुमार सर एवं गणमान्य व्यक्ति\n\n` +
        `कृपया इस निमंत्रण को अपने मित्रों और परिवार के साथ साझा करें! 🔄\n` +
        `#VKC10Years #VishwakarmaPride`
      : `Cordially inviting you to the Vishwakarma Knowledge Centre (VKC) 10th Anniversary Decennial Celebrations!🎉\n\n` +
        `📅 Date: May 31, 2026 (Sunday)\n` +
        `⏰ Time: 05:00 PM to 09:30 PM IST\n` +
        `📍 Venue: Main Hall, Sundarayya Vignana Kendram, Bagh Lingampally, Hyderabad.\n` +
        `👑 Chief Guests: Hon'ble Minister Smt Seethakka garu, ACP Brahmasri K.M. Kiran Kumar Sir & Dignitaries\n\n` +
        `Please share this invitation with your family and friends! 🔄\n` +
        `#VKC10Years #VishwakarmaPride`;

    const encodedText = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  const handleDirections = () => {
    window.open('https://maps.google.com/?q=Sundarayya+Vignana+Kendram+Bagh+Lingampally+Hyderabad', '_blank');
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose}
      className="!bg-gradient-to-b !from-stone-900 !to-stone-950 text-white !border-saffron-500/20"
      maxW="max-w-[420px]"
    >
      {/* Saffron & Gold Decorative Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-saffron-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="p-6 md:p-7 text-center space-y-4 relative z-10">
        {/* Saffron Badge */}
        <div className="inline-flex items-center gap-1.5 bg-saffron-500/10 border border-saffron-500/30 px-3 py-1 rounded-full text-saffron-400">
          <span className="text-[9px] font-black uppercase tracking-widest">
            {i18n.language === 'te' ? '10 సంవత్సరాల దశాబ్ది ఉత్సవాలు' : i18n.language === 'hi' ? '10 वर्षीय दशकीय समारोह' : '10 Years Decennial Celebrations'}
          </span>
        </div>

        {/* Title Block */}
        <div className="space-y-1">
          <span className="text-2xl">🎉</span>
          <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight text-white font-display">
            {i18n.language === 'te'
              ? 'విశ్వకర్మ నాలెడ్జ్ సెంటర్ దశాబ్ది ఉత్సవాలు!'
              : i18n.language === 'hi'
                ? 'विश्वकर्मा नॉलेज सेंटर दशकीय समारोह!'
                : 'VKC 10th Anniversary Celebrations!'}
          </h3>
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest leading-none pt-0.5">
            {i18n.language === 'te' ? 'ఒక దశాబ్దపు సగర్వ వికాసం' : i18n.language === 'hi' ? 'सशक्तिकरण और गौरव का एक दशक' : 'A Decade of Empowerment & Pride'}
          </p>
        </div>

        <div className="h-[1px] bg-stone-800/80 w-full" />

        {/* Chief Guests & Dignitaries Segment */}
        <div className="bg-stone-850/50 border border-stone-800 p-3 rounded-xl text-left space-y-2">
          <span className="text-[8px] font-black text-saffron-400 uppercase tracking-widest block">
            {i18n.language === 'te' 
              ? 'ముఖ్య అతిథులు & ప్రతినిధులు' 
              : i18n.language === 'hi' 
              ? 'मुख्य अतिथि और गणमान्य व्यक्ति' 
              : 'Chief Guests & Dignitaries'}
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {DIGNITARIES.map((guest, idx) => {
              const initials = getInitials(guest.nameEn);
              return (
                <div key={idx} className="flex-shrink-0 w-28 bg-stone-900/50 p-2 rounded-xl border border-stone-800/40 text-center space-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-stone-800 text-saffron-400 text-[10px] font-black mx-auto overflow-hidden relative border border-stone-700">
                    <span className="absolute inset-0 flex items-center justify-center">{initials}</span>
                    {guest.photo && (
                      <img
                        src={guest.photo}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-white truncate px-1">
                      {(i18n.language === 'te' ? guest.nameTe : i18n.language === 'hi' ? guest.nameHi : guest.nameEn).replace(/ (garu|గారు|गारू)$/i, '')}
                    </p>
                    <p className="text-[7px] text-stone-500 font-black uppercase tracking-tighter truncate px-1">
                      {i18n.language === 'te' ? guest.subTe : i18n.language === 'hi' ? guest.subHi : guest.subEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid gap-2 text-left text-[11px] text-stone-300 font-medium">
          <div className="flex items-center gap-2.5 bg-stone-850/20 p-2.5 rounded-lg border border-stone-850/50">
            <Calendar size={14} className="text-saffron-500 shrink-0" />
            <span>
              {i18n.language === 'te' ? '31 మే 2026 (ఆదివారం - విజయవంతంగా ముగిసింది)' : i18n.language === 'hi' ? '31 मई 2026 (रविवार - संपन्न)' : 'May 31, 2026 (Sunday - Concluded)'}
            </span>
          </div>
          <div className="flex items-center gap-2.5 bg-stone-850/20 p-2.5 rounded-lg border border-stone-850/50">
            <Clock size={14} className="text-saffron-500 shrink-0" />
            <span>
              {i18n.language === 'te' ? 'సాయంత్రం 05:00 - రాత్రి 09:30 IST' : i18n.language === 'hi' ? 'शाम 05:00 - रात 09:30 IST' : '05:00 PM - 09:30 PM IST'}
            </span>
          </div>
          <div className="flex items-center gap-2.5 bg-stone-850/20 p-2.5 rounded-lg border border-stone-850/50">
            <MapPin size={14} className="text-saffron-500 shrink-0" />
            <span className="leading-normal">
              {i18n.language === 'te'
                ? 'మెయిన్ హాల్, సుందరయ్య విజ్ఞాన కేంద్రం, బాగ్ లింగంపల్లి, హైదరాబాద్.'
                : i18n.language === 'hi'
                ? 'मुख्य हॉल, सुंदरैया विज्ञान केंद्र, बाग लिंगमपल्ली, हैदराबाद।'
                : 'Main Hall, Sundarayya Vignana Kendram, Bagh Lingampally, Hyderabad.'}
            </span>
          </div>
        </div>

        <div className="h-[1px] bg-stone-800/80 w-full" />

        {/* Interactive Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="bg-saffron-600 text-white h-10 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-saffron-700 transition-all active:scale-[0.98] shadow-lg shadow-saffron-600/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 size={12} />
            {i18n.language === 'te' ? 'షేర్ చేయండి' : i18n.language === 'hi' ? 'साझा करें' : 'Share Invite'}
          </button>
          <button
            onClick={handleDirections}
            className="bg-stone-800 text-white h-10 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-stone-700 transition-all active:scale-[0.98] border border-stone-750 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Navigation size={12} className="text-saffron-500" />
            {i18n.language === 'te' ? 'దారి కనుగొనండి' : i18n.language === 'hi' ? 'दिशा-निर्देश' : 'Get Directions'}
          </button>
        </div>

        {/* Contacts */}
        <p className="text-[9px] text-stone-500 font-bold uppercase tracking-widest">
          {i18n.language === 'te' ? 'వికెసి కమిటీ' : i18n.language === 'hi' ? 'वीकेसी समिति' : 'VKC Committee'}: 9700960815, 8886469469
        </p>

      </div>
    </BaseModal>
  );
};
