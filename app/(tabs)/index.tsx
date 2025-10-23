import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, Store } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import IsmarliyorumLogo from '@/components/IsmarliyorumLogo';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Ionicons } from '@expo/vector-icons';
import { widthPixel, fontPixel } from '@/utils/responsive';

export default function HomeScreen() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    // Genişliği ekran boyutuna göre ölçekle
    const responsiveLogoWidth = widthPixel(200);
    // Genişliğe göre en/boy oranını koruyarak yüksekliği hesapla
    const responsiveLogoHeight = responsiveLogoWidth * 0.3; 
    

    if (isLoading) {
        return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" color={Colors.light.oneCo} />;
    }

    const renderStoreItem = ({ item }: { item: Store }) => (   
        <TouchableOpacity 
            style={styles.cardContainer} // Stil adı daha anlaşılır olması için değiştirildi
            onPress={() => router.push(`/${item._id}`)}
        >
            <View style={styles.topRow}>
                <Image source={{ uri: item.coverImageUrl }} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.address} numberOfLines={2}>
                        {item.location.district}, {item.location.province}
                    </Text>
                </View>
                {/* YENİ: Ok ikonu eklendi */}
                <Ionicons name="chevron-forward" size={24} color={Colors.light.icon} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="dark" />
            <View style={styles.headerContainer}>
                <IsmarliyorumLogo 
                    variant="color" 
                    width={responsiveLogoWidth} 
                    height={responsiveLogoHeight}  />
            </View>
            <View style={styles.mainContainer}>
                <Text style={styles.welcomeText}>Hoş geldin, {user?.firstName}!</Text>
                <Text style={styles.subText}>İşlem yapmak istediğin mağazayı seç.</Text>
                
                <FlatList
                    data={user?.stores || []}
                    renderItem={renderStoreItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ marginTop: 10 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Yönettiğiniz bir mağaza bulunamadı.</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

// GÜNCELLEME: Stiller temizlendi ve düzenlendi
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f4f4f4' },
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
    mainContainer: {
        flex: 1,
        paddingHorizontal: 20, 
    paddingTop:  widthPixel(100),
    },
    welcomeText: { fontFamily: Fonts.family.bold, fontSize: 24, marginBottom: 5 },
    subText: { fontFamily: Fonts.family.regular, fontSize: 16, color: '#666', marginBottom: 20 },
    emptyContainer: { marginTop: 50, alignItems: 'center' },
    emptyText: { fontFamily: Fonts.family.regular, fontSize: 16, color: '#888' },

    // Kart Stilleri
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        padding: 12,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: widthPixel(65), 
        height: widthPixel(65),
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
    },
    infoContainer: {
        flex: 1,
        marginLeft: widthPixel(12),
        marginRight: widthPixel(8), // İkon için boşluk
        justifyContent: 'center',
    },
    name: {
        fontFamily: Fonts.family.bold,
        fontSize: fontPixel(14),
        color: Colors.light.text,
    },
    address: {
        fontFamily: Fonts.family.regular,
        fontSize: fontPixel(11),
        color: '#666',
        marginTop: 4,
    },
});