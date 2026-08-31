import { Metadata } from 'next';
import { HomePage } from "@/features/home/pages/HomePage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Media Gallery & Event Highlights",
  description: "Browse photos, video highlights, and archive coverage of Vishwakarma Knowledge Centre (VKC) decennial events, artisan meets, and traditional craftsmanship.",
  keywords: ["Gallery", "Media highlights", "VKC Events", "Decennial Celebrations", "Artisan photos"],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/gallery',
  },
  openGraph: {
    title: "Media Gallery & Event Highlights | VKC",
    description: "Browse photos, video highlights, and archive coverage of Vishwakarma Knowledge Centre (VKC).",
    url: "https://vishwakarmaknowledgecentre.org/gallery",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Media Gallery", url: "/gallery" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Media Gallery & Event Highlights",
    description: "Media gallery and photos archive of Vishwakarma Knowledge Centre.",
    url: "/gallery"
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
