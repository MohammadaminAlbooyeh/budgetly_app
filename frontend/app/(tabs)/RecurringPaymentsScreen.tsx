import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Picker, Alert } from 'react-native';
import { getRecurringPayments, addRecurringPayment, deleteRecurringPayment, updateRecurringPayment } from '@/db';

const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];
const types = ['expense', 'income'];

export default function RecurringPaymentsScreen() {
  const [payments, setPayments] = React.useState<any[]>([]);
  const [form, setForm] = React.useState({
    type: 'expense',
    category: '',
    value: '',
    start_date: '',
    frequency: 'monthly',
    note: '',
  });
  const [editingId, setEditingId] = React.useState<number | null>(null);

  React.useEffect(() => {
    getRecurringPayments(setPayments);
  }, []);

  const handleAddOrUpdate = () => {
    if (!form.category || !form.value || !form.start_date) return;
    if (editingId === null) {
      addRecurringPayment(form.type, form.category, Number(form.value), form.start_date, form.frequency, form.note, () => getRecurringPayments(setPayments));
    } else {
      updateRecurringPayment(editingId, form.type, form.category, Number(form.value), form.start_date, form.frequency, form.note, () => getRecurringPayments(setPayments));
      setEditingId(null);
    }
    setForm({ type: 'expense', category: '', value: '', start_date: '', frequency: 'monthly', note: '' });
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      type: item.type,
      category: item.category,
      value: String(item.value),
      start_date: item.start_date,
      frequency: item.frequency,
      note: item.note || '',
    });
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete', 'Delete this recurring payment?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteRecurringPayment(id, () => getRecurringPayments(setPayments)); } },
    ]);
  };

  return (
    <View style={styles.container}>
  <Text style={styles.title} accessibilityRole="header" accessibilityLabel="Recurring Payments">Recurring Payments</Text>
      <View style={styles.formRow}>
        <Text style={styles.label} accessibilityLabel="Type">Type:</Text>
        <Picker
          selectedValue={form.type}
          style={styles.picker}
          onValueChange={v => setForm(f => ({ ...f, type: v }))}
          accessibilityLabel="Type Picker"
          accessibilityRole="combobox"
        >
          {types.map(t => <Picker.Item key={t} label={t} value={t} />)}
        </Picker>
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label} accessibilityLabel="Category">Category:</Text>
        <TextInput style={styles.input} value={form.category} onChangeText={v => setForm(f => ({ ...f, category: v }))} placeholder="Category" accessibilityLabel="Category Input" accessibilityRole="textbox" />
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label} accessibilityLabel="Value">Value:</Text>
        <TextInput style={styles.input} value={form.value} onChangeText={v => setForm(f => ({ ...f, value: v }))} placeholder="Amount" keyboardType="numeric" accessibilityLabel="Value Input" accessibilityRole="spinbutton" />
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label} accessibilityLabel="Start Date">Start Date:</Text>
        <TextInput style={styles.input} value={form.start_date} onChangeText={v => setForm(f => ({ ...f, start_date: v }))} placeholder="YYYY-MM-DD" accessibilityLabel="Start Date Input" accessibilityRole="textbox" />
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label} accessibilityLabel="Frequency">Frequency:</Text>
        <Picker
          selectedValue={form.frequency}
          style={styles.picker}
          onValueChange={v => setForm(f => ({ ...f, frequency: v }))}
          accessibilityLabel="Frequency Picker"
          accessibilityRole="combobox"
        >
          {frequencies.map(f => <Picker.Item key={f} label={f} value={f} />)}
        </Picker>
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label} accessibilityLabel="Note">Note:</Text>
        <TextInput style={styles.input} value={form.note} onChangeText={v => setForm(f => ({ ...f, note: v }))} placeholder="Note (optional)" accessibilityLabel="Note Input" accessibilityRole="textbox" />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdate} accessibilityRole="button" accessibilityLabel={editingId === null ? 'Add Payment' : 'Update Payment'}>
        <Text style={styles.buttonText}>{editingId === null ? 'Add' : 'Update'}</Text>
      </TouchableOpacity>
  <Text style={styles.sectionTitle} accessibilityRole="header" accessibilityLabel="Payments List">List</Text>
      <FlatList
        data={payments}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.paymentRow} accessible accessibilityRole="listitem" accessibilityLabel={`Payment: ${item.type}, ${item.category}, ${item.value}, ${item.frequency}, ${item.start_date}`}>
            <Text style={styles.paymentText}>{item.type} | {item.category} | {item.value} | {item.frequency} | {item.start_date}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)} accessibilityRole="button" accessibilityLabel="Edit Payment"><Text style={styles.buttonText}>Edit</Text></TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)} accessibilityRole="button" accessibilityLabel="Delete Payment"><Text style={styles.buttonText}>Delete</Text></TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 28, textAlign: 'center', color: '#333' },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 20, marginBottom: 12, color: '#333' },
  label: { fontSize: 20, color: '#333', marginRight: 8 },
  formRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#BDBDBD', borderRadius: 8, padding: 12, fontSize: 20, flex: 1, marginLeft: 8, backgroundColor: '#F5F5F5' },
  picker: { flex: 1, marginLeft: 8 },
  addButton: { backgroundColor: '#4BC0C0', padding: 16, borderRadius: 8, marginTop: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  paymentText: { flex: 1, fontSize: 20, color: '#333' },
  editButton: { backgroundColor: '#36A2EB', padding: 10, borderRadius: 8, marginLeft: 8 },
  deleteButton: { backgroundColor: '#F7464A', padding: 10, borderRadius: 8, marginLeft: 8 },
});
