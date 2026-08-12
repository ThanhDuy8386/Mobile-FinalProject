import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const API_BASE_URL = 'http://10.0.2.2:5001/api';

const formatAmount = (amount) => {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return '0.00';
  }

  return Math.abs(numericAmount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const TransactionDetailScreen = ({ route, navigation }) => {
  const routeTransaction = route.params?.transaction;
  const transactionId = routeTransaction?.id;
  const [transaction, setTransaction] = useState(routeTransaction || null);
  const [loading, setLoading] = useState(Boolean(transactionId));
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchTransaction = useCallback(async () => {
    if (!transactionId) {
      setError('Transaction ID is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('Please log in again to view this transaction.');
      }

      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to load this transaction.');
      }

      setTransaction(result.data);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load this transaction.');
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  useFocusEffect(
    useCallback(() => {
      fetchTransaction();
    }, [fetchTransaction]),
  );

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);

            try {
              const token = await AsyncStorage.getItem('token');

              if (!token) {
                throw new Error('Please log in again to delete this transaction.');
              }

              const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
                method: 'DELETE',
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });
              const result = await response.json();

              if (!response.ok || !result.success) {
                throw new Error(result.message || 'Unable to delete this transaction.');
              }

              navigation.goBack();
            } catch (requestError) {
              Alert.alert('Delete failed', requestError.message);
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  if (loading && !transaction) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator size="large" color="#1569FF" />
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.errorText}>{error || 'Transaction not found.'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTransaction}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isExpense = transaction.type === 'EXPENSE';
  const categoryName = transaction.category?.name || 'Uncategorized';

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.inlineError}>{error}</Text> : null}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{transaction.title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount</Text>
          <Text style={[styles.value, isExpense ? styles.expense : styles.income]}>
            {isExpense ? '-' : '+'}{formatAmount(transaction.amount)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Type</Text>
          <Text style={[styles.value, isExpense ? styles.expense : styles.income]}>
            {transaction.type}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{categoryName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{transaction.transactionDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Note</Text>
          <Text style={styles.value}>{transaction.note || '—'}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
          disabled={deleting}
        >
          {deleting ? <ActivityIndicator color="#E53935" /> : <Ionicons name="trash-outline" size={24} color="#E53935" />}
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditTransaction', { transaction })}
          style={styles.editButton}
        >
          <Ionicons name="create-outline" size={24} color="#1569FF" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransactionDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    borderWidth: 1,
    borderColor: '#c0c0c0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginRight: 12,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: 15,
    fontWeight: '600',
    color: '#1569FF',
  },
  income: {
    color: '#2E9E5B',
  },
  expense: {
    color: '#E53935',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 10,
    paddingVertical: 12,
    flex: 1,
    marginRight: 8,
  },
  deleteText: {
    color: '#E53935',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 17,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1569FF',
    borderRadius: 10,
    paddingVertical: 12,
    flex: 1,
  },
  editText: {
    color: '#1569FF',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 17,
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 12,
  },
  inlineError: {
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    borderRadius: 8,
    backgroundColor: '#1569FF',
    paddingVertical: 9,
    paddingHorizontal: 18,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
