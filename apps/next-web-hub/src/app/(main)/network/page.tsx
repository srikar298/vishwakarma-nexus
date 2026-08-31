import React, { Suspense } from "react";
import { Metadata } from 'next';
import { NetworkHub } from "@/features/network/pages/NetworkHub";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Professional Network & Community Hub",
  description: "Connect with verified Vishwakarma professionals, community leaders, and access educational resources and matchmaking directories.",
  keywords: ["Community Hub", "Professional Network", "Matrimony Directory", "Artisan network", "VKC Nexus"],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/network',
  },
  openGraph: {
    title: "Professional Network & Community Hub | VKC",
    description: "Connect with verified Vishwakarma professionals, community leaders, and access educational resources.",
    url: "https://vishwakarmaknowledgecentre.org/network",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Professional Network", url: "/network" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Professional Network & Community Hub",
    description: "Connect with verified Vishwakarma professionals, community leaders, and artisan enterprises.",
    url: "/network"
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
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="w-12 h-12 border-4 border-vermilion border-t-transparent rounded-full animate-spin" /></div>}>
        <NetworkHub />
      </Suspense>
    </>
  );
}
