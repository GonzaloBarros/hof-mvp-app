import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AskAiPage: React.FC = () => {
    const { user } = useAuth();
    const [prompt, setPrompt] = useState('');

    const handleSend = () => {
        if (!prompt.trim()) return;
        // No futuro, aqui enviaremos o prompt para a API do Gemini
        alert(`Pergunta enviada para a IA (simulação): "${prompt}"`);
        setPrompt('');
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
            <div className="flex-grow flex flex-col items-center justify-center text-center">
                <div 
                    className="w-16 h-16 mb-4 bg-gradient-to-tr from-blue-400 to-emerald-400 rounded-full flex items-center justify-center"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.45 4.1-4.1 1.45 4.1 1.45L12 14l1.45-4.1 4.1-1.45-4.1-1.45Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-800">
                    Olá, {user?.name || 'Dr.'}
                </h1>
                <p className="text-xl text-gray-500 mt-2">
                    O que precisa perguntar ou aprender hoje?
                </p>
            </div>

            <div className="mt-auto">
                <div className="relative">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Digite sua pergunta aqui..."
                        className="w-full pl-4 pr-12 py-4 bg-white border border-gray-200 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"
                    />
                    <button 
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#00C4B4] rounded-full flex items-center justify-center text-white hover:bg-[#00B5A5] transition-colors"
                        aria-label="Enviar Pergunta"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
