import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Patient } from '../types/patient';

interface PatientContextType {
    patients: Patient[];
    addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [patients, setPatients] = useState<Patient[]>(() => {
        // Carrega os pacientes do localStorage ao iniciar
        try {
            const savedPatients = localStorage.getItem('patients');
            return savedPatients ? JSON.parse(savedPatients) : [];
        } catch (error) {
            console.error("Erro ao carregar pacientes do localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        // Salva os pacientes no localStorage sempre que a lista muda
        try {
            localStorage.setItem('patients', JSON.stringify(patients));
        } catch (error) {
            console.error("Erro ao salvar pacientes no localStorage", error);
        }
    }, [patients]);

    const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
        const newPatient: Patient = {
            id: new Date().toISOString(), // ID simples para o MVP
            createdAt: new Date().toISOString(),
            ...patientData,
        };
        setPatients(prevPatients => [...prevPatients, newPatient]);
    };

    return (
        <PatientContext.Provider value={{ patients, addPatient }}>
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
