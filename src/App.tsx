import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation'; // Garanta que 'Navigation' é importado daqui
import { CameraCapture } from './components/Camera/CameraCapture';
import { SkinAnalysis } from './components/Analysis/SkinAnalysis';
import { ImageProvider } from './context/ImageContext';
import { PatientProvider } from './context/PatientContext';
import { AnalysisProvider } from './context/AnalysisContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext'; // Garanta que 'ReportProvider' é importado daqui
import { PatientsPage } from './pages/PatientsPage';
import { DashboardPage } from './pages/DashboardPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage';
import { AgendaPage } from './pages/AgendaPage';
import { AskAiPage } from './pages/AskAiPage';
import { DashboardReportsPage } from './pages/DashboardReportsPage'; // AGORA CORRETO: Importa a página de estatísticas
import { GeneratedPDFsPage } from './pages/GeneratedPDFsPage'; // AGORA CORRETO: Importa a página de PDFs gerados

// Componente que protege as rotas que exigem login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Componente para gerir o layout principal (Header e Navigation)
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  let title = "Dashboard";

  if (location.pathname.startsWith('/patient/')) {
    title = "Detalhes do Paciente";
  } else if (location.pathname.startsWith('/analysis/')) {
    title = "Detalhes da Análise";
  } else if (location.pathname.startsWith('/ask-ai')) {
    title = "Pergunte para IA";
  } else if (location.pathname.startsWith('/reports-dashboard')) {
    title = "Relatórios e Estatísticas";
  } else if (location.pathname.startsWith('/generated-pdfs')) {
    title = "PDFs Gerados";
  } else if (location.pathname.startsWith('/agenda')) {
    title = "Agenda";
  }
  else {
    switch (location.pathname) {
      case '/camera':
        title = "Captura Facial";
        break;
      case '/analysis':
        title = "Nova Análise";
        break;
      case '/patients':
        title = "Pacientes";
        break;
      default:
        title = "Dashboard";
    }
  }

  if (location.pathname === '/register' || location.pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <Header title={title} />
      <main>{children}</main>
      <Navigation />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AnalysisProvider>
        <PatientProvider>
          <ImageProvider>
            <ReportProvider>
              <Router>
                <Routes>
                  {/* Rotas Públicas */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Rotas Protegidas (exigem login) */}
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <Routes>
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/camera" element={<CameraCapture />} />
                            <Route path="/analysis" element={<SkinAnalysis />} />
                            <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
                            <Route path="/patients" element={<PatientsPage />} />
                            <Route path="/patient/:id" element={<PatientDetailPage />} />
                            <Route path="/reports-dashboard" element={<DashboardReportsPage />} /> {/* Rota para o dashboard de relatórios */}
                            <Route path="/generated-pdfs" element={<GeneratedPDFsPage />} /> {/* Rota para a página de PDFs gerados */}
                            <Route path="/agenda" element={<AgendaPage />} />
                            <Route path="/ask-ai" element={<AskAiPage />} />

                            <Route path="*" element={<Navigate to="/" />} />
                          </Routes>
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Router>
            </ReportProvider>
          </ImageProvider>
        </PatientProvider>
      </AnalysisProvider>
    </AuthProvider>
  );
}

export default App;