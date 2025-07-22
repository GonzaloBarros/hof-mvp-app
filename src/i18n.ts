import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
    // Carrega traduções de um servidor/pasta pública
    .use(HttpApi)
    // Deteta o idioma do utilizador
    .use(LanguageDetector)
    // Passa a instância do i18n para o react-i18next
    .use(initReactI18next)
    // Inicia a configuração
    .init({
        // Idioma padrão se a deteção falhar
        fallbackLng: 'pt',
        // Ativar modo de depuração no console do navegador
        debug: true,
        // Configurações para o detetor de idioma
        detection: {
            // Ordem de deteção: primeiro o URL, depois o navegador, etc.
            order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
            // Chaves para procurar nos caches
            caches: ['cookie'],
        },
        // Configurações para o backend que carrega os ficheiros
        backend: {
            // Caminho para os nossos ficheiros de tradução
            loadPath: '/locales/{{lng}}/translation.json',
        },
        // Configuração para o React
        react: {
            // Usa o Suspense para esperar que as traduções carreguem
            useSuspense: true,
        },
    });

export default i18n;
