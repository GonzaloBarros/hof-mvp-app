import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Layout Components
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';

// Context Providers
import { ImageProvider } from './context/ImageContext';
import { PatientProvider } from './context/PatientContext';
import { AnalysisProvider } from './context/AnalysisContext'; // <-- CORRIGIDO AQUI! O nome do ficheiro era AnalysisContext.tsx
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { ConsentProvider } from './context/ConsentContext';
import { TreatmentPlanProvider } from './context/TreatmentPlanContext';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { CameraCapture } from './components/Camera/CameraCapture';
import { SkinAnalysis } from './components/Analysis/SkinAnalysis';
import { PatientsPage } from './pages/PatientsPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage';
import { AskAiPage } from './pages/AskAiPage';
import { AgendaPage } from './pages/AgendaPage';
import { ProfilePage } from './pages/ProfilePage';
import { ConsentPage } from './pages/ConsentPage';
import { CompareAnalysesPage } from './pages/CompareAnalysesPage'; 

// REMOVIDO: A importação de AnalysisCapturePage relacionada à PerfectCorp
// import AnalysisCapturePage from './pages/AnalysisCapturePage'; // Esta linha foi removida ou ajustada
import { GeneratedPDFsPage } from './pages/GeneratedPDFsPage'; // Mantida se ainda for usada em outro lugar


// Componente que protege as rotas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
};

// Componente para gerir o layout principal
const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    let title = "Dashboard";

    if (location.pathname.startsWith('/patient/')) {
        title = "Detalhes do Paciente";
    } else if (location.pathname.startsWith('/analysis/')) {
        title = "Detalhes da Análise";
    } else if (location.pathname.startsWith('/consent/')) {
        title = "Consentimento Informado";
    } else if (location.pathname.startsWith('/compare/')) {
        title = "Comparar Análises"; // Título para a nova página
    } else if (location.pathname.startsWith('/iniciar-analise')) { // Removido o título para a página de análise da PerfectCorp
        title = "Captura Facial"; // Revertido para o título original da CameraCapture
    } else if (location.pathname.startsWith('/resultado-analise')) { // Mantido se a página de resultados ainda existir
        title = "Resultado da Análise";
    } else if (location.pathname.startsWith('/pdfs-gerados')) { // Mantido se a página de PDFs ainda existir
        title = "PDFs Gerados";
    } else {
        switch (location.pathname) {
            case '/camera': title = "Captura Facial"; break;
            case '/analysis': title = "Nova Análise"; break;
            case '/patients': title = "Pacientes"; break;
            case '/agenda': title = "Agenda"; break;
            case '/ask-ai': title = "Pergunte para IA"; break;
            case '/profile': title = "Perfil"; break;
            default: title = "Dashboard";
        }
    }

    if (location.pathname === '/register' || location.pathname === '/login') {
        return <>{children}</>;
    }

    if (location.pathname === '/') {
        return <div className="bg-gray-50 min-h-screen pb-24"><main>{children}</main><Navigation /></div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            <Header title={title} />
            <main>{children}</main>
            <Navigation />
        </div>
    )
}

function App() {
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <AuthProvider>
                <PatientProvider>
                    <AppointmentProvider>
                        <AnalysisProvider>
                            <ConsentProvider>
                                <TreatmentPlanProvider>
                                    <ImageProvider>
                                        <BrowserRouter>
                                            <Routes>
                                                <Route path="/login" element={<LoginPage />} />
                                                <Route path="/register" element={<RegisterPage />} />
                                                <Route path="/*" element={
                                                    <ProtectedRoute>
                                                        <MainLayout>
                                                            <Routes>
                                                                <Route path="/" element={<DashboardPage />} />
                                                                <Route path="/camera" element={<CameraCapture />} />
                                                                <Route path="/analysis" element={<SkinAnalysis />} />
                                                                <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
                                                                <Route path="/patients" element={<PatientsPage />} />
                                                                <Route path="/patient/:id" element={<PatientDetailPage />} />
                                                                <Route path="/ask-ai" element={<AskAiPage />} />
                                                                <Route path="/agenda" element={<AgendaPage />} />
                                                                <Route path="/profile" element={<ProfilePage />} />
                                                                <Route path="/consent/:patientId" element={<ConsentPage />} />
                                                                {/* AQUI ESTÁ A ROTA DE COMPARAÇÃO (mantida) */}
                                                                <Route path="/compare/:id" element={<CompareAnalysesPage />} />
                                                                {/* REMOVIDO: A ROTA PARA INICIAR ANÁLISE DA PerfectCorp */}
                                                                {/* <Route path="/iniciar-analise" element={<AnalysisCapturePage />} /> */}
                                                                {/* AQUI ESTÁ A ROTA PARA RESULTADO DA ANÁLISE (mantida) */}
                                                                <Route path="/resultado-analise" element={<SkinAnalysis />} /> {/* Temporário, será substituído por AnalysisResultPage */}
                                                                {/* AQUI ESTÁ A ROTA PARA PDFS GERADOS (mantida) */}
                                                                <Route path="/pdfs-gerados" element={<GeneratedPDFsPage />} />
                                                                <Route path="*" element={<Navigate to="/" />} />
                                                            </Routes>
                                                        </MainLayout>
                                                    </ProtectedRoute>
                                                } />
                                            </Routes>
                                        </BrowserRouter>
                                    </ImageProvider>
                                </TreatmentPlanProvider>
                            </ConsentProvider>
                        </AnalysisProvider>
                    </AppointmentProvider>
                </PatientProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}

export default App;
