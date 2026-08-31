import { Metadata } from 'next';
import { LegendsPage } from "@/features/heritage/pages/LegendsPage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Legends, Historians & Scholars",
  description: "Celebrate the prominent scholars, sculptors, and historians who have chronicled the contribution of the Vishwakarma community to global engineering, arts, and literature.",
  keywords: ["Vishwakarma Legends", "Historians", "Sculptors", "Community Scholars", "Legacy of Art", "National Awardees"],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/legends',
  },
  openGraph: {
    title: "Legends, Historians & Scholars | VKC",
    description: "Celebrate the prominent scholars, sculptors, and historians of the Vishwakarma community.",
    url: "https://vishwakarmaknowledgecentre.org/legends",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Legends & Scholars", url: "/legends" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Legends, Historians & Scholars",
    description: "Prominent scholars, sculptors, and historians chronicling Vishwakarma heritage.",
    url: "/legends"
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
      <LegendsPage />
    </>
  );
}
