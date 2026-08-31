import { Metadata } from 'next';
import { EktaYatraPage } from "@/features/events/pages/EktaYatraPage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Vishwakarma Vanshaj Ekta Maha Padayatra (1,700 KM) | VKC",
  description: "Historic 1,700 KM Vishwakarma Vanshaj Ekta Maha Padayatra from Hyderabad to New Delhi along NH-44 across 68+ waypoint stations. Organized jointly by VKC and Ekta Manch Bharat from Sep 17 to Nov 29, 2026. Register your mobile number for a Digital Pass.",
  keywords: [
    "Vishwakarma Vanshaj Ekta Maha Padayatra",
    "Vishwakarma Ekta Yatra 2026",
    "Hyderabad to Delhi 1700 KM",
    "VKC Ekta Padayatra",
    "VKC",
    "Vishwanadhula Pushpagiri",
    "Mukesh Kumar Jangid",
    "NH-44 Padayatra Route Map",
    "Vishwakarma 15 Demands",
    "Caste Census Vishwakarma",
    "Maru Parikrama Ekta Yatra"
  ],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/events/ekta-yatra',
  },
  openGraph: {
    title: "Vishwakarma Vanshaj Ekta Maha Padayatra (1,700 KM) | VKC",
    description: "Historic 1,700 KM Vishwakarma Vanshaj Ekta Maha Padayatra from Hyderabad to New Delhi along NH-44 across 68+ waypoint stations. Sep 17 to Nov 29, 2026.",
    url: "https://vishwakarmaknowledgecentre.org/events/ekta-yatra",
    siteName: "Vishwakarma Knowledge Centre",
    images: [
      {
        url: "https://vishwakarmaknowledgecentre.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vishwakarma Vanshaj Ekta Maha Padayatra 2026",
      },
    ],
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Events & Summits", url: "/events" },
    { name: "Vishwakarma Vanshaj Ekta Maha Padayatra", url: "/events/ekta-yatra" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Vishwakarma Vanshaj Ekta Maha Padayatra (1,700 KM)",
    description: "Historic 1,700 KM foot march from Hyderabad to Delhi along NH-44 traversing 68+ waypoint stations across 6 states for Vishwakarma community rights and recognition.",
    url: "/events/ekta-yatra"
  });

  // Schema.org Event structured data
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Vishwakarma Vanshaj Ekta Maha Padayatra (Hyderabad to New Delhi)",
    "startDate": "2026-09-17T08:00:00+05:30",
    "endDate": "2026-11-29T18:00:00+05:30",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "NH-44 National Highway Corridor (Hyderabad to New Delhi Parliament)",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "addressCountry": "IN"
      }
    },
    "description": "Historic 1,700 KM Vishwakarma Vanshaj Ekta Maha Padayatra traversing 68+ waypoint stations across Telangana, Maharashtra, Madhya Pradesh, Uttar Pradesh, Rajasthan, and Haryana to New Delhi for community constitutional rights and a 15-point national charter of demands.",
    "organizer": {
      "@type": "Organization",
      "@id": "https://vishwakarmaknowledgecentre.org/#organization",
      "name": "Vishwakarma Knowledge Centre & Vishwakarma Vanshaj Ekta Manch Bharat",
      "url": "https://vishwakarmaknowledgecentre.org"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": "https://vishwakarmaknowledgecentre.org/events/ekta-yatra"
    },
    "image": [
      "https://vishwakarmaknowledgecentre.org/og-image.jpg"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <EktaYatraPage />
    </>
  );
}
