import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  canonical?: string;
  schema?: object; // Add support for JSON-LD schema
}

export const SEO = ({ 
  title, 
  description, 
  image = '/og-image.jpg', 
  type = 'website',
  canonical,
  schema
}: SEOProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const siteUrl = 'https://vishwakarmaknowledgecentre.org';
  
  useEffect(() => {
    const baseTitle = t('app.title', 'Vishwakarma Knowledge Centre');
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    const metaDesc = description || t('app.description', 'Dedicated to the recognition, skill upgradation, and holistic support of traditional artisans.');
    const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
    const currentUrl = canonical || `${siteUrl}${location.pathname}`;

    // 1. Standard Meta Tags
    document.title = fullTitle;
    updateMeta('name', 'description', metaDesc);

    // 2. Open Graph / Facebook
    updateMeta('property', 'og:title', fullTitle);
    updateMeta('property', 'og:description', metaDesc);
    updateMeta('property', 'og:image', fullImageUrl);
    updateMeta('property', 'og:url', currentUrl);
    updateMeta('property', 'og:type', type);
    updateMeta('property', 'og:site_name', baseTitle);

    // 3. Twitter
    updateMeta('name', 'twitter:title', fullTitle);
    updateMeta('name', 'twitter:description', metaDesc);
    updateMeta('name', 'twitter:image', fullImageUrl);
    updateMeta('name', 'twitter:card', 'summary_large_image');

    // 4. Canonical
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', currentUrl);

    // 5. JSON-LD Schema
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) existingScript.remove();

    if (schema) {
      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    }

  }, [title, description, image, type, canonical, location.pathname, t, schema]);

  return null;
};

/**
 * Helper to update or create a meta tag
 */
function updateMeta(attr: 'name' | 'property', key: string, content: string) {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}
