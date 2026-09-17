import { Metadata } from 'next';
import { EventsPage } from "@/features/events/pages/EventsPage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Events, Summits & National Movements",
  description: "Stay updated on upcoming summits, the historic Pushpagiri Chalo Delhi Paadha Yathra (1,700 KM), artisan training workshops, and heritage celebrations.",
  keywords: [
    "Events", 
    "VKC Events", 
    "Pushpagiri Chalo Delhi Yatra", 
    "Artisan Workshops", 
    "Community Summits", 
    "Decennial Celebrations",
    "Vishwakarma Yatra 2026"
  ],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/events',
  },
  openGraph: {
    title: "Events, Summits & National Movements | VKC",
    description: "Stay updated on upcoming summits, the historic Pushpagiri Chalo Delhi Paadha Yathra (1,700 KM), artisan workshops, and celebrations.",
    url: "https://vishwakarmaknowledgecentre.org/events",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Events & Summits", url: "/events" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Events, Summits & National Movements",
    description: "Upcoming summits, artisan training workshops, and the Pushpagiri Chalo Delhi Paadha Yathra organized by VKC.",
    url: "/events"
  });

  const eventListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Event",
          "@id": "https://vishwakarmaknowledgecentre.org/events/ekta-yatra#event",
          "name": "Vishwakarma Vanshaj Ekta Maha Padayatra (Hyderabad to New Delhi)",
          "description": "Historic 1,700 KM Vishwakarma Vanshaj Ekta Maha Padayatra traversing 68+ waypoint stations across Telangana, Maharashtra, Madhya Pradesh, Uttar Pradesh, Rajasthan, and Haryana to New Delhi for community constitutional rights and a 15-point national charter of demands.",
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
          "offers": {
            "@type": "Offer",
            "name": "Free Community Yatra Registration & Pass",
            "price": "0",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "validFrom": "2026-01-15T00:00:00+05:30",
            "url": "https://vishwakarmaknowledgecentre.org/events/ekta-yatra"
          },
          "performer": [
            {
              "@type": "Person",
              "name": "Brahmasri Vishwanadhula Pushpagiri",
              "jobTitle": "Ekta Yatra Leader & Spiritual Guide"
            },
            {
              "@type": "Organization",
              "name": "Vishwakarma Vanshaj Ekta Manch Bharat",
              "url": "https://vishwakarmaknowledgecentre.org"
            }
          ],
          "organizer": {
            "@type": "Organization",
            "name": "Vishwakarma Knowledge Centre & Vishwakarma Vanshaj Ekta Manch Bharat",
            "url": "https://vishwakarmaknowledgecentre.org"
          },
          "image": [
            "https://vishwakarmaknowledgecentre.org/og-image.jpg"
          ]
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
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
              "name": "Brahmasri Vishwanadhula Pushpagiri"
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
        }
      }
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventListSchema) }}
      />
      <EventsPage />
    </>
  );
}
