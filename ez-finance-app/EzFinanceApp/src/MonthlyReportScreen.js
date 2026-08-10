import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

const monthlyData = [
  {
    month: 1,
    totalIncome: 1200000,
    totalExpense: 800000,
    balance: 400000,
  },
  {
    month: 2,
    totalIncome: 1500000,
    totalExpense: 900000,
    balance: 600000,
  },
  {
    month: 3,
    totalIncome: 1800000,
    totalExpense: 1000000,
    balance: 800000,
  },
  {
    month: 8,
    totalIncome: 15000000,
    totalExpense: 4500000,
    balance: 10500000,
  },
  {
    month: 12,
    totalIncome: 1800000,
    totalExpense: 1100000,
    balance: 700000,
  },
];

const MonthlyReportScreen = () => {
  const formatMoney = (amount) => {
    return amount.toFixed(2);
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