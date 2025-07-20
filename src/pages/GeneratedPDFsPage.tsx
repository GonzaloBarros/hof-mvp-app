import React from 'react';
import { useReports } from '../context/ReportContext';
import { useNavigate } from 'react-router-dom';

export const GeneratedPDFsPage: React.FC = () => {
    const { reports } = useReports();
    const navigate = useNavigate();

    const handleDownload = (reportId: string) => {
        alert(`Simulando download do relatório ID: ${reportId}`);
        // Em um app real, você teria a lógica para baixar o PDF aqui.
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Meus Relatórios em PDF</h2>

            {reports.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow-lg text-center text-gray-600">
                    <p className="mb-4">Você ainda não gerou nenhum relatório em PDF.</p>
                    <p>Vá para a análise facial e clique em "Gerar Relatório PDF" para começar!</p>
                    <button
                        onClick={() => navigate('/camera')}
                        className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out shadow-md"
                    >
                        Gerar Nova Análise
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <div key={report.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-700 mb-2">Relatório de {report.patientName}</h3>
                                <p className="text-gray-600 text-sm mb-4">Gerado em: {report.date}</p>
                            </div>
                            <button
                                onClick={() => handleDownload(report.id)}
                                className="mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 ease-in-out shadow-md w-full"
                            >
                                Baixar PDF
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};