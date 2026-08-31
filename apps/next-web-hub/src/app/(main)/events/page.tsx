import { Metadata } from 'next';
import { HomePage } from "@/features/home/pages/HomePage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Community Events & Decennial Celebrations",
  description: "Stay updated on upcoming summits, artisan training workshops, and heritage celebrations organized by the Vishwakarma Knowledge Centre.",
  keywords: ["Events", "VKC Events", "Artisan Workshops", "Community Summits", "Decennial Celebrations"],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/events',
  },
  openGraph: {
    title: "Community Events & Decennial Celebrations | VKC",
    description: "Stay updated on upcoming summits, artisan training workshops, and heritage celebrations.",
    url: "https://vishwakarmaknowledgecentre.org/events",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Events", url: "/events" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Community Events & Decennial Celebrations",
    description: "Upcoming summits, artisan training workshops, and heritage celebrations organized by VKC.",
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
      <HomePage />
    </>
  );
}
