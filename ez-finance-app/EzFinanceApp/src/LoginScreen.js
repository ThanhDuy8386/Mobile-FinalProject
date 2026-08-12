import React, {useState} from 'react';
import {Alert, View, Text, StyleSheet, TextInput, Pressable, TouchableOpacity} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    try {
      const res = await fetch (
        'http://10.0.2.2:5001/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const result = await res.json();
      console.log(result);
      if(result.success) {
        const token = result.data.token;
        console.log(token);
        await AsyncStorage.setItem('token', token);
        navigation.replace('MainTabs');
      } else {
        console.log(result.message);
        Alert.alert(
          'Login Failed',
          result.message
        );
      }
    } catch(error) {
      console.log(error);
      Alert.alert(
        'Error',
        'Cannot connect to server'
      );
    }
  }

  return (
    <View style={[styles.container,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom
      }
    ]}>
      <View style={styles.form}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
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
          <Text style={styles.eye}>
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </Pressable>
        <Pressable>
          <Text style={styles.forgot}>Forgot password?</Text>
        </Pressable>

        {/* will fix when connect to API */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don't have an account? </Text>

          <TouchableOpacity>
            <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>Register</Text>
          </TouchableOpacity>
        </View>
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
export default LoginScreen;