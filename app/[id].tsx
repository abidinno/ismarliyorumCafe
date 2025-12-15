import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useFocusEffect, useRouter } from 'expo-router';

import { api } from '@/services/api';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { fontPixel, widthPixel } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '@/utils/imageHelper';
import OrderDetailModal, { BackendOrderDetail } from '@/components/orders/OrderDetailModal';

// --- TİP TANIMLAMALARI ---
type ListType = 'available' | 'completed';
type TimeFilterType = 'daily' | 'weekly' | 'monthly' | 'general';

interface StoreOrderItem {
    name: string;
    quantity: number;
    variant: string;
    extras?: string;
    image: string | null;
}

interface StoreOrder {
    _id: string;
    orderCode: string;
    createdAt: string;
    status: string;
    totalPrice: number;
    recipient: {
        name: string;
        phone: string;
    };
    items: StoreOrderItem[];
}

interface SummaryData {
    totalRevenue: number;
    totalOrders: number;
    completedOrders: number;
}

interface PaginationData {
    totalPages: number;
    total: number;
    limit: number;
    currentPage: number;
}

// --- ANA EKRAN BİLEŞENİ ---
export default function StoreOrdersScreen() {
    const { id: storeId } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    
    // STATE'LER
    const [activeTab, setActiveTab] = useState<ListType>('completed');
    const [timeFilter, setTimeFilter] = useState<TimeFilterType>('daily');

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

    // --- VERİ ÇEKME FONKSİYONU ---
    const fetchStoreOrders = useCallback(async (pageNum: number, currentTab: ListType, currentTime: TimeFilterType, isRefresh = false) => {
        if (!storeId) return;
        
        if (pageNum === 1 && !isRefresh) setIsLoading(true);
        if (isRefresh) setIsRefreshing(true);

        try {
            const filters = {
                listType: currentTab,
                timeFilter: currentTime,
                page: pageNum,
                limit: 20
            };
            
            const response = await api.getOrdersForStore(storeId, filters);
            
            // Backend'den gelen veri kontrolü
            const incomingOrders = response.data || [];

            if (pageNum === 1) {
                setOrders(incomingOrders);
            } else {
                setOrders(prevOrders => [...prevOrders, ...incomingOrders]);
            }
            
            setSummary(response.summary || null);
            setPagination(response.pagination || null);

        } catch (error) {
            console.error(`Siparişler çekilirken hata:`, error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [storeId]);

    // --- EFFECTLER ---
    useEffect(() => {
        fetchStoreOrders(page, activeTab, timeFilter);
    }, [page, activeTab, timeFilter]); 

    useFocusEffect(useCallback(() => {
        fetchStoreOrders(1, activeTab, timeFilter, true); 
    }, [activeTab, timeFilter]));

    // --- HANDLERS ---
    const handleTabChange = (tab: ListType) => {
        if (tab === activeTab) return;
        setOrders([]); 
        setPage(1);
        setActiveTab(tab);
    };

    const handleTimeFilterChange = (filter: TimeFilterType) => {
        if (filter === timeFilter) return;
        setOrders([]); 
        setPage(1);
        setTimeFilter(filter);
    };

    const handleRefresh = () => {
        setPage(1);
        fetchStoreOrders(1, activeTab, timeFilter, true);
    };

    const handleLoadMore = () => {
        if (pagination && page < pagination.totalPages && !isLoading && !isRefreshing) {
            setPage(prev => prev + 1);
        }
    };

    // Modal İşlemleri
    const handleOrderPress = (packageId: string) => {
        setSelectedPackageId(packageId);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedPackageId(null);
        setOrderDetail(null);
    };
    
    useEffect(() => {
        if (selectedPackageId && storeId) {
            const loadDetail = async () => {
                setIsModalLoading(true);
                try {
                    const res = await api.getOrderDetail(storeId, selectedPackageId);
                    if(res.success) setOrderDetail(res.data);
                } catch(e) { console.error(e); }
                finally { setIsModalLoading(false); }
            };
            loadDetail();
        }
    }, [selectedPackageId, storeId]);


    // --- RENDER HEADER ---
    const renderListHeader = () => (
        <View style={styles.headerContainer}>
            <TimeFilterButtons activeFilter={timeFilter} onChange={handleTimeFilterChange} />
            <SummaryHeader summary={summary} timeFilter={timeFilter} onRefresh={handleRefresh} />
            <TabButtons activeTab={activeTab} onTabChange={handleTabChange} />
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen 
                options={{ 
                    title: 'Sipariş Yönetimi', 
                    headerShadowVisible: false, 
                    headerStyle: { backgroundColor: '#f4f4f4' },
                    headerLeft: () => (
                        <TouchableOpacity 
                            onPress={() => router.replace('/(tabs)')} 
                            style={{ marginRight: 15, padding: 5 }}
                        >
                            <Ionicons name="home" size={24} color="#333" />
                        </TouchableOpacity>
                    ),
                }} 
            />
            
            <FlatList
                data={orders}
                renderItem={({ item }) => <OrderCard item={item} onPress={() => handleOrderPress(item._id)} />}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={renderListHeader}
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={60} color="#ccc" />
                            <Text style={styles.emptyText}>Bu kriterlere uygun sipariş bulunamadı.</Text>
                        </View>
                    ) : null
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isLoading && page > 1 ? <ActivityIndicator style={{ marginVertical: 20 }} /> : <View style={{height: 20}}/>}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={Colors.light.oneCo} />
                }
                contentContainerStyle={styles.listContent}
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

// --- ALT BİLEŞENLER ---

const TimeFilterButtons = ({ activeFilter, onChange }: { activeFilter: TimeFilterType, onChange: (f: TimeFilterType) => void }) => {
    const filters: { key: TimeFilterType, label: string }[] = [
        { key: 'daily', label: 'Günlük' },
        { key: 'weekly', label: 'Haftalık' },
        { key: 'monthly', label: 'Aylık' },
        { key: 'general', label: 'Tümü' },
    ];

    return (
        <View style={styles.timeFilterContainer}>
            {filters.map((f) => (
                <TouchableOpacity
                    key={f.key}
                    style={[styles.timeButton, activeFilter === f.key && styles.timeButtonActive]}
                    onPress={() => onChange(f.key)}
                >
                    <Text style={[styles.timeButtonText, activeFilter === f.key && styles.timeButtonTextActive]}>
                        {f.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const SummaryHeader = ({ summary, timeFilter, onRefresh }: { summary: SummaryData | null, timeFilter: TimeFilterType, onRefresh: () => void }) => {
    const getTitle = () => {
        switch(timeFilter) {
            case 'daily': return "Bugünün Özeti";
            case 'weekly': return "Bu Haftanın Özeti";
            case 'monthly': return "Bu Ayın Özeti";
            default: return "Genel Özet";
        }
    };

    return (
        <View style={styles.summaryContainer}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>{getTitle()}</Text>
                <TouchableOpacity onPress={onRefresh} style={{ padding: 4 }}>
                    <Ionicons name="refresh" size={20} color={Colors.light.oneCo} />
                </TouchableOpacity>
            </View>
            <View style={styles.summaryBox}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>₺{(summary?.totalRevenue || 0).toFixed(2)}</Text>
                    <Text style={styles.summaryLabel}>Ciro</Text>
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{summary?.completedOrders || 0}</Text>
                    <Text style={styles.summaryLabel}>Tamamlanan</Text>
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{summary?.totalOrders || 0}</Text>
                    <Text style={styles.summaryLabel}>Toplam</Text>
                </View>
            </View>
        </View>
    );
};

const TabButtons = ({ activeTab, onTabChange }: { activeTab: ListType, onTabChange: (tab: ListType) => void }) => (
    <View style={styles.tabContainer}>
        <TouchableOpacity
            style={[styles.tabButton, activeTab === 'completed' && styles.tabButtonActive]}
            onPress={() => onTabChange('completed')}
        >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>Kafede (Geçmiş)</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.tabButton, activeTab === 'available' && styles.tabButtonActive]}
            onPress={() => onTabChange('available')}
        >
            <Text style={[styles.tabText, activeTab === 'available' && styles.tabTextActive]}>Müşteride (Aktif)</Text>
        </TouchableOpacity>
    </View>
);

// --- DÜZELTİLEN BİLEŞEN: ORDER CARD ---
const OrderCard = ({ item, onPress }: { item: StoreOrder, onPress: () => void }) => {
    const statusConfig: { [key: string]: { text: string, color: string, bg: string } } = {
        PENDING_REDEEM: { text: 'Kullanılabilir', color: '#b45309', bg: '#fffbeb' },
        AWAITING_CONFIRMATION: { text: 'Onay Bekliyor', color: '#0f766e', bg: '#ccfbf1' },
        COMPLETED: { text: 'Tamamlandı', color: '#15803d', bg: '#dcfce7' },
        EXPIRED: { text: 'Süresi Doldu', color: '#b91c1c', bg: '#fee2e2' },
        CANCELLED: { text: 'İptal', color: '#b91c1c', bg: '#fee2e2' },
        PENDING_PAYMENT: { text: 'Ödeme Bekleniyor', color: '#6366f1', bg: '#e0e7ff' },
        default: { text: item.status, color: '#374151', bg: '#f3f4f6' }
    };
    const status = statusConfig[item.status] || statusConfig.default;

    // items dizisini güvenli bir şekilde al
    const safeItems = item.items || [];
    const firstProduct = safeItems.length > 0 ? safeItems[0] : null;
    const productImage = firstProduct?.image || null;
    
    // Diğer ürün sayısı (Güvenli Hesaplama)
    const moreCount = safeItems.length > 1 ? safeItems.length - 1 : 0;

    return (
        <TouchableOpacity style={styles.orderCard} onPress={onPress}>
            <View style={styles.cardHeader}>
                {/* 1. Ürün Resmi */}
                <View style={styles.productInfoContainer}>
                    {productImage ? (
                        <Image source={getImageUrl(productImage)} style={styles.productImage} />
                    ) : (
                        <View style={[styles.productImage, { backgroundColor: '#f0f0f0', justifyContent:'center', alignItems:'center' }]}>
                             <Ionicons name="cafe-outline" size={20} color="#ccc" />
                        </View>
                    )}
                    
                    {/* 2. Sipariş Detayları */}
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        {/* Müşteri Adı */}
                        <Text style={styles.customerName}>{item.recipient?.name || 'Misafir'}</Text>
                        
                        {/* Ürün Detayı: 2x Latte (Grande) */}
                        {firstProduct ? (
                            <View>
                                <Text style={styles.productNameText} numberOfLines={1}>
                                    <Text style={{fontWeight: 'bold', color: Colors.light.oneCo}}>{firstProduct.quantity}x</Text> {firstProduct.name} 
                                    <Text style={{fontSize: 12, color: '#666'}}> ({firstProduct.variant})</Text>
                                    {moreCount > 0 && <Text style={{fontSize: 12, color: Colors.light.oneCo}}> +{moreCount} diğer</Text>}
                                </Text>
                                
                                {/* Extralar varsa altında gri olarak göster */}
                                {firstProduct.extras && (
                                    <Text style={styles.extrasText} numberOfLines={1}>
                                        + {firstProduct.extras}
                                    </Text>
                                )}
                            </View>
                        ) : (
                            <Text style={styles.productNameText}>Ürün bilgisi yok</Text>
                        )}
                        
                        {/* Tarih */}
                        <Text style={styles.dateText}>
                            {new Date(item.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                        </Text>
                    </View>
                </View>

                {/* 3. Fiyat */}
                <Text style={styles.priceText}>₺{(item.totalPrice || 0).toFixed(2)}</Text>
            </View>
            
            {/* 4. Alt Bilgi (ID ve Durum) */}
            <View style={styles.cardFooter}>
                <Text style={styles.orderId}>#{item.orderCode ? item.orderCode.toUpperCase() : '---'}</Text>
                
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// --- STİLLER ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f4f4f4' },
    listContent: { paddingHorizontal: 20, paddingBottom: 30 },
    headerContainer: { marginBottom: 10, paddingTop: 10 },
    
    // Zaman Filtresi
    timeFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
    },
    timeButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
    timeButtonActive: { backgroundColor: Colors.light.oneCo },
    timeButtonText: { fontFamily: Fonts.family.regular, fontSize: fontPixel(13), color: '#666' },
    timeButtonTextActive: { color: '#fff', fontFamily: Fonts.family.bold },

    // Özet Alanı
    summaryContainer: { marginBottom: 16 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 4 },
    headerTitle: { fontFamily: Fonts.family.bold, fontSize: fontPixel(18), color: '#333' },
    summaryBox: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: 'white', 
        paddingVertical: 20, 
        paddingHorizontal: 10,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    summaryItem: { alignItems: 'center', flex: 1 },
    summaryValue: { fontFamily: Fonts.family.bold, fontSize: fontPixel(18), color: Colors.light.oneCo },
    summaryLabel: { fontFamily: Fonts.family.regular, fontSize: fontPixel(12), color: '#888', marginTop: 4 },
    verticalLine: { width: 1, height: '70%', backgroundColor: '#eee' },

    // Tablar
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#e9ecef',
        borderRadius: 12,
        padding: 4,
        marginBottom: 8,
    },
    tabButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    tabButtonActive: {
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: { fontFamily: Fonts.family.semibold, fontSize: fontPixel(13), color: '#6c757d' },
    tabTextActive: { color: Colors.light.oneCo },

    // Sipariş Kartı
    orderCard: { 
        backgroundColor: 'white', 
        padding: 16, 
        borderRadius: 16, 
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    productInfoContainer: { flexDirection: 'row', flex: 1, marginRight: 10 },
    productImage: { width: 48, height: 48, borderRadius: 10, marginRight: 12, resizeMode: 'cover' }, // Biraz büyüttük
    customerName: { fontFamily: Fonts.family.bold, fontSize: fontPixel(14), color: '#111', marginBottom: 2 },
    productNameText: { fontFamily: Fonts.family.regular, fontSize: fontPixel(13), color: '#333' },
    extrasText: { fontFamily: Fonts.family.regular, fontSize: fontPixel(11), color: '#888', marginTop: 2 },
    dateText: { fontFamily: Fonts.family.regular, fontSize: fontPixel(11), color: '#999', marginTop: 4 },
    priceText: { fontFamily: Fonts.family.bold, fontSize: fontPixel(16), color: Colors.light.oneCo },
    
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f8f8f8', paddingTop: 10 },
    orderId: { fontFamily: Fonts.family.regular, fontSize: fontPixel(12), color: '#9ca3af', letterSpacing: 0.5 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    statusText: { fontFamily: Fonts.family.bold, fontSize: fontPixel(11) },

    // Boş Durum
    emptyContainer: { alignItems: 'center', marginTop: 60 },
    emptyText: { fontFamily: Fonts.family.regular, fontSize: fontPixel(14), color: '#999', marginTop: 12 },
});