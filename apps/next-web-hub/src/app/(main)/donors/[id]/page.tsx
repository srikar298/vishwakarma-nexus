import { Metadata } from 'next';
import { mockDonors } from '@/features/community/constants/donorsData';
import { notFound } from 'next/navigation';
import { DonorProfilePage } from '@/features/community/pages/DonorProfilePage';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await params as dynamic parameters are promises in Next.js 15+
  const resolvedParams = await params;
  const donor = mockDonors.find((d) => d.id === resolvedParams.id);
  
  if (!donor) {
    return {
      title: 'Donor Profile Not Found | VKC',
      description: 'The requested community donor profile could not be found.',
    };
  }

  const title = `${donor.name} | VKC Community Sponsor`;
  const description = donor.tier === 'honorary'
    ? `${donor.name} is providing ${donor.formattedAmount} to the Vishwakarma Knowledge Centre. Read their dedication to preserving the traditional artisan legacy.`
    : `${donor.name} contributed ${donor.formattedAmount} to the Vishwakarma Knowledge Centre. Read their dedication to preserving the traditional artisan legacy.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: donor.avatar, width: 256, height: 256, alt: donor.name }],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
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
  const donor = mockDonors.find((d) => d.id === resolvedParams.id);
  
  if (!donor) {
    notFound();
  }

  return <DonorProfilePage donor={donor} />;
}
