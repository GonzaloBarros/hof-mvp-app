import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { runAiQuery } from '../services/aiService';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

export const AskAiPage: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: prompt };
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);
    setPrompt('');

    // Adiciona uma mensagem de "a pensar..."
    const thinkingMessage: Message = { sender: 'ai', text: 'A pensar...' };
    setConversation(prev => [...prev, thinkingMessage]);

    // Chama o nosso serviço de IA
    const aiResponse = await runAiQuery(prompt);
    const aiMessage: Message = { sender: 'ai', text: aiResponse };
    
    // Substitui a mensagem de "a pensar..." pela resposta final
    setConversation(prev => [...prev.slice(0, -1), aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      {/* Área da Conversa */}
      <div className="flex-grow overflow-y-auto space-y-6">
        {conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-full">
                <div className="w-16 h-16 mb-4 bg-gradient-to-tr from-blue-400 to-emerald-400 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.45 4.1-4.1 1.45 4.1 1.45L12 14l1.45-4.1 4.1-1.45-4.1-1.45Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-800">
                    Olá, Doutor!
                </h1>
                <p className="text-xl text-gray-500 mt-2">
                    Tudo bem? 😊 Como Medanalis AI pode te ajudar hoje?
                </p>
            </div>
        ) : (
            conversation.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-lg px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-[#00C4B4] text-white' : 'bg-gray-200 text-gray-800'}`}>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Área de Input */}
      <div className="mt-auto pt-4">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua pergunta aqui..."
            className="w-full pl-4 pr-12 py-4 bg-white border border-gray-200 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#00C4B4] rounded-full flex items-center justify-center text-white hover:bg-[#00B5A5] transition-colors disabled:bg-gray-300"
            aria-label="Enviar Pergunta"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
