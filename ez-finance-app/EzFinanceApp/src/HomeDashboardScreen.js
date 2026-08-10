import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';


const dashboardData = {
  totalIncome: 15000000,
  totalExpense: 4500000,
  balance: 10500000,
  allTimeBalance: 25000000,

  recentTransactions: [
    {
      id: 1,
      title: 'Salary',
      amount: 50000,
      type: 'INCOME',
      transactionDate: '2026-08-05',
    },
    {
      id: 2,
      title: 'Food',
      amount: 2500,
      type: 'EXPENSE',
      transactionDate: '2026-08-06',
    },
  ],

  budgetSummary: [
    {
      categoryId: 1,
      limitAmount: 3000000,
      spentAmount: 1200000,
      remainingAmount: 1800000,
      percentage: 40,
      isExceeded: false,
    },
    {
      categoryId: 5,
      limitAmount: 150000,
      spentAmount: 160000,
      remainingAmount: -10000,
      percentage: 107,
      isExceeded: true,
    },
  ],
};


const HomeDashboardScreen = ({ navigation }) => {
  // Format tiền
  const formatMoney = (amount) => {
    return amount.toFixed(2);
  };


  // Tạo một summary card
  const renderSummaryCard = (title, amount) => {
    return (
      <View style={styles.summaryCard}>

        <Text style={styles.summaryTitle}>
          {title}
        </Text>

        <Text style={styles.summaryAmount}>
          {formatMoney(amount)}
        </Text>

      </View>
    );
  };

  //render trânsaction
  const renderTransaction = (item) => {
    return (
      <View style={styles.transactionRow}>

        <Text style={styles.transactionTitle}>
          {item.title}
        </Text>

        <Text style={styles.transactionAmount}>
          {formatMoney(item.amount)}
        </Text>

        <Text
          style={[
            styles.transactionType,
            item.type === 'INCOME'
              ? styles.incomeText
              : styles.expenseText,
          ]}
        >
          {item.type}
        </Text>

        <Text style={styles.transactionDate}>
          {item.transactionDate}
        </Text>

      </View>
    );
  };

//render budget
  const renderBudget = (item) => {
    return (
      <View style={styles.budgetRow}>

        <Text style={styles.budgetCell}>
          {item.categoryId}
        </Text>

        <Text style={styles.budgetCell}>
          {formatMoney(item.limitAmount)}
        </Text>

        <Text style={styles.budgetCell}>
          {formatMoney(item.spentAmount)}
        </Text>

        <Text style={styles.budgetCell}>
          {formatMoney(item.remainingAmount)}
        </Text>

        <Text
          style={[
            styles.budgetCell,
            item.isExceeded ? styles.exceededText : styles.normalText,
          ]}
        >
          {item.percentage}%
        </Text>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>

        {renderSummaryCard(
          'totalIncome',
          dashboardData.totalIncome
        )}

        {renderSummaryCard(
          'totalExpense',
          dashboardData.totalExpense
        )}

        {renderSummaryCard(
          'balance',
          dashboardData.balance
        )}

        {renderSummaryCard(
          'allTimeBalance',
          dashboardData.allTimeBalance
        )}

      </View>

      <TouchableOpacity style={styles.reportButton}
      onPress={() => navigation.navigate('MonthlyReport')}>
        <Text style={styles.reportButtonText}>
          View Monthly Report
        </Text>
      </TouchableOpacity>

      <View style={styles.transactionContainer}>

        <Text style={styles.sectionTitle}>
          recentTransactions
        </Text>

        {dashboardData.recentTransactions.map(item => (
          <View key={item.id}>
            {renderTransaction(item)}
          </View>
        ))}

        <TouchableOpacity>
          <Text style={styles.viewAll}>
            View All
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.budgetContainer}>

        <Text style={styles.sectionTitle}>
          budgetSummary
        </Text>

        <View style={styles.budgetHeader}>
          <Text style={styles.budgetHeaderCell}>categoryId</Text>
          <Text style={styles.budgetHeaderCell}>limitAmount</Text>
          <Text style={styles.budgetHeaderCell}>spentAmount</Text>
          <Text style={styles.budgetHeaderCell}>remainingAmount</Text>
          <Text style={styles.budgetHeaderCell}>percentage</Text>
        </View>

        {dashboardData.budgetSummary.map(item => (
          <View key={item.categoryId}>
            {renderBudget(item)}
          </View>
        ))}

      </View>
    </View>
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },

  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  summaryCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },

  summaryTitle: {
    fontSize: 12,
    color: 'gray',
  },

  summaryAmount: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 8,
  },

  transactionContainer: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 10,
  padding: 14,
  marginTop: 12,
},

  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  transactionTitle: {
    flex: 2,
    fontSize: 13,
  },

  transactionAmount: {
    flex: 1.5,
    fontSize: 12,
  },

  transactionType: {
    flex: 1.5,
    fontSize: 11,
    fontWeight: 'bold',
  },

  transactionDate: {
    flex: 1.5,
    fontSize: 11,
    textAlign: 'right',
  },

  incomeText: {
    color: 'green',
  },

  expenseText: {
    color: 'red',
  },

  viewAll: {
    color: '#3578e5',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 4,
  },

  budgetContainer: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 10,
  padding: 14,
  marginTop: 16,
  marginBottom: 20,
},

  budgetHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  budgetHeaderCell: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  budgetCell: {
    flex: 1,
    fontSize: 10,
    textAlign: 'center',
  },

  normalText: {
    color: 'black',
  },

  exceededText: {
    color: 'red',
    fontWeight: 'bold',
  },

  reportButton: {
    backgroundColor: '#4f6df5',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 16,
  },

  reportButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
});


export default HomeDashboardScreen;