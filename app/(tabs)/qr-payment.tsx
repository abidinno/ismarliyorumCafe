// Dosya: IsmarliyorumStore/app/(tabs)/qr-payment.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Button, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { router, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- EKLENDİ

import { api } from '@/services/api';

import IsmarliyorumLogo from '@/components/IsmarliyorumLogo';
import StyledButton from '@/components/ui/StyledButton';
import StyledModal from '@/components/ui/StyledModal';

import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { widthPixel, fontPixel } from '@/utils/responsive';

export default function QRPaymentScreen() {
    const insets = useSafeAreaInsets();
    
    // Genişliği ekran boyutuna göre ölçekle
    const responsiveLogoWidth = widthPixel(200);
    const responsiveLogoHeight = responsiveLogoWidth * 0.3; 
    
    const [permission, requestPermission] = useCameraPermissions();
    const [isScannerVisible, setScannerVisible] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [modalContent, setModalContent] = useState({
        visible: false,
        title: '',
        message: '',
        onConfirm: () => {}, 
        scannedData: '',    
    });

    const handleOpenCamera = async () => {
        const { status } = await requestPermission();
        if (status === 'granted') {
            setScannerVisible(true);
        } else {
            Alert.alert(
                'Kamera İzni Gerekli',
                'QR kod okutmak için kamera izni vermeniz gerekiyor. Lütfen ayarlardan izni açın.',
                [
                    { text: 'Vazgeç' },
                    { text: 'Ayarları Aç', onPress: () => Linking.openSettings() }
                ]
            );
        }
    };

    const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
        setScanned(true);
        setScannerVisible(false);
        setModalContent({
            visible: true,
            title: 'Kod Okundu',
            message: `Okunan Kod: ${data}\nBu siparişi onaylamak istiyor musunuz?`,
            onConfirm: () => processCode(data), 
            scannedData: data,
        });
    };

    const processCode = async (code: string) => {
        if (!code) {
            Alert.alert('Hata', 'Lütfen bir kod girin veya okutun.');
            return;
        }

        setIsSubmitting(true);
        setScanned(false); 
        
        try {
            // 1. Önce aktif mağaza ID'sini alıyoruz
            const storeId = await AsyncStorage.getItem('lastSelectedStoreId');

            if (!storeId) {
                Alert.alert('Mağaza Seçimi', 'Lütfen önce Ana Sayfadan (Dashboard) işlem yapılacak mağazayı seçiniz.');
                return;
            }

            // 2. İsteği storeId ile birlikte gönderiyoruz
            const response = await api.redeemOrderByCode(code, storeId); 
            
            // Başarılı olursa başarı sayfasına yönlendir
            router.push({
                pathname: '/(tabs)/qr/success',
                params: { orderDetails: JSON.stringify(response.data) }
            });

        } catch (error: any) {
            console.error(error);
            Alert.alert('İşlem Başarısız', error.message || 'Kod doğrulanırken bir sorun oluştu.');
        } finally {
            setIsSubmitting(false);
            setManualCode(''); 
        }
    };

    const handleManualCodeSubmit = () => { processCode(manualCode); };

    const closeModal = () => {
        setModalContent({ ...modalContent, visible: false });
        setScanned(false); 
    };
    
    if (!permission) {
        return <View />;
    }

    if (isScannerVisible) {
        return (
            <View style={styles.fullScreen}>
                <CameraView
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "ean13"], 
                    }}
                    style={StyleSheet.absoluteFillObject}
                />
                <TouchableOpacity style={styles.closeButton} onPress={() => { setScannerVisible(false); setScanned(false); }}>
                    <Ionicons name="close-circle" size={40} color="white" />
                </TouchableOpacity>
            </View>
        );
    }
    
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
                <Text style={styles.title}>Sipariş Kodu</Text>
                
                <TouchableOpacity style={styles.cameraButton} onPress={handleOpenCamera}>
                    <Ionicons name="camera-outline" size={60} color={Colors.light.oneCo} />
                    <Text style={styles.cameraButtonText}>Kamerayı Aç ve Okut</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>veya</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.manualContainer}>
                    <Text style={styles.manualLabel}>Kodu manuel olarak girin:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ABC-123"
                        placeholderTextColor="#ccc"
                        value={manualCode}
                        onChangeText={setManualCode}
                        autoCapitalize="characters"
                    />
                    <StyledButton
                        title={isSubmitting ? "Kontrol Ediliyor..." : "Kodu Onayla"}
                        onPress={handleManualCodeSubmit}
                        variant="primary"
                        isLoading={isSubmitting}
                    />
                </View>
            </View>
            <StyledModal
                visible={modalContent.visible}
                onClose={closeModal}
                title={modalContent.title}
                message={modalContent.message}
                primaryButton={{
                    text: 'Onayla',
                    onPress: () => {
                        modalContent.onConfirm(); 
                        closeModal();
                    }
                }}
                secondaryButton={{
                    text: 'İptal',
                    onPress: closeModal
                }}
            />
        </SafeAreaView>
    );
}

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
    container: {
        flex: 1,
        padding: 24,
        paddingTop: widthPixel(150),
        alignItems: 'center',
    },
    title: {
        fontFamily: Fonts.family.bold,
        fontSize: 28,
        textAlign: 'center',
        marginVertical: 20,
    },
    cameraButton: {
        width: '100%',
        height: 180,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#eee',
        borderStyle: 'dashed',
    },
    cameraButtonText: {
        fontFamily: Fonts.family.semibold,
        fontSize: 18,
        color: Colors.light.oneCo,
        marginTop: 10,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
        width: '100%',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    dividerText: {
        marginHorizontal: 15,
        fontFamily: Fonts.family.regular,
        color: '#888',
    },
    manualContainer: {
        width: '100%',
    },
    manualLabel: {
        fontFamily: Fonts.family.regular,
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 15,
        fontSize: 18,
        textAlign: 'center',
        fontFamily: Fonts.family.bold,
        letterSpacing: 2,
        marginBottom: 20,
    },
    fullScreen: {
        flex: 1,
        backgroundColor: 'black',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
    },
});