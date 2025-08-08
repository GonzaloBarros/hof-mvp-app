import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importa o nosso ficheiro de traduções diretamente
import translationPTBR from './translation.json';

// Configura os recursos de tradução
const resources = {
  'pt-BR': {
    translation: translationPTBR,
  },
};

i18n
  .use(LanguageDetector) // Deteta o idioma do utilizador
  .use(initReactI18next) // Passa a instância para o react-i18next
  .init({
    resources, // Usa os recursos que importámos diretamente
    fallbackLng: 'pt-BR', // Idioma padrão
    interpolation: {
      escapeValue: false, // O React já protege contra XSS
    },
  });

export default i18n;
