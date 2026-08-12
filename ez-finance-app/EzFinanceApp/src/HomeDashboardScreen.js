import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeDashboardScreen = ({ navigation }) => {
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboard = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        'http://10.0.2.2:5001/api/reports/dashboard',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      console.log('Dashboard response:', result);

      if (result.success) {
        setDashboardData(result.data);
      } else {
        Alert.alert('Error', result.message);
      }

    } catch (error) {
      console.log('Dashboard error:', error);

      Alert.alert(
        'Error',
        'Cannot load dashboard data'
      );
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Format tiền
  const formatMoney = (amount) => {
    return Number(amount).toFixed(2);
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
          {item.category.name}
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

  if (!dashboardData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
          <Text style={styles.budgetHeaderCell}>category</Text>
          <Text style={styles.budgetHeaderCell}>limitAmount</Text>
          <Text style={styles.budgetHeaderCell}>spentAmount</Text>
          <Text style={styles.budgetHeaderCell}>remainingAmount</Text>
          <Text style={styles.budgetHeaderCell}>percentage</Text>
        </View>

        {dashboardData.budgetSummary.map(item => (
          <View key={item.id}>
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