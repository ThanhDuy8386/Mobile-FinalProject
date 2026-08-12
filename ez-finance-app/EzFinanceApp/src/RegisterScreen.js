import React, { useState } from 'react';
import { Alert, ActivityIndicator, View, Text, StyleSheet, TextInput, Pressable, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleRegister = async () => {
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

    if (password.length < 6) {
      Alert.alert('Invalid password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://10.0.2.2:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: trimmedName,
          email: trimmedEmail,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      await AsyncStorage.setItem('token', result.data.token);
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Registration failed', error.message || 'Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={[styles.container,
    {
      paddingTop: insets.top,
      paddingBottom: insets.bottom
    }
    ]}>
      <View style={styles.form}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.eye}>{showPassword ? 'Hide' : 'Show'}</Text>
        </Pressable>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Register</Text>}
      </TouchableOpacity>

      <View style={styles.registerRow}>
        <Text style={styles.registerText}>Already have an account?  </Text>

        <TouchableOpacity>
          <Text style={styles.registerLink} onPress={() => navigation.navigate('Login')}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'white'
  },
  form: {
    marginTop: 70,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center'
  },
  inputGroup: {
    marginTop: 10
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 46
  },
  eye: {
    color: 'gray',
    fontSize: 12,
  },

  forgot: {
    color: '#4f6df5',
    textAlign: 'right',
    marginTop: 10,
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: '#4f6df5',
    paddingVertical: 14,
    borderRadius: 15,
    marginTop: 24,
  },

  loginText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  registerText: {
    fontSize: 12,
    color: 'gray',
  },

  registerLink: {
    fontSize: 12,
    color: '#4f6df5',
    fontWeight: 'bold',
  },
})
export default RegisterScreen;
