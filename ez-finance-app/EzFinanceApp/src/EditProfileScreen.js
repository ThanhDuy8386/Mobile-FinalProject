import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5001/api';

const EditProfileScreen = ({ navigation, route }) => {
  const [fullName, setFullName] = useState(route.params?.profile?.fullName || '');
  const [email, setEmail] = useState(route.params?.profile?.email || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      Alert.alert('Invalid name', 'Full name must be between 2 and 100 characters.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: trimmedName, email: trimmedEmail }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to update profile');
      }

      navigation.goBack();
    } catch (requestError) {
      Alert.alert('Update failed', requestError.message);
    } finally {
      setSaving(false);
    }
  };

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
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save</Text>}
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
