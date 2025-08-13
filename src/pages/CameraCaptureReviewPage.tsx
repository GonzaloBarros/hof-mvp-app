import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useImage } from '../context/ImageContext';

// Definir as dimensões do vídeo para garantir o aspecto correto
const videoConstraints = {
  width: { ideal: 720 },
  height: { ideal: 1280 },
  facingMode: 'user', // Usa a câmara frontal por padrão
};

// Componente para a guia oval com efeito de máscara
const FaceOutline = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
    <div className="w-[70vw] h-[60vh] max-w-sm max-h-96 border-4 border-dashed border-[#00C4B4] rounded-[50%]"
      style={{ boxShadow: '0 0 0 9999px rgba(31, 41, 55, 0.7)' }}
    ></div>
  </div>
);

export const CameraCaptureReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { setImageData } = useImage();
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para capturar a imagem da webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setShowPreview(true);
    }
  }, [webcamRef]);

  // Função para lidar com o upload de um ficheiro
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setShowPreview(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Função para navegar para a página de associação de paciente
  const handleKeep = () => {
    if (capturedImage) {
      setImageData(capturedImage);
      navigate('/associate-patient');
    }
  };

  // Função para tirar uma nova foto (reinicia o estado)
  const handleRetake = () => {
    setCapturedImage(null);
    setShowPreview(false);
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Visualização da câmara ou da pré-visualização */}
      <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
        {!showPreview && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="absolute min-w-full min-h-full w-auto h-auto object-cover"
          />
        )}
        {capturedImage && (
          <img src={capturedImage} alt="Pré-visualização da imagem" className="absolute min-w-full min-h-full w-auto h-auto object-cover" />
        )}

        {/* Guia oval para o rosto */}
        <FaceOutline />

        {/* Ecrã de pré-visualização para imagem */}
        {showPreview && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex flex-col items-center justify-end p-6 z-20">
            <img src={capturedImage || ''} alt="Foto para análise" className="max-w-xs max-h-96 rounded-xl shadow-lg border-2 border-white mb-6" />
            <p className="text-xl font-bold mb-4">Confirmar imagem?</p>
            <div className="flex space-x-6">
              <button
                onClick={handleKeep}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg transition-transform transform hover:scale-110"
                aria-label="Manter Imagem"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>
              <button
                onClick={handleRetake}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg transition-transform transform hover:scale-110"
                aria-label="Tirar Nova Foto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9c0-5.5 4-9 9-9 3.1 0 5.8 1.4 7.5 3.6l-2.6 2.6L22 10V3l-3.3 3.3"></path></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controlos para o estado da câmara (se não houver pré-visualização) */}
      {!showPreview && (
        <div className="absolute bottom-6 flex space-x-6 z-20">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white shadow-lg transition-transform transform hover:scale-110"
            aria-label="Carregar Imagem"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={capture}
            className="w-20 h-20 bg-[#00C4B4] rounded-full flex items-center justify-center text-white shadow-lg transition-transform transform hover:scale-110"
            aria-label="Tirar Foto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.22c0 4.6-3.73 8.38-8.33 8.38-4.6 0-8.33-3.78-8.33-8.38s3.73-8.38 8.33-8.38c4.6 0 8.33 3.78 8.33 8.38z"/><path d="M2 12h3m14 0h3"/><path d="m19.07 4.93-2.12 2.12M7.05 16.95l-2.12 2.12m14.14 0-2.12-2.12M7.05 7.05 4.93 4.93"/></svg>
          </button>
        </div>
      )}
    </div>
  );
};
