import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCamera } from '../../hooks/useCamera';
import { useImage } from '../../context/ImageContext';

// Componente para a guia oval animada
const FaceOutline = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg mb-4 shadow-lg">
            Posicione o rosto dentro do oval
        </div>
        <div
            className="w-[70vw] h-[60vh] max-w-sm max-h-96 border-4 border-dashed border-[#00C4B4] rounded-[50%] animate-spin-slow"
        ></div>
    </div>
);


export const CameraCapture: React.FC = () => {
    const { stream, isActive, error, startCamera, stopCamera, captureImage } = useCamera();
    const { setCapturedImage } = useImage(); // Apenas precisamos de 'set' aqui
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showInitialScreen, setShowInitialScreen] = useState(true);


    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    // Garante que a câmara é desligada quando saímos da página
    useEffect(() => {
        return () => {
            if (isActive) {
                stopCamera();
            }
        };
    }, [isActive, stopCamera]);

    const handleStartCamera = () => {
        startCamera();
        setShowInitialScreen(false);
    }

    // *** AQUI ESTÁ A CORREÇÃO PRINCIPAL ***
    const handleCapture = () => {
        const imageData = captureImage(videoRef);
        if (imageData) {
            setCapturedImage(imageData); // Guarda a imagem no contexto global
            stopCamera();
            navigate('/analysis'); // Navega IMEDIATAMENTE para a página de análise
        }
    };

    return (
        <div className="w-full h-full bg-gray-800 text-white">
            {/* Estado: Inicial (Antes de ligar a câmara) */}
            {showInitialScreen && (
                 <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <FaceOutline />
                    <div className="z-20">
                        <button onClick={handleStartCamera} className="bg-[#00C4B4] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg">
                            Iniciar Câmera
                        </button>
                    </div>
                    {error && (
                        <div className="absolute top-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-20">
                            {error}
                        </div>
                    )}
                </div>
            )}

            {/* Estado: Câmara Ativa */}
            {isActive && (
                <div className="relative w-full h-full flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <FaceOutline />
                    <div className="absolute bottom-24 flex items-center justify-center w-full z-20">
                        <button onClick={handleCapture} className="w-20 h-20 bg-[#00C4B4] rounded-full flex items-center justify-center shadow-lg" aria-label="Capturar Imagem">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.22c0 4.6-3.73 8.38-8.33 8.38-4.6 0-8.33-3.78-8.33-8.38s3.73-8.38 8.33-8.38c4.6 0 8.33 3.78 8.33 8.38z"/><path d="M2 12h3m14 0h3"/><path d="m19.07 4.93-2.12 2.12M7.05 16.95l-2.12 2.12m14.14 0-2.12-2.12M7.05 7.05 4.93 4.93"/></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
