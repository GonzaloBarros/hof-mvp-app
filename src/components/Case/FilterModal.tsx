import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (selectedTreatments: string[]) => void;
}

const treatmentTypes = [
  'Harmonização Orofacial',
  'Toxina Botulínica',
  'Preenchimento Labial',
  'Bichectomia',
  'Fios de Sustentação',
  'Rinomodelação',
];

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);

  if (!isOpen) {
    return null;
  }

  const handleCheckboxChange = (treatment: string) => {
    setSelectedTreatments(prev =>
      prev.includes(treatment)
        ? prev.filter(t => t !== treatment)
        : [...prev, treatment]
    );
  };

  const handleApply = () => {
    onApplyFilters(selectedTreatments);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">Filtrar Casos</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto pr-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Tipo de Procedimento</h3>
            <div className="space-y-2">
              {treatmentTypes.map((treatment) => (
                <label key={treatment} className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    className="h-5 w-5 rounded text-primary focus:ring-primary-light"
                    checked={selectedTreatments.includes(treatment)}
                    onChange={() => handleCheckboxChange(treatment)}
                  />
                  <span className="text-gray-600">{treatment}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Data de Conclusão</h3>
            <select className="w-full p-2 border rounded-lg bg-gray-50">
              <option>Qualquer data</option>
              <option>Últimos 30 dias</option>
              <option>Este ano</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 border-t pt-4 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Cancelar
          </button>
          <button onClick={handleApply} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};
