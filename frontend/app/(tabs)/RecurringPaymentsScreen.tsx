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
      <Text style={styles.title}>Recurring Payments</Text>
      <View style={styles.formRow}>
        <Text>Type:</Text>
        <Picker
          selectedValue={form.type}
          style={styles.picker}
          onValueChange={v => setForm(f => ({ ...f, type: v }))}
        >
          {types.map(t => <Picker.Item key={t} label={t} value={t} />)}
        </Picker>
      </View>
      <View style={styles.formRow}>
        <Text>Category:</Text>
        <TextInput style={styles.input} value={form.category} onChangeText={v => setForm(f => ({ ...f, category: v }))} placeholder="Category" />
      </View>
      <View style={styles.formRow}>
        <Text>Value:</Text>
        <TextInput style={styles.input} value={form.value} onChangeText={v => setForm(f => ({ ...f, value: v }))} placeholder="Amount" keyboardType="numeric" />
      </View>
      <View style={styles.formRow}>
        <Text>Start Date:</Text>
        <TextInput style={styles.input} value={form.start_date} onChangeText={v => setForm(f => ({ ...f, start_date: v }))} placeholder="YYYY-MM-DD" />
      </View>
      <View style={styles.formRow}>
        <Text>Frequency:</Text>
        <Picker
          selectedValue={form.frequency}
          style={styles.picker}
          onValueChange={v => setForm(f => ({ ...f, frequency: v }))}
        >
          {frequencies.map(f => <Picker.Item key={f} label={f} value={f} />)}
        </Picker>
      </View>
      <View style={styles.formRow}>
        <Text>Note:</Text>
        <TextInput style={styles.input} value={form.note} onChangeText={v => setForm(f => ({ ...f, note: v }))} placeholder="Note (optional)" />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdate}>
        <Text style={styles.buttonText}>{editingId === null ? 'Add' : 'Update'}</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>List</Text>
      <FlatList
        data={payments}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.paymentRow}>
            <Text style={styles.paymentText}>{item.type} | {item.category} | {item.value} | {item.frequency} | {item.start_date}</Text>
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
  formRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#BDBDBD', borderRadius: 8, padding: 8, fontSize: 16, flex: 1, marginLeft: 8, backgroundColor: '#F5F5F5' },
  picker: { flex: 1, marginLeft: 8 },
  addButton: { backgroundColor: '#4BC0C0', padding: 12, borderRadius: 8, marginTop: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  paymentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  paymentText: { flex: 1, fontSize: 16, color: '#333' },
  editButton: { backgroundColor: '#36A2EB', padding: 8, borderRadius: 8, marginLeft: 8 },
  deleteButton: { backgroundColor: '#F7464A', padding: 8, borderRadius: 8, marginLeft: 8 },
});
