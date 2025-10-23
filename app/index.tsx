// app/index.tsx

import { StyleSheet, Dimensions, ActivityIndicator, View } from 'react-native';
import React, { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';
import IsmarliyorumLogo from '@/components/IsmarliyorumLogo';

// AuthContext'i ve hook'u import et
import { useAuth } from '../context/AuthContext'; 

const screenWidth = Dimensions.get('window').width;
const logoWidth = screenWidth * 0.7;
const logoAspectRatio = 2.5; 
const logoHeight = logoWidth / logoAspectRatio;

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Yönlendirme mantığı için useEffect kullanıyoruz
  useEffect(() => {
    // AuthContext'in durumu henüz yükleniyorsa, hiçbir şey yapma.
    // Ekranda zaten ActivityIndicator görünüyor olacak.
    if (isLoading) {
      return;
    }

    // Yükleme bittiğinde:
    if (isAuthenticated) {
      // Kullanıcı giriş yapmışsa ana ekrana yönlendir.
      // 'replace' kullanıyoruz ki kullanıcı geri tuşuyla bu splash ekranına dönemesin.
      router.replace('/(tabs)');
    } else {
      // Kullanıcı giriş yapmamışsa login ekranına yönlendir.
      router.replace('/(auth)/login');
    }
  }, [isLoading, isAuthenticated]); // isLoading veya isAuthenticated değiştiğinde bu efekti tekrar çalıştır.

  // Bu bileşen, yönlendirme gerçekleşene kadar HER ZAMAN splash ekranı tasarımını gösterir.
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#FF7D25', '#FF6620']}
        style={styles.container}
      >
        <StatusBar style="auto" />
        <IsmarliyorumLogo variant="white" width={logoWidth} height={logoHeight} />
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} />
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});