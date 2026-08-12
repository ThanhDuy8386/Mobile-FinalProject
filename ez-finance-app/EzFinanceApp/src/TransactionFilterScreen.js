import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5001/api';

const monthOptions = [
    {
        label: 'January',
        value: 1,
    },
    {
        label: 'February',
        value: 2,
    },
    {
        label: 'March',
        value: 3,
    },
    {
        label: 'April',
        value: 4,
    },
    {
        label: 'May',
        value: 5,
    },
    {
        label: 'June',
        value: 6,
    },
    {
        label: 'July',
        value: 7,
    },
    {
        label: 'August',
        value: 8,
    },
    {
        label: 'September',
        value: 9,
    },
    {
        label: 'October',
        value: 10,
    },
    {
        label: 'November',
        value: 11,
    },
    {
        label: 'December',
        value: 12,
    },
];

const yearOptions = Array.from({ length: 7 }, (_, index) => new Date().getFullYear() - index);

const sortByOptions = [
    {
        label: 'Transaction Date',
        value: 'transactionDate',
    },
    {
        label: 'Amount',
        value: 'amount',
    },
    {
        label: 'Created Date',
        value: 'createdAt',
    },
    {
        label: 'Title',
        value: 'title',
    },
];

const sortOrderOptions = [
    {
        label: 'Ascending',
        value: 'ASC',
    },
    {
        label: 'Descending',
        value: 'DESC',
    },
];

