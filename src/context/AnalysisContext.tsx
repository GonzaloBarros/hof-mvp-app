import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Analysis } from '../types/analysis';
// Não precisamos mais da resposta do serviço antigo aqui.

interface AnalysisContextType {
    analyses: Analysis[];
    getAnalysesForPatient: (patientId: string) => Analysis[];
    addAnalysis: (analysis: Analysis) => void;
    isLoading: boolean;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [analyses, setAnalyses] = useState<Analysis[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Simulação de carregamento de dados
    useEffect(() => {
        // No futuro, aqui seria o local para carregar as análises do Firebase
        const mockAnalyses: Analysis[] = []; // Começa vazio por agora
        setAnalyses(mockAnalyses);
        setIsLoading(false);
    }, []);

    const getAnalysesForPatient = (patientId: string) => {
        return analyses.filter(a => a.patientId === patientId);
    };

    const addAnalysis = (analysis: Analysis) => {
        setAnalyses(prev => [...prev, analysis]);
    };

    return (
        <AnalysisContext.Provider value={{ analyses, getAnalysesForPatient, addAnalysis, isLoading }}>
            {children}
        </AnalysisContext.Provider>
    );
};

export const useAnalyses = () => {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error('useAnalyses must be used within an AnalysisProvider');
    }
    return context;
};
