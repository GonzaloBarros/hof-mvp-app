import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { useAnalyses } from '../context/AnalysisContext';
import { useAuth } from '../context/AuthContext';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Analysis } from '../types/analysis';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generatePdf } from '../utils/reportGenerator';

// Componente para mostrar os detalhes de uma análise na comparação
const AnalysisDetailsCard = ({ analysis }: { analysis: Analysis | null }) => {
    if (!analysis) return <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">Selecione uma análise</div>;

    return (
        <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-bold text-lg mb-2 text-center">{new Date(analysis.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}</h4>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Rugas:</span> <span className="font-semibold">{analysis.skinProblems.wrinkles.severity}</span></div>
                <div className="flex justify-between"><span>Manchas:</span> <span className="font-semibold">{analysis.skinProblems.darkSpots.severity}</span></div>
                <div className="flex justify-between"><span>Poros:</span> <span className="font-semibold">{analysis.skinProblems.pores.severity}</span></div>
                <div className="flex justify-between"><span>Acne:</span> <span className="font-semibold">{analysis.skinProblems.acne.severity}</span></div>
            </div>
        </div>
    );
};


export const CompareAnalysesPage: React.FC = () => {
    const { id: patientId } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { patients } = usePatients();
    const { analyses } = useAnalyses();

    const patient = patients.find(p => p.id === patientId);
    const patientAnalyses = analyses.filter(a => a.patientId === patientId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const [beforeAnalysis, setBeforeAnalysis] = useState<Analysis | null>(null);
    const [afterAnalysis, setAfterAnalysis] = useState<Analysis | null>(null);

    useEffect(() => {
        // Define as análises padrão: a primeira e a última
        if (patientAnalyses.length >= 2) {
            setBeforeAnalysis(patientAnalyses[0]);
            setAfterAnalysis(patientAnalyses[patientAnalyses.length - 1]);
        }
    }, [patientAnalyses]);
    
    // Prepara os dados para o gráfico
    const chartData = [
        { name: 'Rugas', Antes: beforeAnalysis?.skinProblems.wrinkles.severity, Depois: afterAnalysis?.skinProblems.wrinkles.severity },
        { name: 'Manchas', Antes: beforeAnalysis?.skinProblems.darkSpots.severity, Depois: afterAnalysis?.skinProblems.darkSpots.severity },
        { name: 'Poros', Antes: beforeAnalysis?.skinProblems.pores.severity, Depois: afterAnalysis?.skinProblems.pores.severity },
        { name: 'Acne', Antes: beforeAnalysis?.skinProblems.acne.severity, Depois: afterAnalysis?.skinProblems.acne.severity },
    ];

    if (!patient) {
        return <div className="text-center p-8">Paciente não encontrado.</div>;
    }
    
    if (patientAnalyses.length < 2) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Comparação de Análises</h2>
                <p className="text-gray-600">Este paciente precisa de pelo menos duas análises para poder comparar a evolução.</p>
                <Link to={`/patient/${patientId}`} className="text-[#00C4B4] hover:underline mt-4 inline-block">
                    Voltar à ficha do paciente
                </Link>
            </div>
        );
    }
    
    // AQUI ESTÁ A CORREÇÃO: Mostra uma mensagem de "a carregar" enquanto as análises não estão prontas
    if (!beforeAnalysis || !afterAnalysis) {
        return <div className="p-8 text-center text-gray-500">A carregar dados da comparação...</div>;
    }

    return (
        <>
            {/* Versão Visível para o Utilizador (Dinâmica) */}
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="mb-6 flex justify-between items-center">
                        <Link to={`/patient/${patientId}`} className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                            &larr; Voltar à Ficha do Paciente
                        </Link>
                        <button
                            onClick={() => generatePdf('comparison-report-for-print', `relatorio-evolucao-${patient.name.replace(/\s/g, '-')}`, user?.name, '/Logo Medanalis.png')}
                            className="bg-[#00B5A5] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1A3C5E] transition-colors"
                        >
                            Gerar Relatório de Evolução
                        </button>
                    </div>
                    
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Comparador Evolutivo</h1>
                        <p className="text-center text-gray-500 mb-8">Compare a evolução de <span className="font-bold">{patient.name}</span> entre duas sessões.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label htmlFor="before-select" className="block text-sm font-medium text-gray-700 mb-1">Análise de "Antes"</label>
                                <select
                                    id="before-select"
                                    value={beforeAnalysis?.id || ''}
                                    onChange={(e) => setBeforeAnalysis(patientAnalyses.find(a => a.id === e.target.value) || null)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm rounded-md"
                                >
                                    {patientAnalyses.map(analysis => (
                                        <option key={analysis.id} value={analysis.id}>
                                            {new Date(analysis.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="after-select" className="block text-sm font-medium text-gray-700 mb-1">Análise de "Depois"</label>
                                <select
                                    id="after-select"
                                    value={afterAnalysis?.id || ''}
                                    onChange={(e) => setAfterAnalysis(patientAnalyses.find(a => a.id === e.target.value) || null)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm rounded-md"
                                >
                                    {patientAnalyses.map(analysis => (
                                        <option key={analysis.id} value={analysis.id}>
                                            {new Date(analysis.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="rounded-lg overflow-hidden border-4 border-gray-200 mb-8">
                            <ReactCompareSlider
                                itemOne={<ReactCompareSliderImage src={beforeAnalysis.image} alt="Imagem Antes" />}
                                itemTwo={<ReactCompareSliderImage src={afterAnalysis.image} alt="Imagem Depois" />}
                                style={{ width: '100%', height: '50vh' }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <AnalysisDetailsCard analysis={beforeAnalysis} />
                            <AnalysisDetailsCard analysis={afterAnalysis} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Gráfico de Evolução da Severidade</h2>
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer>
                                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 10]} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Antes" fill="#8884d8" name="Severidade Antes" />
                                        <Bar dataKey="Depois" fill="#00C4B4" name="Severidade Depois" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Versão Oculta para o PDF (Estática) */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm' }}>
                 <div id="comparison-report-for-print" className="bg-white p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Comparador Evolutivo</h1>
                    <p className="text-center text-gray-500 mb-8">Evolução de <span className="font-bold">{patient.name}</span></p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="relative">
                            <img src={beforeAnalysis.image} alt="Imagem Antes" className="w-full h-auto object-cover" />
                            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">ANTES</div>
                        </div>
                        <div className="relative">
                            <img src={afterAnalysis.image} alt="Imagem Depois" className="w-full h-auto object-cover" />
                            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">DEPOIS</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-12">
                        <AnalysisDetailsCard analysis={beforeAnalysis} />
                        <AnalysisDetailsCard analysis={afterAnalysis} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Gráfico de Evolução da Severidade</h2>
                        <div style={{ width: '100%', height: 350 }}>
                             <ResponsiveContainer>
                                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 10]} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Antes" fill="#8884d8" name="Severidade Antes" />
                                    <Bar dataKey="Depois" fill="#00C4B4" name="Severidade Depois" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
