import { Metadata } from 'next';
import { LeadershipRoster } from "@/features/home/components/LeadershipRoster";
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";
import { LEADERSHIP_MEMBERS } from "@/shared/constants/leadershipData";

export const metadata: Metadata = {
  title: "Leadership & Advisory Council",
  description: "Official executive leadership, advisory council, state committee, and youth wing convenors of Vishwakarma Knowledge Centre (VKC). Meet our leaders empowering traditional artisans.",
  keywords: [
    "VKC Leadership",
    "Leadership & Advisory Council",
    "Governing Council",
    "Vishwakarma Knowledge Centre Office Bearers",
    "National Secretary",
    "Telangana State President",
    "Youth Wing Convenor",
    "Kasarlawar Vidyasagar",
    "Solleti Prabhakarachary",
    "Kondoju Praveen Kumar",
    "Muniganti Trinath Achary"
  ],
  alternates: {
    canonical: 'https://vishwakarmaknowledgecentre.org/leadership',
  },
  openGraph: {
    title: "Leadership & Advisory Council | VKC",
    description: "Official executive leadership, advisory council, state committee, and youth wing convenors of Vishwakarma Knowledge Centre (VKC).",
    url: "https://vishwakarmaknowledgecentre.org/leadership",
    siteName: "Vishwakarma Knowledge Centre",
  },
};

export default function Page() {
  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Leadership & Advisory Council", url: "/leadership" }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: "Leadership & Advisory Council",
    description: "Executive leadership, advisory council, and office-bearers of Vishwakarma Knowledge Centre.",
    url: "/leadership"
  });

  // Schema.org Person elements for each leader
  const leadershipPersonsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "VKC Leadership & Advisory Council",
    "itemListElement": LEADERSHIP_MEMBERS.map((member) => ({
      "@type": "ListItem",
      "position": member.serial,
      "item": {
        "@type": "Person",
        "name": member.name.en,
        "jobTitle": member.role.en,
        "worksFor": {
          "@type": "Organization",
          "@id": "https://vishwakarmaknowledgecentre.org/#organization",
          "name": "Vishwakarma Knowledge Centre"
        }
      }
    }))
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(leadershipPersonsSchema) }}
      />
      <LeadershipRoster showAll={true} showHeader={true} />
    </>
  );
}
