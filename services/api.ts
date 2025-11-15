// Dosya: IsmarliyorumStore/services/api.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

// Bu adres, admin panelinin build edilmiş halinin API'ye bağlanacağı adres olmalı.
const API_BASE_URL = 'https://ismarliyorum.com/api'; // Kendi sunucundaki API adresi

// Mağaza kullanıcıları için özel bir API isteği fonksiyonu
const apiRequest = async (endpoint: string, method: 'GET' | 'POST' | 'PUT', body?: any) => {
    try {
        const token = await AsyncStorage.getItem('storeAuthToken');
        
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['x-auth-token'] = token; // Backend'deki storeAuthMiddleware'inin beklediği header
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || `Sunucu Hatası: ${response.status}`);
        }
        return data;

    } catch (error) {
        console.error(`API Hatası (${method} ${endpoint}):`, error);
        throw error;
    }
};


// Kullanacağımız API fonksiyonlarını tanımlıyoruz
export const api = {
    loginStore: (credentials: { email: string; password: string }) => apiRequest('/store-auth/login', 'POST', credentials),
    
    getMe: () => apiRequest('/store-auth/me', 'GET'),
    
    // Belirli bir mağazanın siparişlerini getirir.
    getOrdersForStore: (storeId: string, params: object = {}) => {
        const queryParams = new URLSearchParams(params as any).toString();
        return apiRequest(`/owner/stores/${storeId}/orders?${queryParams}`, 'GET');
    },

    redeemOrderByCode: (redemptionCode: string) => {
        return apiRequest(
            `/owner/redeem-order`, 
            'POST', 
            { redemptionCode }
        );
    },

    getOrderDetail: (storeId: string, packageId: string) => {
        return apiRequest(`/owner/stores/${storeId}/orders/${packageId}`, 'GET');
    },
};