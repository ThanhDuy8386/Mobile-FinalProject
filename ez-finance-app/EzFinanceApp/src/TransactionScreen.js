import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const dummyTransactions = [
    {
        id: '1',
        title: 'August Salary',
        amount: 50000,
        type: 'INCOME',
        category: 'Salary',
        date: '2026-08-05',
        note: 'Monthly salary',
    },
    {
        id: '2',
        title: 'Lunch',
        amount: -50000,
        type: 'EXPENSE',
        category: 'Food',
        date: '2026-08-10',
        note: 'Lunch with classmates',
    },
    {
        id: '3',
        title: 'Freelance Project',
        amount: 150000,
        type: 'INCOME',
        category: 'Job',
        date: '2026-08-07',
        note: 'Website development',
    },
];

const TransactionScreen = ({ navigation }) => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [keyword, setKeyword] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>Transaction List</Text>
            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={[
                        styles.filterPill,
                        activeFilter === 'All' && styles.filterPillActive,
                    ]}
                    onPress={() => setActiveFilter('All')}>
                    <Text
                        style={
                            activeFilter === 'All'
                                ? styles.filterTextActive
                                : styles.filterText
                        }>
                        ALL
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.filterPill,
                        activeFilter === 'Income' && styles.filterPillActive,
                    ]}
                    onPress={() => setActiveFilter('Income')}>
                    <Text
                        style={
                            activeFilter === 'Income'
                                ? styles.filterTextActive
                                : styles.filterText
                        }>
                        INCOME
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.filterPill,
                        activeFilter === 'Expense' && styles.filterPillActive,
                    ]}
                    onPress={() => setActiveFilter('Expense')}>
                    <Text
                        style={
                            activeFilter === 'Expense'
                                ? styles.filterTextActive
                                : styles.filterText
                        }>
                        EXPENSE
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search" size={17} color="#999" />
                <TextInput
                    placeholder="keyword"
                    value={keyword}
                    onChangeText={setKeyword}
                    style={styles.searchInput}
                />
            </View>

            <FlatList
                data={dummyTransactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate('TransactionDetail', { transaction: item })
                        }>
                        <View style={styles.cardTopRow}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={[styles.cardAmount, { color: item.amount < 0 ? '#E53935' : '#2E9E5B' }]}>
                                {item.amount < 0 ? '-' : ''}
                                {Math.abs(item.amount).toLocaleString()}.00
                            </Text>
                        </View>
                        <View style={styles.cardBottomRow}>
                            <Text style={styles.cardType}>{item.type}</Text>
                            <Text style={styles.cardDate}>{item.date}</Text>
                        </View>
                        <Text style={styles.cardNote}>{item.note}</Text>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTransaction')}>
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
        fontWeight: 600,
        fontSize: 13,
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: 600,
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
        fontSize: 15,
        fontWeight: 'bold',
    },
    cardAmount: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    cardType: {
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
});
