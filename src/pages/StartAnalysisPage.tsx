import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';

export const StartAnalysisPage: React.FC = () => {
    const { patients } = usePatients();
    const navigate = useNavigate();

    // Função para navegar para a página de captura do paciente selecionado
    const handlePatientSelect = (patientId: string) => {
        navigate(`/patient/${patientId}/capture`);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Iniciar Nova Análise</h1>
                <p className="text-gray-600 mb-6">Por favor, selecione para qual paciente deseja iniciar uma nova análise facial.</p>
                
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <ul className="divide-y divide-gray-200">
                        {patients.filter(p => p.isActive !== false).map(patient => (
                            <li 
                                key={patient.id} 
                                onClick={() => handlePatientSelect(patient.id)}
                                className="p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <img 
                                    src={patient.profilePic || `https://placehold.co/40x40/E2E8F0/4A5568?text=${patient.name.charAt(0)}`} 
                                    alt={`Foto de ${patient.name}`}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-900">{patient.name}</p>
                                    <p className="text-sm text-gray-500">{patient.mainComplaint || 'Sem queixa principal registada'}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
