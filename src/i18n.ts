import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traduções
import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es }
};

// Função para detectar idioma do navegador e mapear para idiomas suportados
const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  const langCode = browserLang.split('-')[0]; // Pegar apenas o código do idioma (ex: 'pt' de 'pt-BR')
  
  // Mapear para idiomas suportados
  const supportedLanguages = ['pt', 'en', 'es'];
  return supportedLanguages.includes(langCode) ? langCode : 'en'; // Default para inglês se não suportado
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: detectBrowserLanguage(), // Forçar detecção automática
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      // Priorizar detecção do navegador
      order: ['navigator', 'htmlTag'],
      caches: [], // Não cachear para sempre detectar o idioma do navegador
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
