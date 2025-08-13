import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { FilterModal } from '../components/Case/FilterModal';

const mockCases = [
  {
    id: 1,
    patientName: 'Ana Silva',
    treatment: 'Harmonização Orofacial',
    dateRange: 'Jan 2025 - Jul 2025',
    imageUrl: 'https://placehold.co/600x400/00C4B4/FFFFFF?text=Antes+%7C+Depois',
  },
  {
    id: 2,
    patientName: 'Bruno Costa',
    treatment: 'Toxina Botulínica',
    dateRange: 'Fev 2025 - Ago 2025',
    imageUrl: 'https://placehold.co/600x400/E8F5F4/333333?text=Antes+%7C+Depois',
  },
  {
    id: 3,
    patientName: 'Carla Dias',
    treatment: 'Preenchimento Labial',
    dateRange: 'Mar 2025 - Set 2025',
    imageUrl: 'https://placehold.co/600x400/00C4B4/FFFFFF?text=Antes+%7C+Depois',
  },
  {
    id: 4,
    patientName: 'Diogo Martins',
    treatment: 'Bichectomia',
    dateRange: 'Abr 2025 - Out 2025',
    imageUrl: 'https://placehold.co/600x400/E8F5F4/333333?text=Antes+%7C+Depois',
  },
   {
    id: 5,
    patientName: 'Elisa Ferreira',
    treatment: 'Fios de Sustentação',
    dateRange: 'Mai 2025 - Nov 2025',
    imageUrl: 'https://placehold.co/600x400/00C4B4/FFFFFF?text=Antes+%7C+Depois',
  },
  {
    id: 6,
    patientName: 'Fábio Nunes',
    treatment: 'Rinomodelação',
    dateRange: 'Jun 2025 - Dez 2025',
    imageUrl: 'https://placehold.co/600x400/E8F5F4/333333?text=Antes+%7C+Depois',
  },
];

export const CasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // 1. Criar um estado para guardar os filtros ATIVOS
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleCaseClick = (caseId: number) => {
    navigate(`/case/${caseId}`);
  };

  // 2. Atualizar a lógica de filtragem para usar AMBOS, busca e filtros
  const filteredCases = mockCases.filter(caseItem => {
    const searchMatch = caseItem.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Se não há filtros ativos, só a busca importa.
    if (activeFilters.length === 0) {
      return searchMatch;
    }
    
    // Se há filtros, o caso precisa de corresponder à busca E a um dos tratamentos selecionados.
    const filterMatch = activeFilters.includes(caseItem.treatment);
    
    return searchMatch && filterMatch;
  });

  return (
    <>
      <div className="container mx-auto p-4 pt-6 bg-gray-50 min-h-screen">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Meus Casos</h1>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome do paciente..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-light focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsFilterModalOpen(true)} 
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm text-gray-700 hover:bg-gray-100"
          >
            <SlidersHorizontal size={20} />
            <span>Filtrar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCases.map((caseItem) => (
            <div 
              key={caseItem.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => handleCaseClick(caseItem.id)}
            >
              <img 
                src={caseItem.imageUrl} 
                alt={`Caso de ${caseItem.patientName}`}
                className="w-full h-40 object-cover" 
              />
              <div className="p-4">
                <p className="font-bold text-lg text-gray-800 truncate">{caseItem.patientName}</p>
                <p className="text-sm text-gray-600">{caseItem.treatment}</p>
                <p className="text-xs text-gray-400 mt-2">{caseItem.dateRange}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-dashed">
            <p className="text-gray-500 font-semibold">Nenhum caso encontrado</p>
            <p className="text-sm text-gray-400 mt-2">Tente ajustar os termos da sua busca ou filtros.</p>
          </div>
        )}
      </div>

      {/* 3. Passar a função para o modal saber como aplicar os filtros */}
      <FilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={(selectedTreatments) => setActiveFilters(selectedTreatments)}
      />
    </>
  );
};
