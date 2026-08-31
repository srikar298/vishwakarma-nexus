import { Metadata } from 'next';
import { EmpowermentPage } from "@/features/empowerment/pages/EmpowermentPage";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

export const metadata: Metadata = {
  title: "Artisan Empowerment & Rights Advocacy",
  description: "Explore data and advocacy efforts regarding the Vishwakarma community's social, economic, and representation rights. Join our census and support traditional artisans.",
  keywords: ["Political Empowerment", "Advocacy", "Artisan Rights", "Community Census", "PM Vishwakarma Scheme", "Artisan Welfare"],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/empowerment',
  },
  openGraph: {
    title: "Artisan Empowerment & Rights Advocacy | VKC",
    description: "Explore data and advocacy efforts regarding the Vishwakarma community's rights and representation.",
    url: "https://vishwakarmaknowledgecentre.org/empowerment",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Empowerment & Advocacy", url: "/empowerment" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Artisan Empowerment & Rights Advocacy",
    description: "Advocacy and community empowerment initiatives by Vishwakarma Knowledge Centre.",
    url: "/empowerment"
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
      <EmpowermentPage />
    </>
  );
}
