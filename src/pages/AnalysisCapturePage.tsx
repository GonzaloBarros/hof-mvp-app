import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Este é um componente de captura de câmara simples, sem integração com a PerfectCorp.
// O objetivo é apenas capturar uma foto e simular a navegação.

export default function AnalysisCapturePage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  // Função para iniciar a câmara
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Erro ao aceder à câmara:", err);
      alert("Não foi possível aceder à câmara. Verifique as permissões no seu navegador.");
      setIsCameraActive(false);
    }
  };

  // Função para parar a câmara ao sair da página
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Função para simular a captura da foto e navegar
  const handleCaptureAndSimulateAnalysis = () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Desenha o frame atual do vídeo no canvas
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    // Para a câmara
    streamRef.current?.getTracks().forEach(track => track.stop());
    setIsCameraActive(false);

    // Simula um pequeno atraso e navega para a página de resultados (ou onde for necessário)
    setTimeout(() => {
      navigate('/analysis'); // Navega para a página de análise existente
    }, 1000); 
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        
        {!isCameraActive && (
          <>
            <h1 className="text-4xl font-bold mb-4">Análise Facial</h1>
            <p className="text-gray-400 mb-8">Clique abaixo para iniciar a câmara e simular uma captura.</p>
            <button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl text-lg transition-transform transform hover:scale-105">
              Iniciar Câmara
            </button>
          </>
        )}

        {isCameraActive && (
          <>
            <h2 className="text-3xl font-bold mb-4">Câmara Ativa</h2>
            <p className="text-gray-400 mb-6">Pronto para capturar. Esta é uma simulação.</p>
            <div className="relative w-full aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden border-4 border-gray-600">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]"></video>
              {/* Máscara oval para simular o guia de posicionamento */}
              <div className="absolute inset-0 bg-gray-800 opacity-50" style={{ clipPath: 'ellipse(40% 45% at 50% 50%)' }}></div>
              <div className="absolute inset-0 border-4 border-blue-400 rounded-full" style={{ clipPath: 'ellipse(40% 45% at 50% 50%)' }}></div>
            </div>
            <button onClick={handleCaptureAndSimulateAnalysis} className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-xl text-lg transition-transform transform hover:scale-105">
              Simular Captura e Análise
            </button>
            <canvas ref={canvasRef} className="hidden"></canvas>
          </>
        )}
      </div>
    </div>
  );
}
