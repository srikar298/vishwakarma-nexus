import { HomePage } from "@/features/home/pages/HomePage";
import { Metadata } from 'next';
import { SOCIAL_LINKS_ARRAY } from '@/shared/constants/social-links';
import { LEADERSHIP_MEMBERS } from '@/shared/constants/leadershipData';

export const metadata: Metadata = {
  title: "Vishwakarma Knowledge Centre | Preserving Heritage, Powering Futures",
  description: "Dedicated to the recognition, skill upgradation, and holistic support of traditional artisans in Andhra Pradesh and Telangana. Join the mission to empower the Vishwakarma community.",
  keywords: [
    "Vishwakarma Knowledge Centre",
    "VKC",
    "PM Vishwakarma",
    "Traditional Artisans",
    "Skill Upgradation",
    "Artisan Support",
    "Hyderabad",
    "Bagh Amberpet",
    "Pancha Kula",
    "Vedic Crafts",
    "Governing Council"
  ],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org',
  },
  openGraph: {
    title: "Vishwakarma Knowledge Centre | Preserving Heritage, Powering Futures",
    description: "Dedicated to the recognition, skill upgradation, and holistic support of traditional artisans in Andhra Pradesh and Telangana. Join the mission to empower the Vishwakarma community.",
    url: "https://vishwakarmaknowledgecentre.org",
    siteName: "Vishwakarma Knowledge Centre",
  },
};

export default function Page() {
  const structuredDataGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://vishwakarmaknowledgecentre.org/#website",
        "url": "https://vishwakarmaknowledgecentre.org",
        "name": "Vishwakarma Knowledge Centre",
        "alternateName": ["VKC", "Vishwakarma Knowledge Centre Hyderabad", "VKC Nexus"],
        "description": "Official portal of Vishwakarma Knowledge Centre for traditional artisans, sacred heritage, and skill development.",
        "inLanguage": ["en", "te", "hi"],
        "publisher": {
          "@id": "https://vishwakarmaknowledgecentre.org/#organization"
        }
      },
      {
        "@type": ["EducationalOrganization", "NGO", "LocalBusiness"],
        "@id": "https://vishwakarmaknowledgecentre.org/#organization",
        "name": "Vishwakarma Knowledge Centre",
        "alternateName": ["VKC", "PM Vishwakarma Centre", "Vishwakarma Knowledge Centre Hyderabad"],
        "url": "https://vishwakarmaknowledgecentre.org",
        "logo": {
          "@type": "ImageObject",
          "url": "https://vishwakarmaknowledgecentre.org/images/shared/emblem.png",
          "caption": "Vishwakarma Knowledge Centre Emblem"
        },
        "image": "https://vishwakarmaknowledgecentre.org/og-image.jpg",
        "description": "A dedicated non-profit institution and knowledge hub for the holistic support, recognition, digital identity, and skill upgradation of traditional artisans.",
        "telephone": ["+91 96664 35426", "+91 94400 95412"],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Shivam Rd, Prashanti Nagar, Bagh Amberpet",
          "addressLocality": "Hyderabad",
          "addressRegion": "Telangana",
          "postalCode": "500013",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "17.3971",
          "longitude": "78.5133"
        },
        "sameAs": SOCIAL_LINKS_ARRAY,
        "member": LEADERSHIP_MEMBERS.map(m => ({
          "@type": "Person",
          "name": m.name.en,
          "jobTitle": m.role.en
        }))
      },
      {
        "@type": "ItemList",
        "@id": "https://vishwakarmaknowledgecentre.org/#navigation",
        "name": "Main Navigation",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "Artisans Directory",
            "description": "Discover verified Vishwakarma sculptors, goldsmiths, blacksmiths, carpenters, and architects.",
            "url": "https://vishwakarmaknowledgecentre.org/directory"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "Knowledge & Shastras",
            "description": "Digital archives of ancient manuscripts, architectural manuals, and Vedic treatises.",
            "url": "https://vishwakarmaknowledgecentre.org/knowledge"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "Governing Leadership Council",
            "description": "National leadership, state committee, and youth wing convenors of VKC.",
            "url": "https://vishwakarmaknowledgecentre.org/leadership"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "Digital Artisan ID & Membership",
            "description": "Join the VKC global network and generate your unique digital artisan identity.",
            "url": "https://vishwakarmaknowledgecentre.org/membership"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 5,
            "name": "Sacred Heritage",
            "description": "Explore the history, lineage, and engineering secrets of Pancha Kula arts.",
            "url": "https://vishwakarmaknowledgecentre.org/heritage"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 6,
            "name": "Vision & Mission",
            "description": "Strategic goals and institutional vision for empowering traditional artisans.",
            "url": "https://vishwakarmaknowledgecentre.org/vision"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 7,
            "name": "Professional Network",
            "description": "Connect with community professionals, leaders, and artisan enterprises.",
            "url": "https://vishwakarmaknowledgecentre.org/network"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 8,
            "name": "Donors & Patrons",
            "description": "Honorary patrons and sponsor leaderboard supporting artisan welfare.",
            "url": "https://vishwakarmaknowledgecentre.org/donors"
          }
        ]
      },
      {
        "@type": "Event",
        "@id": "https://vishwakarmaknowledgecentre.org/#event-anniversary",
        "name": "VKC 10th Anniversary Decennial Celebration",
        "description": "Celebrating a decade of excellence, heritage preservation, and community leadership by Vishwakarma Knowledge Centre. A grand gathering of artisans, community leaders, and dignitaries.",
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
          "availability": "https://schema.org/InStock",
          "url": "https://vishwakarmaknowledgecentre.org"
        },
        "organizer": {
          "@id": "https://vishwakarmaknowledgecentre.org/#organization"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataGraph) }}
      />
      <HomePage />
    </>
  );
}
