// Dosya: IsmarliyorumStore/context/AuthContext.tsx

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { useRouter, useSegments } from 'expo-router';

export interface Store {
    _id: string;
    name: string;
    coverImageUrl: string;
    bannerImageUrl: string;
    location: {
        province: string;
        district: string;
        address: string;
        geo: {
            type: 'Point';
            coordinates: [number, number];
        };
    };
    rating: {
        score: number,
        count: number
    };
    categories: string[];
    tags: string[];
    distance?: number;
}

export interface StoreUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl: string;
    role: 'store_owner' | 'store_member';
    stores: Store[];
}

interface AuthContextType {
    user: StoreUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<StoreUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('storeAuthToken');
                if (storedToken) {
                    setToken(storedToken);
                    const response = await api.getMe();
                    setUser(response);
                }
            } catch (e) {
                console.error("Oturum verileri yüklenirken hata:", e);
                await AsyncStorage.removeItem('storeAuthToken');
            } finally {
                setIsLoading(false);
            }
        };
        loadAuthData();
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        const response = await api.loginStore(credentials);
        const newToken = response.token;
        setToken(newToken);
        await AsyncStorage.setItem('storeAuthToken', newToken);
        // Başarılı girişten sonra hemen kullanıcı bilgilerini çek
        const userResponse = await api.getMe();
        setUser(userResponse);
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem('storeAuthToken');
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isLoading, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};