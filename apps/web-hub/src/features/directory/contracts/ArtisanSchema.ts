export interface PortfolioItem {
  id: string;
  title: { en: string; te: string; hi: string };
  image: string;
  description: { en: string; te: string; hi: string };
}

export interface Testimonial {
  id: string;
  clientName: string;
  rating: number;
  text: { en: string; te: string; hi: string };
}

export interface Artisan {
  id: string;
  name: string;
  nameRegional: string;
  craft: 'carpentry' | 'metalwork' | 'sculpture' | 'jewelry' | 'architecture';
  location: string;
  coordinates?: { lat: number; lng: number };
  phone: string;
  rating: number;
  featured?: boolean;
  image: string;
  experienceYears: number;
  portfolio?: PortfolioItem[];
  testimonials?: Testimonial[];
}


export type ArtisanCategory = Artisan['craft'] | 'all';

export const CRAFT_LABELS: Record<Artisan['craft'], { en: string; te: string; hi: string }> = {
  carpentry: { en: 'Carpentry', te: 'వడ్రంగం', hi: 'बढ़ई' },
  metalwork: { en: 'Iron & Steel', te: 'కమ్మరం', hi: 'लोहार' },
  sculpture: { en: 'Stone Sculpture', te: 'శిల్పం', hi: 'मूर्तिकार' },
  jewelry: { en: 'Goldsmith', te: 'కంచర', hi: 'सुनार' },
  architecture: { en: 'Architecture', te: 'స్థాపక', hi: 'वास्तुकला' }
};
