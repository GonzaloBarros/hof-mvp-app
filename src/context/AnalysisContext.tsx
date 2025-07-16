import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Analysis } from '../types/analysis';
import { SkinAnalysisResponse } from '../services/skinAnalyzer';

interface AnalysisContextType {
    analyses: Analysis[];
    addAnalysis: (analysisData: SkinAnalysisResponse, patientId: string, image: string) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [analyses, setAnalyses] = useState<Analysis[]>(() => {
        try {
            const savedAnalyses = localStorage.getItem('analyses');
            return savedAnalyses ? JSON.parse(savedAnalyses) : [];
        } catch (error) {
            console.error("Erro ao carregar análises do localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('analyses', JSON.stringify(analyses));
        } catch (error) {
            console.error("Erro ao salvar análises no localStorage", error);
        }
    }, [analyses]);

    const addAnalysis = (analysisData: SkinAnalysisResponse, patientId: string, image: string) => {
        const newAnalysis: Analysis = {
            id: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            patientId,
            image,
            ...analysisData,
        };
        setAnalyses(prevAnalyses => [...prevAnalyses, newAnalysis]);
    };

    return (
        <AnalysisContext.Provider value={{ analyses, addAnalysis }}>
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
