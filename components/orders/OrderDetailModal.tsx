import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { fontPixel } from '@/utils/responsive';
import { getImageUrl } from '@/utils/imageHelper';

// --- TİP TANIMLAMALARI (JSON ile Birebir Uyumlu) ---
export interface BackendOrderDetail {
    headerInfo: {
        orderDate: string;
        status: string;
        orderType: string;
    };
    recipientInfo: {
        fullName: string;
        phone: string;
        note: string;
    };
    buyerInfo: {
        fullName: string;
        phone: string;
    };
    items: {
        _id: string;
        productName: string;
        productImage: string;
        variant: string;
        extras: string | null;
        quantity: number;
        unitPrice: number;
        totalLinePrice: number;
    }[];
    paymentInfo: {
        subTotal: number;
        discount: number;
        finalPrice: number;
        campaignName: string | null;
    };
}

interface OrderDetailModalProps {
    visible: boolean;
    onClose: () => void;
    order: BackendOrderDetail | null;
    isLoading: boolean;
}

// Fiyat formatlama yardımcısı
const formatPrice = (price: number = 0) => price.toFixed(2);

// Durum (status) metinlerini ve renklerini yöneten yardımcı fonksiyon
const getStatusInfo = (status: string): { text: string, color: string } => {
    const statusConfig: { [key: string]: { text: string, color: string } } = {
        PENDING_REDEEM: { text: 'Kullanılabilir', color: '#b45309' }, // Sarı/Turuncu
        PENDING_PAYMENT: { text: 'Ödeme Bekleniyor', color: '#6366f1' }, // Mor
        COMPLETED: { text: 'Tamamlandı', color: '#15803d' }, // Yeşil
        EXPIRED: { text: 'Süresi Doldu', color: '#b91c1c' }, // Kırmızı
        CANCELLED: { text: 'İptal', color: '#b91c1c' },
        default: { text: status, color: '#374151' } // Gri
    };
    return statusConfig[status] || statusConfig.default;
};