const TransactionFilterScreen = ({ navigation }) => {
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [keyword, setKeyword] = useState('');

    const [categoryId, setCategoryId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);

    const [startDate, setStartDate] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());

    const [endDate, setEndDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());

    const [sortBy, setSortBy] = useState('transactionDate');
    const [sortOrder, setSortOrder] = useState('DESC');

    const [categoryOpen, setCategoryOpen] = useState(false);
    const [monthOpen, setMonthOpen] = useState(false);
    const [yearOpen, setYearOpen] = useState(false);

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const [sortByOpen, setSortByOpen] = useState(false);
    const [sortOrderOpen, setSortOrderOpen] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) return;
                const query = activeFilter === 'ALL' ? '' : `?type=${activeFilter}`;
                const response = await fetch(`${API_BASE_URL}/categories${query}`, {
                    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
                });
                const result = await response.json();
                if (response.ok && result.success) setCategories(result.data || []);
            } catch (requestError) {
                // The list screen can still be used without the optional category picker.
            }
        };
        loadCategories();
        setCategoryId(null);
    }, [activeFilter]);

    const closeAllDropdowns = () => {
        setCategoryOpen(false);
        setMonthOpen(false);
        setYearOpen(false);
        setSortByOpen(false);
        setSortOrderOpen(false);
    };

    const formatDate = date => {
        const dateYear = date.getFullYear();
        const dateMonth = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${dateYear}-${dateMonth}-${day}`;
    };

    const handleStartDateChange = (event, date) => {
        setShowStartDatePicker(false);

        if (date) {
            setSelectedStartDate(date);
            setStartDate(formatDate(date));
        }
    };

    const handleEndDateChange = (event, date) => {
        setShowEndDatePicker(false);

        if (date) {
            setSelectedEndDate(date);
            setEndDate(formatDate(date));
        }
    };

    const handleFilter = () => {
        const filters = {
            type: activeFilter === 'ALL' ? undefined : activeFilter,
            categoryId: categoryId || undefined,
            month: month || undefined,
            year: year || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            keyword: keyword.trim() || undefined,
            sortBy,
            sortOrder,
        };

        navigation.navigate('TransactionList', { filters });
    };

    const selectedCategory = categories.find(
        option => option.id === categoryId,
    );

    const selectedMonth = monthOptions.find(
        option => option.value === month,
    );

    const selectedSortBy = sortByOptions.find(
        option => option.value === sortBy,
    );

    const selectedSortOrder = sortOrderOptions.find(
        option => option.value === sortOrder,
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.card}>

                <Text style={styles.label}>
                    Type
                </Text>
                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[
                            styles.filterPill,
                            activeFilter === 'ALL' &&
                            styles.filterPillActive,
                        ]}
                        onPress={() => setActiveFilter('ALL')}
                    >
                        <Text
                            style={
                                activeFilter === 'ALL'
                                    ? styles.filterTextActive
                                    : styles.filterText
                            }
                        >
                            ALL
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterPill,
                            activeFilter === 'INCOME' &&
                            styles.filterPillActive,
                        ]}
                        onPress={() => setActiveFilter('INCOME')}
                    >
                        <Text
                            style={
                                activeFilter === 'INCOME'
                                    ? styles.filterTextActive
                                    : styles.filterText
                            }
                        >
                            INCOME
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterPill,
                            activeFilter === 'EXPENSE' &&
                            styles.filterPillActive,
                        ]}
                        onPress={() => setActiveFilter('EXPENSE')}
                    >
                        <Text
                            style={
                                activeFilter === 'EXPENSE'
                                    ? styles.filterTextActive
                                    : styles.filterText
                            }
                        >
                            EXPENSE
                        </Text>
                    </TouchableOpacity>

                </View>

                <Text style={styles.label}>
                    Category
                </Text>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => {
                        const nextState = !categoryOpen;

                        closeAllDropdowns();
                        setCategoryOpen(nextState);
                    }}
                >
                    <Text style={styles.dropdownText}>
                        {selectedCategory?.name || 'All Categories'}
                    </Text>

                    <Ionicons
                        name={
                            categoryOpen
                                ? 'chevron-up'
                                : 'chevron-down'
                        }
                        size={18}
                        color="#888"
                    />
                </TouchableOpacity>

                {categoryOpen && (
                    <View style={styles.dropdownList}>

                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => {
                                setCategoryId(null);
                                setCategoryOpen(false);
                            }}
                        >
                            <Text style={styles.dropdownItemText}>
                                All Categories
                            </Text>
                        </TouchableOpacity>

                        {categories.map(option => (
                            <TouchableOpacity
                                key={option.id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setCategoryId(option.id);
                                    setCategoryOpen(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>
                                    {option.name}
                                </Text>
                            </TouchableOpacity>
                        ))}

                    </View>
                )}

                <Text style={styles.label}>
                    Month
                </Text>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => {
                        const nextState = !monthOpen;

                        closeAllDropdowns();
                        setMonthOpen(nextState);
                    }}
                >
                    <Text style={styles.dropdownText}>
                        {selectedMonth?.label || 'All Months'}
                    </Text>

                    <Ionicons
                        name={
                            monthOpen
                                ? 'chevron-up'
                                : 'chevron-down'
                        }
                        size={18}
                        color="#888"
                    />
                </TouchableOpacity>

                {monthOpen && (
                    <View style={styles.dropdownList}>

                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => {
                                setMonth(null);
                                setMonthOpen(false);
                            }}
                        >
                            <Text style={styles.dropdownItemText}>
                                All Months
                            </Text>
                        </TouchableOpacity>

                        {monthOptions.map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setMonth(option.value);
                                    setMonthOpen(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}

                    </View>
                )}

                <Text style={styles.label}>
                    Year
                </Text>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => {
                        const nextState = !yearOpen;

                        closeAllDropdowns();
                        setYearOpen(nextState);
                    }}
                >
                    <Text style={styles.dropdownText}>
                        {year || 'All Years'}
                    </Text>

                    <Ionicons
                        name={
                            yearOpen
                                ? 'chevron-up'
                                : 'chevron-down'
                        }
                        size={18}
                        color="#888"
                    />
                </TouchableOpacity>

                {yearOpen && (
                    <View style={styles.dropdownList}>

                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => {
                                setYear(null);
                                setYearOpen(false);
                            }}
                        >
                            <Text style={styles.dropdownItemText}>
                                All Years
                            </Text>
                        </TouchableOpacity>

                        {yearOptions.map(option => (
                            <TouchableOpacity
                                key={option}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setYear(option);
                                    setYearOpen(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}

                    </View>
                )}

                <Text style={styles.label}>
                    Start Date
                </Text>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => {
                        closeAllDropdowns();
                        setShowStartDatePicker(true);
                    }}
                >
                    <Text style={styles.dropdownText}>
                        {startDate || 'Select Start Date'}
                    </Text>

                    <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#888"
                    />
                </TouchableOpacity>

                {showStartDatePicker && (
                    <DateTimePicker
                        value={selectedStartDate}
                        mode="date"
                        display="default"
                        onValueChange={handleStartDateChange}
                    />
                )}

                <Text style={styles.label}>
                    End Date
                </Text>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => {
                        closeAllDropdowns();
                        setShowEndDatePicker(true);
                    }}
                >
                    <Text style={styles.dropdownText}>
                        {endDate || 'Select End Date'}
                    </Text>

                    <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#888"
                    />
                </TouchableOpacity>

                {showEndDatePicker && (
                    <DateTimePicker
                        value={selectedEndDate}
                        mode="date"
                        display="default"
                        onValueChange={handleEndDateChange}
                    />
                )}

                <Text style={styles.label}>
                    Keyword
                </Text>
                <View style={styles.searchBar}>
                    <Ionicons
                        name="search"
                        size={18}
                        color="#999"
                    />

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search transactions"
                        placeholderTextColor="#999"
                        value={keyword}
                        onChangeText={setKeyword}
                    />
                </View>

                <Text style={styles.label}>
                    Sort By
                </Text>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => {
                        const nextState = !sortByOpen;

                        closeAllDropdowns();
                        setSortByOpen(nextState);
                    }}
                >
                    <Text style={styles.dropdownText}>
                        {selectedSortBy?.label || 'Transaction Date'}
                    </Text>

                    <Ionicons
                        name={
                            sortByOpen
                                ? 'chevron-up'
                                : 'chevron-down'
                        }
                        size={18}
                        color="#888"
                    />
                </TouchableOpacity>

                {sortByOpen && (
                    <View style={styles.dropdownList}>

                        {sortByOptions.map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSortBy(option.value);
                                    setSortByOpen(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}

                    </View>
                )}

                <Text style={styles.label}>
                    Sort Order
                </Text>

                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => {
                        const nextState = !sortOrderOpen;

                        closeAllDropdowns();
                        setSortOrderOpen(nextState);
                    }}
                >
                    <Text style={styles.dropdownText}>
                        {selectedSortOrder?.label || 'Descending'}
                    </Text>

                    <Ionicons
                        name={
                            sortOrderOpen
                                ? 'chevron-up'
                                : 'chevron-down'
                        }
                        size={18}
                        color="#888"
                    />
                </TouchableOpacity>

                {sortOrderOpen && (
                    <View style={styles.dropdownList}>

                        {sortOrderOptions.map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSortOrder(option.value);
                                    setSortOrderOpen(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}

                    </View>
                )}

                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={handleFilter}
                >
                    <Ionicons
                        name="filter-outline"
                        size={18}
                        color="#fff"
                    />

                    <Text style={styles.applyFilterText}>
                        Apply Filter
                    </Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
};

export default TransactionFilterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        borderWidth: 1,
        borderColor: '#c0c0c0',
        borderRadius: 12,
        padding: 12,
    },
    label: {
        fontSize: 15,
        marginBottom: 6,
        marginTop: 14,
        fontWeight: 'bold',
        color: '#222',
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
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
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 14,
        backgroundColor: '#fff',
    },
    dropdownText: {
        fontSize: 15,
        color: '#333',
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginTop: 4,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#333',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 48,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: '#333',
    },
    applyButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1569FF',
        padding: 16,
        borderRadius: 12,
        marginTop: 24,
    },
    applyFilterText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
});
