import { MetadataRoute } from 'next';
import { mockDonors } from '@/features/community/constants/donorsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vishwakarmaknowledgecentre.org';

  // Static routes
  const staticRoutes = [
    '',
    '/directory',
    '/knowledge',
    '/membership',
    '/heritage',
    '/vision',
    '/leadership',
    '/founder',
    '/network',
    '/empowerment',
    '/donors',
    '/legends',
    '/events',
    '/events/ekta-yatra',
    '/gallery',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route === '/events/ekta-yatra' ? 0.9 : 0.8,
  }));

  // Dynamic routes (donors)
  const donorRoutes = mockDonors.map((donor) => ({
    url: `${baseUrl}/donors/${donor.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...donorRoutes];
}
