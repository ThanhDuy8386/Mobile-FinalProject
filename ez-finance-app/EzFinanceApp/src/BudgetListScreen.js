import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
const BudgetListScreen = ({ navigation }) => {
  const currentDate = new Date();
  const [budgetData, setBudgetData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const formatMoney = (amount) => {
    return Number(amount).toFixed(2);
  };

  const fetchBudgets = async (month, year) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        `http://10.0.2.2:5001/api/budgets?month=${month}&year=${year}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      console.log('Budget response:', result);

      if (result.success) {
        setBudgetData(result.data);
      } else {
        Alert.alert(
          'Error',
          result.message
        );
      }

    } catch (error) {
      console.log('Budget error:', error);

      Alert.alert(
        'Error',
        'Cannot load budgets'
      );
    }
  };

  useEffect(() => {
    fetchBudgets(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const goToPreviousYear = () => {
    setSelectedYear(selectedYear - 1);
  };

  const goToNextYear = () => {
    setSelectedYear(selectedYear + 1);
  };

  const renderBudget = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.budgetCard}
        onPress={() =>
          navigation.navigate('BudgetDetailScreen', {
            budget: item,
          })
        }
      >

        <View style={styles.topRow}>
          <Text style={styles.categoryText}>
            {item.category.name}
          </Text>

          <Text style={styles.monthText}>
            Month: {item.month} Year: {item.year}
          </Text>
        </View>


        <View style={styles.infoRow}>
          <Text style={styles.label}>Limit Amount</Text>

          <Text style={styles.value}>
            {formatMoney(item.limitAmount)}
          </Text>
        </View>


        <View style={styles.infoRow}>
          <Text style={styles.label}>Spent Amount</Text>

          <Text style={styles.value}>
            {formatMoney(item.spentAmount)}
          </Text>
        </View>


        <View style={styles.infoRow}>
          <Text style={styles.label}>Remaining Amount</Text>

          <Text
            style={[
              styles.value,
              item.isExceeded && styles.exceededText,
            ]}
          >
            {formatMoney(item.remainingAmount)}
          </Text>
        </View>


        <View style={styles.infoRow}>
          <Text style={styles.label}>Percentage</Text>

          <Text
            style={[
              styles.percentageText,
              item.isExceeded
                ? styles.exceededText
                : styles.normalText,
            ]}
          >
            {item.percentage}%
          </Text>
        </View>


        <View style={styles.infoRow}>
          <Text style={styles.label}>Is Exceeded</Text>

          <Text
            style={[
              styles.value,
              item.isExceeded
                ? styles.exceededText
                : styles.normalText,
            ]}
          >
            {item.isExceeded ? 'true' : 'false'}
          </Text>
        </View>


        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(item.percentage, 100)}%`,
                backgroundColor: item.isExceeded ? 'red' : 'green',
              },
            ]}
          />
        </View>

      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.filterContainer}>
        <View style={styles.yearRow}>
          <TouchableOpacity
            style={styles.yearButton}
            onPress={goToPreviousYear}
          >
            <Text style={styles.yearButtonText}>{'<'}</Text>
          </TouchableOpacity>

          <Text style={styles.filterTitle}>
            Month {selectedMonth} / {selectedYear}
          </Text>

          <TouchableOpacity
            style={styles.yearButton}
            onPress={goToNextYear}
          >
            <Text style={styles.yearButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.monthList}>
          {months.map((month) => (
            <TouchableOpacity
              key={month}
              style={[
                styles.monthButton,
                selectedMonth === month && styles.selectedMonthButton,
              ]}
              onPress={() => setSelectedMonth(month)}
            >
              <Text
                style={[
                  styles.monthButtonText,
                  selectedMonth === month && styles.selectedMonthButtonText,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={budgetData}
        renderItem={renderBudget}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddBudgetScreen')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  filterContainer: {
    marginBottom: 12,
  },

  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  yearButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  yearButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1569FF',
  },

  filterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  monthList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  monthButton: {
    width: 38,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedMonthButton: {
    backgroundColor: '#1569FF',
  },

  monthButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },

  selectedMonthButtonText: {
    color: 'white',
  },

  budgetCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 16,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  monthText: {
    fontSize: 12,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  label: {
    fontSize: 12,
    color: 'gray',
  },

  value: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  percentageText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  normalText: {
    color: 'green',
  },

  exceededText: {
    color: 'red',
    fontWeight: 'bold',
  },

  progressBackground: {
    height: 7,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginTop: 8,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    borderRadius: 5,
  },

  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1569FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonText: {
    color: 'white',
    fontSize: 30,
  },
});

export default BudgetListScreen;
