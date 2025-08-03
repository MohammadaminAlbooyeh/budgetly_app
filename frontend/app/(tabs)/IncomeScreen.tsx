import React, { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';

export default function IncomeScreen() {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [value, setValue] = useState('');
  const { incomes, addIncome } = useBudget();
  const categories = [
    'Salary', 'Bonus', 'Investments', 'Gifts', 'Refunds', 'Interest', 'Dividends', 'Business Income', 'Pension', 'Sale of Assets', 'Other'
  ];
  const handleAddIncome = () => {
    if (selectedCategory && value) {
      addIncome({ category: selectedCategory, value });
      setSelectedCategory('');
      setValue('');
    }
  };
  return (
    <View style={styles.container}>
      {/* Categories Dropdown */}
      <TouchableOpacity style={styles.categoriesBox} onPress={() => setCategoriesOpen(!categoriesOpen)}>
        <Text style={styles.categoriesBoxText}>{selectedCategory ? selectedCategory : 'Categories'}</Text>
      </TouchableOpacity>
      {categoriesOpen && (
        <View style={styles.categoriesDropdown}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { setSelectedCategory(item); setCategoriesOpen(false); }} style={styles.categoryItem}>
                <Text style={styles.categoryText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {/* Value Input Box */}
      <View style={styles.valueBox}>
        <Text style={styles.valueLabel}>Value</Text>
        <TextInput
          style={styles.valueInput}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={value}
          onChangeText={setValue}
        />
      </View>
      {/* Table of Income */}
      {incomes.length > 0 && (
        <View style={styles.tableBox}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Category</Text>
            <Text style={styles.tableHeaderText}>Value</Text>
          </View>
          <FlatList
            data={incomes}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.category}</Text>
                <Text style={styles.tableCell}>{item.value}</Text>
              </View>
            )}
          />
        </View>
      )}
      <Text style={styles.title}>Income Page</Text>
      <TouchableOpacity style={styles.incomeBottomButton} onPress={handleAddIncome}>
        <Text style={styles.incomeBottomButtonText}>Income</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesBox: {
    width: '90%',
    marginTop: 32,
    marginBottom: 8,
    alignSelf: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  categoriesBoxText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoriesDropdown: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    maxHeight: 260,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  valueBox: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    alignItems: 'flex-start',
  },
  valueLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  valueInput: {
    width: '100%',
    fontSize: 18,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    padding: 10,
    color: '#333',
  },
  tableBox: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    width: '50%',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tableCell: {
    fontSize: 16,
    color: '#333',
    width: '50%',
    textAlign: 'center',
  },
  incomeBottomButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#388E3C',
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  incomeBottomButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#388E3C',
  },
});
