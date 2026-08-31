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
      <EventsPage />
    </>
  );
}
