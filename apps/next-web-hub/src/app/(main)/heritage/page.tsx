import { Metadata } from 'next';
import { HeritagePage } from "@/features/heritage/pages/HeritagePage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Sacred Architecture & Pancha Kula Heritage",
  description: "Explore ancient scriptures, temple engineering secrets, and sacred architecture of the Vishwakarma community. Uncover the roots of Pancha Kula arts and traditional engineering legacies.",
  keywords: ["Sacred Architecture", "Pancha Kula", "Shastras", "Artisan Heritage", "Traditional Engineering", "Vedic Arts"],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/heritage',
  },
  openGraph: {
    title: "Sacred Architecture & Pancha Kula Heritage | VKC",
    description: "Explore the ancient scriptures, engineering secrets, and sacred architecture of the Vishwakarma community.",
    url: "https://vishwakarmaknowledgecentre.org/heritage",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Sacred Heritage", url: "/heritage" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Sacred Architecture & Pancha Kula Heritage",
    description: "Explore the ancient scriptures, engineering secrets, and sacred architecture of the Vishwakarma community.",
    url: "/heritage"
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
      <HeritagePage />
    </>
  );
}
