import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useFocusEffect } from 'expo-router';

import { api } from '@/services/api';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { fontPixel } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import OrderDetailModal, { BackendOrderDetail } from '@/components/orders/OrderDetailModal';

// --- TİP TANIMLAMALARI ---
type ListType = 'available' | 'completed'; // YENİ: Tab tipleri

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
    
    // AKTİF TAB STATE'İ
    const [activeTab, setActiveTab] = useState<ListType>('completed');
    
    // LİSTE STATE'LERİ
    const [orders, setOrders] = useState<StoreOrder[]>([]);
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // MODAL STATE'LERİ
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
    const [orderDetail, setOrderDetail] = useState<BackendOrderDetail | null>(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const getTodayDateString = () => new Date().toISOString().split('T')[0];

    // --- GÜNCELLENMİŞ FETCH FONKSİYONU ---
    const fetchStoreOrders = useCallback(async (pageNum = 1, listType: ListType, isRefresh = false) => {
        if (!storeId) return;
        
        if (pageNum === 1 && !isRefresh) setIsLoading(true);
        if (isRefresh) setIsRefreshing(true);

        try {
            const today = getTodayDateString();
            const filters = {
                startDate: today,
                endDate: today,
                listType: listType, // Hangi tab'daysak o listType'ı gönder
                page: pageNum,
                limit: 20
            };
            
            const response = await api.getOrdersForStore(storeId, filters);
            
            if (pageNum === 1) {
                setOrders(response.data || []);
            } else {
                // Sadece mevcut tab'ın verilerini ekle
                setOrders(prevOrders => [...prevOrders, ...(response.data || [])]);
            }
            // Özet ve sayfalama verileri her zaman güncellenir
            setSummary(response.summary || null);
            setPagination(response.pagination || null);

        } catch (error) {
            console.error(`Mağaza (${storeId}) '${listType}' siparişleri çekilirken hata:`, error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [storeId]); // fetchStoreOrders artık 'listType'ı parametre alıyor

    // --- SİPARİŞ DETAYINI ÇEKME FONKSİYONU (Değişiklik yok) ---
    const fetchOrderDetail = async (packageId: string, sId: string) => {
        setIsModalLoading(true);
        setOrderDetail(null);
        try {
            const responseData = await api.getOrderDetail(sId, packageId); 
            if (responseData && responseData.success) {
                setOrderDetail(responseData.data);
            } else {
                throw new Error(responseData.error || 'Sipariş detayı alınamadı.');
            }
        } catch (error) {
            console.error(`Sipariş detayı (${packageId}) çekilirken hata:`, error);
        } finally {
            setIsModalLoading(false);
        }
    };

    // Modal için 'selectedPackageId'yi dinle (Değişiklik yok)
    useEffect(() => {
        if (selectedPackageId && storeId) {
            fetchOrderDetail(selectedPackageId, storeId);
        }
    }, [selectedPackageId, storeId]);

    // Ekrana her gelindiğinde, aktif tab'a göre verileri yeniden çek
    useFocusEffect(useCallback(() => {
        setPage(1);
        fetchStoreOrders(1, activeTab);
    }, [fetchStoreOrders, activeTab])); // Artık activeTab'a da bağlı

    // --- YENİ: TAB DEĞİŞTİRME FONKSİYONU ---
    const handleTabChange = (tab: ListType) => {
        if (tab === activeTab || isLoading) return; // Zaten o tab'daysa veya yükleniyorsa bir şey yapma
        
        setActiveTab(tab); // Yeni tab'ı ayarla
        setPage(1);         // Sayfayı sıfırla
        setOrders([]);      // Listeyi temizle (yükleniyor hissi verir)
        // fetchStoreOrders(1, tab); // 'useFocusEffect' veya 'useEffect' bunu tetiklemeli,
                                   // ama 'useFocusEffect' ekran odaklı olduğu için manuel çağırmak daha güvenli.
                                   // 'useFocusEffect' zaten 'activeTab'a bağlı olduğu için
                                   // bu çağrıya gerek kalmayabilir, ancak garanti olması için:
        fetchStoreOrders(1, tab, false); // Yenileme değil, normal yükleme
    };

    const handleRefresh = () => {
        setPage(1);
        fetchStoreOrders(1, activeTab, true); // Aktif tab için yenile
    };

    const handleLoadMore = () => {
        if (pagination && page < pagination.totalPages && !isLoading && !isRefreshing) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchStoreOrders(nextPage, activeTab); // Aktif tab için daha fazla yükle
        }
    };

    // Modal açma/kapama (Değişiklik yok)
    const handleOrderPress = (packageId: string) => {
        setSelectedPackageId(packageId);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedPackageId(null);
        setOrderDetail(null);
    };

    // Order item render (Değişiklik yok)
    const renderOrderItem = ({ item }: { item: StoreOrder }) => {
        return <OrderCard item={item} onPress={() => handleOrderPress(item._id)} />;
    };
    
    // --- YENİ: HEADER'I VE TABLARI BİRLEŞTİREN RENDER FONKSİYONU ---
    const renderListHeader = () => (
        <>
            <SummaryHeader summary={summary} onRefresh={handleRefresh} />
            <TabButtons activeTab={activeTab} onTabChange={handleTabChange} />
        </>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ title: 'Günlük Siparişler' }} />
            
            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={renderListHeader} // GÜNCELLENDİ
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={60} color="#ccc" />
                            <Text style={styles.emptyText}>
                                {activeTab === 'completed' 
                                    ? "Bugün için 'tamamlanmış' sipariş yok."
                                    : "Bugün için 'kullanılabilir' sipariş yok."}
                            </Text>
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

            <OrderDetailModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                order={orderDetail} 
                isLoading={isModalLoading}
            />
        </SafeAreaView>
    );
}

