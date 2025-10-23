// components/ui/WelcomeModal.tsx
import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import StyledButton from './StyledButton';
import { fontPixel, heightPixel } from '@/utils/responsive';

interface WelcomeModalProps {
    visible: boolean;
    onClose: () => void;
    isLoadingData: boolean;
}

export default function WelcomeModal({ visible, onClose, isLoadingData }: WelcomeModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
        >
            <View style={styles.overlay} />
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Aramıza Hoş Geldin! 🎉</Text>
                    <Text style={styles.modalText}>
                        Hesabını başarıyla oluşturduğun için, bizden sana tam <Text style={{fontFamily: Fonts.family.bold}}>9 gülümseme</Text> hediye!
                    </Text>
                    <StyledButton
                        title={isLoadingData ? "Veriler Yükleniyor..." : "Harika, Başlayalım!"}
                        onPress={onClose}
                        disabled={isLoadingData}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: heightPixel(35),
        alignItems: 'center',
        width: '100%',
    },
    modalTitle: {
        fontFamily: Fonts.family.bold,
        fontSize: fontPixel(Fonts.size.md),
        marginBottom: heightPixel(15),
        color: Colors.light.text,
    },
    modalText: {
        fontFamily: Fonts.family.regular,
        fontSize: fontPixel(Fonts.size.xs),
        textAlign: 'center',
        marginBottom: heightPixel(30),
        lineHeight: heightPixel(24),
        color: Colors.light.text,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
});