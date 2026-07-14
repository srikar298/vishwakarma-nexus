"use client";

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  MapPin, 
  Phone, 
  Star, 
  Filter,
  ChevronRight,
  User,
  X,
  Briefcase,
  MessageSquare,
  Award
} from 'lucide-react';
import type { Artisan, ArtisanCategory } from '@/features/directory/contracts/ArtisanSchema';
import { CRAFT_LABELS } from '@/features/directory/contracts/ArtisanSchema';
import { BaseModal } from '@/shared/ui/BaseModal';

const MOCK_ARTISANS: Artisan[] = [
  {
    id: '1',
    name: 'Sri Ramana Chary',
    nameRegional: 'శ్రీ రమణ చారి',
    craft: 'sculpture',
    location: 'Warangal, Telangana',
    phone: '+91 98480 12345',
    rating: 4.9,
    experienceYears: 25,
    featured: true,
    image: 'https://images.unsplash.com/photo-1590739225287-bd2049969145?auto=format&fit=crop&q=82&w=800',
    portfolio: [
      {
        id: 'p1_1',
        title: { en: 'Temple Dwara Palaka', te: 'దేవాలయ ద్వారపాలకుడు', hi: 'मंदिर द्वारपाल मूर्ति' },
        image: 'https://images.unsplash.com/photo-1608976328267-e673d3ec06ce?auto=format&fit=crop&q=80&w=800',
        description: {
          en: 'Hand-carved granite stone dwara palaka (gatekeeper) statue for a traditional South Indian temple.',
          te: 'సాంప్రదాయ దక్షిణ భారత దేవాలయం కోసం చేతితో చెక్కిన గ్రానైట్ ద్వారపాలకుడి విగ్రహం.',
          hi: 'पारंपरिक दक्षिण भारतीय मंदिर के लिए हाथ से तराशी गई ग्रेनाइट द्वारपाल की मूर्ति।'
        }
      },
      {
        id: 'p1_2',
        title: { en: 'Lord Shiva Vigraha', te: 'శివ విగ్రహం', hi: 'शिव विग्रह' },
        image: 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?auto=format&fit=crop&q=80&w=800',
        description: {
          en: 'Five-foot monolithic black granite Shiva idol with intricate details of the Trishula and Damru.',
          te: 'త్రిశూలం మరియు డమరుకం యొక్క క్లిష్టమైన వివరాలతో కూడిన ఐదు అడుగుల నల్ల రాతి శివుడి ఏకశిలా విగ్రహం.',
          hi: 'त्रिशूल और डमरू के जटिल विवरणों के साथ पांच फीट की अखंड काले ग्रेनाइट शिव की मूर्ति।'
        }
      }
    ],
    testimonials: [
      {
        id: 't1_1',
        clientName: 'M. S. N. Sastry (Temple Committee)',
        rating: 5,
        text: {
          en: "Sri Ramana Chary's work is divinely precise. The Shiva idol he sculpted has become the spiritual focal point of our community.",
          te: "శ్రీ రమణ చారిగారి పనితనం దైవికమైన ఖచ్చితత్వంతో కూడుకున్నది. వారు చెక్కిన శివుడి విగ్రహం మా ఆలయానికి ప్రధాన ఆకర్షణగా నిలిచింది.",
          hi: "श्री रमना चारी का काम अत्यंत दिव्य और सटीक है। उनके द्वारा तराशी गई शिव की मूर्ति हमारे समुदाय की आध्यात्मिक श्रद्धा का केंद्र बन गई है।"
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Sri Naveen Achary',
    nameRegional: 'శ్రీ నవీన్ ఆచారి',
    craft: 'jewelry',
    location: 'Secunderabad, Hyderabad',
    phone: '+91 99887 76655',
    rating: 4.8,
    experienceYears: 15,
    image: 'https://images.unsplash.com/photo-1610492314412-d4ec18db6865?auto=format&fit=crop&q=82&w=800',
    portfolio: [
      {
        id: 'p2_1',
        title: { en: 'Bridal Guttapusalu', te: 'నవవధువు గుట్టపూసల హారం', hi: 'दुल्हन गुट्टापुसुलू हार' },
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
        description: {
          en: 'Handcrafted gold Guttapusalu necklace set with natural pearls, rubies, and emeralds.',
          te: 'సహజ ముత్యాలు, కెంపులు మరియు పచ్చలతో చేతితో తయారు చేయబడిన బంగారు గుట్టపూసల హారం.',
          hi: 'प्राकृतिक मोतियों, माणिक और पन्ने से जड़ा हुआ हस्तनिर्मित सोने का गुट्टापुसुलू हार सेट।'
        }
      },
      {
        id: 'p2_2',
        title: { en: 'Traditional Waist Belt', te: 'బంగారు వడ్డాణం', hi: 'पारंपरिक सोने की कमरबंद (वॉडनम)' },
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
        description: {
          en: 'Intricate 22k gold Vaddanam (waist belt) detailing Goddess Lakshmi seated on a lotus.',
          te: 'తామరపువ్వుపై కూర్చున్న లక్ష్మీ దేవి రూపంతో కూడిన 22 క్యారెట్ల బంగారు వడ్డాణం.',
          hi: 'कमल पर विराजमान देवी लक्ष्मी के विवरण वाली 22 कैरेट सोने की जटिल कमरबंद।'
        }
      }
    ],
    testimonials: [
      {
        id: 't2_1',
        clientName: 'Smt. Anjali Rao',
        rating: 5,
        text: {
          en: "The Guttapusalu set Naveen Achary crafted for my daughter's wedding is an heirloom piece. Incredible refinement in gold wire wrapping.",
          te: "నా కుమార్తె వివాహం కోసం నవీన్ ఆచారిగారు తయారు చేసిన గుట్టపూసల హారం మా కుటుంబంలో ఒక అపురూపమైన కానుక. బంగారు తీగల అల్లిక చాలా అద్భుతంగా ఉంది.",
          hi: "नवीन आचारी ने मेरी बेटी की शादी के लिए जो गुट्टापुसुलू सेट बनाया, वह एक विरासत टुकड़ा है। सोने के तारों की नक्काशी में अद्भुत परिष्कार है।"
        }
      }
    ]
  },
  {
    id: '3',
    name: 'Sri Bhaskar Chary',
    nameRegional: 'శ్రీ భాస్కర్ చారి',
    craft: 'carpentry',
    location: 'Karimnagar, Telangana',
    phone: '+91 94401 55443',
    rating: 4.7,
    experienceYears: 30,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=82&w=800',
    portfolio: [
      {
        id: 'p3_1',
        title: { en: 'Burma Teak Temple Door', te: 'టేకు దేవాలయ తలుపు', hi: 'बर्मा टीक मंदिर का दरवाजा' },
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
        description: {
          en: 'Hand-carved double door made of premium Burma teak representing the Dashavatara (ten incarnations of Lord Vishnu).',
          te: 'దశావతారాల రూపాలతో కూడిన ప్రీమియం బర్మా టేకుతో చేతితో చెక్కిన ఆలయ ద్వారం.',
          hi: 'दशावतार (भगवान विष्णु के दस अवतार) को दर्शाते हुए प्रीमियम बर्मा टीक से नक्काशीदार डबल दरवाजा।'
        }
      },
      {
        id: 'p3_2',
        title: { en: 'Home Pooja Mandir', te: 'పూజా మందిరం', hi: 'घर का पूजा मंदिर' },
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
        description: {
          en: 'Custom home temple altar with traditional gopuram dome and bell placements.',
          te: 'సాంప్రదాయ గోపురం మరియు గంటల అమరికతో కూడిన ఇంటి పూజా మందిరం.',
          hi: 'पारंपरिक गोपुरम गुंबद और घंटियों की व्यवस्था के साथ कस्टम होम पूजा मंदिर।'
        }
      }
    ],
    testimonials: [
      {
        id: 't3_1',
        clientName: 'Sri Venkatesh K.',
        rating: 5,
        text: {
          en: "Bhaskar Chary's wood carving skills are unmatched. The Dashavatara door he built for our home is a true work of art.",
          te: "భాస్కర్ చారిగారి చెక్క చెక్కడపు నైపుణ్యం సాటిలేనిది. వారు మా ఇంటి కోసం తయారు చేసిన దశావతారాల తలుపు నిజమైన కళాఖండం.",
          hi: "भास्कर चारी की लकड़ी पर नक्काशी का कौशल बेजोड़ है। उन्होंने हमारे घर के लिए जो दशावतार दरवाजा बनाया, वह कला का एक सच्चा काम है।"
        }
      }
    ]
  },
  {
    id: '4',
    name: 'Sri Venkata Chary',
    nameRegional: 'శ్రీ వెంకట చారి',
    craft: 'metalwork',
    location: 'Nirmal, Telangana',
    phone: '+91 90001 11223',
    rating: 4.6,
    experienceYears: 20,
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5f566fab?auto=format&fit=crop&q=82&w=800',
    portfolio: [
      {
        id: 'p4_1',
        title: { en: 'Ornamental Brass Lamps', te: 'ఇత్తడి దీపాలు', hi: 'सजावटी पीतल के दीपक' },
        image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800',
        description: {
          en: 'Tall, traditional bronze and brass lamps (Samayalu) with intricate peacock motif on the apex.',
          te: 'శిఖరంపై క్లిష్టమైన నెమలి రూపంతో కూడిన పొడవైన, సాంప్రదాయ ఇత్తడి దీపాలు.',
          hi: 'शीर्ष पर जटिल मयूर आकृति के साथ लंबे, पारंपरिक कांसे और पीतल के दीपक।'
        }
      },
      {
        id: 'p4_2',
        title: { en: 'Wrought Iron Gates', te: 'ఇనుప సింహద్వారం', hi: 'गढ़ा हुआ लोहे का दरवाजा (Wrought Iron)' },
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        description: {
          en: 'Heavy wrought iron main gate with floral vine scrolling patterns and brass spearheads.',
          te: 'పువ్వుల తీగలు మరియు ఇత్తడి మొనలతో కూడిన బరువైన అలంకార ఇనుప ప్రధాన ద్వారం.',
          hi: 'पुष्प लता घुमावदार पैटर्न और पीतल के भालों के साथ भारी गढ़ा हुआ लोहे का मुख्य द्वार।'
        }
      }
    ],
    testimonials: [
      {
        id: 't4_1',
        clientName: 'Sri Ramakrishnan A.',
        rating: 5,
        text: {
          en: "Venkata Chary created custom brass oil lamps for our ancestral home. The symmetry and polish are outstanding.",
          te: "వెంకట చారిగారు మా పూర్వీకుల ఇల్లు కోసం ప్రత్యేకమైన ఇత్తడి దీపాలను తయారు చేశారు. వాటి సౌష్టవం మరియు మెరుపు చాలా అద్భుతంగా ఉన్నాయి.",
          hi: "वेंकट चारी ने हमारे पुश्तैनी घर के लिए कस्टम पीतल के दीये बनाए। उनकी समरूपता और पॉलिश उत्कृष्ट है।"
        }
      }
    ]
  }
];

import { PageHero } from '@/shared/ui/PageHero';

export const DirectoryPage = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ArtisanCategory>('all');
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);

  // Lock scroll & handle Escape key for the details modal
  useEffect(() => {
    if (selectedArtisan) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedArtisan(null);
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        window.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedArtisan]);

  const filteredArtisans = useMemo(() => {
    return MOCK_ARTISANS.filter(artisan => {
      const searchTerms = searchQuery.toLowerCase();
      const matchesSearch = 
        artisan.name.toLowerCase().includes(searchTerms) ||
        artisan.nameRegional.toLowerCase().includes(searchTerms) ||
        artisan.location.toLowerCase().includes(searchTerms);
      const matchesCategory = activeCategory === 'all' || artisan.craft === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categories: ArtisanCategory[] = ['all', 'carpentry', 'metalwork', 'sculpture', 'jewelry', 'architecture'];

  return (
    <div className="min-h-screen bg-stone-50/30">
      <PageHero
        badgeLabel="The Economic Engine"
        title={<>Master Artisans <span className="text-vermilion">& Professionals</span></>}
        subtitle="Discover the finest Vishwakarma craftsmen. From sacred architecture to intricate jewelry, find the legacy you need."
      >
        {/* Search & Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[2.5rem] border border-stone-200/60 shadow-2xl flex flex-col md:flex-row gap-4 items-center mt-8 relative">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-vermilion transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search by name, location, or skill..."
              className="w-full h-16 pl-16 pr-12 bg-stone-50 rounded-3xl border-none focus:ring-2 focus:ring-vermilion transition-all font-medium text-stone-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-stone-900 transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="hidden md:flex h-12 w-[1px] bg-stone-100" />
          <div className="relative w-full md:w-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto pr-8 md:pr-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeCategory === cat 
                      ? 'bg-stone-900 text-turmeric shadow-lg' 
                      : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                  }`}
                >
                  {cat === 'all' ? <Filter size={12} /> : null}
                  {cat === 'all' ? 'All Crafts' : CRAFT_LABELS[cat as keyof typeof CRAFT_LABELS][i18n.language as 'en' | 'te' | 'hi']}
                </button>
              ))}
            </div>
            {/* Mobile Scroll Hint Gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/80 to-transparent pointer-events-none md:hidden" />
          </div>
        </div>
      </PageHero>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-8">
           <p className="text-stone-500 font-bold text-sm">
             Showing <span className="text-stone-900">{filteredArtisans.length}</span> results
           </p>
        </div>

        <motion.div 
           layout
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredArtisans.map((artisan, index) => (
              <motion.div
                key={artisan.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group bg-white rounded-[3rem] overflow-hidden border border-stone-100 shadow-xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col justify-between"
              >
                <div 
                  className="flex-1 flex flex-col justify-between cursor-pointer" 
                  onClick={() => setSelectedArtisan(artisan)}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img src={artisan.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={artisan.name} />
                    
                    {/* Hover visual indicator tag */}
                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white/95 backdrop-blur-sm text-stone-900 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl scale-90 group-hover:scale-100 transition-all duration-300 flex items-center gap-2">
                        View Portfolio
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    {artisan.featured && (
                      <div className="absolute top-6 left-6 bg-turmeric text-stone-900 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                         <Star size={12} fill="currentColor" />
                         Master Artisan
                      </div>
                    )}

                    <div className="absolute bottom-6 left-8 right-8 text-white">
                      <span className="text-turmeric text-[10px] font-black uppercase tracking-[0.3em] mb-1 block">
                         {CRAFT_LABELS[artisan.craft][i18n.language as 'en' | 'te' | 'hi']}
                      </span>
                      <h3 className={`text-2xl font-black leading-tight ${i18n.language === 'te' ? 'font-ramaraja' : i18n.language === 'hi' ? 'font-rozha' : 'font-outfit'}`}>
                         {i18n.language === 'en' ? artisan.name : artisan.nameRegional}
                      </h3>
                    </div>
                  </div>

                  <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-stone-600 font-medium">
                         <MapPin size={18} className="text-vermilion/50" />
                         <span className="text-sm">{artisan.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-stone-600 font-medium">
                         <User size={18} className="text-vermilion/50" />
                         <span className="text-sm">{artisan.experienceYears}+ Years Experience</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                         {[...Array(5)].map((_, i) => (
                           <Star 
                             key={i} 
                             size={14} 
                             className={i < Math.floor(artisan.rating) ? "text-turmeric fill-turmeric" : "text-stone-200"}
                           />
                         ))}
                         <span className="ml-2 text-xs font-black text-stone-900">{artisan.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-0 flex gap-3">
                  <a 
                    href={`tel:${artisan.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-grow bg-stone-900 text-white h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-stone-800 transition-all active:scale-95 shadow-lg cursor-pointer"
                  >
                    <Phone size={16} />
                    Call Now
                  </a>
                  <button 
                    onClick={() => setSelectedArtisan(artisan)}
                    className="w-14 h-14 border-2 border-stone-100 rounded-2xl flex items-center justify-center text-stone-400 hover:border-vermilion hover:text-vermilion transition-all active:scale-95 group/btn cursor-pointer"
                  >
                     <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredArtisans.length === 0 && (
          <div className="bg-stone-50/50 border-4 border-dashed border-stone-100 rounded-[3rem] p-32 text-center">
            <p className="text-stone-400 font-bold mb-4 uppercase tracking-[0.2em]">No master artisans found</p>
            <p className="text-stone-300 text-sm max-w-sm mx-auto">Try adjusting your search query or switching categories to find other professionals.</p>
          </div>
        )}
      </div>

      {/* Join the Network Banner */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-24">
        <div className="bg-vermilion rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-[0_40px_100px_rgba(227,66,52,0.2)]">
          <motion.img 
            src="/images/features/home/hero/mandala-motif.webp"
            alt="Decorative Mandala Motif"
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute -right-32 -bottom-32 w-96 h-96 opacity-10 pointer-events-none invert"
          />
          <div className="relative z-10 max-w-2xl">
             <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
               Are you a Master <span className="text-turmeric text-stroke-white">Craftsman?</span>
             </h2>
             <p className="text-white/80 text-lg mb-10 font-medium">
               Get your work discovered by thousands. Join our network today and claim your Digital Identity card.
             </p>
             <button className="bg-white text-vermilion px-10 py-5 rounded-2xl font-black text-base uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                List Your Business
             </button>
          </div>
        </div>
      </div>

      {/* Portfolio & Details Modal */}
      <BaseModal
        isOpen={!!selectedArtisan}
        onClose={() => setSelectedArtisan(null)}
        maxW="max-w-4xl"
        className="!p-0" // Padding handled by internal columns
      >
        {selectedArtisan && (
          <div className="relative w-full p-6 sm:p-10 flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto">
            {/* Left Column: Profile Card */}
            <div className="w-full md:w-1/3 flex flex-col gap-6">
              <div className="aspect-[4/3] md:aspect-square w-full rounded-3xl overflow-hidden shadow-md">
                <img src={selectedArtisan.image} alt={selectedArtisan.name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-vermilion text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">
                      {CRAFT_LABELS[selectedArtisan.craft][i18n.language as 'en' | 'te' | 'hi']}
                  </span>
                  <h2 className={`text-3xl font-black text-stone-900 tracking-tight leading-tight ${i18n.language === 'te' ? 'font-ramaraja' : i18n.language === 'hi' ? 'font-rozha' : 'font-outfit'}`}>
                      {i18n.language === 'en' ? selectedArtisan.name : selectedArtisan.nameRegional}
                  </h2>
                </div>

                <div className="space-y-2 border-t border-b border-stone-100 py-4">
                  <div className="flex items-center gap-3 text-stone-600 font-medium">
                      <MapPin size={16} className="text-vermilion/60" />
                      <span className="text-xs">{selectedArtisan.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-600 font-medium">
                      <Briefcase size={16} className="text-vermilion/60" />
                      <span className="text-xs">{selectedArtisan.experienceYears}+ Years Experience</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-600 font-medium">
                      <Award size={16} className="text-vermilion/60" />
                      <span className="text-xs">Certified Master Artisan</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < Math.floor(selectedArtisan.rating) ? "text-turmeric fill-turmeric" : "text-stone-200"}
                        />
                      ))}
                      <span className="ml-1 text-xs font-black text-stone-900">{selectedArtisan.rating}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a 
                    href={`tel:${selectedArtisan.phone}`}
                    className="flex-grow bg-stone-900 text-white h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-stone-800 transition-all active:scale-95 shadow-lg"
                  >
                    <Phone size={16} />
                    Call Now
                  </a>
                  <a 
                    href={`https://wa.me/${selectedArtisan.phone.replace(/[^0-9]/g, '')}?text=Hello ${selectedArtisan.name}, I found your profile on Vishwakarma Nexus and I am interested in your ${selectedArtisan.craft} work.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-600/20"
                  >
                    <MessageSquare size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Portfolio & Reviews */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Section: Portfolio */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-stone-900 uppercase tracking-widest font-display flex items-center gap-2 border-b border-stone-100 pb-2">
                  Featured Portfolio
                </h3>
                
                <div className="grid gap-6">
                  {selectedArtisan.portfolio?.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 bg-stone-50/50 p-4 rounded-3xl border border-stone-100/80 hover:shadow-md transition-all group/item">
                      <div className="w-full sm:w-28 aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                        <img src={item.image} alt={item.title[i18n.language as 'en' | 'te' | 'hi']} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-black text-stone-900 text-sm font-display group-hover/item:text-vermilion transition-colors">
                          {item.title[i18n.language as 'en' | 'te' | 'hi']}
                        </h4>
                        <p className="text-stone-500 text-xs leading-relaxed line-clamp-3">
                          {item.description[i18n.language as 'en' | 'te' | 'hi']}
                        </p>
                      </div>
                    </div>
                  ))}
                  {!selectedArtisan.portfolio && (
                    <p className="text-stone-400 text-xs italic">No portfolio items uploaded yet.</p>
                  )}
                </div>
              </div>

              {/* Section: Testimonials */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-stone-900 uppercase tracking-widest font-display flex items-center gap-2 border-b border-stone-100 pb-2">
                  Client Endorsements
                </h3>
                
                <div className="grid gap-4">
                  {selectedArtisan.testimonials?.map((t) => (
                    <div key={t.id} className="bg-stone-50/30 p-5 rounded-3xl border border-stone-100/60 relative overflow-hidden">
                      <MessageSquare className="absolute right-4 bottom-4 w-16 h-16 text-stone-200/20 pointer-events-none" />
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-xs text-stone-800">{t.clientName}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} size={10} className="text-turmeric fill-turmeric" />
                          ))}
                        </div>
                      </div>
                      <p className="text-stone-500 text-xs italic leading-relaxed relative z-10">
                        &ldquo;{t.text[i18n.language as 'en' | 'te' | 'hi']}&rdquo;
                      </p>
                    </div>
                  ))}
                  {!selectedArtisan.testimonials && (
                    <p className="text-stone-400 text-xs italic">No client endorsements yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </BaseModal>
    </div>
  );
};

