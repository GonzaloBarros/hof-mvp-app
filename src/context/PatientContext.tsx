import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Patient } from '../types/patient';

// Define o tipo para o valor do contexto
export interface PatientContextType {
    patients: Patient[];
    getPatientById: (id: string) => Patient | undefined;
    addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'isActive'>) => void;
    updatePatientProfilePic: (patientId: string, imageUrl: string) => void;
    softDeletePatient: (patientId: string) => void;
    updatePatientComments: (patientId: string, comments: string) => void;
    updatePatient: (patientId: string, updatedData: Partial<Patient>) => void;
}

// Dados de exemplo para simulação, usados apenas na primeira vez que a aplicação corre
const initialPatients: Patient[] = [
    {
        id: '1',
        name: 'Roberto Saez',
        age: 51,
        email: 'roberto@example.com',
        phone: '11999998888',
        createdAt: '2025-07-16T10:00:00Z',
        isActive: true,
        profilePic: 'https://i.imgur.com/ObHj3a5.png',
        mainComplaint: 'Rugas na testa e ao redor dos olhos.',
        healthHistory: 'Nenhuma condição médica relevante. Não fumante.',
        comments: 'Paciente retornou para acompanhamento.',
        birthDate: '1974-05-20',
    },
];

export const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const usePatients = (): PatientContextType => {
    const context = useContext(PatientContext);
    if (!context) {
        throw new Error('usePatients deve ser usado dentro de um PatientProvider');
    }
    return context;
};

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // *** PASSO 1: Carregar os dados do localStorage ao iniciar ***
    // O estado agora é inicializado com os dados do localStorage.
    // Se não houver nada lá, ele usa os dados de exemplo.
    const [patients, setPatients] = useState<Patient[]>(() => {
        try {
            const localData = localStorage.getItem('medanalitic-patients');
            return localData ? JSON.parse(localData) : initialPatients;
        } catch (error) {
            console.error("Could not parse patients from localStorage", error);
            return initialPatients;
        }
    });

    // *** PASSO 2: Salvar os dados no localStorage sempre que forem alterados ***
    // Este `useEffect` corre sempre que a lista de `patients` muda.
    useEffect(() => {
        try {
            localStorage.setItem('medanalitic-patients', JSON.stringify(patients));
        } catch (error) {
            console.error("Could not save patients to localStorage", error);
        }
    }, [patients]);


    const getPatientById = (id: string): Patient | undefined => {
        return patients.find(p => p.id === id);
    };

    const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'isActive'>) => {
        const newPatient: Patient = {
            id: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            isActive: true,
            ...patientData,
        };
        setPatients(prevPatients => [newPatient, ...prevPatients]);
    };

    const updatePatientProfilePic = (patientId: string, imageUrl: string) => {
        setPatients(prevPatients =>
            prevPatients.map(p =>
                p.id === patientId ? { ...p, profilePic: imageUrl } : p
            )
        );
    };

    const softDeletePatient = (patientId: string) => {
        setPatients(prevPatients =>
            prevPatients.map(p =>
                p.id === patientId ? { ...p, isActive: false } : p
            )
        );
    };

    const updatePatientComments = (patientId: string, comments: string) => {
        setPatients(prevPatients =>
            prevPatients.map(p =>
                p.id === patientId ? { ...p, comments } : p
            )
        );
    };
    
    const updatePatient = (patientId: string, updatedData: Partial<Patient>) => {
        setPatients(prevPatients =>
            prevPatients.map(p =>
                p.id === patientId ? { ...p, ...updatedData } : p
            )
        );
    };

    return (
        <PatientContext.Provider value={{ 
            patients, 
            getPatientById, 
            addPatient, 
            updatePatientProfilePic,
            softDeletePatient,
            updatePatientComments,
            updatePatient
        }}>
            {children}
        </PatientContext.Provider>
    );
};
