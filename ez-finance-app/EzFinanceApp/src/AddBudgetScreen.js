import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const AddBudgetScreen = () => {
  const [categoryId, setCategoryId] = useState(null);
  const [limitAmount, setLimitAmount] = useState('');
  const [month, setMonth] = useState('8');
  const [year, setYear] = useState('2026');

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleAddBudget = () => {
    const newBudget = {
      categoryId: categoryId,
      limitAmount: Number(limitAmount),
      month: Number(month),
      year: Number(year),
    };

    console.log(newBudget);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>categoryId</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() =>
          setShowCategoryDropdown(!showCategoryDropdown)
        }
      >
        <Text>
          {categoryId
            ? expenseCategories.find(
                item => item.id === categoryId
              )?.name
            : 'Select category'}
        </Text>

        <Text>▼</Text>
      </TouchableOpacity>

      {showCategoryDropdown && (
        <View style={styles.dropdown}>
          {expenseCategories.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.dropdownItem}
              onPress={() => {
                setCategoryId(item.id);
                setShowCategoryDropdown(false);
              }}
            >
              <Text>
                {item.id} - {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>limitAmount</Text>

      <TextInput
        style={styles.input}
        placeholder="0.00"
        value={limitAmount}
        onChangeText={setLimitAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>month</Text>

      <TextInput
        style={styles.input}
        value={month}
        onChangeText={setMonth}
        keyboardType="numeric"
      />

      <Text style={styles.label}>year</Text>

      <TextInput
        style={styles.input}
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleAddBudget}
      >
        <Text style={styles.saveButtonText}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const expenseCategories = [
  {
    id: 1,
    name: 'Food',
  },
  {
    id: 5,
    name: 'Transport',
  },
  {
    id: 7,
    name: 'Shopping',
  },
  {
    id: 8,
    name: 'Entertainment',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },

  label: {
    fontSize: 13,
    color: 'gray',
    marginBottom: 6,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 18,
  },

  dropdownButton: {
    height: 46,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 18,
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  saveButton: {
    backgroundColor: '#1569FF',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },

  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddBudgetScreen;