import React, { useState, useMemo } from 'react';
import { PatientList } from '../components/Patient/PatientList';
import { usePatients } from '../context/PatientContext';

export const PatientsPage: React.FC = () => {
    const { patients } = usePatients();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = useMemo(() => {
        let activePatients = patients.filter(patient => patient.isActive);

        if (searchTerm) {
            activePatients = activePatients.filter(patient =>
                patient.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return activePatients.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [patients, searchTerm]);

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Gestão de Pacientes</h2>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Pesquisar paciente por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00C4B4] focus:border-[#00C4B4] text-gray-700"
                />
            </div>

            <PatientList patientsToDisplay={filteredPatients} />
        </div>
    );
};