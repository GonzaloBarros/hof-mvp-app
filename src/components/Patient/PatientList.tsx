import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Patient } from '../../types/patient';
import { PatientAvatar } from './PatientAvatar';

interface PatientListProps {
    patients: Patient[];
}

export const PatientList: React.FC<PatientListProps> = ({ patients }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (patients.length === 0) {
        return <p className="text-center text-gray-500 mt-8">Nenhum paciente ativo encontrado.</p>;
    }

    return (
        <div className="space-y-3">
            {patients.map(patient => {
                const isExpanded = expandedId === patient.id;
                return (
                    <div key={patient.id} className="bg-white p-4 rounded-lg shadow-sm transition-shadow">
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(patient.id)}>
                            <div className="flex items-center space-x-4">
                                <PatientAvatar patient={patient} />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{patient.name}</h2>
                                    <p className="text-sm text-gray-500">{patient.age} anos</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Adicionado em:</p>
                                <p className="text-sm text-gray-600">{new Date(patient.createdAt).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                        {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-700 space-y-2">
                                {/* AQUI ESTÁ A CORREÇÃO: Verificamos se a data existe antes de mostrá-la */}
                                <p><strong>Nascimento:</strong> {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-PT') : 'N/A'}</p>
                                <p><strong>Telefone:</strong> {patient.phone}</p>
                                <p><strong>Queixa Principal:</strong> {patient.mainComplaint || 'N/A'}</p>
                                <p><strong>Histórico de Saúde:</strong> {patient.healthHistory || 'N/A'}</p>
                                <Link to={`/patient/${patient.id}`} className="text-blue-600 hover:underline font-semibold mt-2 inline-block">
                                    Ver Ficha Completa
                                </Link>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
