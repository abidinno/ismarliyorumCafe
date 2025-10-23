// Dosya: IsmarliyorumStore/app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';

import { AnasayfaIcon } from '@/components/icons/AnasayfaIcon';
import QRButton from '@/components/QRButton';
import { ProfilIcon } from '@/components/icons/ProfilIcon';
import { widthPixel, fontPixel } from '@/utils/responsive';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.oneCo,
        tabBarInactiveTintColor: '#AEAEB2',
        tabBarStyle: {
          height: widthPixel(70),
          paddingTop: widthPixel(10),
          paddingBottom: widthPixel(10),
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarLabelStyle: {
          fontSize: fontPixel(11),
        }
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