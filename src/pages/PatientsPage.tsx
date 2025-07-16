import React from 'react';
import { PatientForm } from '../components/Patient/PatientForm';
import { PatientList } from '../components/Patient/PatientList';

export const PatientsPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Gestão de Pacientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div>
                    <PatientForm />
                </div>
                <div>
                    <PatientList />
                </div>
            </div>
        </div>
    );
};
