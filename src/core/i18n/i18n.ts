// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./langs/en.json";
import fr from "./langs/fr.json";

// Get the selected lang in the localStorage or use "fr"
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
        escapeValue: true,
    },
    react: {
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor: ["br", "strong", "i", "b"],
    },
});

export default i18n;
