import { ImageResponse } from 'next/og';
import { mockDonors } from '@/features/community/constants/donorsData';

export const runtime = 'edge';

export const alt = 'VKC Community Sponsor';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const donor = mockDonors.find((d) => d.id === resolvedParams.id);

  if (!donor) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1c1917',
            color: '#fff',
            fontSize: 40,
            fontWeight: 'bold',
          }}
        >
          VKC Sponsor Profile
        </div>
      ),
      { ...size }
    );
  }

  const baseUrl = 'https://vishwakarmaknowledgecentre.org';
  const avatarUrl = donor.avatar.startsWith('http') ? donor.avatar : `${baseUrl}${donor.avatar}`;
  const logoUrl = `${baseUrl}/images/shared/emblem.png`;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#1c1917',
        }}
      >
        {/* Large photo covering the entire card */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt={donor.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '630px',
            objectFit: 'cover',
            objectPosition: 'center 20%', // Center crop slightly higher for portraits
          }}
        />

        {/* Small VKC Logo in the top-right edge */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(28, 25, 23, 0.75)', // semi-transparent background
            padding: '12px',
            borderRadius: '16px',
            border: '2px solid rgba(180, 83, 9, 0.4)', // amber-700 outline
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="VKC Logo"
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
