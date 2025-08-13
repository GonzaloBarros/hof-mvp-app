import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// A importação do ícone foi removida para o nosso teste.

export const AnalysisDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const analysisResult = location.state?.result;

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md w-full p-4 flex items-center">
        <button onClick={handleGoBack} className="mr-4 text-gray-600">
          {/* SUBSTITUIÇÃO DO ÍCONE POR UM SVG DIRETO */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Detalhes da Análise</h1>
      </header>

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Resultado da Análise Facial</h2>
          {analysisResult ? (
            <pre className="bg-gray-200 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-600">
              Não foram encontrados dados da análise. Por favor, volte e selecione uma análise para ver os detalhes.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};
