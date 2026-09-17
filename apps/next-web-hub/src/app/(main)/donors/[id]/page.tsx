import { Metadata } from 'next';
import { mockDonors } from '@/features/community/constants/donorsData';
import { notFound, permanentRedirect } from 'next/navigation';
import { DonorProfilePage } from '@/features/community/pages/DonorProfilePage';
import { generateBreadcrumbsSchema, generateWebPageSchema } from "@/shared/lib/seo-helpers";

// Legacy or alternate slug mappings to prevent 404s and preserve link equity
const LEGACY_DONOR_SLUGS: Record<string, string> = {
  'brahmasri-kammari-palli-mallikharjuna-kiran-kumar': 'brahmasri-kammaripalli-mallikharjuna-kiran-kumar',
};

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await params as dynamic parameters are promises in Next.js 15+
  const resolvedParams = await params;
  const canonicalId = LEGACY_DONOR_SLUGS[resolvedParams.id] || resolvedParams.id;
  const donor = mockDonors.find((d) => d.id === canonicalId);
  
  if (!donor) {
    return {
      title: 'Donor Profile Not Found',
      description: 'The requested community donor profile could not be found.',
    };
  }

  const title = `${donor.name} - Community Sponsor`;
  const description = donor.tier === 'honorary'
    ? `${donor.name} is providing ${donor.formattedAmount} to the Vishwakarma Knowledge Centre. Read their dedication to preserving the traditional artisan legacy.`
    : `${donor.name} contributed ${donor.formattedAmount} to the Vishwakarma Knowledge Centre. Read their dedication to preserving the traditional artisan legacy.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://vishwakarmaknowledgecentre.org/donors/${donor.id}`,
    },
    openGraph: {
      title: `${donor.name} | VKC Community Sponsor`,
      description,
      images: [{ url: donor.avatar, width: 256, height: 256, alt: donor.name }],
      type: 'profile',
      url: `https://vishwakarmaknowledgecentre.org/donors/${donor.id}`,
    },
    twitter: {
      card: 'summary',
      title: `${donor.name} | VKC Community Sponsor`,
      description,
      images: [donor.avatar],
    },
  };
}

export async function generateStaticParams() {
  return mockDonors.map((donor) => ({
    id: donor.id,
  }));
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  if (LEGACY_DONOR_SLUGS[resolvedParams.id]) {
    permanentRedirect(`/donors/${LEGACY_DONOR_SLUGS[resolvedParams.id]}`);
  }
  const donor = mockDonors.find((d) => d.id === resolvedParams.id);
  
  if (!donor) {
    notFound();
  }

  const breadcrumbsSchema = generateBreadcrumbsSchema([
    { name: "Donors & Patrons", url: "/donors" },
    { name: donor.name, url: `/donors/${donor.id}` }
  ]);

  const webPageSchema = generateWebPageSchema({
    title: `${donor.name} - Community Sponsor Profile`,
    description: `Community profile and patron contribution details for ${donor.name}.`,
    url: `/donors/${donor.id}`
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
      <DonorProfilePage donor={donor} />
    </>
  );
}
