import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient } from '../types/patient';

interface PatientContextType {
    patients: Patient[];
    addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'isActive' | 'comments'>) => void; // Removido 'comments' aqui, pois é opcional na criação
    updatePatientProfilePic: (id: string, profilePic: string) => void;
    softDeletePatient: (id: string) => void;
    updatePatientComments: (id: string, comments: string) => void; // NOVO: Função para atualizar comentários
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [patients, setPatients] = useState<Patient[]>(() => {
        try {
            const savedPatients = localStorage.getItem('medanalis_patients');
            if (savedPatients) {
                const parsed = JSON.parse(savedPatients);
                return parsed.map((p: Patient) => ({
                    ...p,
                    isActive: p.isActive === false ? false : true,
                    comments: p.comments || '' // Garante que 'comments' existe e é string
                }));
            }
        } catch (error) {
            console.error("Erro ao carregar pacientes do localStorage:", error);
        }
        return [];
    });

    useEffect(() => {
        try {
            localStorage.setItem('medanalis_patients', JSON.stringify(patients));
        } catch (error) {
            console.error("Erro ao salvar pacientes no localStorage:", error);
        }
    }, [patients]);

    const addPatient = (patient: Omit<Patient, 'id' | 'createdAt' | 'isActive' | 'comments'>) => {
        const newPatient: Patient = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            isActive: true,
            comments: '', // Inicializa comentários vazios
            ...patient,
        };
        setPatients((prevPatients) => [...prevPatients, newPatient]);
    };

    const updatePatientProfilePic = (id: string, profilePic: string) => {
        setPatients((prevPatients) =>
            prevPatients.map((p) => (p.id === id ? { ...p, profilePic } : p))
        );
    };

    const softDeletePatient = (id: string) => {
        setPatients((prevPatients) =>
            prevPatients.map((p) => (p.id === id ? { ...p, isActive: false } : p))
        );
    };

    // NOVO: Implementação da função para atualizar comentários
    const updatePatientComments = (id: string, comments: string) => {
        setPatients((prevPatients) =>
            prevPatients.map((p) => (p.id === id ? { ...p, comments } : p))
        );
    };

    return (
        <PatientContext.Provider value={{ patients, addPatient, updatePatientProfilePic, softDeletePatient, updatePatientComments }}>
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