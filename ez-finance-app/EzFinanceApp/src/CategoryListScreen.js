import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoryListScreen = ({navigation}) => {
  const [selectedType, setSelectedType] = useState('INCOME');
  const [categoryData, setCategoryData] = useState([]);

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        `http://10.0.2.2:5001/api/categories?type=${selectedType}`,
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      console.log('Category response:', result);

      if (result.success) {
        setCategoryData(result.data);
      } else {
        Alert.alert('Error', result.message);
      }

    } catch (error) {
      console.log('Category error:', error);

      Alert.alert(
        'Error',
        'Cannot load categories'
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [selectedType])
  );

  const handleDeleteCategory = (id) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');

              const response = await fetch(
                `http://10.0.2.2:5001/api/categories/${id}`,
                {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const result = await response.json();

              console.log('Delete category response:', result);

              if (result.success) {
                Alert.alert(
                  'Success',
                  'Category deleted successfully'
                );

                fetchCategories();
              } else {
                Alert.alert(
                  'Delete Failed',
                  result.message
                );
              }

            } catch (error) {
              console.log('Delete category error:', error);

              Alert.alert(
                'Error',
                'Cannot delete category'
              );
            }
          },
        },
      ]
    );
  };

  const renderCategory = ({ item }) => {
    return (
      <View style={styles.categoryRow}>

        <View
          style={[
            styles.iconBox,
            { backgroundColor: item.color },
          ]}
        >
          <Text style={styles.iconText}>
            $
          </Text>
        </View>


        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>
            {item.name}
          </Text>

          <Text
            style={[
              styles.categoryType,
              item.type === 'INCOME'
                ? styles.incomeText
                : styles.expenseText,
            ]}
          >
            {item.type}
          </Text>
        </View>


        <TouchableOpacity style={styles.actionButton}
            onPress={() =>
                navigation.navigate('EditCategory', {
                  category: item,
                })
              }
        >
          <Text>✎</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}
          onPress={() => handleDeleteCategory(item.id)}
        >
          <Text>🗑</Text>
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === 'INCOME' && styles.activeButton,
          ]}
          onPress={() => setSelectedType('INCOME')}
        >
          <Text
            style={[
              styles.filterText,
              selectedType === 'INCOME' && styles.activeText,
            ]}
          >
            INCOME
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === 'EXPENSE' && styles.activeButton,
          ]}
          onPress={() => setSelectedType('EXPENSE')}
        >
          <Text
            style={[
              styles.filterText,
              selectedType === 'EXPENSE' && styles.activeText,
            ]}
          >
            EXPENSE
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={categoryData}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddCategory')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CategoryListScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },

  filterContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 20,
  },

  filterButton: {
    width: 110,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 12,
  },

  activeButton: {
    backgroundColor: '#1569FF',
    borderColor: '#1569FF',
  },

  filterText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },

  activeText: {
    color: 'white',
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconText: {
    color: 'white',
    fontWeight: 'bold',
  },

  categoryInfo: {
    flex: 1,
    marginLeft: 12,
  },

  categoryName: {
    fontSize: 15,
    fontWeight: '500',
  },

  categoryType: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 3,
  },

  incomeText: {
    color: 'green',
  },

  expenseText: {
    color: 'red',
  },

  actionButton: {
    padding: 10,
  },

  listContainer: {
  flex: 1,
},

  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1569FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: '300',
  },
})