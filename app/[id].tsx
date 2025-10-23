import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useFocusEffect } from 'expo-router';

import { api } from '@/services/api';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { fontPixel } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
// import OrderDetailModal from '@/components/orders/OrderDetailModal'; // Modal'ı daha sonra entegre edebiliriz

// --- TİP TANIMLAMALARI ---
interface StoreOrder {
    _id: string;
    orderId: string;
    customerName: string;
    orderDate: string;
    status: string;
    totalPrice: number;
}
interface SummaryData {
    totalRevenue: number;
    totalOrders: number;
    completedOrders: number;
}
interface PaginationData {
    totalPages: number;
}

// --- ANA EKRAN BİLEŞENİ ---
export default function StoreOrdersScreen() {
    const { id: storeId } = useLocalSearchParams<{ id: string }>();
    
    // GÜNCELLENMİŞ STATE'LER
    const [orders, setOrders] = useState<StoreOrder[]>([]);
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const getTodayDateString = () => new Date().toISOString().split('T')[0];

    const fetchStoreOrders = useCallback(async (pageNum = 1, isRefresh = false) => {
        if (!storeId) return;
        
        // Yüklenme durumlarını yönet
        if (pageNum === 1 && !isRefresh) setIsLoading(true);
        if (isRefresh) setIsRefreshing(true);

        try {
            const today = getTodayDateString();
            const filters = {
                startDate: today,
                endDate: today,
                page: pageNum,
                limit: 20
            };
            
            const response = await api.getOrdersForStore(storeId, filters);
            
            // Verileri state'e ata
            if (pageNum === 1) {
                setOrders(response.data || []);
            } else {
                setOrders(prevOrders => [...prevOrders, ...(response.data || [])]);
            }
            setSummary(response.summary || null);
            setPagination(response.pagination || null);

        } catch (error) {
            console.error(`Mağaza (${storeId}) siparişleri çekilirken hata:`, error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [storeId]);

    // Ekrana her gelindiğinde verileri yeniden çek
    useFocusEffect(useCallback(() => {
        setPage(1); // Sayfayı sıfırla
        fetchStoreOrders(1);
    }, [fetchStoreOrders]));

    const handleRefresh = () => {
        setPage(1);
        fetchStoreOrders(1, true);
    };

    const handleLoadMore = () => {
        if (pagination && page < pagination.totalPages && !isLoading && !isRefreshing) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchStoreOrders(nextPage);
        }
    };

    const renderOrderItem = ({ item }: { item: StoreOrder }) => {
        return <OrderCard item={item} />;
    };
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ title: 'Günlük Siparişler' }} />
            
            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={
                    <SummaryHeader summary={summary} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={60} color="#ccc" />
                            <Text style={styles.emptyText}>Bugün için henüz sipariş yok.</Text>
                        </View>
                    ) : null
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isLoading && page > 1 ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={Colors.light.oneCo} />
                }
                contentContainerStyle={styles.container}
            />
        </SafeAreaView>
    );
}

// --- YARDIMCI BİLEŞENLER ---

// 1. Özet Bilgi Kartı
const SummaryHeader = ({ summary, onRefresh }: { summary: SummaryData | null, onRefresh: () => void }) => (
    <>
        <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Bugünün Özeti</Text>
            <TouchableOpacity onPress={onRefresh}>
                <Ionicons name="refresh" size={24} color={Colors.light.oneCo} />
            </TouchableOpacity>
        </View>
        <View style={styles.summaryBox}>
            <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>₺{(summary?.totalRevenue || 0).toFixed(2)}</Text>
                <Text style={styles.summaryLabel}>Toplam Ciro</Text>
            </View>
            <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{summary?.completedOrders || 0}</Text>
                <Text style={styles.summaryLabel}>Tamamlanan</Text>
            </View>
            <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{summary?.totalOrders || 0}</Text>
                <Text style={styles.summaryLabel}>Toplam Sipariş</Text>
            </View>
        </View>
        <Text style={[styles.headerTitle, { marginTop: 24 }]}>Siparişler</Text>
    </>
);

// 2. Sipariş Kartı
const OrderCard = ({ item }: { item: StoreOrder }) => {
    const statusConfig: { [key: string]: { text: string, color: string } } = {
        PENDING_REDEEM: { text: 'Kullanılabilir', color: '#ffc107' },
        COMPLETED: { text: 'Kullanıldı', color: '#28a745' },
        EXPIRED: { text: 'Süresi Doldu', color: '#dc3545' },
        // ... diğer durumlar ...
        default: { text: item.status, color: '#6c757d' }
    };
    const statusInfo = statusConfig[item.status] || statusConfig.default;

    return (
        <TouchableOpacity style={styles.orderCard}>
            <View style={styles.leftColumn}>
                <Text style={styles.customerName}>{item.customerName}</Text>
                <Text style={styles.orderId}>#{item.orderId.slice(-6).toUpperCase()}</Text>
            </View>
            <View style={styles.rightColumn}>
                <Text style={styles.orderPrice}>{item.totalPrice.toFixed(2)} TL</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                    <Text style={styles.statusText}>{statusInfo.text}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// --- STİLLER ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f4f4f4' },
    container: { paddingHorizontal: 20, paddingTop: 10 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontFamily: Fonts.family.bold, fontSize: 24, marginBottom: 12 },
    summaryBox: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', padding: 20, borderRadius: 16 },
    summaryItem: { alignItems: 'center' },
    summaryValue: { fontFamily: Fonts.family.bold, fontSize: fontPixel(20), color: Colors.light.oneCo },
    summaryLabel: { fontFamily: Fonts.family.regular, fontSize: fontPixel(13), color: '#666', marginTop: 4 },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    emptyText: { fontFamily: Fonts.family.regular, fontSize: 16, color: '#888', marginTop: 16 },
    orderCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
    leftColumn: { flex: 1, marginRight: 10 },
    customerName: { fontFamily: Fonts.family.bold, fontSize: 16 },
    orderId: { fontFamily: Fonts.family.regular, fontSize: 12, color: '#aaa', marginTop: 4 },
    rightColumn: { alignItems: 'flex-end' },
    orderPrice: { fontFamily: Fonts.family.semibold, fontSize: 16 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginTop: 4 },
    statusText: { fontFamily: Fonts.family.bold, color: 'white', fontSize: 11 },
});