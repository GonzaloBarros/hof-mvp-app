import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { CameraCapture } from './components/Camera/CameraCapture';
import { SkinAnalysis } from './components/Analysis/SkinAnalysis';
import { ImageProvider } from './context/ImageContext';
import { PatientProvider } from './context/PatientContext';
import { AnalysisProvider } from './context/AnalysisContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PatientsPage } from './pages/PatientsPage';
import { DashboardPage } from './pages/DashboardPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage';
import { AskAiPage } from './pages/AskAiPage'; // Importar a nova página

const ReportsPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Página de Relatórios</h1></div>;

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
  let title = "";

  if (location.pathname.startsWith('/patient/')) {
    title = "Detalhes do Paciente";
  } else if (location.pathname.startsWith('/analysis/')) {
    title = "Detalhes da Análise";
  } else {
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
      case '/reports':
        title = "Relatórios";
        break;
      case '/ask-ai':
        title = "Pergunte para IA";
        break;
      default:
        title = "";
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
        <main className="h-[calc(100vh-128px)]">{children}</main> {/* Ajuste para a página de IA ocupar o espaço */}
        <Navigation />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AnalysisProvider>
        <PatientProvider>
          <ImageProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
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
                          <Route path="/reports" element={<ReportsPage />} />
                          <Route path="/ask-ai" element={<AskAiPage />} /> {/* Nova rota */}
                          <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </ImageProvider>
        </PatientProvider>
      </AnalysisProvider>
    </AuthProvider>
  );
}

export default App;
