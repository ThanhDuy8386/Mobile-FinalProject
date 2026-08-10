import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TransactionDetailScreen = ({ route }) => {
  const { transaction } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <Text style={styles.value}>{transaction.title}</Text>
        <Text style={styles.label}>Amount</Text>
        <Text
          style={[
            styles.value,
            { color: transaction.amount < 0 ? '#E53935' : '#2E9E5B' },
          ]}>
          {transaction.amount < 0 ? '-' : ''}
          {Math.abs(transaction.amount).toLocaleString()}.00
        </Text>
        <Text style={styles.label}>Type</Text>
        <Text style={styles.value}>{transaction.type}</Text>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{transaction.date}</Text>
        <Text style={styles.label}>Note</Text>
        <Text style={styles.value}>{transaction.note}</Text>
      </View>
    </View>
  );
};

export default TransactionDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ff',
  },
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#eee',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
});
