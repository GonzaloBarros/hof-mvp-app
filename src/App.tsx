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
import { AppointmentProvider } from './context/AppointmentContext';
import { PatientsPage } from './pages/PatientsPage';
import { DashboardPage } from './pages/DashboardPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { AskAiPage } from './pages/AskAiPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage';
import { AgendaPage } from './pages/AgendaPage';
import { AddPatientPage } from './pages/AddPatientPage';

// Componente que protege as rotas que exigem login
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
  } else if (location.pathname.startsWith('/profile')) {
    title = "Perfil do Profissional";
  } else if (location.pathname.startsWith('/ask-ai')) {
    title = "Inteligência Artificial";
  } else if (location.pathname.startsWith('/agenda')) {
    title = "Agenda";
  } else if (location.pathname.startsWith('/add-patient')) {
    title = "Adicionar Novo Paciente";
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

  if (location.pathname === '/register' || location.pathname === '/login' || location.pathname === '/add-patient') {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header title={title} />
        <main>{children}</main>
      </div>
    )
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
  return (
    <AuthProvider>
      <AppointmentProvider>
        <AnalysisProvider>
          <PatientProvider>
            <ImageProvider>
              <BrowserRouter>
                <Routes>
                  {/* Rotas Públicas */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Rotas Protegidas */}
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
                            <Route path="/agenda" element={<AgendaPage />} />
                            <Route path="/ask-ai" element={<AskAiPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/add-patient" element={<AddPatientPage />} />
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
      </AppointmentProvider>
    </AuthProvider>
  );
}

export default App;