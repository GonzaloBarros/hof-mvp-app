import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Esta linha está correta e procura por 'App.tsx'
import reportWebVitals from './reportWebVitals';

// Importa a configuração do i18n que criámos
import './i18n';

// Importa o CSS principal da aplicação (agora com os estilos da agenda)
import './index.css'; 

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* O Suspense mostra uma mensagem de fallback enquanto as traduções carregam */}
    <Suspense fallback="A carregar...">
      {/* Aqui é onde o componente App é usado */}
      <App />
    </Suspense>
  </React.StrictMode>
);

// Se quiseres começar a medir o desempenho da tua aplicação, passa uma função
// para registar os resultados (por exemplo: reportWebVitals(console.log))
// ou envia para um endpoint de análise. Sabe mais: https://bit.ly/CRA-vitals
reportWebVitals();
