import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { useAnalyses } from '../context/AnalysisContext';

// Definir o tipo para a interface de reconhecimento de fala
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

export const PatientDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { patients, softDeletePatient, updatePatientComments } = usePatients();
    const { analyses } = useAnalyses();
    const navigate = useNavigate();

    const patient = patients.find(p => p.id === id && p.isActive);
    const patientAnalyses = analyses.filter(a => a.patientId === id);

    const [comments, setComments] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Efeito para carregar os comentários do paciente quando a página carrega
    useEffect(() => {
        if (patient && patient.comments) {
            setComments(patient.comments);
        }
    }, [patient]);

    // Lógica para iniciar e parar o reconhecimento de fala
    useEffect(() => {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            console.warn("Reconhecimento de fala não suportado neste navegador.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'pt-BR'; // Definir idioma para Português do Brasil

        recognitionRef.current.onstart = () => {
            setIsRecording(true);
            console.log("Gravação iniciada...");
        };

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log("Transcrito:", transcript);
            setComments(prevComments => prevComments + (prevComments ? ' ' : '') + transcript);
        };

        recognitionRef.current.onend = () => {
            setIsRecording(false);
            console.log("Gravação encerrada.");
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error("Erro no reconhecimento de fala:", event.error);
            setIsRecording(false);
            alert(`Erro na gravação: ${event.error}. Verifique as permissões do microfone.`);
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setComments('');
            recognitionRef.current.start();
        }
    };

    const displayProfilePic = patient?.profilePic || 
                            (patientAnalyses.length > 0 ? patientAnalyses[0].image : null) ||
                            `https://placehold.co/120x120/E8F5F4/1A3C5E?text=${patient?.name?.charAt(0) || 'P'}`;


    const handleSaveComments = () => {
        if (patient) {
            updatePatientComments(patient.id, comments);
            alert('Anotações salvas com sucesso!');
        }
    };

    const handleDeletePatient = () => {
        if (patient && window.confirm(`Tem certeza que deseja apagar o paciente ${patient.name}? Esta ação não pode ser desfeita.`)) {
            softDeletePatient(patient.id);
            alert(`Paciente ${patient.name} apagado com sucesso (arquivado)!`);
            navigate('/patients', { replace: true });
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
        // CORRIGIDO AQUI: className com classes Tailwind corretas e fechamento da string
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
                    <p className="text-gray-500 text-lg">Nascimento: {new Date(patient.birthDate).toLocaleDateString('pt-PT')}</p>
                    <p className="text-gray-500 text-lg">Telefone: {patient.phone}</p>
                    <p className="text-gray-500 text-lg">Email: {patient.email}</p>
                    <p className="text-gray-500 text-lg mt-2">Idade: {patient.age} anos</p>
                    <p className="text-gray-500 text-lg">Adicionado em: {new Date(patient.createdAt).toLocaleDateString('pt-PT')}</p>

                    {/* Botão de Apagar Paciente - OCULTADO por enquanto */}
                    {/* <button
                        onClick={handleDeletePatient}
                        className="mt-4 bg-red-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-600 transition-colors duration-300 ease-in-out shadow-md"
                    >
                        Apagar Paciente
                    </button> */}
                </div>
            </div>

            {/* Seção para Queixa Principal e Histórico de Saúde */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Queixa Principal</h3>
                <p className="text-gray-700">{patient.mainComplaint || 'N/A'}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Histórico de Saúde / Observações</h3>
                <p className="text-gray-700">{patient.healthHistory || 'N/A'}</p>
            </div>

            {/* Seção para Anotações do Dentista com Reconhecimento de Voz */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Anotações do Dentista</h3>
                <div className="relative">
                    <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={6}
                        className="mt-1 block w-full px-3 py-2 pr-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm"
                        placeholder={isRecording ? "Gravando... Fale agora!" : "Adicione suas anotações e comentários sobre o paciente aqui..."}
                        disabled={isRecording}
                    ></textarea>
                    {/* Botão de Microfone */}
                    <button
                        onClick={toggleRecording}
                        className={`absolute right-3 top-3 p-2 rounded-full shadow-md transition-colors ${
                            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-[#00C4B4] hover:bg-[#00B5A5]'
                        } text-white`}
                        aria-label={isRecording ? "Parar gravação" : "Iniciar gravação por voz"}
                    >
                        {isRecording ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="10" height="14" x="7" y="5" rx="1"></rect><path d="M12 19v4"></path><path d="M8 23h8"></path></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                        )}
                    </button>
                </div>
                {isRecording && <p className="text-sm text-gray-500 mt-2">Falando... O texto aparecerá acima.</p>}
                <button
                    onClick={handleSaveComments}
                    className="mt-4 bg-[#00C4B4] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00B5A5] transition-colors"
                >
                    Salvar Anotações
                </button>
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