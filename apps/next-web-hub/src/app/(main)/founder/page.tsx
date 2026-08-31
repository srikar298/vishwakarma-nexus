import { Metadata } from 'next';
import { FounderPage } from "@/features/home/pages/FounderPage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Founder Legacy - Brahmasri Kondoju Praveen Kumar Chary",
  description: "Discover the journey, achievements, and legacy of our founder, Brahmasri Kondoju Praveen Kumar Chary. Read about his lifelong dedication to restoring dignity and digital sovereignty to traditional artisans.",
  keywords: ["VKC Founder", "Kondoju Praveen Kumar Chary", "Artisan Advocate", "Vishwakarma Legacy", "Welfare Leader"],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/founder',
  },
  openGraph: {
    title: "Founder Legacy - Brahmasri Kondoju Praveen Kumar Chary | VKC",
    description: "Discover the journey, achievements, and legacy of our founder, Brahmasri Kondoju Praveen Kumar Chary.",
    url: "https://vishwakarmaknowledgecentre.org/founder",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Founder & Legacy", url: "/founder" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Founder Legacy - Brahmasri Kondoju Praveen Kumar Chary",
    description: "Discover the journey, achievements, and legacy of our founder, Brahmasri Kondoju Praveen Kumar Chary.",
    url: "/founder"
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
      <FounderPage />
    </>
  );
}
