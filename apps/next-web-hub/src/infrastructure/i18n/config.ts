import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';

const isClient = typeof window !== 'undefined';

// Configure i18n instance
const i18nInstance = i18n.createInstance();

if (isClient) {
  // Use require for browser language detector to prevent loading it on server
  const LanguageDetector = require('i18next-browser-languagedetector').default;
  i18nInstance.use(LanguageDetector);
}

i18nInstance
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      te: { translation: te }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // Prevents promise suspension during server pre-rendering
    },
    detection: isClient ? {
      order: ['htmlTag', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie']
    } : undefined
  });

if (isClient) {
  const rawOverrides = localStorage.getItem('vkc_overrides');
  if (rawOverrides) {
    try {
      const overrides = JSON.parse(rawOverrides);
      Object.keys(overrides).forEach(lng => {
        i18nInstance.addResourceBundle(lng, 'translation', overrides[lng].translation, true, true);
      });
    } catch (e) {
      console.warn('Failed to parse translation overrides:', e);
    }
  }
}

export default i18nInstance;
