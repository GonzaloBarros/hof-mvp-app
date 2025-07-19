import React from 'react';
import { PatientList } from '../components/Patient/PatientList';

export const PatientsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Gestão de Pacientes
      </h2>
      <div className="w-full">
        <PatientList />
      </div>
    </div>
  );
};