import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Patient } from '../types/patient';

interface PatientContextType {
    patients: Patient[];
    addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'profilePic'>) => void;
    updatePatientProfilePic: (patientId: string, profilePic: string) => void; // Nova função
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [patients, setPatients] = useState<Patient[]>(() => {
        try {
            const savedPatients = localStorage.getItem('patients');
            return savedPatients ? JSON.parse(savedPatients) : [];
        } catch (error) {
            console.error("Erro ao carregar pacientes do localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('patients', JSON.stringify(patients));
        } catch (error) {
            console.error("Erro ao salvar pacientes no localStorage", error);
        }
    }, [patients]);

    const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'profilePic'>) => {
        const newPatient: Patient = {
            id: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            profilePic: null, // Pacientes começam sem foto
            ...patientData,
        };
        setPatients(prevPatients => [...prevPatients, newPatient]);
    };

    const updatePatientProfilePic = (patientId: string, profilePic: string) => {
        setPatients(prevPatients =>
            prevPatients.map(patient =>
                patient.id === patientId ? { ...patient, profilePic } : patient
            )
        );
    };

    return (
        <PatientContext.Provider value={{ patients, addPatient, updatePatientProfilePic }}>
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
