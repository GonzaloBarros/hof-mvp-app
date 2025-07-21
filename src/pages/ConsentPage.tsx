import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { usePatients } from '../context/PatientContext';
import { useConsents } from '../context/ConsentContext';

export const ConsentPage: React.FC = () => {
    const { patients } = usePatients();
    const { addConsent } = useConsents();
    const navigate = useNavigate();
    const sigCanvas = useRef<SignatureCanvas>(null);

    const [selectedPatientId, setSelectedPatientId] = useState<string>(patients.length > 0 ? patients[0].id : '');
    const [procedureName, setProcedureName] = useState('');

    const clearSignature = () => {
        sigCanvas.current?.clear();
    };

    const saveConsent = () => {
        if (!selectedPatientId || !procedureName.trim()) {
            alert('Por favor, selecione um paciente e descreva o procedimento.');
            return;
        }
        if (sigCanvas.current?.isEmpty()) {
            alert('A assinatura do paciente é obrigatória.');
            return;
        }

        const patient = patients.find(p => p.id === selectedPatientId);
        if (!patient) {
            alert('Paciente não encontrado.');
            return;
        }

        const consentText = `Eu, ${patient.name}, portador(a) do documento de identidade [Nº do Documento], autorizo o(a) Dr(a). a realizar o procedimento de ${procedureName}. Fui devidamente informado(a) sobre os objetivos, benefícios, riscos e alternativas do tratamento, e tive a oportunidade de esclarecer todas as minhas dúvidas. Estou ciente de que o resultado pode variar e que devo seguir todas as recomendações pós-procedimento.`;
        
        const signatureDataUrl = sigCanvas.current?.toDataURL('image/png') || '';

        addConsent({
            patientId: selectedPatientId,
            patientName: patient.name,
            procedureName,
            consentText,
            signatureDataUrl,
            createdAt: new Date().toISOString(),
        });

        alert('Consentimento informado guardado com sucesso!');
        navigate(`/patient/${selectedPatientId}`);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Termo de Consentimento Informado</h1>

                <div className="space-y-6">
                    {/* Seleção de Paciente */}
                    <div>
                        <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700">Paciente</label>
                        <select
                            id="patient-select"
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm rounded-md"
                        >
                            {patients.length > 0 ? (
                                patients.map(patient => (
                                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                                ))
                            ) : (
                                <option value="">Nenhum paciente cadastrado</option>
                            )}
                        </select>
                    </div>

                    {/* Nome do Procedimento */}
                    <div>
                        <label htmlFor="procedure-name" className="block text-sm font-medium text-gray-700">Nome do Procedimento</label>
                        <input
                            type="text"
                            id="procedure-name"
                            value={procedureName}
                            onChange={(e) => setProcedureName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm"
                            placeholder="Ex: Aplicação de Toxina Botulínica"
                        />
                    </div>

                    {/* Texto do Consentimento */}
                    <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                        <p className="text-sm text-gray-600">
                            Eu, <strong>{patients.find(p => p.id === selectedPatientId)?.name || '[Nome do Paciente]'}</strong>, portador(a) do documento de identidade [Nº do Documento], autorizo o(a) Dr(a). a realizar o procedimento de <strong>{procedureName || '[Nome do Procedimento]'}</strong>. Fui devidamente informado(a) sobre os objetivos, benefícios, riscos e alternativas do tratamento, e tive a oportunidade de esclarecer todas as minhas dúvidas. Estou ciente de que o resultado pode variar e que devo seguir todas as recomendações pós-procedimento.
                        </p>
                    </div>

                    {/* Campo de Assinatura */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assinatura do Paciente</label>
                        <div className="border border-gray-300 rounded-md">
                            <SignatureCanvas
                                ref={sigCanvas}
                                penColor='black'
                                canvasProps={{ className: 'w-full h-40' }}
                            />
                        </div>
                        <button onClick={clearSignature} className="text-sm text-gray-500 hover:text-red-500 mt-2">
                            Limpar Assinatura
                        </button>
                    </div>

                    {/* Botão de Salvar */}
                    <button
                        onClick={saveConsent}
                        className="w-full bg-[#00C4B4] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00B5A5] transition-colors"
                    >
                        Guardar Consentimento
                    </button>
                </div>
            </div>
        </div>
    );
};
