"use client";

import React, { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/infrastructure/i18n/config";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run on client after mount
    const detectLanguage = (): 'en' | 'hi' | 'te' => {
      // 1. Check localStorage
      try {
        const local = localStorage.getItem('i18nextLng');
        if (local && ['en', 'hi', 'te'].includes(local)) {
          return local as 'en' | 'hi' | 'te';
        }
      } catch (e) {
        // Storage disabled or inaccessible
      }

      // 2. Check cookies
      try {
        const cookies = document.cookie.split(';');
        const i18nCookie = cookies.find(c => c.trim().startsWith('i18nextLng='));
        if (i18nCookie) {
          const val = i18nCookie.split('=')[1]?.trim();
          if (val && ['en', 'hi', 'te'].includes(val)) {
            return val as 'en' | 'hi' | 'te';
          }
        }
      } catch (e) {
        // Cookies disabled or inaccessible
      }

      // 3. Check browser navigator language
      try {
        const navLang = navigator.language.split('-')[0];
        if (['en', 'hi', 'te'].includes(navLang)) {
          return navLang as 'en' | 'hi' | 'te';
        }
      } catch (e) {
        // Navigator inaccessible
      }

      return 'en';
    };

    const detectedLang = detectLanguage();
    if (detectedLang !== 'en') {
      i18n.changeLanguage(detectedLang);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
