import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { fontPixel } from '@/utils/responsive';

export interface BackendOrderDetail {
    mainOrderInfo: {
        status: string;
        note: string;
    };
    packageInfo: {
        status: string;
        redemptionCode: string;
        storeId: string;
    };
    orderingUserInfo: {
        fullName: string;
        phone: string;
    };
    recipientInfo: {
        fullName: string;
        phone: string;
    };
    orderTypeInfo: {
        type: string;
        description: string;
    };
    campaignInfo: {
        isApplied: boolean;
        name: string;
        discountAmount: number;
    };
    giftInfo: {
        isGift: boolean;
        message: string;
        acceptanceDeadline: string | null;
        redemptionDeadline: string | null;
    };
    priceInfo: {
        mainOrderFinalPrice: number;
        packageSubtotal: number;
        totalDiscount: number;
    };
    items: {
        name: string;
        quantity: number;
        size: string;
        unitPrice: number;
        totalPrice: number;
    }[];
}


interface OrderDetailModalProps {
    visible: boolean;
    onClose: () => void;
    order: BackendOrderDetail | null; // Tip güncellendi
    isLoading: boolean; // isLoading eklendi
}

// Fiyat formatlama yardımcısı
const formatPrice = (price: number = 0) => price.toFixed(2);

// Durum (status) metinlerini ve renklerini yöneten yardımcı fonksiyon
const getStatusInfo = (status: string): { text: string, color: string } => {
    const statusConfig: { [key: string]: { text: string, color: string } } = {
        PENDING_REDEEM: { text: 'Kullanılabilir', color: '#ffc107' },
        COMPLETED: { text: 'Kullanıldı', color: '#28a745' },
        EXPIRED: { text: 'Süresi Doldu', color: '#dc3545' },
        default: { text: status, color: '#6c757d' }
    };
    return statusConfig[status] || statusConfig.default;
};


