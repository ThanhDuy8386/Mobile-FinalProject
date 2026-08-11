import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

const BudgetListScreen = ({navigation}) => {
  const formatMoney = (amount) => {
    return amount.toFixed(2);
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
            categoryId: {item.categoryId}
          </Text>

          <Text style={styles.monthText}>
            month: {item.month} year: {item.year}
          </Text>
        </View>


        <View style={styles.infoRow}>
          <Text style={styles.label}>limitAmount</Text>

          <Text style={styles.value}>
            {formatMoney(item.limitAmount)}
          </Text>
        </View>


        <View style={styles.infoRow}>
          <Text style={styles.label}>spentAmount</Text>

          <Text style={styles.value}>
            {formatMoney(item.spentAmount)}
          </Text>
        </View>


        <View style={styles.infoRow}>
          <Text style={styles.label}>remainingAmount</Text>

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
          <Text style={styles.label}>percentage</Text>

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
          <Text style={styles.label}>isExceeded</Text>

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

const budgetData = [
  {
    id: 1,
    categoryId: 1,
    limitAmount: 3000000,
    spentAmount: 1200000,
    remainingAmount: 1800000,
    percentage: 40,
    isExceeded: false,
    month: 8,
    year: 2026,
  },
  {
    id: 2,
    categoryId: 5,
    limitAmount: 1500000,
    spentAmount: 1600000,
    remainingAmount: -100000,
    percentage: 107,
    isExceeded: true,
    month: 8,
    year: 2026,
  },
  {
    id: 3,
    categoryId: 7,
    limitAmount: 2000000,
    spentAmount: 800000,
    remainingAmount: 1200000,
    percentage: 40,
    isExceeded: false,
    month: 8,
    year: 2026,
  },
];