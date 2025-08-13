import React, { useState } from 'react';

// O tipo de dados para enviar para o servidor
interface ChatPayload {
  question: string;
  analysisData: any; // Mudar para o tipo correto dos seus dados de análise
}

// Esta função agora faz a chamada para o seu servidor (ask-ai.ts)
async function getGeminiResponseFromServer(payload: ChatPayload) {
  try {
    const response = await fetch('/api/ask-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Se o servidor retornar um erro, nós mostramos isso
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ocorreu um erro ao comunicar com o servidor.');
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    // Se a conexão falhar por qualquer motivo (internet, servidor fora do ar, etc.)
    console.error("Erro ao chamar o servidor da API:", error);
    return "Desculpe, ocorreu um erro ao tentar comunicar com o assistente. Por favor, tente novamente mais tarde.";
  }
}

// O componente que exibe a interface do chat
export const GeminiChat = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Exemplo de dados de análise. Você deve substituir isso pelos dados reais da sua aplicação.
  const analysisData = {
    patientName: 'João Silva',
    skinType: 'Mista',
    concerns: ['Acne', 'Manchas de sol'],
    // ... outros dados da análise
  };

  const handleSendMessage = async () => {
    if (!prompt) return;

    setIsLoading(true);
    // Chamamos a nova função que se comunica com o seu servidor
    const apiResponse = await getGeminiResponseFromServer({
      question: prompt,
      analysisData: analysisData,
    });
    setResponse(apiResponse);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4 rounded-lg shadow-lg">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {/* Mensagens de Exemplo */}
        <div className="flex justify-start">
          <div className="bg-blue-200 text-gray-800 p-3 rounded-xl max-w-sm">
            Olá! Sou o seu assistente de diagnóstico. Como posso ajudar a interpretar os resultados desta análise?
          </div>
        </div>
        {response && (
          <div className="flex justify-end">
            <div className="bg-gray-300 text-gray-800 p-3 rounded-xl max-w-sm">
              {response}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Digite sua pergunta aqui..."
          className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="bg-blue-600 text-white p-3 rounded-r-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
};
