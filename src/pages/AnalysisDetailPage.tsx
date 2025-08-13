import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, User, Calendar } from 'lucide-react';

// Dados de exemplo para uma análise
const mockAnalysis = {
  id: 1,
  patientName: 'Ana Silva',
  date: '13 de Ago de 2025',
  // ... aqui entrariam os dados da PerfectCorp
};

export const AnalysisDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Função para navegar para a página da IA, passando o ID da análise atual
  const handleAskAiClick = () => {
    navigate(`/ask-ai/${id}`);
  };

  return (
    <div className="container mx-auto p-4 pt-6 bg-gray-50 min-h-screen">
      <Link to="/cases" className="flex items-center gap-2 text-primary mb-6 hover:underline font-semibold">
        <ArrowLeft size={20} />
        <span>Voltar</span>
      </Link>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Relatório da Análise</h1>
                <div className="flex items-center gap-4 text-gray-500 mt-2">
                    <span className="flex items-center gap-2"><User size={16} /> {mockAnalysis.patientName}</span>
                    <span className="flex items-center gap-2"><Calendar size={16} /> {mockAnalysis.date}</span>
                </div>
            </div>
            {/* ESTE É O NOVO BOTÃO DA IA */}
            <button 
                onClick={handleAskAiClick}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-gray rounded-lg shadow-md hover:bg-primary-dark transition-colors"
            >
                <MessageCircle size={20} />
                <span>Insights da IA</span>
            </button>
        </div>
        
        <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Resultados da Análise</h2>
            <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Os dados da análise da PerfectCorp serão exibidos aqui.</p>
            </div>
        </div>
      </div>
    </div>
  );
};
