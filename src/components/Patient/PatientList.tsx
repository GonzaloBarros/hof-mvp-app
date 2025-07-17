import React from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../../context/PatientContext';

export const PatientList: React.FC = () => {
    const { patients } = usePatients();

    if (patients.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <p className="text-gray-500">Nenhum paciente adicionado ainda.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Pacientes</h3>
            <ul className="space-y-4">
                {patients.map((patient) => (
                    <Link to={`/patient/${patient.id}`} key={patient.id}>
                        <li className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center hover:bg-gray-100 hover:border-[#00C4B4] transition-colors cursor-pointer">
                            <div>
                                <p className="font-semibold text-gray-900">{patient.name}</p>
                                <p className="text-sm text-gray-600">{patient.age} anos</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Adicionado em:</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(patient.createdAt).toLocaleDateString('pt-PT')}
                                </p>
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};
