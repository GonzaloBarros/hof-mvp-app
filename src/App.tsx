import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Layout Components
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';

// Context Providers
import { ImageProvider } from './context/ImageContext';
import { PatientProvider } from './context/PatientContext';
import { AnalysisProvider } from './context/AnalysisContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { ConsentProvider } from './context/ConsentContext';
import { TreatmentPlanProvider } from './context/TreatmentPlanContext';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { PatientsPage } from './pages/PatientsPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage';
import { AskAiPage } from './pages/AskAiPage';
import { AgendaPage } from './pages/AgendaPage';
import { ProfilePage } from './pages/ProfilePage';
import { ConsentPage } from './pages/ConsentPage';
import { CompareAnalysesPage } from './pages/CompareAnalysesPage';
import { GeneratedPDFsPage } from './pages/GeneratedPDFsPage';
import { CameraCaptureReviewPage } from './pages/CameraCaptureReviewPage';
import { AssociatePatientPage } from './pages/AssociatePatientPage';
import { CasesPage } from './pages/CasesPage';
import { CaseDetailPage } from './pages/CaseDetailPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    let title = "Dashboard";

    // Lógica para definir o título da página
    if (location.pathname.startsWith('/patient/')) {
        title = "Detalhes do Paciente";
    } else if (location.pathname.startsWith('/analysis-detail/')) {
        title = "Relatório da Análise";
    } else if (location.pathname.startsWith('/case/')) {
        title = "Detalhe do Caso";
    // TÍTULO PARA A NOVA PÁGINA DA IA
    } else if (location.pathname.startsWith('/ask-ai/')) {
        title = "Assistente de Diagnóstico";
    } else {
        switch (location.pathname) {
            case '/patients': title = "Pacientes"; break;
            case '/agenda': title = "Agenda"; break;
            case '/cases': title = "Meus Casos"; break;
            case '/profile': title = "Perfil"; break;
            default: title = "Dashboard";
        }
    }

    // Não mostra o Header/Navegação em certas páginas
    if (['/register', '/login'].includes(location.pathname) || location.pathname.startsWith('/ask-ai/')) {
        return <>{children}</>;
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            <Header title={title} />
            <main className="p-4 sm:p-6 lg:p-8">{children}</main>
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
                                                                <Route path="/cases" element={<CasesPage />} />
                                                                <Route path="/case/:id" element={<CaseDetailPage />} />
                                                                {/* ROTA DA IA ATUALIZADA PARA ACEITAR UM ID */}
                                                                <Route path="/ask-ai/:analysisId" element={<AskAiPage />} />
                                                                {/* ROTA DE DETALHE DA ANÁLISE ATUALIZADA */}
                                                                <Route path="/analysis-detail/:id" element={<AnalysisDetailPage />} />
                                                                <Route path="/capture-flow" element={<CameraCaptureReviewPage />} />
                                                                <Route path="/associate-patient" element={<AssociatePatientPage />} />
                                                                <Route path="/patients" element={<PatientsPage />} />
                                                                <Route path="/patient/:id" element={<PatientDetailPage />} />
                                                                <Route path="/agenda" element={<AgendaPage />} />
                                                                <Route path="/profile" element={<ProfilePage />} />
                                                                <Route path="/consent/:patientId" element={<ConsentPage />} />
                                                                <Route path="/compare/:id" element={<CompareAnalysesPage />} />
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
