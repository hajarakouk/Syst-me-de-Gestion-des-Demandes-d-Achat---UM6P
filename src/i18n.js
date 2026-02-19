import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      home: "Accueil",
      contact: "Contact",
   
      about: "À propos",
      services: "Services",

      pages: "Pages",
      freeConsultation: "CONSULTATION GRATUITE",
      myum6p: "My um6p",
      agenda: "Agenda",
      french: "Français",
      english: "Anglais"
    }
  },
  en: {
    translation: {
      home: "Home",
      contact: "Contact",
      plan: "Map",
      about: "About us",
      services: "Services",
      portfolio: "Portfolio",
      pages: "Pages",
      freeConsultation: "FREE CONSULTATION",
      myum6p: "My um6p",
      agenda: "Agenda",
      french: "French",
      english: "English"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "fr",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 