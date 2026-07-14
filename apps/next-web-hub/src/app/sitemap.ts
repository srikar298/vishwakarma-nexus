import { MetadataRoute } from 'next';
import { mockDonors } from '@/features/community/constants/donorsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vishwakarmaknowledgecentre.org';

  // Static routes
  const staticRoutes = [
    '',
    '/vision',
    '/founder',
    '/heritage',
    '/knowledge',
    '/legends',
    '/directory',
    '/network',
    '/membership',
    '/donors',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
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
