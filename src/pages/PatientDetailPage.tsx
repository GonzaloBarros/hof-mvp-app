import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { useAnalyses } from '../context/AnalysisContext';

export const PatientDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { patients } = usePatients();
    const { analyses } = useAnalyses();

    const patient = patients.find(p => p.id === id);
    const patientAnalyses = analyses.filter(a => a.patientId === id).reverse(); // .reverse() para mostrar as mais recentes primeiro

    // Lógica melhorada para a foto de perfil:
    // Usa a foto de perfil guardada, ou, se não existir, usa a foto da análise mais recente.
    const displayProfilePic = patient?.profilePic || (patientAnalyses.length > 0 ? patientAnalyses[0].image : null);


    if (!patient) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-red-600">Paciente não encontrado</h2>
                <Link to="/patients" className="text-[#00C4B4] hover:underline mt-4 inline-block">
                    Voltar para a lista de pacientes
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Cabeçalho com os dados do paciente */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex items-center space-x-6">
                <img
                    src={displayProfilePic || `https://placehold.co/80x80/E8F5F4/1A3C5E?text=${patient.name.charAt(0)}`}
                    alt="Foto do Paciente"
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#00C4B4]"
                />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{patient.name}</h1>
                    <p className="text-gray-500">{patient.age} anos</p>
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
