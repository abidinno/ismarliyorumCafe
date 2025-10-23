// Dosya: app/(tabs)/qr/success.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import StyledButton from '@/components/ui/StyledButton';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { fontPixel } from '@/utils/responsive';

// Gelen verinin tipini tanımlayalım
interface OrderDetails {
    recipientName: string;
    orderNote: string | null;
    items: {
        name: string;
        quantity: number;
        size: string;
    }[];
    totalPrice: number;
}

export default function QRSuccessScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    
    // Parametrelerden gelen string veriyi JSON'a çeviriyoruz
    const details: OrderDetails | null = params.orderDetails ? JSON.parse(params.orderDetails as string) : null;

    if (!details) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Sipariş detayları yüklenemedi.</Text>
                <StyledButton title="Geri Dön" onPress={() => router.back()} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Ionicons name="checkmark-circle" size={100} color={Colors.light.succes} />
                <Text style={styles.title}>İşlem Başarılı!</Text>
                <Text style={styles.subtitle}>Sipariş 'Kullanıldı' olarak işaretlendi.</Text>
                
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Sipariş Özeti</Text>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Alıcı:</Text>
                        <Text style={styles.detailValue}>{details.recipientName}</Text>
                    </View>

                    <View style={styles.separator} />

                    <Text style={styles.detailLabel}>Ürünler:</Text>
                    {details.items.map((item, index) => (
                        <Text key={index} style={styles.itemText}>
                            • {item.quantity}x {item.name} ({item.size})
                        </Text>
                    ))}

                    {/* Sadece sipariş notu varsa bu bölümü göster */}
                    {details.orderNote && (
                        <>
                            <View style={styles.separator} />
                            <Text style={styles.detailLabel}>Sipariş Notu:</Text>
                            <Text style={styles.noteText}>"{details.orderNote}"</Text>
                        </>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <StyledButton title="Yeni Tarama Yap" onPress={() => router.back()} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f4f4f4' 
    },
    scrollContent: {
        alignItems: 'center',
        padding: 20,
        paddingBottom: 100, // Footer için boşluk
    },
    errorText: {
        fontSize: fontPixel(18),
        color: Colors.light.error,
        marginBottom: 20
    },
    title: { 
        fontFamily: Fonts.family.bold, 
        fontSize: fontPixel(28), 
        marginVertical: 16 
    },
    subtitle: { 
        fontFamily: Fonts.family.regular, 
        fontSize: fontPixel(18), 
        color: '#666', 
        marginBottom: 24,
        textAlign: 'center'
    },
    card: { 
        backgroundColor: 'white', 
        borderRadius: 12, 
        padding: 20, 
        width: '100%', 
        marginBottom: 32 
    },
    cardTitle: { 
        fontFamily: Fonts.family.bold, 
        fontSize: fontPixel(20), 
        marginBottom: 16,
        textAlign: 'center'
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: { 
        fontFamily: Fonts.family.semibold, 
        fontSize: fontPixel(16), 
        color: '#888' 
    },
    detailValue: { 
        fontFamily: Fonts.family.bold, 
        fontSize: fontPixel(16) 
    },
    itemText: { 
        fontFamily: Fonts.family.regular, 
        fontSize: fontPixel(15), 
        color: '#555', 
        marginLeft: 10,
        lineHeight: 22,
    },
    noteText: {
        fontFamily: Fonts.family.regular, 
        fontSize: fontPixel(15), 
        color: '#555', 
        fontStyle: 'italic',
        marginTop: 4,
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 12,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 30, // SafeArea için ekstra boşluk
        backgroundColor: '#f4f4f4',
    }
});