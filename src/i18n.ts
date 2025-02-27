import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import ru from "./locales/ru.json";
import ukr from "./locales/ukr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    supportedLngs: ["en", "ukr", "ru"],
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      ukr: { translation: ukr },
    },
    detection: {
      order: ["path", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
