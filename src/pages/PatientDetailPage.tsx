import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import { usePatients } from '../context/PatientContext';
import { useAnalyses } from '../context/AnalysisContext';

export const PatientDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { patients, softDeletePatient } = usePatients(); // Usar softDeletePatient
    const { analyses } = useAnalyses();
    const navigate = useNavigate(); // Hook para navegação

    const patient = patients.find(p => p.id === id && p.isActive); // Apenas pacientes ativos
    const patientAnalyses = analyses.filter(a => a.patientId === id);

    // Lógica para obter a foto de perfil, se não definida, usar a da primeira análise
    const displayProfilePic = patient?.profilePic || 
                            (patientAnalyses.length > 0 ? patientAnalyses[0].image : null) ||
                            `https://placehold.co/120x120/E8F5F4/1A3C5E?text=${patient?.name?.charAt(0) || 'P'}`;


    const handleDeletePatient = () => {
        if (patient && window.confirm(`Tem certeza que deseja apagar o paciente ${patient.name}? Esta ação não pode ser desfeita.`)) {
            softDeletePatient(patient.id);
            alert(`Paciente ${patient.name} apagado com sucesso (arquivado)!`);
            navigate('/patients'); // Redireciona para a lista de pacientes
        }
    };

    if (!patient) {
        return (
            <div className="text-center p-8 bg-gray-50 min-h-screen flex items-center justify-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Paciente não encontrado ou foi apagado</h2>
                <Link to="/patients" className="text-[#00C4B4] hover:underline mt-4 inline-block">
                    Voltar para a lista de pacientes
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Cabeçalho com os dados do paciente */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <img
                    src={displayProfilePic}
                    alt="Foto do perfil do paciente"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#00C4B4] mb-4 sm:mb-0"
                />
                <div className="text-center sm:text-left flex-grow">
                    <h1 className="text-3xl font-bold text-gray-800">{patient.name}</h1>
                    <p className="text-gray-500">{patient.age} anos</p>
                    {/* Botão de Apagar Paciente */}
                    <button
                        onClick={handleDeletePatient}
                        className="mt-4 bg-red-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-600 transition-colors duration-300 ease-in-out shadow-md"
                    >
                        Apagar Paciente
                    </button>
                </div>
            </div>

            {/* Histórico de Análises */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Histórico de Análises</h2>
                {patientAnalyses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {patientAnalyses.map(analysis => (
                            <Link to={`/analysis/${analysis.id}`} key={analysis.id}>
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer h-full flex flex-col">
                                    <img src={analysis.image} alt={`Análise de ${new Date(analysis.createdAt).toLocaleDateString()}`} className="w-full h-48 object-cover group-hover:opacity-75 transition-opacity" />
                                    <div className="p-4 flex flex-col flex-grow">
                                        <p className="font-semibold text-gray-800">Análise</p>
                                        <p className="text-sm text-gray-500 mb-3">
                                            {new Date(analysis.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </p>
                                        <div className="border-t border-gray-200 pt-3 mt-auto text-xs space-y-1">
                                            <div className="flex justify-between"><span>Rugas:</span> <span className="font-bold">{analysis.skinProblems.wrinkles.severity}</span></div>
                                            <div className="flex justify-between"><span>Manchas:</span> <span className="font-bold">{analysis.skinProblems.darkSpots.severity}</span></div>
                                            <div className="flex justify-between"><span>Poros:</span> <span className="font-bold">{analysis.skinProblems.pores.severity}</span></div>
                                            <div className="flex justify-between"><span>Acne:</span> <span className="font-bold">{analysis.skinProblems.acne.severity}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <p className="text-gray-500">Nenhuma análise encontrada para este paciente.</p>
                    </div>
                )}
            </div>
        </div>
    );
};