import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import { Patient } from '../../types/patient';

interface PatientListProps {
    patientsToDisplay: Patient[];
}

export const PatientList: React.FC<PatientListProps> = ({ patientsToDisplay }) => {
    const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);
    const navigate = useNavigate(); // Hook para navegação programática

    const toggleExpand = (patientId: string) => {
        setExpandedPatientId(prevId => (prevId === patientId ? null : patientId));
    };

    // NOVO: Função para lidar com o clique no cartão, navegando para a página de detalhes
    const handlePatientCardClick = (patientId: string) => {
        navigate(`/patient/${patientId}`);
    };

    if (patientsToDisplay.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <p className="text-gray-500">Nenhum paciente encontrado com os filtros aplicados.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Pacientes</h3>

            <ul className="space-y-4">
                {patientsToDisplay.map((patient) => {
                    const isExpanded = expandedPatientId === patient.id;
                    return (
                        // Removido o <Link> externo e adicionado um onClick ao <li>
                        // O estilo 'cursor-pointer' já está lá, mas o onClick agora navega
                        <li
                            key={patient.id}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col"
                            onClick={() => handlePatientCardClick(patient.id)} // NOVO: Clique no cartão navega
                        >
                            <div className="flex justify-between items-center mb-2">
                                {/* Foto do paciente */}
                                <img
                                    src={patient.profilePic || `https://placehold.co/40x40/E8F5F4/1A3C5E?text=${patient.name.charAt(0)}`}
                                    alt="Foto do Paciente"
                                    className="w-10 h-10 rounded-full object-cover mr-4"
                                />

                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-900">{patient.name}</p>
                                    <p className="text-sm text-gray-600">{patient.age} anos</p>
                                    <p className="text-xs text-gray-500">{patient.email}</p> 
                                </div>
                                <div className="text-right ml-4">
                                    <p className="text-xs text-gray-400">Adicionado em:</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(patient.createdAt).toLocaleDateString('pt-PT')}
                                    </p>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-700 space-y-2">
                                    <p><strong>Nascimento:</strong> {new Date(patient.birthDate).toLocaleDateString('pt-PT')}</p>
                                    <p><strong>Telefone:</strong> {patient.phone}</p>
                                    <p><strong>Queixa Principal:</strong> {patient.mainComplaint}</p>
                                    <p><strong>Histórico de Saúde:</strong> {patient.healthHistory || 'N/A'}</p>
                                    {/* Removido o link "Ver Perfil Completo" duplicado, pois o cartão inteiro agora navega */}
                                </div>
                            )}

                            {/* Botão "Ler mais / Ler menos" */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // MUITO IMPORTANTE: Impede que o clique no botão ative o clique do <li>
                                    toggleExpand(patient.id);
                                }}
                                className="mt-3 text-center text-sm font-semibold text-[#00C4B4] hover:underline"
                            >
                                {isExpanded ? 'Ler menos' : 'Ler mais'}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};