const OrderDetailModal = ({ visible, onClose, order, isLoading }: OrderDetailModalProps) => {

    const renderLoading = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.oneCo} />
            <Text style={styles.loadingText}>Detaylar yükleniyor...</Text>
        </View>
    );

    const renderDetails = () => {
        if (!order) return null;

        const statusInfo = getStatusInfo(order.headerInfo.status);
        const formattedDate = new Date(order.headerInfo.orderDate).toLocaleDateString('tr-TR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        return (
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* 1. ÜST BİLGİ (Tarih ve Tip) */}
                <View style={styles.section}>
                    <View style={styles.headerRow}>
                        <View>
                             <Text style={styles.orderTypeBadge}>{order.headerInfo.orderType}</Text>
                             <Text style={styles.dateText}>{formattedDate}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
                             <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
                        </View>
                    </View>
                </View>

                {/* 2. ALICI BİLGİLERİ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Alıcı Bilgileri</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ad Soyad:</Text>
                        <Text style={styles.infoValue}>{order.recipientInfo.fullName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Telefon:</Text>
                        <Text style={styles.infoValue}>{order.recipientInfo.phone}</Text>
                    </View>
                    {/* Alıcı Notu Varsa Göster */}
                    {order.recipientInfo.note && order.recipientInfo.note !== "Not yok." && (
                        <View style={styles.noteContainer}>
                             <Text style={styles.noteLabel}>Not:</Text>
                             <Text style={styles.noteText}>{order.recipientInfo.note}</Text>
                        </View>
                    )}
                </View>

                {/* 3. ÜRÜN LİSTESİ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sipariş İçeriği</Text>
                    {order.items.map((item, index) => (
                        <View key={index} style={styles.productRow}>
                            {/* Ürün Resmi */}
                            {item.productImage ? (
                                <Image source={getImageUrl(item.productImage)} style={styles.productImage} />
                            ) : (
                                <View style={[styles.productImage, { backgroundColor: '#eee' }]} />
                            )}
                            
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>
                                    {item.quantity}x {item.productName}
                                </Text>
                                <Text style={styles.productDetails}>{item.variant}</Text>
                                {item.extras && (
                                    <Text style={styles.extrasText}>+ {item.extras}</Text>
                                )}
                            </View>
                            
                            <Text style={styles.productPrice}>{formatPrice(item.totalLinePrice)} TL</Text>
                        </View>
                    ))}
                </View>

                {/* 4. FİYAT ÖZETİ */}
                <View style={styles.section}>
                    <View style={styles.priceSummaryRow}>
                        <Text style={styles.priceSummaryLabel}>Ara Toplam</Text>
                        <Text style={styles.priceSummaryValue}>{formatPrice(order.paymentInfo.subTotal)} TL</Text>
                    </View>
                    
                    {order.paymentInfo.discount > 0 && (
                        <View style={styles.priceSummaryRow}>
                            <Text style={[styles.priceSummaryLabel, { color: Colors.light.oneCo }]}>
                                İndirim {order.paymentInfo.campaignName ? `(${order.paymentInfo.campaignName})` : ''}
                            </Text>
                            <Text style={[styles.priceSummaryValue, { color: Colors.light.oneCo }]}>
                                -{formatPrice(order.paymentInfo.discount)} TL
                            </Text>
                        </View>
                    )}
                    
                    <View style={[styles.priceSummaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Genel Toplam</Text>
                        <Text style={styles.totalValue}>{formatPrice(order.paymentInfo.finalPrice)} TL</Text>
                    </View>
                </View>

                {/* 5. SİPARİŞİ VEREN (Eğer kendine sipariş değilse veya her zaman göstermek istersen) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Siparişi Veren</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>{order.buyerInfo.fullName}</Text>
                        <Text style={styles.infoValue}>{order.buyerInfo.phone}</Text>
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
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={fontPixel(28)} color="#333" />
                    </TouchableOpacity>
                </View>
                {isLoading ? renderLoading() : renderDetails()}
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: '#f4f4f4' },
    modalHeader: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' 
    },
    modalHeaderText: { fontFamily: Fonts.family.bold, fontSize: fontPixel(18), color: '#333' },
    closeButton: { padding: 4 },
    scrollContent: { padding: 16, paddingBottom: 40 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontFamily: Fonts.family.regular, fontSize: fontPixel(14), marginTop: 10, color: '#666' },

    section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
    sectionTitle: { 
        fontFamily: Fonts.family.bold, fontSize: fontPixel(15), marginBottom: 12, 
        color: '#333', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 8 
    },
    
    // Header Info Styles
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderTypeBadge: { 
        fontFamily: Fonts.family.bold, fontSize: fontPixel(14), color: Colors.light.oneCo, marginBottom: 4 
    },
    dateText: { fontFamily: Fonts.family.regular, fontSize: fontPixel(12), color: '#888' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    statusText: { fontFamily: Fonts.family.bold, fontSize: fontPixel(12) },

    // Info Rows
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    infoLabel: { fontFamily: Fonts.family.regular, color: '#666', fontSize: fontPixel(14) },
    infoValue: { fontFamily: Fonts.family.semibold, color: '#333', fontSize: fontPixel(14) },

    // Notes
    noteContainer: { marginTop: 8, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
    noteLabel: { fontFamily: Fonts.family.bold, fontSize: fontPixel(12), color: '#555', marginBottom: 2 },
    noteText: { fontFamily: Fonts.family.regular, fontSize: fontPixel(13), color: '#333', fontStyle: 'italic' },

    // Product Row
    productRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    productImage: { width: 48, height: 48, borderRadius: 8, marginRight: 12, backgroundColor: '#f0f0f0' },
    productInfo: { flex: 1 },
    productName: { fontFamily: Fonts.family.semibold, fontSize: fontPixel(14), color: '#333' },
    productDetails: { fontFamily: Fonts.family.regular, fontSize: fontPixel(12), color: '#888' },
    extrasText: { fontFamily: Fonts.family.regular, fontSize: fontPixel(11), color: '#666', marginTop: 2 },
    productPrice: { fontFamily: Fonts.family.bold, fontSize: fontPixel(14), color: '#333' },

    // Prices
    priceSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    priceSummaryLabel: { fontFamily: Fonts.family.regular, color: '#666', fontSize: fontPixel(14) },
    priceSummaryValue: { fontFamily: Fonts.family.bold, color: '#333', fontSize: fontPixel(14) },
    totalRow: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#eee' },
    totalLabel: { fontFamily: Fonts.family.bold, fontSize: fontPixel(16), color: '#333' },
    totalValue: { fontFamily: Fonts.family.bold, fontSize: fontPixel(16), color: Colors.light.oneCo },
});

export default OrderDetailModal;