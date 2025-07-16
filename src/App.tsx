import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { CameraCapture } from './components/Camera/CameraCapture';
import { SkinAnalysis } from './components/Analysis/SkinAnalysis';
import { ImageProvider } from './context/ImageContext';
import { PatientProvider } from './context/PatientContext';
import { PatientsPage } from './pages/PatientsPage'; // Importar a nova página

// Páginas de exemplo por enquanto
const DashboardPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Página do Dashboard</h1></div>;
const ReportsPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Página de Relatórios</h1></div>;


function App() {
  return (
    <PatientProvider>
      <ImageProvider>
        <BrowserRouter>
          <div className="bg-gray-100 min-h-screen pb-24">
            <Header title="Análise Facial" />
            <main>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/camera" element={<CameraCapture />} />
                <Route path="/analysis" element={<SkinAnalysis />} />
                <Route path="/patients" element={<PatientsPage />} /> {/* Usar a nova página */}
                <Route path="/reports" element={<ReportsPage />} />
              </Routes>
            </main>
            <Navigation />
          </div>
        </BrowserRouter>
      </ImageProvider>
    </PatientProvider>
  );
}

export default App;
