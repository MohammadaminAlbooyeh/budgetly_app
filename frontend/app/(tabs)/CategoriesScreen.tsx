import * as React from 'react';
import { useBudget } from '@/context/BudgetContext';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

export default function CategoriesScreen() {
  const {
    expenseCategories,
    incomeCategories,
    addExpenseCategory,
    editExpenseCategory,
    deleteExpenseCategory,
    addIncomeCategory,
    editIncomeCategory,
    deleteIncomeCategory,
  } = useBudget();

  const [newExpenseCategory, setNewExpenseCategory] = React.useState('');
  const [newIncomeCategory, setNewIncomeCategory] = React.useState('');
  const [editingExpense, setEditingExpense] = React.useState<string | null>(null);
  const [editingIncome, setEditingIncome] = React.useState<string | null>(null);
  const [editExpenseValue, setEditExpenseValue] = React.useState('');
  const [editIncomeValue, setEditIncomeValue] = React.useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Categories</Text>
      <Text style={styles.sectionTitle}>Expense Categories</Text>
      <FlatList
        data={expenseCategories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.categoryRow}>
            {editingExpense === item ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editExpenseValue}
                  onChangeText={setEditExpenseValue}
                />
                <TouchableOpacity onPress={() => { editExpenseCategory(item, editExpenseValue); setEditingExpense(null); }} style={styles.saveButton}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditingExpense(null)} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.categoryText}>{item}</Text>
                <TouchableOpacity onPress={() => { setEditingExpense(item); setEditExpenseValue(item); }} style={styles.editButton}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  Alert.alert('Delete Category', `Delete "${item}"?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => deleteExpenseCategory(item) },
                  ]);
                }} style={styles.deleteButton}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="New expense category"
          value={newExpenseCategory}
          onChangeText={setNewExpenseCategory}
        />
        <TouchableOpacity onPress={() => { addExpenseCategory(newExpenseCategory); setNewExpenseCategory(''); }} style={styles.addButton}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Income Categories</Text>
      <FlatList
        data={incomeCategories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.categoryRow}>
            {editingIncome === item ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editIncomeValue}
                  onChangeText={setEditIncomeValue}
                />
                <TouchableOpacity onPress={() => { editIncomeCategory(item, editIncomeValue); setEditingIncome(null); }} style={styles.saveButton}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditingIncome(null)} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.categoryText}>{item}</Text>
                <TouchableOpacity onPress={() => { setEditingIncome(item); setEditIncomeValue(item); }} style={styles.editButton}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  Alert.alert('Delete Category', `Delete "${item}"?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => deleteIncomeCategory(item) },
                  ]);
                }} style={styles.deleteButton}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="New income category"
          value={newIncomeCategory}
          onChangeText={setNewIncomeCategory}
        />
        <TouchableOpacity onPress={() => { addIncomeCategory(newIncomeCategory); setNewIncomeCategory(''); }} style={styles.addButton}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    flex: 1,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#4BC0C0',
    padding: 10,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#36A2EB',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#F7464A',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#8BC34A',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#BDBDBD',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
