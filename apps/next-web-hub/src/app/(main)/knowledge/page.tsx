import { Metadata } from 'next';
import { KnowledgePage } from "@/features/heritage/pages/KnowledgePage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Knowledge Base & Shastra Archives",
  description: "Browse the digital library of Vishwakarma architectural manuals, ancient scriptures, and research papers on structural sciences, metallurgy, and traditional crafting techniques.",
  keywords: ["Knowledge Base", "Shastra Vault", "Metallurgy", "Vedic Science", "Artisan Manuals", "Ancient Manuscripts"],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/knowledge',
  },
  openGraph: {
    title: "Knowledge Base & Shastra Archives | VKC",
    description: "Browse the digital library of Vishwakarma architectural manuals, ancient scriptures, and research papers on structural sciences, metallurgy, and traditional crafting techniques.",
    url: "https://vishwakarmaknowledgecentre.org/knowledge",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Knowledge & Shastras", url: "/knowledge" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Knowledge Base & Shastra Archives",
    description: "Digital library of Vishwakarma architectural manuals, ancient scriptures, and research papers.",
    url: "/knowledge"
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
      <KnowledgePage />
    </>
  );
}
