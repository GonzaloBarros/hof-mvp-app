import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define a interface para um relatório
interface Report {
    id: string;
    patientName: string;
    date: string; // Formato string para simplificar (ex: "DD/MM/YYYY HH:mm")
    // Se no futuro você tiver URLs reais para os PDFs, pode adicionar aqui
}

// Define a interface para o contexto
interface ReportContextType {
    reports: Report[];
    addReport: (report: Omit<Report, 'id'>) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reports, setReports] = useState<Report[]>(() => {
        // Tenta carregar os relatórios do localStorage ao iniciar
        const savedReports = localStorage.getItem('medanalis_reports');
        return savedReports ? JSON.parse(savedReports) : [];
    });

    // Salva os relatórios no localStorage sempre que eles mudam
    useEffect(() => {
        localStorage.setItem('medanalis_reports', JSON.stringify(reports));
    }, [reports]);

    const addReport = (report: Omit<Report, 'id'>) => {
        const newReport: Report = {
            ...report,
            id: Date.now().toString(), // ID único baseado no timestamp
        };
        setReports((prevReports) => [...prevReports, newReport]);
    };

    return (
        <ReportContext.Provider value={{ reports, addReport }}>
            {children}
        </ReportContext.Provider>
    );
};

export const useReports = () => {
    const context = useContext(ReportContext);
    if (context === undefined) {
        throw new Error('useReports must be used within a ReportProvider');
    }
    return context;
};