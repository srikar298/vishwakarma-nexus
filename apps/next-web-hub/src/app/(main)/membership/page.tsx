import { Metadata } from 'next';
import { MembershipPage } from "@/features/onboarding/pages/MembershipPage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Digital Artisan ID & Membership Registration",
  description: "Join the VKC global network and claim your Digital Artisan Identity card. Complete the online verification to generate your unique Artisan ID card.",
  keywords: ["Artisan Identity", "Digital ID", "VKC Membership", "Artisan Registry", "Join VKC"],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/membership',
  },
  openGraph: {
    title: "Digital Artisan ID & Membership Registration | VKC",
    description: "Join the VKC global network and claim your Digital Artisan Identity card. Complete the registration to generate your unique Artisan ID card in real-time.",
    url: "https://vishwakarmaknowledgecentre.org/membership",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Artisan Membership", url: "/membership" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Digital Artisan ID & Membership Registration",
    description: "Join the VKC global network and claim your Digital Artisan Identity card.",
    url: "/membership"
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
      <MembershipPage />
    </>
  );
}