const OrderDetailModal = ({ visible, onClose, order, isLoading }: OrderDetailModalProps) => {

    // Yükleniyor durumunu modal içinde göster
    const renderLoading = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.oneCo} />
            <Text style={styles.loadingText}>Detaylar yükleniyor...</Text>
        </View>
    );

    // Sipariş detayı render fonksiyonu
    const renderDetails = () => {
        if (!order) return null; // Yüklenme bitti ama veri yoksa (hata durumu)

        const statusInfo = getStatusInfo(order.packageInfo.status);
        const deadline = order.giftInfo.redemptionDeadline ? 
            new Date(order.giftInfo.redemptionDeadline).toLocaleDateString('tr-TR') : 'N/A';

        return (
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Ana Bilgiler Bölümü */}
                <View style={styles.section}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Alıcı (Müşteri):</Text>
                        <Text style={styles.infoValue}>{order.recipientInfo.fullName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Alıcı Telefon:</Text>
                        <Text style={styles.infoValue}>{order.recipientInfo.phone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Sipariş Kodu:</Text>
                        <Text style={styles.infoValue}>#{order.packageInfo.redemptionCode}</Text>
                    </View>
                </View>

                {/* Durum ve Kullanım Kodu */}
                <View style={[styles.section, styles.statusSection]}>
                    <Text style={styles.sectionTitle}>Sipariş Durumu</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                        <Text style={styles.statusText}>{statusInfo.text}</Text>
                    </View>
                    <Text style={styles.infoLabel}>Son Kullanma Tarihi: {deadline}</Text>
                </View>

                {/* Ürün Listesi */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sipariş İçeriği</Text>
                    {order.items.map((item, index) => (
                        <View key={index} style={styles.productRow}>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{item.name} ({item.size})</Text>
                                <Text style={styles.productDetails}>{formatPrice(item.unitPrice)} TL</Text>
                            </View>
                            <Text style={styles.productQuantity}>x {item.quantity}</Text>
                            <Text style={styles.productPrice}>{formatPrice(item.totalPrice)} TL</Text>
                        </View>
                    ))}
                </View>

                {/* Fiyat Özeti */}
                <View style={styles.section}>
                    <View style={styles.priceSummaryRow}>
                        <Text style={styles.priceSummaryLabel}>Ara Toplam</Text>
                        <Text style={styles.priceSummaryValue}>{formatPrice(order.priceInfo.packageSubtotal)} TL</Text>
                    </View>
                    {order.campaignInfo.isApplied && (
                        <View style={styles.priceSummaryRow}>
                            <Text style={[styles.priceSummaryLabel, { color: Colors.light.oneCo }]}>İndirim ({order.campaignInfo.name})</Text>
                            <Text style={[styles.priceSummaryValue, { color: Colors.light.oneCo }]}>- {formatPrice(order.campaignInfo.discountAmount)} TL</Text>
                        </View>
                    )}
                    <View style={styles.priceSummaryRow}>
                        <Text style={styles.priceSummaryLabel}>Paket Toplamı</Text>
                        <Text style={styles.priceSummaryValue}>{formatPrice(order.priceInfo.packageSubtotal - order.campaignInfo.discountAmount)} TL</Text>
                    </View>
                </View>

                {/* Notlar */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sipariş Notu (Müşteri)</Text>
                    <Text style={styles.noteText}>{order.mainOrderInfo.note || 'Sipariş notu yok.'}</Text>
                </View>
                 <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hediye Mesajı</Text>
                    <Text style={styles.noteText}>{order.giftInfo.message || 'Hediye mesajı yok.'}</Text>
                </View>

                {/* Siparişi Veren Bilgileri */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Siparişi Veren (Gönderici)</Text>
                     <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ad Soyad:</Text>
                        <Text style={styles.infoValue}>{order.orderingUserInfo.fullName}</Text>
                    </View>
                     <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Telefon:</Text>
                        <Text style={styles.infoValue}>{order.orderingUserInfo.phone}</Text>
                    </View>
                </View>
            </ScrollView>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalHeaderText}>Sipariş Detayı</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={fontPixel(28)} color={Colors.light.text} />
                    </TouchableOpacity>
                </View>
                {isLoading ? renderLoading() : renderDetails()}
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: '#f4f4f4' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: 'white' },
    modalHeaderText: { fontFamily: Fonts.family.bold, fontSize: fontPixel(18) },
    scrollContent: { padding: 16 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontFamily: Fonts.family.semibold, fontSize: fontPixel(16), marginTop: 12 },
    section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
    statusSection: { alignItems: 'center' },
    statusBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, marginVertical: 8 },
    statusText: { fontFamily: Fonts.family.bold, color: 'white', fontSize: fontPixel(14) },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    infoLabel: { fontFamily: Fonts.family.semibold, fontSize: fontPixel(14), color: '#666' },
    infoValue: { fontFamily: Fonts.family.regular, fontSize: fontPixel(14) },
    sectionTitle: { fontFamily: Fonts.family.bold, fontSize: fontPixel(16), marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 8 },
    productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    productInfo: { flex: 1 },
    productName: { fontFamily: Fonts.family.semibold, fontSize: fontPixel(14) },
    productDetails: { fontFamily: Fonts.family.regular, color: '#888', fontSize: fontPixel(12) },
    productQuantity: { fontFamily: Fonts.family.regular, color: '#888', marginHorizontal: 10 },
    productPrice: { fontFamily: Fonts.family.semibold, fontSize: fontPixel(14) },
    priceSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    priceSummaryLabel: { fontFamily: Fonts.family.semibold, fontSize: fontPixel(14) },
    priceSummaryValue: { fontFamily: Fonts.family.bold, fontSize: fontPixel(16) },
    noteText: { fontFamily: Fonts.family.regular, fontSize: fontPixel(14), color: '#333', fontStyle: 'italic' },
});

export default OrderDetailModal;