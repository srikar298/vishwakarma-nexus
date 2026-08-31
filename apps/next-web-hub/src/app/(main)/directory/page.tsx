import { Metadata } from 'next';
import { DirectoryPage } from "@/features/directory/pages/DirectoryPage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Master Artisans & Professionals Directory",
  description: "Discover verified Vishwakarma craftsmen. From sacred temple architecture and traditional carpentry to intricate metalwork and jewelry, find certified master artisans.",
  keywords: ["Artisan Directory", "Vishwakarma Directory", "Traditional Craftsmen", "Blacksmiths", "Goldsmiths", "Carpenters", "Sculptors", "Sacred Architecture"],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/directory',
  },
  openGraph: {
    title: "Master Artisans & Professionals Directory | VKC",
    description: "Discover verified Vishwakarma craftsmen. From sacred temple architecture and traditional carpentry to intricate metalwork and jewelry, find certified master artisans.",
    url: "https://vishwakarmaknowledgecentre.org/directory",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Artisans Directory", url: "/directory" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Master Artisans & Professionals Directory",
    description: "Discover verified Vishwakarma craftsmen and master artisans.",
    url: "/directory"
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
      <DirectoryPage />
    </>
  );
}
