// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./langs/en.json";
import fr from "./langs/fr.json";

// Récupère la langue sélectionnée depuis le localStorage ou utilise "fr" par défaut
const savedLanguage = localStorage.getItem("lang") || "fr";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
        fr: {
            translation: fr,
        },
    },
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false, // React gère la sécurisation
    },
});

export default i18n;