// --- YARDIMCI BİLEŞENLER ---

// 1. Özet Bilgi Kartı (Değişiklik yok)
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
    </>
);

// --- YENİ: TAB BUTONLARI BİLEŞENİ ---
const TabButtons = ({ activeTab, onTabChange }: { activeTab: ListType, onTabChange: (tab: ListType) => void }) => {
    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={[styles.tabButton, activeTab === 'completed' && styles.tabButtonActive]}
                onPress={() => onTabChange('completed')}
            >
                <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
                    Kafede
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tabButton, activeTab === 'available' && styles.tabButtonActive]}
                onPress={() => onTabChange('available')}
            >
                <Text style={[styles.tabText, activeTab === 'available' && styles.tabTextActive]}>
                    Müşteride
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// 2. Sipariş Kartı (Değişiklik yok)
const OrderCard = ({ item, onPress }: { item: StoreOrder, onPress: () => void }) => {
    const statusConfig: { [key: string]: { text: string, color: string } } = {
        PENDING_REDEEM: { text: 'Kullanılabilir', color: '#ffc107' },
        AWAITING_CONFIRMATION: { text: 'Onay Bekliyor', color: '#17a2b8' },
        PREPARING: { text: 'Hazırlanıyor', color: '#fd7e14' },
        COMPLETED: { text: 'Kullanıldı', color: '#28a745' },
        EXPIRED: { text: 'Süresi Doldu', color: '#dc3545' },
        default: { text: item.status, color: '#6c757d' }
    };
    const statusInfo = statusConfig[item.status] || statusConfig.default;

    return (
        <TouchableOpacity style={styles.orderCard} onPress={onPress}>
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

// --- STİLLER (YENİ TAB STİLLERİ EKLENDİ) ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f4f4f4' },
    container: { paddingHorizontal: 20, paddingTop: 10 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontFamily: Fonts.family.bold, fontSize: 24, marginBottom: 12 },
    summaryBox: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', padding: 20, borderRadius: 16 },
    summaryItem: { alignItems: 'center' },
    summaryValue: { fontFamily: Fonts.family.bold, fontSize: fontPixel(20), color: Colors.light.oneCo },
    summaryLabel: { fontFamily: Fonts.family.regular, fontSize: fontPixel(13), color: '#666', marginTop: 4 },
    
    // --- YENİ TAB STİLLERİ ---
    tabContainer: {
        flexDirection: 'row',
        marginTop: 24,
        marginBottom: 10,
        backgroundColor: '#e9ecef',
        borderRadius: 12,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabButtonActive: {
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    tabText: {
        fontFamily: Fonts.family.semibold,
        fontSize: 14,
        color: '#6c757d',
    },
    tabTextActive: {
        color: Colors.light.oneCo,
    },
    // --- BİTİŞ ---
    
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