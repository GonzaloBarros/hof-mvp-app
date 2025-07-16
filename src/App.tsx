import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { CameraCapture } from './components/Camera/CameraCapture';
import { SkinAnalysis } from './components/Analysis/SkinAnalysis';
import { ImageProvider } from './context/ImageContext';
import { PatientProvider } from './context/PatientContext';
import { AnalysisProvider } from './context/AnalysisContext'; // Importar o novo provider
import { PatientsPage } from './pages/PatientsPage';
import { DashboardPage } from './pages/DashboardPage';

const ReportsPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Página de Relatórios</h1></div>;

const AppHeader = () => {
  const location = useLocation();
  let title = "Dashboard";

  switch (location.pathname) {
    case '/camera':
      title = "Captura Facial";
      break;
    case '/analysis':
      title = "Análise Facial";
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
  
  if (location.pathname === '/') {
    return null;
  }

  return <Header title={title} />;
}

function App() {
  return (
    <AnalysisProvider> {/* Adicionar o novo provider */}
      <PatientProvider>
        <ImageProvider>
          <BrowserRouter>
            <div className="bg-gray-50 min-h-screen pb-24">
              <AppHeader />
              <main>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/camera" element={<CameraCapture />} />
                  <Route path="/analysis" element={<SkinAnalysis />} />
                  <Route path="/patients" element={<PatientsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                </Routes>
              </main>
              <Navigation />
            </div>
          </BrowserRouter>
        </ImageProvider>
      </PatientProvider>
    </AnalysisProvider>
  );
}

export default App;
