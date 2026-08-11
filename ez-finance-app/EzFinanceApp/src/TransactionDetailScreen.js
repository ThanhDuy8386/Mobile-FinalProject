import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TransactionDetailScreen = ({ route, navigation }) => {
  const { transaction } = route.params;

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // will handle later when connect to API
            navigation.goBack();
          },
        },
      ],
      { cancelable: true }
    );
  }

  const handleEdit = () => {
    navigation.navigate('EditTransaction', { transaction });
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{transaction.title}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Amount</Text>
          <Text
            style={[
              styles.value,
              { color: transaction.amount < 0 ? '#E53935' : '#2E9E5B' },
            ]}
          >
            {transaction.amount < 0 ? '-' : ''}
            {Math.abs(transaction.amount).toLocaleString()}.00
          </Text>
        </View>

        {/* <View style={styles.row}>
          <Text style={styles.label}>Type</Text>
          <Text
            style={[
              styles.typeValue,
              { color: transaction.type === 'EXPENSE' ? '#E53935' : '#2E9E5B' },
            ]}
          >
            {transaction.type}
          </Text>
        </View> */}

        <View style={styles.row}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{transaction.category}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{transaction.date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Note</Text>
          <Text style={styles.value}>{transaction.note}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#E53935" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
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
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1569FF'
  },
  typeValue: {
    fontSize: 15,
    color: '#2E9E5B',
    fontWeight: 'bold'
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
    marginRight: 8
  },
  deleteText: {
    color: '#E53935',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 17
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
    marginRight: 8
  },
  editText: {
    color: '#1569FF',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 17
  }
});
