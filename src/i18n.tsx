import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // Pour charger les fichiers de traduction
  .use(LanguageDetector) // Pour détecter la langue
  .use(initReactI18next) // Pour intégrer avec React
  .init({
    debug: false,
    fallbackLng: 'fr', // Langue par défaut
    supportedLngs: ['en','fr'], // Langues supportées
    // backend: {
    //   loadPath: '/locales/{{lng}}/translation.json', // Chemin vers les fichiers de traduction
    // },
    detection: {
      order: ['localStorage', 'navigator','cookie', 'querystring','htmlTag'], // Ordre de détection
      caches: ['localStorage'],
    },
    react: {
      useSuspense: true, // Active React suspense
    },
  });

export default i18n;
