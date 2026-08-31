import { Metadata } from 'next';
import { VisionPage } from "@/features/home/pages/VisionPage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Vision & Strategic Goals",
  description: "Learn about the mission, goals, and core values of the Vishwakarma Knowledge Centre (VKC). Read about our strategic objectives for empowering and mapping traditional artisans in India.",
  keywords: ["VKC Vision", "Mission", "Traditional Artisans", "Artisan Welfare", "Vedic Architecture", "VKC Strategic Goals"],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/vision',
  },
  openGraph: {
    title: "Vision & Strategic Goals | VKC",
    description: "Learn about the mission, goals, and core values of the Vishwakarma Knowledge Centre (VKC).",
    url: "https://vishwakarmaknowledgecentre.org/vision",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Vision & Mission", url: "/vision" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Vision & Strategic Goals",
    description: "Learn about the mission, goals, and core values of the Vishwakarma Knowledge Centre (VKC).",
    url: "/vision"
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
      <VisionPage />
    </>
  );
}
