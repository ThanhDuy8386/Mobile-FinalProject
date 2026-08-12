import React, {
  useCallback,
  useState,
} from 'react';

import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const BudgetDetailScreen = ({ route, navigation }) => {
  const { budget } = route.params;
  const [budgetDetail, setBudgetDetail] = useState(null);
  const fetchBudgetDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        `http://10.0.2.2:5001/api/budgets/${budget.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      console.log('Budget detail response:', result);

      if (result.success) {
        setBudgetDetail(result.data);
      } else {
        Alert.alert('Error', result.message);
      }

    } catch (error) {
      console.log('Budget detail error:', error);

      Alert.alert(
        'Error',
        'Cannot load budget detail'
      );
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchBudgetDetail();
    }, [])
  );
  const renderInfoRow = (label, value) => {
    return (
      <View style={styles.infoRow}>
        <Text style={styles.label}>
          {label}
        </Text>

        <Text style={styles.value}>
          {value}
        </Text>
      </View>
    );
  };

  const renderTransaction = ({ item }) => {
    return (
      <View style={styles.transactionRow}>

        <View>
          <Text style={styles.transactionTitle}>
            {item.title}
          </Text>

          <Text style={styles.transactionDate}>
            {item.transactionDate}
          </Text>
        </View>

        <Text style={styles.transactionAmount}>
          {formatMoney(item.amount)}
        </Text>

      </View>
    );
  };

  const formatMoney = (amount) => {
    return Number(amount).toFixed(2);
  };

  if (!budgetDetail) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={budgetDetail.transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <>
            <View style={styles.detailCard}>

              {renderInfoRow(
                'Limit Amount',
                formatMoney(budgetDetail.limitAmount)
              )}

              {renderInfoRow(
                'Spent Amount',
                formatMoney(budgetDetail.spentAmount)
              )}

              {renderInfoRow(
                'Remaining Amount',
                formatMoney(budgetDetail.remainingAmount),
                budgetDetail.isExceeded
              )}

              {renderInfoRow(
                'Percentage',
                `${budgetDetail.percentage}%`,
                budgetDetail.isExceeded
              )}

              {renderInfoRow(
                'Is Exceeded',
                budgetDetail.isExceeded ? 'true' : 'false',
                budgetDetail.isExceeded
              )}

              {renderInfoRow(
                'Month',
                budgetDetail.month
              )}

              {renderInfoRow(
                'Year',
                budgetDetail.year
              )}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('EditBudgetScreen', {
                    budget: budget,
                  })
                }
              >
                <Text style={styles.editButtonText}>
                  Edit Budget
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>
              Expense Transactions
            </Text>

          </>
        }
      />

    </View>
  );
};

export default BudgetDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },

  detailCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: 'gray',
  },

  value: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  redText: {
    color: 'red',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 22,
    marginBottom: 12,
  },

  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  transactionTitle: {
    flex: 1,
    fontSize: 13,
  },

  transactionAmount: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center',
  },

  transactionDate: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right',
  },

  editButton: {
    backgroundColor: '#1569FF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },

  editButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});