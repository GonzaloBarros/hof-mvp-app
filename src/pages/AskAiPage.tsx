import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import axios from 'axios';

// Define a estrutura de um objeto de mensagem
interface Message {
  text: string;
  sender: 'user' | 'ai';
}

// Dados de análise de exemplo. No futuro, isto virá da base de dados.
const mockAnalysisData = {
  wrinkles: { forehead: 0.85, eye_corner: 0.75 },
  spots: { uv_spots: 0.72, dark_spots: 0.65 },
  texture: { pores: 0.88, smoothness: 0.5 },
  redness: 0.4,
};

// --- NOVO: LISTA DE PALAVRAS-CHAVE PARA DESTACAR ---
// Adicionamos uma lista de palavras que queremos que tenham uma cor diferente.
const KEYWORDS = [
  'rugas', 'manchas', 'acne', 'flacidez', 'hidratação', 'poros',
  'vermelhidão', 'oleosidade', 'textura', 'firmeza', 'proteção solar'
];

export const AskAiPage: React.FC = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Olá! Sou o seu assistente de diagnóstico. Como posso ajudar a interpretar os resultados desta análise?', sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/ask-ai', {
        question: userMessage.text,
        analysisData: mockAnalysisData,
      });

      // A API que criámos devolve um campo chamado 'response'
      const aiResponse: Message = {
        text: response.data.response, 
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Erro ao comunicar com a IA:', error);
      const errorMessage: Message = {
        text: 'Desculpe, ocorreu um erro ao tentar comunicar com o assistente. Por favor, tente novamente mais tarde.',
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- NOVO: FUNÇÃO PARA RENDERIZAR O TEXTO COM DESTAQUE ---
  // Esta função verifica cada palavra da mensagem. Se for uma palavra-chave,
  // ela aplica um estilo diferente (cinzento escuro e negrito).
  const renderMessageContent = (text: string) => {
    // Criamos uma expressão regular que encontra qualquer uma das nossas palavras-chave
    const parts = text.split(new RegExp(`(${KEYWORDS.join('|')})`, 'gi'));
    
    return parts.map((part, index) =>
      KEYWORDS.includes(part.toLowerCase()) ? (
        // Se a parte do texto for uma palavra-chave, aplicamos a cor correta
        <span key={index} className="text-gray-700 font-semibold">
          {part}
        </span>
      ) : (
        // Caso contrário, mostramos o texto normalmente
        part
      )
    );
  };

  return (
    <div className="container mx-auto p-4 pt-6 bg-gray-50 min-h-screen flex flex-col h-screen">
      <div className="flex-shrink-0">
        <Link to={`/analysis-detail/${analysisId}`} className="flex items-center gap-2 text-primary mb-4 hover:underline font-semibold">
          <ArrowLeft size={20} />
          <span>Voltar para a Análise</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Assistente de Diagnóstico</h1>
        <p className="text-gray-500 mb-4">Análise ID: {analysisId}</p>
      </div>

      <div className="flex-grow bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
        <div className="flex-grow p-6 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">IA</div>
              )}
              <div className={`p-4 rounded-lg max-w-lg ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
                {/* --- MUDANÇA: USAMOS A NOVA FUNÇÃO AQUI --- */}
                {/* Em vez de mostrar o texto diretamente, passamos pela nossa função de renderização */}
                <p>{renderMessageContent(msg.text)}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">IA</div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 animate-pulse">Pensando...</p>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="border-t p-4 bg-white flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Digite sua pergunta aqui..."
              className="w-full pr-12 pl-4 py-3 border rounded-full shadow-sm focus:ring-2 focus:ring-primary-light focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark disabled:bg-gray-400"
              onClick={handleSendMessage}
              disabled={isLoading}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
