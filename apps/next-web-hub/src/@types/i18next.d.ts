import type en from '@/infrastructure/i18n/locales/en.json';

/**
 * Augments i18next with typed translations derived from en.json.
 * This restores full TypeScript autocompletion and typo-detection
 * for all t() calls across the Next.js app.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof en;
    };
  }
}
