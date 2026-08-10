import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const RegisterScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();
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
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
        />
      </View>
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Register</Text>
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