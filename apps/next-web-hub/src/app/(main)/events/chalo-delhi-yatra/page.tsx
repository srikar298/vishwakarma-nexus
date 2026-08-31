import { Metadata } from 'next';
import { ChaloDelhiYatraPage } from "@/features/events/pages/ChaloDelhiYatraPage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Pushpagiri Chalo Delhi Ekta Paadha Yathra (1,700 KM) | VKC",
  description: "Historic 1,700 KM Vishwakarma Ekta Paadha Yathra from Hyderabad to New Delhi along NH-44. Organized by Vishwakarma Knowledge Centre (VKC) from Sep 17 to Nov 29, 2026. Register your mobile number for a Digital Pass.",
  keywords: [
    "Pushpagiri Chalo Delhi Yatra",
    "Vishwakarma Padayatra 2026",
    "Hyderabad to Delhi 1700 KM",
    "Vishwakarma Ekta Yatra",
    "VKC",
    "Vishwanadhula Pushpagiri",
    "NH-44 Padayatra",
    "Vishwakarma 15 Demands",
    "Caste Census Vishwakarma",
    "Telangana Vishwakarma",
    "National Highway 44 Yatra"
  ],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/events/chalo-delhi-yatra',
  },
  openGraph: {
    title: "Pushpagiri Chalo Delhi Ekta Paadha Yathra (1,700 KM) | VKC",
    description: "Historic 1,700 KM Vishwakarma Ekta Paadha Yathra from Hyderabad to New Delhi along NH-44. Sep 17 to Nov 29, 2026. Register your mobile number.",
    url: "https://vishwakarmaknowledgecentre.org/events/chalo-delhi-yatra",
    siteName: "Vishwakarma Knowledge Centre",
    images: [
      {
        url: "https://vishwakarmaknowledgecentre.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pushpagiri Chalo Delhi Ekta Paadha Yathra 2026",
      },
    ],
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Events & Summits", url: "/events" },
    { name: "Pushpagiri Chalo Delhi Paadha Yathra", url: "/events/chalo-delhi-yatra" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Pushpagiri Chalo Delhi Ekta Paadha Yathra (1,700 KM)",
    description: "Historic 1,700 KM foot march from Hyderabad to Delhi along NH-44 for Vishwakarma community rights and recognition.",
    url: "/events/chalo-delhi-yatra"
  });

  // Schema.org Event structured data
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Pushpagiri Chalo Delhi Vishwakarma Ekta Paadha Yathra",
    "startDate": "2026-09-17T08:00:00+05:30",
    "endDate": "2026-11-29T18:00:00+05:30",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "NH-44 National Highway Corridor (Hyderabad to New Delhi)",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "addressCountry": "IN"
      }
    },
    "description": "Historic 1,700 KM Vishwakarma Ekta Paadha Yathra traversing Telangana, Maharashtra, Madhya Pradesh, Uttar Pradesh, Rajasthan, and Haryana to New Delhi for community constitutional rights and a 15-point national charter of demands.",
    "organizer": {
      "@type": "Organization",
      "@id": "https://vishwakarmaknowledgecentre.org/#organization",
      "name": "Vishwakarma Knowledge Centre",
      "url": "https://vishwakarmaknowledgecentre.org"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": "https://vishwakarmaknowledgecentre.org/events/chalo-delhi-yatra"
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
      <ChaloDelhiYatraPage />
    </>
  );
}
