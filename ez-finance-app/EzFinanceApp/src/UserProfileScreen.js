import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5001/api';

const UserProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to load profile');
      }

      setProfile(result.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      const rootNavigation = navigation.getParent()?.getParent();

      if (rootNavigation) {
        rootNavigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    } catch (logoutError) {
      Alert.alert('Logout failed', logoutError.message);
    }
  };

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: handleLogout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>User Profile</Text>

      {loading && !profile ? (
        <ActivityIndicator size="large" color="#1569FF" style={styles.loader} />
      ) : error && !profile ? (
        <View style={styles.messageBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadProfile} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color="#2E75E7" />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{profile?.fullName}</Text>
            <Text style={styles.profileEmail}>{profile?.email}</Text>
          </View>
        </View>
      )}

      <View style={styles.menuCard}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CategoryList')}>
          <Ionicons
            name="reader-outline"
            size={20}
            color="#1E5F47"
            style={styles.menuIcon}
          />
          <Text style={styles.menuLabel}>Category List</Text>
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('BudgetListScreen')}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#0A1825"
            style={styles.menuIcon}
          />
          <Text style={styles.menuLabel}>Budget List</Text>
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('EditProfile', { profile })}>
          <Ionicons
            name="create-outline"
            size={20}
            color="#1C5696"
            style={styles.menuIcon}
          />
          <Text style={styles.menuLabel}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChangePassword')}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#3474A4"
            style={styles.menuIcon}
          />
          <Text style={styles.menuLabel}>Change Password</Text>
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Ionicons name="log-out-outline" size={18} color="#B61E09" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c0c0c0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF2FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  menuCard: {
    borderWidth: 1,
    borderColor: '#c0c0c0',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B61E09',
    borderRadius: 10,
    paddingVertical: 14,
  },
  logoutText: {
    color: '#B61E09',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
  loader: {
    marginVertical: 32,
  },
  messageBox: {
    borderWidth: 1,
    borderColor: '#f0b8b8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  errorText: {
    color: '#B61E09',
    marginBottom: 12,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#1569FF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
