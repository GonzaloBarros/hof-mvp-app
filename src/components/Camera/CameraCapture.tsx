import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCamera } from '../../hooks/useCamera';
import { useImage } from '../../context/ImageContext';

export const CameraCapture: React.FC = () => {
    const { stream, isActive, error, startCamera, stopCamera, captureImage } = useCamera();
    const { capturedImage, setCapturedImage } = useImage();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);

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

    const handleCapture = () => {
        const imageData = captureImage(videoRef);
        if (imageData) {
            setCapturedImage(imageData); // Guarda a imagem no contexto global
            stopCamera();
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        startCamera();
    };

    const handleAnalyze = () => {
        if (capturedImage) {
            navigate('/analysis'); // Navega para a página de análise
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Captura Facial
                    </h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {!isActive && !capturedImage && (
                        <div className="text-center">
                            <button
                                onClick={startCamera}
                                className="bg-[#00C4B4] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00B5A5] transition-colors"
                            >
                                Iniciar Câmera
                            </button>
                        </div>
                    )}

                    {isActive && (
                        <div style={{ position: 'relative', width: '100%', maxWidth: '512px', margin: '0 auto' }}>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: '20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 10
                            }}>
                                <button
                                    onClick={handleCapture}
                                    className="bg-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors border-4 border-[#00C4B4]"
                                    aria-label="Capturar Imagem"
                                >
                                    <div className="w-16 h-16 bg-[#00C4B4] rounded-full"></div>
                                </button>
                            </div>
                        </div>
                    )}

                    {capturedImage && !isActive && (
                        <div className="space-y-4 mt-4">
                            <img
                                src={capturedImage}
                                alt="Imagem Capturada"
                                className="w-full h-auto rounded-lg"
                            />
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={handleRetake}
                                    className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                                >
                                    Repetir Captura
                                </button>
                                <button
                                    onClick={handleAnalyze}
                                    className="bg-[#00C4B4] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00B5A5] transition-colors"
                                >
                                    Analisar Imagem
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
