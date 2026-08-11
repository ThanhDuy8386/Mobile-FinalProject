import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

const typeOptions = ['INCOME', 'EXPENSE'];
const categoryOptions = ['Food', 'Transport', 'Shopping', 'Salary', 'Other'];

const EditTransactionScreen = ({ route, navigation }) => {
    const { transaction } = route.params;

    const [title, setTitle] = useState(transaction.title);
    const [amount, setAmount] = useState(String(Math.abs(transaction.amount)));
    const [type, setType] = useState(transaction.type);
    const [category, setCategory] = useState(transaction.category || '');
    const [date, setDate] = useState(transaction.date);
    const [selectedDate, setSelectedDate] = useState(new Date(transaction.date));
    const [note, setNote] = useState(transaction.note);

    const [typeOpen, setTypeOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (pickedDate) => {
        setShowDatePicker(false);
        if (pickedDate) {
            setSelectedDate(pickedDate);
            setDate(pickedDate.toISOString().split('T')[0]);
        }
    }

    const handleUpdate = () => {
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.label}>Title</Text>
                <TextInput placeholder='Enter title' value={title} onChangeText={setTitle} style={styles.input} />
                <Text style={styles.label}>Amount</Text>
                <TextInput placeholder='0.00' value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
                <Text style={styles.label}>Type</Text>
                <TouchableOpacity onPress={() => setTypeOpen(!typeOpen)} style={styles.dropdown}>
                    <Text style={styles.dropdownText}>{type}</Text>
                    <Ionicons name={typeOpen ? 'chevron-up' : 'chevron-down'} size={18} color='#888' />
                </TouchableOpacity>
                {typeOpen && (
                    <View style={styles.dropdownList}>
                        {typeOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => {
                                    setType(option);
                                    setTypeOpen(false);
                                }}
                                style={styles.dropdownItem}
                            >
                                <Text style={styles.dropdownItemText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Category</Text>
                <TouchableOpacity
                    onPress={() => setCategoryOpen(!categoryOpen)} style={styles.dropdown}
                >
                    <Text style={styles.dropdownText}>{category || 'Select category'}</Text>
                    <Ionicons name={categoryOpen ? 'chevron-up' : 'chevron-down'} size={18} color='#888' />
                </TouchableOpacity>
                {categoryOpen && (
                    <View style={styles.dropdownList}>
                        {categoryOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => {
                                    setCategory(option);
                                    setCategoryOpen(false);
                                }}
                                style={styles.dropdownItem}
                            >
                                <Text style={styles.dropdownItemText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                <Text style={styles.label}>Trasaction Date</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dropdownText}>{date || 'Select date'}</Text>
                    <Ionicons name='calendar-outline' size={18} color='#888' />
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onValueChange={handleDateChange}
                    />
                )}
                <Text style={styles.label}>Note</Text>
                <TextInput
                    placeholder='Enter note'
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={4}
                    style={[styles.input, styles.noteInput]}
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                    <Text style={styles.saveText}>Update</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default EditTransactionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontWeight: 'bold'
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
})
