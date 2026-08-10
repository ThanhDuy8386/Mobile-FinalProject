import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.changePasswordCard}>
        <Text style={styles.label}>Current Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrentPassword}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
            <Ionicons
              name={showCurrentPassword ? 'eye-off' : 'eye'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}>
            <Ionicons
              name={showNewPassword ? 'eye-off' : 'eye'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.updateText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  changePasswordCard: {
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#095EDD',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
