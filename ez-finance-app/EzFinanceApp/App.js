import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from './src/LoginScreen';
import RegisterScreen from './src/RegisterScreen';

import UserProfileScreen from './src/UserProfileScreen';
import EditProfileScreen from './src/EditProfileScreen';
import ChangePasswordScreen from './src/ChangePasswordScreen';

import TransactionScreen from './src/TransactionScreen';
import TransactionDetailScreen from './src/TransactionDetailScreen';
import AddTransactionScreen from './src/AddTransactionScreen';
import EditTransactionScreen from './src/EditTransactionScreen';
import TransactionFilterScreen from './src/TransactionFilterScreen';

import HomeDashboardScreen from './src/HomeDashboardScreen';
import MonthlyReportScreen from './src/MonthlyReportScreen';

import CategoryListScreen from './src/CategoryListScreen';
import AddCategoryScreen from './src/AddCategoryScreen';
import EditCategoryScreen from './src/EditCategoryScreen';

import BudgetListScreen from './src/BudgetListScreen';
import AddBudgetScreen from './src/AddBudgetScreen';
import BudgetDetailScreen from './src/BudgetDetailScreen';
import EditBudgetScreen from './src/EditBudgetScreen';

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

      <ProfileStack.Screen
        name="CategoryList"
        component={CategoryListScreen}
        options={{ title: 'Category List' }}
      />

      <ProfileStack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
        options={{ title: 'Add Category' }}
      />

      <ProfileStack.Screen
        name="EditCategory"
        component={EditCategoryScreen}
        options={{ title: 'Edit Category' }}
      />

      <ProfileStack.Screen
        name="BudgetListScreen"
        component={BudgetListScreen}
        options={{ title: 'Budget List' }}
      />

      <ProfileStack.Screen
        name="BudgetDetailScreen"
        component={BudgetDetailScreen}
        options={{ title: 'Budget Detail' }}
      />

      <ProfileStack.Screen
        name="AddBudgetScreen"
        component={AddBudgetScreen}
        options={{ title: 'Add Budget' }}
      />

      <ProfileStack.Screen
        name="EditBudgetScreen"
        component={EditBudgetScreen}
        options={{ title: 'Edit Budget' }}
      />
    </ProfileStack.Navigator>
  );
};

const TransactionStack = createNativeStackNavigator();
const TransactionNavigator = () => {
  return (
    <TransactionStack.Navigator>
      <TransactionStack.Screen
        name="TransactionList"
        component={TransactionScreen}
        options={{ headerShown: false }}
      />
      <TransactionStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{ title: 'Transaction Detail' }}
      />
      <TransactionStack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{ title: 'Add Transaction' }}
      />
      <TransactionStack.Screen
        name="EditTransaction"
        component={EditTransactionScreen}
        options={{ title: 'Edit Transaction' }}
      />
      <TransactionStack.Screen
        name="TransactionFilter"
        component={TransactionFilterScreen}
        options={{ title: 'Transaction Filter' }}
      />
    </TransactionStack.Navigator>
  );
};

const HomeStack = createNativeStackNavigator();
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeDashboard"
        component={HomeDashboardScreen}
        options={{
          title: 'Home Dashboard',
        }}
      />
      <HomeStack.Screen
        name="MonthlyReport"
        component={MonthlyReportScreen}
        options={{ title: 'Monthly Report' }}
      />
    </HomeStack.Navigator>
  );
}

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
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={TransactionNavigator}
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
