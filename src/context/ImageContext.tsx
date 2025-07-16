import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define a forma dos dados do contexto
interface ImageContextType {
    capturedImage: string | null;
    setCapturedImage: (image: string | null) => void;
}

// Cria o contexto com um valor padrão
const ImageContext = createContext<ImageContextType | undefined>(undefined);

// Cria um componente provedor
interface ImageProviderProps {
    children: ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    return (
        <ImageContext.Provider value={{ capturedImage, setCapturedImage }}>
            {children}
        </ImageContext.Provider>
    );
};

// Cria um hook personalizado para usar o contexto da imagem
export const useImage = () => {
    const context = useContext(ImageContext);
    if (context === undefined) {
        throw new Error('useImage must be used within an ImageProvider');
    }
    return context;
};
