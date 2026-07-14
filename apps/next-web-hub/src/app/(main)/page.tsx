import { HomePage } from "@/features/home/pages/HomePage";
import { Metadata } from 'next';
import { SOCIAL_LINKS_ARRAY } from '@/shared/constants/social-links';

export const metadata: Metadata = {
  title: "Home | Vishwakarma Knowledge Centre",
  description: "Dedicated to the recognition, skill upgradation, and holistic support of traditional artisans in Andhra Pradesh and Telangana. Join the mission to empower the Vishwakarma community.",
  keywords: ["Vishwakarma", "VKC", "Traditional Artisans", "Skill Upgradation", "Artisan Support", "Hyderabad"],
};

export default function Page() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(anniversarySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationSchema) }}
      />
      <HomePage />
    </>
  );
}
