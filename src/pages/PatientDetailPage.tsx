import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { useAnalyses } from '../context/AnalysisContext';
import { useTreatmentPlans } from '../context/TreatmentPlanContext';
import { useConsents } from '../context/ConsentContext';
import { Patient } from '../types/patient';
import { Consent } from '../types/consent';

// Definir o tipo para a interface de reconhecimento de fala
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { patients, softDeletePatient, updatePatientComments, updatePatient } = usePatients();
  const { analyses } = useAnalyses();
  const { treatmentPlans, addTreatmentPlan } = useTreatmentPlans();
  const { consents } = useConsents();
  const navigate = useNavigate();

  const patient = patients.find(p => p.id === id && (p.isActive === undefined || p.isActive === true));
  const patientAnalyses = analyses.filter(a => a.patientId === id);
  const patientTreatmentPlans = treatmentPlans.filter(p => p.patientId === id);
  const patientConsents = consents.filter(c => c.patientId === id);

  const [comments, setComments] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Partial<Patient>>({});

  useEffect(() => {
    if (patient) {
      setComments(patient.comments || '');
    }
  }, [patient]);

  useEffect(() => {
    if (patient) {
      setEditedPatient({
        name: patient.name,
        age: patient.age,
        birthDate: patient.birthDate,
        phone: patient.phone,
        email: patient.email,
        mainComplaint: patient.mainComplaint,
        healthHistory: patient.healthHistory,
        profilePic: patient.profilePic,
      });
    }
  }, [patient, isEditing]);


  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.warn("Reconhecimento de fala não suportado neste navegador.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'pt-BR';

    recognitionRef.current.onstart = () => setIsRecording(true);
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setComments(prev => prev + (prev ? ' ' : '') + transcript);
    };
    recognitionRef.current.onend = () => setIsRecording(false);
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

  const handleSavePatientEdits = () => {
    if (patient && editedPatient.name && editedPatient.birthDate && editedPatient.phone && editedPatient.email && editedPatient.mainComplaint) {
      const updatedPatientData: Partial<Patient> = {
        ...editedPatient,
        age: editedPatient.birthDate ? (new Date().getFullYear() - new Date(editedPatient.birthDate).getFullYear()) : (editedPatient.age || 0),
        profilePic: editedPatient.profilePic
      };
      updatePatient(patient.id, updatedPatientData);
      setIsEditing(false);
      alert('Dados do paciente atualizados com sucesso!');
    } else {
      alert('Por favor, preencha todos os campos obrigatórios para salvar.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  

  const handleCreateNewPlan = () => {
    if (patient) {
      const planTitle = prompt("Qual o nome do novo plano de tratamento? (Ex: Rejuvenescimento Terço Superior)");
      if (planTitle) {
        addTreatmentPlan({
          patientId: patient.id,
          title: planTitle,
        });
      }
    }
  };

  const handleViewConsent = (consent: Consent) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
        <head>
          <title>Consentimento Informado - ${consent.patientName}</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="p-10 font-sans bg-gray-50">
          <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div class="text-center mb-8">
              <button onclick="window.close()" class="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">Voltar</button>
            </div>
            <h1 class="text-3xl font-bold mb-6 text-center">Termo de Consentimento Informado</h1>
            <div class="bg-gray-100 p-4 rounded-lg border mb-8 text-lg">
              <p><strong>Paciente:</strong> ${consent.patientName}</p>
              <p><strong>Procedimento:</strong> ${consent.procedureName}</p>
              <p><strong>Data:</strong> ${new Date(consent.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
            <div class="prose max-w-none text-justify">
              <p>${consent.consentText.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="mt-12 pt-8 border-t">
              <h2 class="font-semibold text-xl mb-4">Assinatura do Paciente:</h2>
              <img src="${consent.signatureDataUrl}" alt="Assinatura" class="border rounded-md p-2 bg-gray-50" />
            </div>
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  if (!patient) {
    return (
      <div className="text-center p-8 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Paciente não encontrado ou foi apagado</h2>
        <p className="text-gray-500 mb-6">O paciente que você está a tentar aceder não existe ou foi arquivado.</p>
        <Link to="/patients" className="bg-[#00C4B4] text-white font-semibold py-2 px-5 rounded-lg hover:bg-[#00B5A5] transition-colors">
          Voltar para a lista de pacientes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Botão de Voltar ao Dashboard/Consultas de Hoje */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
          Voltar ao Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={displayProfilePic}
          alt="Foto do perfil do paciente"
          className="w-32 h-32 rounded-full object-cover border-4 border-[#00C4B4] mb-4 sm:mb-0"
        />
        <div className="text-center sm:text-left flex-grow">
          <h1 className="text-3xl font-bold text-gray-800">{patient.name}</h1>
          <p className="text-gray-500 text-lg">Idade: {patient.age} anos</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link to={`/consent/${patient.id}`} className="bg-green-600 text-white text-center font-semibold py-2 px-4 rounded-lg hover:bg-green-700">Gerar Consentimento</Link>
        </div>
      </div>

      {/* Seção para Queixa Principal e Histórico de Saúde */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Queixa Principal</h3>
        {isEditing ? (
          <textarea value={editedPatient.mainComplaint || ''} onChange={(e) => setEditedPatient({ ...editedPatient, mainComplaint: e.target.value })} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm bg-gray-100"></textarea>
        ) : (
          <p className="text-gray-700">{patient.mainComplaint || 'N/A'}</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Histórico de Saúde / Observações</h3>
        {isEditing ? (
          <textarea value={editedPatient.healthHistory || ''} onChange={(e) => setEditedPatient({ ...editedPatient, healthHistory: e.target.value })} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm bg-gray-100"></textarea>
        ) : (
          <p className="text-gray-700">{patient.healthHistory || 'N/A'}</p>
        )}
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
            placeholder={isRecording ? "Gravando... Fale agora!" : "Adicione suas anotações aqui..."}
            disabled={isRecording}
          ></textarea>
          <button
            onClick={toggleRecording}
            className={`absolute right-3 top-3 p-2 rounded-full shadow-md transition-colors ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-[#00C4B4] hover:bg-[#00B5A5]'
            } text-white`}
            aria-label={isRecording ? "Parar gravação" : "Iniciar gravação por voz"}
          >
            {isRecording ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12"></rect></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
            )}
          </button>
        </div>
        <button
          onClick={handleSaveComments}
          className="mt-4 bg-[#00C4B4] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00B5A5] transition-colors"
        >
          Salvar Anotações
        </button>
      </div>

      {/* NOVA SECÇÃO: PLANOS DE TRATAMENTO */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Planos de Tratamento</h2>
          <button onClick={handleCreateNewPlan} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
            + Novo Plano
          </button>
        </div>
        {patientTreatmentPlans.length > 0 ? (
          <ul className="space-y-4">
            {patientTreatmentPlans.map(plan => (
              <li key={plan.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg text-gray-800">{plan.title}</h3>
                <p className="text-sm text-gray-500">Criado em: {new Date(plan.createdAt).toLocaleDateString('pt-PT')}</p>
                <p className="text-sm text-gray-500">{plan.sessions.length} sessões registadas</p>
                <button className="text-sm text-[#00C4B4] hover:underline mt-2">Ver Detalhes</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhum plano de tratamento iniciado para este paciente.</p>
        )}
      </div>

      {/* NOVA SECÇÃO: HISTÓRICO DE CONSENTIMENTOS */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Histórico de Consentimentos</h2>
        {patientConsents.length > 0 ? (
          <ul className="space-y-3">
            {patientConsents.map(consent => (
              <li key={consent.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">{consent.procedureName}</h3>
                  <p className="text-sm text-gray-500">Assinado em: {new Date(consent.createdAt).toLocaleDateString('pt-PT')}</p>
                </div>
                <button onClick={() => handleViewConsent(consent)} className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-lg hover:bg-gray-300">
                  Visualizar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhum consentimento encontrado para este paciente.</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Histórico de Análises</h2>
          {/* AQUI ESTÁ O NOVO BOTÃO */}
          {patientAnalyses.length >= 2 && (
            <Link to={`/compare/${patient.id}`} className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700">
              Comparar Análises
            </Link>
          )}
        </div>
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
