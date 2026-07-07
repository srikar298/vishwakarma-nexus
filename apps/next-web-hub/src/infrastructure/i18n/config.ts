import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';

// Initialize i18next engine globally
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      te: { translation: te }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['htmlTag', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie']
    }
  });

if (typeof window !== 'undefined') {
  const rawOverrides = localStorage.getItem('vkc_overrides');
  if (rawOverrides) {
    try {
      const overrides = JSON.parse(rawOverrides);
      Object.keys(overrides).forEach(lng => {
        i18n.addResourceBundle(lng, 'translation', overrides[lng].translation, true, true);
      });
    } catch (e) {
      console.warn('Failed to parse translation overrides:', e);
    }
  }
}

export default i18n;
