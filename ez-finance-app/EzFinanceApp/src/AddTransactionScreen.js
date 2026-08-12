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

const AddTransactionScreen = ({ navigation }) => {
    const today = new Date();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('INCOME');
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(formatDate(today));
    const [selectedDate, setSelectedDate] = useState(today);
    const [note, setNote] = useState('');
    const [typeOpen, setTypeOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            setLoadingCategories(true);
            setError('');

            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) throw new Error('Please log in again to load categories.');

                const response = await fetch(`${API_BASE_URL}/categories?type=${type}`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || 'Unable to load categories.');
                }

                setCategories(result.data || []);
                setCategoryId('');
            } catch (requestError) {
                setCategories([]);
                setCategoryId('');
                setError(requestError.message || 'Unable to load categories.');
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
    }, [type]);

    const handleDateChange = (event, pickedDate) => {
        setShowDatePicker(false);
        if (pickedDate) {
            setSelectedDate(pickedDate);
            setDate(formatDate(pickedDate));
        }
    };

    const handleAdd = async () => {
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
            if (!token) throw new Error('Please log in again to add a transaction.');

            const response = await fetch(`${API_BASE_URL}/transactions`, {
                method: 'POST',
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
                    ...(note.trim() ? { note: note.trim() } : {}),
                }),
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Unable to add transaction.');
            }

            navigation.goBack();
        } catch (requestError) {
            setError(requestError.message || 'Unable to add transaction.');
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
                {typeOpen && (
                    <View style={styles.dropdownList}>
                        {typeOptions.map((option) => (
                            <TouchableOpacity key={option} onPress={() => { setType(option); setTypeOpen(false); }} style={styles.dropdownItem}>
                                <Text style={styles.dropdownItemText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Category</Text>
                <TouchableOpacity onPress={() => setCategoryOpen(!categoryOpen)} style={styles.dropdown} disabled={loadingCategories}>
                    <Text style={styles.dropdownText}>{loadingCategories ? 'Loading categories...' : (selectedCategory?.name || 'Select category')}</Text>
                    {loadingCategories ? <ActivityIndicator size="small" color="#888" /> : <Ionicons name={categoryOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#888" />}
                </TouchableOpacity>
                {categoryOpen && (
                    <View style={styles.dropdownList}>
                        {categories.length === 0 ? <Text style={styles.noCategories}>No {type.toLowerCase()} categories found.</Text> : categories.map((category) => (
                            <TouchableOpacity key={category.id} onPress={() => { setCategoryId(String(category.id)); setCategoryOpen(false); }} style={styles.dropdownItem}>
                                <Text style={styles.dropdownItemText}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Transaction Date</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dropdownText}>{date}</Text>
                    <Ionicons name="calendar-outline" size={18} color="#888" />
                </TouchableOpacity>
                {showDatePicker && <DateTimePicker value={selectedDate} mode="date" display="default" onValueChange={handleDateChange} />}

                <Text style={styles.label}>Note</Text>
                <TextInput placeholder="Enter note" value={note} onChangeText={setNote} multiline numberOfLines={4} style={[styles.input, styles.noteInput]} />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <TouchableOpacity style={styles.saveButton} onPress={handleAdd} disabled={saving}>
                    {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Add</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AddTransactionScreen;

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
    noCategories: {
        padding: 12,
        color: '#777',
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
