import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { getBudgetGoals, addBudgetGoal, updateBudgetGoal, deleteBudgetGoal } from '@/db';

const types = ['expense', 'income'];
const periods = ['monthly', 'weekly'];

export default function BudgetGoalsScreen() {
  const [goals, setGoals] = React.useState<any[]>([]);
  const [form, setForm] = React.useState({ type: 'expense', period: 'monthly', amount: '' });
  const [editingId, setEditingId] = React.useState<number | null>(null);

  React.useEffect(() => {
    getBudgetGoals(setGoals);
  }, []);

  const handleAddOrUpdate = () => {
    if (!form.amount) return;
    if (editingId === null) {
      addBudgetGoal(form.type, form.period, Number(form.amount), () => getBudgetGoals(setGoals));
    } else {
      updateBudgetGoal(editingId, Number(form.amount), () => getBudgetGoals(setGoals));
      setEditingId(null);
    }
    setForm({ type: 'expense', period: 'monthly', amount: '' });
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ type: item.type, period: item.period, amount: String(item.amount) });
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete', 'Delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteBudgetGoal(id, () => getBudgetGoals(setGoals)); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget Goals</Text>
      <View style={styles.formRow}>
        <Text style={styles.label}>Type:</Text>
        <TouchableOpacity style={form.type === 'expense' ? styles.selectedButton : styles.button} onPress={() => setForm(f => ({ ...f, type: 'expense' }))}><Text>Expense</Text></TouchableOpacity>
        <TouchableOpacity style={form.type === 'income' ? styles.selectedButton : styles.button} onPress={() => setForm(f => ({ ...f, type: 'income' }))}><Text>Income</Text></TouchableOpacity>
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>Period:</Text>
        <TouchableOpacity style={form.period === 'monthly' ? styles.selectedButton : styles.button} onPress={() => setForm(f => ({ ...f, period: 'monthly' }))}><Text>Monthly</Text></TouchableOpacity>
        <TouchableOpacity style={form.period === 'weekly' ? styles.selectedButton : styles.button} onPress={() => setForm(f => ({ ...f, period: 'weekly' }))}><Text>Weekly</Text></TouchableOpacity>
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>Amount:</Text>
        <TextInput style={styles.input} value={form.amount} onChangeText={v => setForm(f => ({ ...f, amount: v }))} placeholder="Amount" keyboardType="numeric" />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdate}>
        <Text style={styles.buttonText}>{editingId === null ? 'Add Goal' : 'Update Goal'}</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Goals List</Text>
      <FlatList
        data={goals}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.goalRow}>
            <Text style={styles.goalText}>{item.type} | {item.period} | {item.amount}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}><Text style={styles.buttonText}>Edit</Text></TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}><Text style={styles.buttonText}>Delete</Text></TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#333' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: '#333' },
  label: { fontSize: 16, color: '#333', marginRight: 8 },
  formRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#BDBDBD', borderRadius: 8, padding: 8, fontSize: 16, flex: 1, marginLeft: 8, backgroundColor: '#F5F5F5' },
  addButton: { backgroundColor: '#4BC0C0', padding: 12, borderRadius: 8, marginTop: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  button: { backgroundColor: '#E2E2E2', padding: 8, borderRadius: 8, marginLeft: 8 },
  selectedButton: { backgroundColor: '#36A2EB', padding: 8, borderRadius: 8, marginLeft: 8 },
  goalRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  goalText: { flex: 1, fontSize: 16, color: '#333' },
  editButton: { backgroundColor: '#8BC34A', padding: 8, borderRadius: 8, marginLeft: 8 },
  deleteButton: { backgroundColor: '#F7464A', padding: 8, borderRadius: 8, marginLeft: 8 },
});
