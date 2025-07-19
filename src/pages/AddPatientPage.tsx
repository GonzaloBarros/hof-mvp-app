import React from 'react';
import { PatientForm } from '../components/Patient/PatientForm';

export const AddPatientPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Centraliza o formulário na página */}
        <div className="md:col-start-1 md:col-span-2 lg:col-start-2 lg:col-span-1 mx-auto w-full">
            <PatientForm />
        </div>
      </div>
    </div>
  );
};