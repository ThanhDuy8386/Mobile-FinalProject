import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const EditProfileScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('Demo User'); // will fix when connect to API
  const [email, setEmail] = useState('demo@ezfinance.com'); // will fix when connect to API

  return (
    <View style={styles.container}>
      <View style={styles.editCard}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter full name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  editCard: {
    borderWidth: 1,
    borderColor: '#c0c0c0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#095EDD',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
