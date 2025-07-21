import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Patient } from '../types/patient';

interface PatientContextType {
    patients: Patient[];
    addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'isActive'>) => void;
    updatePatient: (id: string, updatedData: Partial<Patient>) => void;
    updatePatientProfilePic: (id: string, profilePic: string) => void;
    updatePatientComments: (id: string, comments: string) => void;
    softDeletePatient: (id: string) => void;
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

    const addPatient = (patient: Omit<Patient, 'id' | 'createdAt' | 'isActive'>) => {
        const newPatient: Patient = {
            ...patient,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            isActive: true, // Pacientes são ativos por defeito
            comments: '', // Inicializa comentários
        };
        setPatients(prev => [...prev, newPatient]);
    };

    const updatePatient = (id: string, updatedData: Partial<Patient>) => {
        setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    const updatePatientProfilePic = (id: string, profilePic: string) => {
        setPatients(prev => prev.map(p => p.id === id ? { ...p, profilePic } : p));
    };

    const updatePatientComments = (id: string, comments: string) => {
        setPatients(prev => prev.map(p => p.id === id ? { ...p, comments } : p));
    };

    const softDeletePatient = (id: string) => {
        setPatients(prev => prev.map(p => p.id === id ? { ...p, isActive: false } : p));
    };


    return (
        <PatientContext.Provider value={{ patients, addPatient, updatePatient, updatePatientProfilePic, updatePatientComments, softDeletePatient }}>
            {children}
        </PatientContext.Provider>
    );
};

export const usePatients = () => {
    const context = useContext(PatientContext);
    if (context === undefined) {
        throw new Error('usePatients deve ser usado dentro de um PatientProvider');
    }
    return context;
};
