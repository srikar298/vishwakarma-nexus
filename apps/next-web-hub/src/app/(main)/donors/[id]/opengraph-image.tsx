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
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#1c1917', // deep stone-900 background
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(120, 53, 4, 0.15) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(185, 28, 28, 0.1) 0%, transparent 50%)',
          padding: '60px',
          boxSizing: 'border-box',
          position: 'relative',
          border: '8px solid #78350f', // warm amber-900 border
        }}
      >
        {/* Left side: Avatar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '380px',
            height: '380px',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '4px solid #b45309', // amber-700
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl}
            alt={donor.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Right side: Branding & Details */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '60px',
            flex: 1,
            height: '380px',
            justifyContent: 'space-between',
          }}
        >
          {/* Top Row: Tagline & Logo */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 900,
                  color: '#f59e0b', // amber-500
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                }}
              >
                VKC HONORARY SPONSOR
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#a8a29e', // stone-400
                  marginTop: '4px',
                }}
              >
                PATRONAGE & SUPPORT
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="VKC Logo"
              style={{
                width: '75px',
                height: '75px',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Middle: Donor Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '20px',
            }}
          >
            <span
              style={{
                fontSize: '44px',
                fontWeight: 'bold',
                color: '#fafaf9', // stone-50
                lineHeight: 1.2,
              }}
            >
              {donor.name}
            </span>
            <span
              style={{
                fontSize: '20px',
                color: '#d6d3d1', // stone-300
                marginTop: '12px',
                lineHeight: 1.4,
              }}
            >
              {donor.role}
            </span>
          </div>

          {/* Bottom: Organization Footer */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '2px solid #292524', // stone-800
              paddingTop: '20px',
              marginTop: 'auto',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: '#a8a29e', // stone-400
              }}
            >
              vishwakarmaknowledgecentre.org
            </span>
            <span
              style={{
                fontSize: '13px',
                color: '#78716c', // stone-500
              }}
            >
              Preserving Heritage • Empowering Artisans
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
