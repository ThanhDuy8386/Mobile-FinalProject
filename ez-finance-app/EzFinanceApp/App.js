import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from './src/LoginScreen';
import RegisterScreen from './src/RegisterScreen'
import UserProfileScreen from './src/UserProfileScreen';
import EditProfileScreen from './src/EditProfileScreen';
import ChangePasswordScreen from './src/ChangePasswordScreen';
import HomeScreen from './src/HomeScreen';
import TransactionScreen from './src/TransactionScreen';

const ProfileStack = createNativeStackNavigator();
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ headerShown: false }}
      />

      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />

      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Change Password' }}
      />
    </ProfileStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1569FF',
        tabBarInactiveTintColor: '#888',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={TransactionScreen}
        options={{
          tabBarLabel: 'Transaction',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
