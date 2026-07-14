"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  MapPin
} from 'lucide-react';

import { eventsData as localEvents } from '../../../shared/constants/mock-data';
import { api } from '@/infrastructure/http/apiClient';
import { HeroFiveSons } from '@/features/heritage/components/HeroFiveSons';
import { EcosystemTwinBranches } from '@/features/home/components/EcosystemTwinBranches';
import { ShastraVaultTab } from '@/features/heritage/components/ShastraVaultTab';
import { AboutSection } from '@/features/home/components/AboutSection';
import { FounderSection } from '@/features/home/components/FounderSection';
import { CompactTimeline } from '@/features/home/components/CompactTimeline';
import { GallerySection } from '@/features/home/components/GallerySection';
import { MatrimonyModal } from '@/shared/components/MatrimonyModal';
import { SOCIAL_LINKS_ARRAY } from '@/shared/constants/social-links';


export const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<typeof localEvents>(localEvents);
  const [isMatrimonyModalOpen, setIsMatrimonyModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await api.get<typeof localEvents>('community/events');
      if (!error && data && data.length > 0) {
        setEvents(data);
      }
      // Falls back to localEvents (already set as default state) on error or empty response
    };

    fetchEvents();
  }, []);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vishwakarma Knowledge Centre",
    "alternateName": "VKC",
    "url": "https://vishwakarmaknowledgecentre.org",
    "logo": "https://vishwakarmaknowledgecentre.org/images/shared/emblem.png",
    "description": "A dedicated institution for the holistic support, recognition, and skill upgradation of traditional artisans.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bagh Lingampally",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500044",
      "addressCountry": "IN"
    },
    "sameAs": SOCIAL_LINKS_ARRAY
  };

  const anniversarySchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "VKC 10th Anniversary Decennial Celebration",
    "description": "Celebrating a decade of excellence, heritage preservation, and community leadership by Vishwakarma Knowledge Centre. A grand gathering of artisans, community leaders, and dignitaries at Sundarayya Vignana Kendram, Hyderabad.",
    "startDate": "2026-05-31T17:00:00+05:30",
    "endDate": "2026-05-31T21:30:00+05:30",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "image": [
      "https://vishwakarmaknowledgecentre.org/images/anniversary-banner.jpg",
      "https://vishwakarmaknowledgecentre.org/og-image.jpg"
    ],
    "location": {
      "@type": "Place",
      "name": "Sundarayya Vignana Kendram",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bagh Lingampally",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "postalCode": "500044",
        "addressCountry": "IN"
      }
    },
    "offers": {
      "@type": "Offer",
      "name": "General Admission",
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/SoldOut",
      "validFrom": "2026-05-01T00:00:00+05:30",
      "url": "https://vishwakarmaknowledgecentre.org"
    },
    "performer": [
      {
        "@type": "Person",
        "name": "ACP Brahmasri K.M. Kiran Kumar"
      },
      {
        "@type": "Person",
        "name": "E. Venkata Chary"
      }
    ],
    "organizer": {
      "@type": "Organization",
      "name": "Vishwakarma Knowledge Centre",
      "url": "https://vishwakarmaknowledgecentre.org"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Vishwakarma Knowledge Centre",
    "url": "https://vishwakarmaknowledgecentre.org"
  };

  const navigationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "Vision",
        "url": "https://vishwakarmaknowledgecentre.org/vision"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Heritage",
        "url": "https://vishwakarmaknowledgecentre.org/heritage"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Directory",
        "url": "https://vishwakarmaknowledgecentre.org/directory"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Network",
        "url": "https://vishwakarmaknowledgecentre.org/network"
      }
    ]
  };

  return (
    <>
      {/* LAYER 1: DIVINE IDENTITY & HERO */}
      <HeroFiveSons />

      {/* LAYER 2: TWIN BRANCHES (MATRIMONY & ARTISAN DIRECTORY) */}
      <EcosystemTwinBranches onOpenMatrimony={() => setIsMatrimonyModalOpen(true)} />

      {/* LAYER 3: WISDOM BRIDGE (TABBED SHASTRA ARCHIVES) */}
      <ShastraVaultTab />

      {/* LAYER 4: BRAND TRUST & EVENTS */}
      <AboutSection />
      <FounderSection />
      <CompactTimeline />
      <GallerySection />


      {/* Events Section */}
      <section id="events" className="py-24 bg-cream/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-4 font-display">{t('events.title')}</h2>
            <p className="text-stone-600 text-lg">{t('events.subtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-saffron-50 -mr-12 -mt-12 rounded-full group-hover:scale-[3] transition-transform duration-700 -z-0" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-saffron-700 font-bold mb-6 uppercase tracking-widest text-[10px]">
                    <Calendar size={14} />
                    {(event.date as Record<string, string>)[i18n.language]}
                  </div>
                  <h3 className="text-2xl font-black text-stone-900 mb-4 group-hover:text-saffron-700 transition-colors leading-tight font-display">
                    {(event.title as Record<string, string>)[i18n.language]}
                  </h3>
                  <p className="text-stone-500 mb-8 line-clamp-3 text-sm leading-relaxed">
                    {(event.description as Record<string, string>)[i18n.language]}
                  </p>
                  <div className="flex items-center gap-2 text-stone-600 text-xs font-bold bg-stone-50 self-start px-3 py-2 rounded-lg">
                    <MapPin size={14} className="text-gold-500" />
                    {(event.location as Record<string, string>)[i18n.language]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matrimony Coming Soon Modal */}
      <MatrimonyModal 
        isOpen={isMatrimonyModalOpen}
        onClose={() => setIsMatrimonyModalOpen(false)}
      />
    </>
  );
};
