// Dosya: IsmarliyorumStore/components/orders/OrderDetailModal.tsx

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { fontPixel } from '@/utils/responsive';

// [id].tsx'teki StoreOrder tipini buraya taşıyabiliriz veya merkezi bir yerden import edebiliriz.
interface StoreOrder {
    _id: string;
    orderId: string;
    customerName: string;
    orderDate: string;
    status: string;
    totalPrice: number;
    items: {
        name: string;
        quantity: number;
        size: string;
    }[];
    redemptionCode: string;
}

interface OrderDetailModalProps {
    visible: boolean;
    onClose: () => void;
    order: StoreOrder | null;
}

const OrderDetailModal = ({ visible, onClose, order }: OrderDetailModalProps) => {
    if (!visible || !order) return null;

    const formattedDate = new Date(order.orderDate).toLocaleString('tr-TR', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalHeaderText}>Sipariş Detayı</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={fontPixel(28)} color={Colors.light.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Durum ve Tarih */}
                    <View style={styles.section}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Müşteri:</Text>
                            <Text style={styles.infoValue}>{order.customerName}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Sipariş No:</Text>
                            <Text style={styles.infoValue}>#{order.orderId.slice(-6).toUpperCase()}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Tarih:</Text>
                            <Text style={styles.infoValue}>{formattedDate}</Text>
                        </View>
                    </View>

                    {/* Ürün Listesi */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sipariş İçeriği</Text>
                        {order.items.map((item, index) => (
                            <View key={index} style={styles.productRow}>
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>{item.name} ({item.size})</Text>
                                </View>
                                <Text style={styles.productDetails}>x {item.quantity}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Fiyat Özeti */}
                    <View style={styles.section}>
                        <View style={styles.priceSummaryRow}>
                            <Text style={styles.priceSummaryLabel}>Toplam Tutar</Text>
                            <Text style={styles.priceSummaryValue}>{order.totalPrice.toFixed(2)} TL</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: '#f4f4f4' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: 'white' },
    modalHeaderText: { fontFamily: Fonts.family.bold, fontSize: fontPixel(18) },
    scrollContent: { padding: 16 },
    section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    infoLabel: { fontFamily: Fonts.family.semibold, fontSize: fontPixel(14), color: '#666' },
    infoValue: { fontFamily: Fonts.family.regular, fontSize: fontPixel(14) },
    sectionTitle: { fontFamily: Fonts.family.bold, fontSize: fontPixel(16), marginBottom: 12 },
    productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    productInfo: { flex: 1 },
    productName: { fontFamily: Fonts.family.semibold },
    productDetails: { fontFamily: Fonts.family.regular, color: '#888' },
    priceSummaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    priceSummaryLabel: { fontFamily: Fonts.family.semibold, fontSize: fontPixel(14) },
    priceSummaryValue: { fontFamily: Fonts.family.bold, fontSize: fontPixel(16) },
    qrSection: { alignItems: 'center' },
    qrTitle: { fontFamily: Fonts.family.bold, fontSize: fontPixel(18), marginBottom: 16 },
    qrContainer: { marginBottom: 16 },
    redeemCode: { fontFamily: Fonts.family.bold, fontSize: fontPixel(24), letterSpacing: 4, color: Colors.light.oneCo },
});

export default OrderDetailModal;