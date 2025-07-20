import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient } from '../types/patient'; // Importar o tipo Patient atualizado

interface PatientContextType {
    patients: Patient[];
    addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'isActive'>) => void;
    updatePatientProfilePic: (id: string, profilePic: string) => void;
    softDeletePatient: (id: string) => void; // Função para exclusão lógica
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [patients, setPatients] = useState<Patient[]>(() => {
        try {
            const savedPatients = localStorage.getItem('medanalis_patients');
            if (savedPatients) {
                const parsed = JSON.parse(savedPatients);
                // IMPORTANTE: Garante que 'isActive' é TRUE por padrão para pacientes existentes,
                // a menos que esteja explicitamente definido como FALSE.
                return parsed.map((p: Patient) => ({
                    ...p,
                    isActive: p.isActive === false ? false : true // Se for explicitamente false, mantém. Caso contrário, é true.
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

    const addPatient = (patient: Omit<Patient, 'id' | 'createdAt' | 'isActive'>) => {
        const newPatient: Patient = {
            id: Date.now().toString(), // ID único
            createdAt: new Date().toISOString(), // Data de criação
            isActive: true, // Sempre ativo ao criar
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

    return (
        <PatientContext.Provider value={{ patients, addPatient, updatePatientProfilePic, softDeletePatient }}>
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