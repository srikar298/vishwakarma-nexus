import { Suspense } from 'react';
import { Metadata } from 'next';
import { DonorsPage } from "@/features/community/pages/DonorsPage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Supporters Registry & Sponsor Leaderboard",
  description: "View the leaderboard of sponsors, honorary patrons, and community members supporting the digital transformation and preservation of traditional artisan legacy.",
  keywords: ["Sponsors", "Donor Registry", "Honorary Patrons", "Leaderboard", "Artisan Fund", "VKC Supporters"],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/donors',
  },
  openGraph: {
    title: "Supporters Registry & Sponsor Leaderboard | VKC",
    description: "View the leaderboard of sponsors, honorary patrons, and community members supporting traditional artisan legacy.",
    url: "https://vishwakarmaknowledgecentre.org/donors",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Donors & Patrons", url: "/donors" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Supporters Registry & Sponsor Leaderboard",
    description: "Leaderboard of sponsors, honorary patrons, and community supporters of VKC.",
    url: "/donors"
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
      <Suspense fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="text-stone-400 font-black text-xs uppercase tracking-widest animate-pulse">Loading Leaderboard...</div>
        </div>
      }>
        <DonorsPage />
      </Suspense>
    </>
  );
}
