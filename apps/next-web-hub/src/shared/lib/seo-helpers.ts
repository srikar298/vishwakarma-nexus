export const SITE_URL = 'https://vishwakarmaknowledgecentre.org';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generates Schema.org BreadcrumbList JSON-LD structure
 */
export function generateBreadcrumbsSchema(items: BreadcrumbItem[]) {
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    ...items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

/**
 * Generates Schema.org WebPage JSON-LD structure
 */
export function generateWebPageSchema({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${fullUrl}#webpage`,
    url: fullUrl,
    name: title,
    description: description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
    },
    inLanguage: ['en', 'te', 'hi'],
  };
}
