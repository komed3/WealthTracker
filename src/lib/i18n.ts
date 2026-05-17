import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import en from '@/src/locales/en';
import de from '@/src/locales/de';

export const resources = { en, de } as const;

i18n
  .use( Backend )
  .use( LanguageDetector )
  .use( initReactI18next )
  .init( {
    resources,
    fallbackLng: 'en',
    lng: 'en',
    enableSelector: true,
    interpolation: {
      escapeValue: false
    }
  } );

export default i18n;
