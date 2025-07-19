import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Patient } from '../types/patient';

interface PatientContextType {
  patients: Patient[];
  addPatient: (patientData: { name: string; age: number }) => void;
  updatePatientProfilePic: (patientId: string, profilePic: string) => void;
  updatePatient: (patientId: string, updatedData: { name: string; age: number }) => void; // Nova função
  deletePatient: (patientId: string) => void; // Nova função
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const savedPatients = localStorage.getItem('patients');
      return savedPatients ? JSON.parse(savedPatients) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('patients', JSON.stringify(patients));
    } catch (error) {
      console.error("Erro ao guardar pacientes", error);
    }
  }, [patients]);

  const addPatient = (patientData: { name: string; age: number }) => {
    const newPatient: Patient = {
      id: uuidv4(),
      ...patientData,
      createdAt: new Date().toISOString(),
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatientProfilePic = (patientId: string, profilePic: string) => {
    setPatients(prev =>
      prev.map(p => (p.id === patientId ? { ...p, profilePic } : p))
    );
  };

  // Nova função para atualizar nome e idade
  const updatePatient = (patientId: string, updatedData: { name: string; age: number }) => {
    setPatients(prev =>
      prev.map(p => (p.id === patientId ? { ...p, ...updatedData } : p))
    );
  };

  // Nova função para apagar um paciente
  const deletePatient = (patientId: string) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
  };


  return (
    <PatientContext.Provider value={{ patients, addPatient, updatePatientProfilePic, updatePatient, deletePatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};