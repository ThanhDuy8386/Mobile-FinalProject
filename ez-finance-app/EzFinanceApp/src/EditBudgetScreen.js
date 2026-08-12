import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const EditBudgetScreen = ({ route, navigation }) => {
  const { budget } = route.params;

  const [expenseCategories, setExpenseCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(
    budget.category.id
  );
  const [limitAmount, setLimitAmount] = useState(
    budget.limitAmount.toString()
  );
  const [month, setMonth] = useState(
    budget.month.toString()
  );
  const [year, setYear] = useState(
    budget.year.toString()
  );

  const [showCategoryDropdown, setShowCategoryDropdown] =
    useState(false);

  const fetchExpenseCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        'http://10.0.2.2:5001/api/categories?type=EXPENSE',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setExpenseCategories(result.data);
      } else {
        Alert.alert('Error', result.message);
      }

    } catch (error) {
      console.log('Category error:', error);

      Alert.alert(
        'Error',
        'Cannot load expense categories'
      );
    }
  };

  useEffect(() => {
    fetchExpenseCategories();
  }, []);

  const handleEditBudget = async () => {
    if (!categoryId) {
      Alert.alert(
        'Warning',
        'Please select category'
      );
      return;
    }

    if (!limitAmount || Number(limitAmount) <= 0) {
      Alert.alert(
        'Warning',
        'Please enter valid limit amount'
      );
      return;
    }

    if (
      Number(month) < 1 ||
      Number(month) > 12
    ) {
      Alert.alert(
        'Warning',
        'Month must be between 1 and 12'
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      const updatedBudget = {
        categoryId,
        limitAmount: Number(limitAmount),
        month: Number(month),
        year: Number(year),
      };

      console.log('Updated budget:', updatedBudget);

      const response = await fetch(
        `http://10.0.2.2:5001/api/budgets/${budget.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedBudget),
        }
      );

      const result = await response.json();

      console.log('Update budget response:', result);

      if (result.success) {
        Alert.alert(
          'Success',
          'Budget updated successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert(
          'Update Failed',
          result.message
        );
      }

    } catch (error) {
      console.log('Update budget error:', error);

      Alert.alert(
        'Error',
        'Cannot update budget'
      );
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.label}>Category</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() =>
          setShowCategoryDropdown(!showCategoryDropdown)
        }
      >
        <Text>
          {
            expenseCategories.find(
              item => item.id === categoryId
            )?.name
          }
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


      <Text style={styles.label}>Limit Amount</Text>

      <TextInput
        style={styles.input}
        value={limitAmount}
        onChangeText={setLimitAmount}
        keyboardType="numeric"
      />


      <Text style={styles.label}>Month</Text>

      <TextInput
        style={styles.input}
        value={month}
        onChangeText={setMonth}
        keyboardType="numeric"
      />


      <Text style={styles.label}>Year</Text>

      <TextInput
        style={styles.input}
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />


      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleEditBudget}
      >
        <Text style={styles.saveButtonText}>
          Save Changes
        </Text>
      </TouchableOpacity>

    </View>
  );
};

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

export default EditBudgetScreen;