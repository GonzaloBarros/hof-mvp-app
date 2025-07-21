import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TreatmentPlan } from '../types/treatmentPlan';
import { Session } from '../types/session';

interface TreatmentPlanContextType {
    treatmentPlans: TreatmentPlan[];
    addTreatmentPlan: (plan: Omit<TreatmentPlan, 'id' | 'createdAt' | 'sessions'>) => void;
    addSessionToPlan: (planId: string, session: Omit<Session, 'id'>) => void;
}

const TreatmentPlanContext = createContext<TreatmentPlanContextType | undefined>(undefined);

export const TreatmentPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>(() => {
        try {
            const savedPlans = localStorage.getItem('treatmentPlans');
            return savedPlans ? JSON.parse(savedPlans) : [];
        } catch (error) {
            console.error("Erro ao carregar planos de tratamento do localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('treatmentPlans', JSON.stringify(treatmentPlans));
        } catch (error) {
            console.error("Erro ao salvar planos de tratamento no localStorage", error);
        }
    }, [treatmentPlans]);

    const addTreatmentPlan = (plan: Omit<TreatmentPlan, 'id' | 'createdAt' | 'sessions'>) => {
        const newPlan: TreatmentPlan = {
            ...plan,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            sessions: [],
        };
        setTreatmentPlans(prev => [...prev, newPlan]);
    };

    const addSessionToPlan = (planId: string, sessionData: Omit<Session, 'id'>) => {
        const newSession: Session = {
            ...sessionData,
            id: uuidv4(),
        };
        setTreatmentPlans(prev =>
            prev.map(plan =>
                plan.id === planId
                    ? { ...plan, sessions: [...plan.sessions, newSession] }
                    : plan
            )
        );
    };

    return (
        <TreatmentPlanContext.Provider value={{ treatmentPlans, addTreatmentPlan, addSessionToPlan }}>
            {children}
        </TreatmentPlanContext.Provider>
    );
};

export const useTreatmentPlans = () => {
    const context = useContext(TreatmentPlanContext);
    if (context === undefined) {
        throw new Error('useTreatmentPlans deve ser usado dentro de um TreatmentPlanProvider');
    }
    return context;
};
