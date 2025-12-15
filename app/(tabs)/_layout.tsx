// Dosya: IsmarliyorumStore/app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnasayfaIcon } from '@/components/icons/AnasayfaIcon';
import QRButton from '@/components/QRButton';
import { ProfilIcon } from '@/components/icons/ProfilIcon';
import { widthPixel, fontPixel, heightPixel } from '@/utils/responsive';

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.oneCo,
        tabBarInactiveTintColor: '#AEAEB2',
        tabBarStyle: {
          position: 'absolute', // <--- KRİTİK NOKTA: Barı akıştan çıkarıp yüzdürüyoruz
          bottom: 0,
          left: 0,
          right: 0,
          height: heightPixel(70) + bottom,
          paddingTop: heightPixel(10),
          paddingBottom: bottom,
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 0, // <--- Üstteki gri çizgiyi kaldırır
          elevation: 0, // Android'deki default gölgeyi kaldırır (istenirse açılabilir)
          shadowOpacity: 0, // iOS'taki default gölgeyi kaldırır (istenirse açılabilir)
        },
        tabBarLabelStyle: {
          fontSize: fontPixel(11),
        },
        // Arkaplanın tamamen şeffaf olduğundan emin olmak için (Bazen gerekebilir)
        tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
        ),
      }}>
      <Tabs.Screen
        name="index" // app/(tabs)/index.tsx dosyasını işaret eder
        options={{
          title: 'Kafelerim',
          headerShown: false, // Her sayfanın kendi başlığı olabilir
          tabBarIcon: ({ color }) => <AnasayfaIcon size={widthPixel(23)} color={color} /> 
        }}
      />
      <Tabs.Screen
        name="qr-payment" // app/(tabs)/qr-payment.tsx dosyasını işaret eder
        options={{
          title: 'QR Ödeme',
          tabBarButton: (props) => <QRButton {...props} /> 
        }}
      />
      <Tabs.Screen
        name="profile" // app/(tabs)/profile.tsx dosyasını işaret eder
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <ProfilIcon size={widthPixel(20)}  color={color} />
        }}
      />
      <Tabs.Screen
        name="qr/success" // app/(tabs)/qr klasörünü işaret eder
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}