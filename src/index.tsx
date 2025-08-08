import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // Importar e executar a configuração de tradução
import './index.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* O Suspense foi removido porque as traduções agora são carregadas instantaneamente */}
    <App />
  </React.StrictMode>
);
