import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const API_BASE_URL = 'http://10.0.2.2:5001/api';

const FILTERS = [
    { label: 'ALL', value: 'ALL' },
    { label: 'INCOME', value: 'INCOME' },
    { label: 'EXPENSE', value: 'EXPENSE' },
];

const formatAmount = (amount) => {
    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
        return '0.00';
    }

    return Math.abs(numericAmount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const TransactionScreen = ({ navigation, route }) => {
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [searchText, setSearchText] = useState('');
    const [keyword, setKeyword] = useState('');
    const [advancedFilters, setAdvancedFilters] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const nextFilters = route.params?.filters;
        if (!nextFilters) return;

        setAdvancedFilters(nextFilters);
        setActiveFilter(nextFilters.type || 'ALL');
        setKeyword(nextFilters.keyword || '');
        setSearchText(nextFilters.keyword || '');
        navigation.setParams({ filters: undefined });
    }, [navigation, route.params?.filters]);

    const fetchTransactions = useCallback(async (page = 1, append = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setRefreshing(true);
            setLoading(true);
        }
        setError('');

        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                throw new Error('Please log in again to view your transactions.');
            }

            const query = [
                `page=${page}`,
                'limit=10',
                'sortBy=transactionDate',
                'sortOrder=DESC',
            ];

            if (activeFilter !== 'ALL') query.push(`type=${activeFilter}`);
            if (keyword) query.push(`keyword=${encodeURIComponent(keyword)}`);
            if (advancedFilters.categoryId) query.push(`categoryId=${advancedFilters.categoryId}`);
            if (advancedFilters.month) query.push(`month=${advancedFilters.month}`);
            if (advancedFilters.year) query.push(`year=${advancedFilters.year}`);
            if (advancedFilters.startDate) query.push(`startDate=${advancedFilters.startDate}`);
            if (advancedFilters.endDate) query.push(`endDate=${advancedFilters.endDate}`);
            if (advancedFilters.sortBy) query.push(`sortBy=${advancedFilters.sortBy}`);
            if (advancedFilters.sortOrder) query.push(`sortOrder=${advancedFilters.sortOrder}`);

            const response = await fetch(`${API_BASE_URL}/transactions?${query.join('&')}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Unable to load transactions.');
            }

            setTransactions((current) => (
                append ? [...current, ...(result.data || [])] : (result.data || [])
            ));
            setPagination(result.pagination || null);
        } catch (requestError) {
            setError(requestError.message || 'Unable to load transactions.');
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    }, [activeFilter, advancedFilters, keyword]);

    useFocusEffect(
        useCallback(() => {
            fetchTransactions();
        }, [fetchTransactions]),
    );

    const handleRefresh = () => fetchTransactions();

    const handleLoadMore = () => {
        if (
            !loading
            && !refreshing
            && !loadingMore
            && pagination
            && pagination.page < pagination.totalPages
        ) {
            fetchTransactions(pagination.page + 1, true);
        }
    };

    const renderTransaction = ({ item }) => {
        const isExpense = item.type === 'EXPENSE';
        const categoryName = item.category?.name || 'Uncategorized';

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
            >
                <View style={styles.cardTopRow}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text
                        style={[
                            styles.cardAmount,
                            isExpense ? styles.cardAmountExpense : styles.cardAmountIncome,
                        ]}
                    >
                        {isExpense ? '-' : '+'}
                        {formatAmount(item.amount)}
                    </Text>
                </View>
                <View style={styles.cardBottomRow}>
                    <Text style={styles.cardType}>
                        {categoryName} · {item.type}
                    </Text>
                    <Text style={styles.cardDate}>{item.transactionDate}</Text>
                </View>
                {item.note ? <Text style={styles.cardNote}>{item.note}</Text> : null}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>Transaction List</Text>
            <View style={styles.filterRow}>
                {FILTERS.map((filter) => (
                    <TouchableOpacity
                        key={filter.value}
                        style={[
                            styles.filterPill,
                            activeFilter === filter.value && styles.filterPillActive,
                        ]}
                        onPress={() => {
                            setActiveFilter(filter.value);
                            setAdvancedFilters((current) => ({
                                ...current,
                                type: filter.value === 'ALL' ? undefined : filter.value,
                            }));
                        }}
                    >
                        <Text
                            style={
                                activeFilter === filter.value
                                    ? styles.filterTextActive
                                    : styles.filterText
                            }
                        >
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    onPress={() => navigation.navigate('TransactionFilter')}
                    style={styles.filterButton}
                >
                    <Ionicons name="options-outline" size={20} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search" size={17} color="#999" />
                <TextInput
                    placeholder="Search transactions"
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={() => setKeyword(searchText.trim())}
                    returnKeyType="search"
                    style={styles.searchInput}
                />
            </View>

            {error && transactions.length === 0 ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : loading ? (
                <View style={styles.messageContainer}>
                    <ActivityIndicator size="large" color="#1569FF" />
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderTransaction}
                    refreshControl={(
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    )}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.4}
                    ListEmptyComponent={(
                        <View style={styles.messageContainer}>
                            <Text style={styles.emptyText}>No transactions found.</Text>
                        </View>
                    )}
                    ListFooterComponent={loadingMore ? (
                        <ActivityIndicator style={styles.footerLoader} color="#1569FF" />
                    ) : null}
                />
            )}

            {error && transactions.length > 0 ? (
                <Text style={styles.inlineError}>{error}</Text>
            ) : null}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddTransaction')}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default TransactionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    filterPill: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    filterPillActive: {
        backgroundColor: '#065EE3',
        borderColor: '#065EE3',
    },
    filterText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 13,
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        marginLeft: 8,
        fontSize: 15,
    },
    card: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    cardTitle: {
        flex: 1,
        marginRight: 8,
        fontSize: 15,
        fontWeight: 'bold',
    },
    cardAmount: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    cardAmountIncome: {
        color: '#2E9E5B',
    },
    cardAmountExpense: {
        color: '#E53935',
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    cardType: {
        flex: 1,
        marginRight: 8,
        fontSize: 12,
        color: '#888',
    },
    cardDate: {
        fontSize: 12,
        color: '#888',
    },
    cardNote: {
        fontSize: 13,
        color: '#555',
    },
    messageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyText: {
        color: '#777',
        fontSize: 15,
    },
    errorText: {
        color: '#C62828',
        textAlign: 'center',
        marginBottom: 12,
    },
    inlineError: {
        color: '#C62828',
        textAlign: 'center',
        marginTop: 8,
    },
    retryButton: {
        borderRadius: 8,
        backgroundColor: '#1569FF',
        paddingVertical: 9,
        paddingHorizontal: 18,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
    },
    footerLoader: {
        marginVertical: 12,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1569FF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DDD',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
});
