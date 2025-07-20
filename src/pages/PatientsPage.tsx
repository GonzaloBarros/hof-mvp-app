import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';

export const PatientsPage: React.FC = () => {
    const { patients } = usePatients();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = patients
        .slice()
        .reverse()
        .filter(patient => 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Lista de Pacientes</h2>
                <div className="relative">
                    <input 
                        type="text"
                        placeholder="Procurar paciente por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-full text-lg focus:ring-[#00C4B4] focus:border-[#00C4B4]"
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <ul className="space-y-4">
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                            <Link to={`/patient/${patient.id}`} key={patient.id}>
                                <li className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center hover:bg-gray-100 hover:border-[#00C4B4] transition-colors cursor-pointer">
                                    <div className="flex items-center space-x-4">
                                        <img 
                                            src={patient.profilePic || `https://placehold.co/40x40/E8F5F4/1A3C5E?text=${patient.name.charAt(0)}`}
                                            alt="Foto do Paciente" 
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{patient.name}</p>
                                            <p className="text-sm text-gray-600">{patient.age} anos</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Adicionado em:</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(patient.createdAt).toLocaleDateString('pt-PT')}
                                        </p>
                                    </div>
                                </li>
                            </Link>
                        ))
                    ) : (
                         <div className="text-center py-8">
                            <p className="text-gray-500">Nenhum paciente encontrado.</p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};
