import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const MonthlyReportScreen = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  const formatMoney = (amount) => {
    return Number(amount).toFixed(2);
  };

  const renderMonth = ({ item }) => {
    return (
      <View style={styles.monthCard}>
        <View style={styles.monthBox}>
          <Text style={styles.monthLabel}>month</Text>

          <Text style={styles.monthNumber}>
            {item.month}
          </Text>
        </View>

        <View style={styles.reportInfo}>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>
              totalIncome
            </Text>

            <Text style={styles.reportValue}>
              {formatMoney(item.totalIncome)}
            </Text>
          </View>

          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>
              totalExpense
            </Text>

            <Text style={styles.reportValue}>
              {formatMoney(item.totalExpense)}
            </Text>
          </View>

          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>
              balance
            </Text>

            <Text style={styles.reportValue}>
              {formatMoney(item.balance)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const fetchMonthlyReport = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        'http://10.0.2.2:5001/api/reports/monthly?year=2026',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      console.log('Monthly report response:', result);

      if (result.success) {
        setMonthlyData(result.data);
      } else {
        Alert.alert('Error', result.message);
      }

    } catch (error) {
      console.log('Monthly report error:', error);

      Alert.alert(
        'Error',
        'Cannot load monthly report'
      );
    }
  };

  useEffect(() => {
    fetchMonthlyReport();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={monthlyData}
        renderItem={renderMonth}
        keyExtractor={(item) => item.month.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },

  list: {
    paddingTop: 16,
    paddingBottom: 20,
  },

  monthCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 18,
    marginBottom: 14,
  },

  monthBox: {
    width: '28%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  monthLabel: {
    fontSize: 12,
    color: 'gray',
  },

  monthNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 8,
  },

  reportInfo: {
    flex: 1,
  },

  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  reportLabel: {
    fontSize: 12,
    color: 'gray',
  },

  reportValue: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default MonthlyReportScreen;