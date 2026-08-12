import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_BASE_URL = 'http://10.0.2.2:5001/api';
const typeOptions = ['INCOME', 'EXPENSE'];
const formatDate = (value) => value.toISOString().split('T')[0];

const EditTransactionScreen = ({ route, navigation }) => {
    const { transaction } = route.params;
    const initialDate = transaction.transactionDate || transaction.date;
    const initialCategoryId = transaction.category?.id || transaction.categoryId;

    const [title, setTitle] = useState(transaction.title || '');
    const [amount, setAmount] = useState(String(Math.abs(Number(transaction.amount || 0))));
    const [type, setType] = useState(transaction.type);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(initialCategoryId ? String(initialCategoryId) : '');
    const [date, setDate] = useState(initialDate || formatDate(new Date()));
    const [selectedDate, setSelectedDate] = useState(new Date(initialDate || Date.now()));
    const [note, setNote] = useState(transaction.note || '');
    const [typeOpen, setTypeOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            setLoadingCategories(true);
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) throw new Error('Please log in again to load categories.');
                const response = await fetch(`${API_BASE_URL}/categories?type=${type}`, {
                    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
                });
                const result = await response.json();
                if (!response.ok || !result.success) throw new Error(result.message || 'Unable to load categories.');
                setCategories(result.data || []);
                if (!result.data?.some((category) => String(category.id) === String(categoryId))) {
                    setCategoryId('');
                }
            } catch (requestError) {
                setError(requestError.message || 'Unable to load categories.');
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, [categoryId, type]);

    const handleDateChange = (event, pickedDate) => {
        setShowDatePicker(false);
        if (pickedDate) {
            setSelectedDate(pickedDate);
            setDate(formatDate(pickedDate));
        }
    };

    const handleUpdate = async () => {
        const numericAmount = Number(amount);
        if (!title.trim() || !amount.trim() || !categoryId || !date) {
            setError('Title, amount, category, and date are required.');
            return;
        }
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            setError('Amount must be a positive number.');
            return;
        }

        setSaving(true);
        setError('');
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Please log in again to update this transaction.');
            const response = await fetch(`${API_BASE_URL}/transactions/${transaction.id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title.trim(),
                    amount: numericAmount,
                    type,
                    categoryId: Number(categoryId),
                    transactionDate: date,
                    note: note.trim() || null,
                }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || 'Unable to update transaction.');
            navigation.goBack();
        } catch (requestError) {
            setError(requestError.message || 'Unable to update transaction.');
        } finally {
            setSaving(false);
        }
    };

    const selectedCategory = categories.find((category) => String(category.id) === String(categoryId));

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
                <Text style={styles.label}>Title</Text>
                <TextInput placeholder="Enter title" value={title} onChangeText={setTitle} style={styles.input} />
                <Text style={styles.label}>Amount</Text>
                <TextInput placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={styles.input} />
                <Text style={styles.label}>Type</Text>
                <TouchableOpacity onPress={() => setTypeOpen(!typeOpen)} style={styles.dropdown}>
                    <Text style={styles.dropdownText}>{type}</Text>
                    <Ionicons name={typeOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#888" />
                </TouchableOpacity>
                {typeOpen && <View style={styles.dropdownList}>{typeOptions.map((option) => <TouchableOpacity key={option} onPress={() => { setType(option); setTypeOpen(false); }} style={styles.dropdownItem}><Text style={styles.dropdownItemText}>{option}</Text></TouchableOpacity>)}</View>}
                <Text style={styles.label}>Category</Text>
                <TouchableOpacity onPress={() => setCategoryOpen(!categoryOpen)} style={styles.dropdown} disabled={loadingCategories}>
                    <Text style={styles.dropdownText}>{loadingCategories ? 'Loading categories...' : (selectedCategory?.name || 'Select category')}</Text>
                    {loadingCategories ? <ActivityIndicator size="small" color="#888" /> : <Ionicons name={categoryOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#888" />}
                </TouchableOpacity>
                {categoryOpen && <View style={styles.dropdownList}>{categories.map((category) => <TouchableOpacity key={category.id} onPress={() => { setCategoryId(String(category.id)); setCategoryOpen(false); }} style={styles.dropdownItem}><Text style={styles.dropdownItemText}>{category.name}</Text></TouchableOpacity>)}</View>}
                <Text style={styles.label}>Transaction Date</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowDatePicker(true)}><Text style={styles.dropdownText}>{date}</Text><Ionicons name="calendar-outline" size={18} color="#888" /></TouchableOpacity>
                {showDatePicker && <DateTimePicker value={selectedDate} mode="date" display="default" onValueChange={handleDateChange} />}
                <Text style={styles.label}>Note</Text>
                <TextInput placeholder="Enter note" value={note} onChangeText={setNote} multiline numberOfLines={4} style={[styles.input, styles.noteInput]} />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={saving}><Text style={styles.saveText}>{saving ? 'Saving...' : 'Update'}</Text></TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default EditTransactionScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    card: {
        borderWidth: 1,
        borderColor: '#c0c0c0',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        marginBottom: 6,
        marginTop: 14,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 14,
        fontSize: 15,
    },
    noteInput: {
        height: 90,
        textAlignVertical: 'top',
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 14,
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
    errorText: {
        color: '#C62828',
        marginTop: 14,
    },
    saveButton: {
        backgroundColor: '#1569FF',
        padding: 16,
        borderRadius: 12,
        marginTop: 24,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
