import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Consent } from '../types/consent';

interface ConsentContextType {
    consents: Consent[];
    addConsent: (consent: Omit<Consent, 'id'>) => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const ConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [consents, setConsents] = useState<Consent[]>(() => {
        try {
            const savedConsents = localStorage.getItem('consents');
            return savedConsents ? JSON.parse(savedConsents) : [];
        } catch (error) {
            console.error("Erro ao carregar consentimentos do localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('consents', JSON.stringify(consents));
        } catch (error) {
            console.error("Erro ao salvar consentimentos no localStorage", error);
        }
    }, [consents]);

    const addConsent = (consent: Omit<Consent, 'id'>) => {
        const newConsent = { ...consent, id: uuidv4() };
        setConsents(prev => [...prev, newConsent]);
    };

    return (
        <ConsentContext.Provider value={{ consents, addConsent }}>
            {children}
        </ConsentContext.Provider>
    );
};

export const useConsents = () => {
    const context = useContext(ConsentContext);
    if (context === undefined) {
        throw new Error('useConsents deve ser usado dentro de um ConsentProvider');
    }
    return context;
};
