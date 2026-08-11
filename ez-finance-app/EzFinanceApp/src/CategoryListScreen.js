import React, {useState} from 'react';
import {View, TouchableOpacity, FlatList, Text, StyleSheet} from 'react-native';

const CategoryListScreen = ({navigation}) => {
  const [selectedType, setSelectedType] = useState('INCOME');

  const getFilteredCategories = () => {
    return categoryData.filter(
      item => item.type === selectedType
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

        <TouchableOpacity style={styles.actionButton}>
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
          data={getFilteredCategories()}
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

const categoryData = [
  {
    id: 1,
    name: 'Salary',
    type: 'INCOME',
    icon: 'cash',
    color: '#22C55E',
  },
  {
    id: 2,
    name: 'Freelance',
    type: 'INCOME',
    icon: 'briefcase',
    color: '#06B6D4',
  },
  {
    id: 3,
    name: 'Investment',
    type: 'INCOME',
    icon: 'trending-up',
    color: '#8B5CF6',
  },
  {
    id: 4,
    name: 'Other Income',
    type: 'INCOME',
    icon: 'star',
    color: '#F59E0B',
  },
  {
    id: 5,
    name: 'Food',
    type: 'EXPENSE',
    icon: 'restaurant',
    color: '#EF4444',
  },
  {
    id: 6,
    name: 'Transport',
    type: 'EXPENSE',
    icon: 'car',
    color: '#3B82F6',
  },
  {
    id: 7,
    name: 'Shopping',
    type: 'EXPENSE',
    icon: 'bag',
    color: '#EC4899',
  },
  {
    id: 8,
    name: 'Entertainment',
    type: 'EXPENSE',
    icon: 'musical-notes',
    color: '#7C3AED',
  },
];