import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Get back your account</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, styles.emailInput]}
        />
        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter your new password"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            style={[styles.input, styles.passwordInput]}
          />
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Ionicons
              name={showNewPassword ? 'eye-off' : 'eye'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm your new password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={[styles.input, styles.passwordInput]}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.resetText}>Reset Password</Text>
        </TouchableOpacity>
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Remember your password?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  form: {
    marginTop: 70,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 6,
    marginTop: 14,
  },
  emailInput: {
    minHeight: 50,
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  passwordInput: {
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  resetButton: {
    backgroundColor: '#4f6df5',
    paddingVertical: 14,
    borderRadius: 15,
    marginTop: 24,
  },
  resetText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  loginText: {
    fontSize: 12,
    color: 'gray',
  },
  loginLink: {
    fontSize: 12,
    color: '#4f6df5',
    fontWeight: 'bold',
  },
});
