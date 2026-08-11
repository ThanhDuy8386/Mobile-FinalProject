import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

const BudgetDetailScreen = ({ route, navigation }) => {
  const { budget } = route.params;
  const renderInfoRow = (label, value, isRed = false) => {
    return (
      <View style={styles.infoRow}>
        <Text style={styles.label}>
          {label}
        </Text>

        <Text
          style={[
            styles.value,
            isRed && styles.redText,
          ]}
        >
          {value}
        </Text>
      </View>
    );
  };

  const renderTransaction = ({ item }) => {
    return (
      <View style={styles.transactionRow}>

        <Text style={styles.transactionTitle}>
          {item.title}
        </Text>

        <Text style={styles.transactionAmount}>
          {formatMoney(item.amount)}
        </Text>

        <Text style={styles.transactionDate}>
          {item.transactionDate}
        </Text>

      </View>
    );
  };

  const formatMoney = (amount) => {
    return amount.toFixed(2);
  };

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
                'categoryId',
                budgetDetail.categoryId
              )}

              {renderInfoRow(
                'limitAmount',
                formatMoney(budgetDetail.limitAmount)
              )}

              {renderInfoRow(
                'spentAmount',
                formatMoney(budgetDetail.spentAmount)
              )}

              {renderInfoRow(
                'remainingAmount',
                formatMoney(budgetDetail.remainingAmount),
                budgetDetail.isExceeded
              )}

              {renderInfoRow(
                'percentage',
                `${budgetDetail.percentage}%`,
                budgetDetail.isExceeded
              )}

              {renderInfoRow(
                'isExceeded',
                budgetDetail.isExceeded ? 'true' : 'false',
                budgetDetail.isExceeded
              )}

              {renderInfoRow(
                'month',
                budgetDetail.month
              )}

              {renderInfoRow(
                'year',
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

const budgetDetail = {
  id: 2,
  categoryId: 5,
  limitAmount: 1500000,
  spentAmount: 1600000,
  remainingAmount: -100000,
  percentage: 107,
  isExceeded: true,
  month: 8,
  year: 2026,

  transactions: [
    {
      id: 1,
      title: 'Food',
      amount: 2500,
      transactionDate: '2026-08-06',
    },
    {
      id: 2,
      title: 'Food',
      amount: 3200,
      transactionDate: '2026-08-10',
    },
    {
      id: 3,
      title: 'Food',
      amount: 1800,
      transactionDate: '2026-08-12',
    },
    {
      id: 4,
      title: 'Food',
      amount: 2700,
      transactionDate: '2026-08-15',
    },
  ],
};

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