import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Definir a forma dos dados do utilizador
export interface User {
    name: string;
    email: string;
    cro: string;
    phone: string;
    city: string;
    state: string;
    profilePic: string | null;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void; // Função para atualizar
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            return null;
        }
    });

    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error("Erro ao interagir com o localStorage do utilizador", error);
        }
    }, [user]);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const updateUser = (userData: Partial<User>) => {
        setUser(prevUser => prevUser ? { ...prevUser, ...userData } : null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
