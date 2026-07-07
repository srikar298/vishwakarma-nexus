import axios from 'axios';
import { fallbackPhotos } from '@/shared/constants/mock-data';

const PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`
];

const CACHE_KEY = 'vkc-photos-cache-v4';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

/**
 * Extracts photo URLs from a public Google Photos shared album with caching.
 */
export async function fetchGooglePhotosAlbum(albumId: string) {
  // 1. Try to load from cache first for instant delivery
  const cached = localStorage.getItem(CACHE_KEY);
  let staleData = null;

  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      const isFresh = Date.now() - timestamp < CACHE_TTL;
      
      if (isFresh && data.length > 0) {
        console.log('Google Photos: Serving fresh photos from cache.');
        return data;
      }
      staleData = data; // Keep for fallback if fetch fails
    } catch {
      console.warn('Google Photos: Cache corruption detected.');
    }
  }

  // 2. Perform background/active fetch
  const targetUrl = albumId.startsWith('http') 
    ? albumId 
    : albumId.length > 20 
      ? `https://photos.google.com/share/${albumId}` 
      : `https://photos.app.goo.gl/${albumId}`;

  console.log('Google Photos: Fetching updates from', targetUrl);

  for (const getProxyUrl of PROXIES) {
    try {
      const proxyUrl = getProxyUrl(targetUrl);
      const response = await axios.get(proxyUrl, { timeout: 10000 });
      const html = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);

      if (!html || html.length < 500) continue;

      const regex = /\["(https:\/\/[a-zA-Z0-9.]+\.(?:googleusercontent|usercontent\.google)\.com\/pw\/[a-zA-Z0-9\-_]*)"/g;
      const links = new Set<string>();
      let match;

      while ((match = regex.exec(html)) !== null) {
        links.add(match[1]);
      }

      if (links.size > 0) {
        const fetchedPhotos = Array.from(links).map(url => ({
          original: `${url}=w1600-h1600`,
          thumbnail: `${url}=w600`,
          id: url.split('/').pop() || Math.random().toString(36).substring(7)
        }));

        // Update Cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: fetchedPhotos,
          timestamp: Date.now()
        }));

        console.log(`Google Photos: Cache updated with ${links.size} photos.`);
        return fetchedPhotos;
      }
    } catch {
      console.warn(`Google Photos: Proxy attempt failed.`);
    }
  }

  // 3. Final Fallback Strategy
  if (staleData) {
    console.log('Google Photos: Using stale cache as network fallback.');
    return staleData;
  }

  console.log('Google Photos: Using hardcoded fallback stable photos.');
  return fallbackPhotos;
}
