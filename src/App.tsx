import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { CameraCapture } from './components/Camera/CameraCapture';
import { SkinAnalysis } from './components/Analysis/SkinAnalysis';
import { ImageProvider } from './context/ImageContext';
import { PatientProvider } from './context/PatientContext';
import { AnalysisProvider } from './context/AnalysisContext';
import { PatientsPage } from './pages/PatientsPage';
import { DashboardPage } from './pages/DashboardPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage'; // Importar a nova página

// Página de exemplo
const ReportsPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Página de Relatórios</h1></div>;

// Componente para gerir o layout principal
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  let title = "Dashboard";

  // Lógica para definir o título do cabeçalho com base na rota
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
      default:
        title = "Dashboard";
    }
  }
  
  // Não mostra o Header e a Navegação em certas páginas
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
  return (
    <AnalysisProvider>
      <PatientProvider>
        <ImageProvider>
          <BrowserRouter>
            <MainLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/camera" element={<CameraCapture />} />
                <Route path="/analysis" element={<SkinAnalysis />} />
                <Route path="/analysis/:id" element={<AnalysisDetailPage />} /> {/* Nova rota */}
                <Route path="/patients" element={<PatientsPage />} />
                <Route path="/patient/:id" element={<PatientDetailPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </ImageProvider>
      </PatientProvider>
    </AnalysisProvider>
  );
}

export default App;
