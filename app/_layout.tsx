// app/_layout.tsx

import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext'; // context'i doğru yoldan import et

import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';

// Splash Screen'in otomatik olarak gizlenmesini engelle
SplashScreen.preventAutoHideAsync();

// Yönlendirme mantığını içeren ana bileşen
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // AuthContext'in token kontrolü gibi başlangıç işlemlerinin bitmesini bekle
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // 1. Durum: Kullanıcı giriş yapmış VE (auth) grubundaki bir sayfada ise (login, register vb.)
    // Bu durum, kullanıcı giriş yaptıktan sonra hala login ekranında kalmasını engeller.
    if (isAuthenticated && inAuthGroup) {
      // Kullanıcıyı ana uygulama ekranına (tabs) yönlendir.
      router.replace('/(tabs)');
    } 
    // 2. Durum: Kullanıcı giriş yapmamış VE (auth) grubu dışındaki bir sayfaya erişmeye çalışıyorsa
    // Bu durum, korumalı sayfalara izinsiz erişimi engeller.
    else if (!isAuthenticated && !inAuthGroup) {
      // Kullanıcıyı giriş ekranına yönlendir.
      router.replace('/(auth)/login');
    }

  }, [isAuthenticated, isLoading, segments]); // Bağımlılıkları doğru şekilde belirle

  // isLoading true iken veya yönlendirme yapılırken henüz bir şey render etme
  // Bu, ekran titremesini ve yanlış ekranın kısa süre görünmesini engeller.
  if (isLoading) {
    return null; 
  }

  return (
    // Stack'in kendisine "screenOptions" ekleyerek, TÜM ekranların başlığını varsayılan olarak kapatıyoruz.
    <Stack screenOptions={{ headerShown: false }}>
      
      {/* Sadece varsayılandan FARKLI bir ayara ihtiyacı olan ekranları burada belirtmemiz yeterli. */}
      <Stack.Screen 
        name="[id]" 
        options={{ 
          presentation: 'modal', 
          headerShown: true, // Sadece bu ekranın başlığı görünsün
          title: 'Mağaza Siparişleri' 
        }} 
      />
    </Stack>
  );
}

// Ana Layout Bileşeni
export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Fontlar yüklenene kadar hiçbir şey gösterme
  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}