import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const AddCategoryScreen = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('INCOME');
  const [icon, setIcon] = useState('restaurant');
  const [color, setColor] = useState('#FF9800');
  const [showIconDropdown, setShowIconDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  const iconOptions = [
    'restaurant',
    'car',
    'bag',
    'star',
  ];

  const colorOptions = [
    '#FF9800',
    '#22C55E',
    '#3B82F6',
    '#EF4444',
  ];

  const handleAddCategory = () => {
    const newCategory = {
      name,
      type,
      icon,
      color,
    };

    console.log(newCategory);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter category name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Type</Text>

      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === 'INCOME' && styles.activeTypeButton,
          ]}
          onPress={() => setType('INCOME')}
        >
          <Text
            style={[
              styles.typeText,
              type === 'INCOME' && styles.activeTypeText,
            ]}
          >
            INCOME
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            type === 'EXPENSE' && styles.activeTypeButton,
          ]}
          onPress={() => setType('EXPENSE')}
        >
          <Text
            style={[
              styles.typeText,
              type === 'EXPENSE' && styles.activeTypeText,
            ]}
          >
            EXPENSE
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Icon</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowIconDropdown(!showIconDropdown)}
      >
        <Text>{icon}</Text>
        <Text>▼</Text>
      </TouchableOpacity>

      {showIconDropdown && (
        <View style={styles.dropdown}>
          {iconOptions.map(item => (
            <TouchableOpacity
              key={item}
              style={styles.dropdownItem}
              onPress={() => {
                setIcon(item);
                setShowIconDropdown(false);
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Color</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowColorDropdown(!showColorDropdown)}
      >
        <View style={styles.colorSelected}>
          <View
            style={[
              styles.colorBox,
              { backgroundColor: color },
            ]}
          />

          <Text>{color}</Text>
        </View>

        <Text>▼</Text>
      </TouchableOpacity>

      {showColorDropdown && (
        <View style={styles.dropdown}>
          {colorOptions.map(item => (
            <TouchableOpacity
              key={item}
              style={styles.dropdownItem}
              onPress={() => {
                setColor(item);
                setShowColorDropdown(false);
              }}
            >
              <View style={styles.colorSelected}>
                <View
                  style={[
                    styles.colorBox,
                    { backgroundColor: item },
                  ]}
                />

                <Text>{item}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddCategory}
      >
        <Text style={styles.addButtonText}>
          Add Category
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 18,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 18,
  },

  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 10,
  },

  activeTypeButton: {
    backgroundColor: '#1569FF',
    borderColor: '#1569FF',
  },

  typeText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },

  activeTypeText: {
    color: 'white',
  },
  dropdownButton: {
    height: 46,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 18,
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  colorSelected: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#1569FF',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },

  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AddCategoryScreen;