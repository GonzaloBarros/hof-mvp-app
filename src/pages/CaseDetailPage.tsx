import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, ClipboardList } from 'lucide-react';
// 1. IMPORTAR O NOSSO NOVO COMPONENTE DE SLIDER
import { ImageSlider } from '../components/Case/ImageSlider';

// 2. ATUALIZAR OS DADOS DE EXEMPLO PARA TER IMAGENS SEPARADAS DE 'ANTES' E 'DEPOIS'
const mockCases = [
  {
    id: 1,
    patientName: 'Ana Silva',
    treatment: 'Harmonização Orofacial',
    dateRange: 'Jan 2025 - Jul 2025',
    beforeImageUrl: 'https://placehold.co/800x600/d1d5db/374151?text=FOTO+ANTES',
    afterImageUrl: 'https://placehold.co/800x600/00C4B4/FFFFFF?text=FOTO+DEPOIS',
    description: 'Realizado preenchimento malar e labial para restaurar o volume facial e definir o contorno. A paciente relatou alta satisfação com a naturalidade dos resultados.'
  },
  {
    id: 2,
    patientName: 'Bruno Costa',
    treatment: 'Toxina Botulínica',
    dateRange: 'Fev 2025 - Ago 2025',
    beforeImageUrl: 'https://placehold.co/800x600/d1d5db/374151?text=FOTO+ANTES',
    afterImageUrl: 'https://placehold.co/800x600/00C4B4/FFFFFF?text=FOTO+DEPOIS',
    description: 'Aplicação de toxina botulínica para suavizar linhas de expressão na região da testa e glabela. Resultados visíveis após 7 dias.'
  },
  // Adicione mais casos aqui se desejar
];

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const caseData = mockCases.find(c => c.id === Number(id));

  if (!caseData) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-red-500">Caso não encontrado</h2>
        <Link to="/cases" className="text-primary hover:underline mt-4 inline-block">
          Voltar para a lista de casos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-6 bg-gray-50 min-h-screen">
      <Link to="/cases" className="flex items-center gap-2 text-primary mb-6 hover:underline font-semibold">
        <ArrowLeft size={20} />
        <span>Voltar para todos os casos</span>
      </Link>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* 3. USAR O NOVO COMPONENTE ImageSlider AQUI */}
        <ImageSlider beforeImage={caseData.beforeImageUrl} afterImage={caseData.afterImageUrl} />

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-800">{caseData.treatment}</h1>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500 mt-2 mb-4">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{caseData.patientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{caseData.dateRange}</span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <ClipboardList />
              Anotações do Profissional
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {caseData.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
