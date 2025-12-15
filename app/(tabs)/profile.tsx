// Dosya: IsmarliyorumStore/app/(tabs)/profile.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, StoreUser  } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import IsmarliyorumLogo from '@/components/IsmarliyorumLogo';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import UserAvatar from '@/components/common/UserAvatar';
import { widthPixel, fontPixel } from '@/utils/responsive';

const getRoleText = (role: StoreUser['role']) => {
    if (role === 'store_owner') {
        return 'Mağaza Yöneticisi';
    }
    if (role === 'store_member') {
        return 'Mağaza Çalışanı';
    }
    return 'Kullanıcı'; // Varsayılan durum
};

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const insets = useSafeAreaInsets();

    // Genişliği ekran boyutuna göre ölçekle
    const responsiveLogoWidth = widthPixel(200);
    // Genişliğe göre en/boy oranını koruyarak yüksekliği hesapla
    const responsiveLogoHeight = responsiveLogoWidth * 0.3; 
    
    if (!user) {
        // Bu durum normalde yaşanmaz çünkü bu sayfa korumalı, ama bir güvenlik önlemi.
        return null;
    }

    const roleText = getRoleText(user.role);

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
            <StatusBar style="dark" />            
            <View style={styles.headerContainer}>
                <IsmarliyorumLogo 
                    variant="color" 
                    width={responsiveLogoWidth} 
                    height={responsiveLogoHeight}  />
            </View>
            <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, widthPixel(120)) }]}>
                {/* Kullanıcı Bilgi Kartı */}
                <View style={styles.profileHeader}>
                    <UserAvatar 
                        name={`${user.firstName} ${user.lastName}`}
                        avatarUrl={user.profilePictureUrl}
                        size={80}
                    />
                    <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
                    {/* YENİ: Rol bilgisi eklendi */}
                    <Text style={styles.userRole}>{roleText}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </View>


                {/* Boşluk bırakmak için */}
                <View style={{ flex: 1 }} />

                {/* Çıkış Yap Butonu */}
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Ionicons name="log-out-outline" size={22} color="#fff" />
                    <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Uygulama Versiyonu 1.0.0</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#f4f4f4' 
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: widthPixel(120),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 40,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    container: { 
        flex: 1,
        padding: 20,
        paddingTop: widthPixel(150),
        alignItems: 'center',
    },
    profileHeader: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
    },
    userName: {
        fontFamily: Fonts.family.bold,
        fontSize: 22,
        color: Colors.light.text,
    },
    userEmail: {
        fontFamily: Fonts.family.regular,
        fontSize: 16,
        color: '#888',
        marginTop: 4,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dc3545',
        paddingVertical: 15,
        borderRadius: 12,
        width: '100%',
        gap: 10, // İkon ve metin arası boşluk
    },
    logoutButtonText: {
        fontFamily: Fonts.family.bold,
        fontSize: 16,
        color: '#fff',
    },
    versionText: {
        fontFamily: Fonts.family.regular,
        color: '#aaa',
        marginTop: 20,
    },
    userRole: {
        fontFamily: Fonts.family.semibold,
        fontSize: 16,
        color: Colors.light.oneCo, // Turuncu renk
        marginTop: 4,
    },
});