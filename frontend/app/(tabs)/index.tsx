import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Image } from 'expo-image';
import { StyleSheet, TextInput, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [budget, setBudget] = useState<{ budget: number; currency: string } | null>(null);
  const [newBudget, setNewBudget] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://192.168.1.110:5000/api/budget')
      .then(response => setBudget(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleSubmit = () => {
    axios.post('http://192.168.1.110:5000/api/budget', {
      budget: Number(newBudget),
      currency: 'IRR'
    })
    .then(response => setMessage(response.data.message))
    .catch(error => setMessage('Error sending data'));
  };

  return (
    <ThemedView style={styles.container}>
      {/* React logo removed as requested */}
      <ThemedText type="title">Your budget:</ThemedText>
      <ThemedText>
        {budget ? `${budget.budget} ${budget.currency}` : 'Loading...'}
      </ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Enter new budget"
        keyboardType="numeric"
        value={newBudget}
        onChangeText={setNewBudget}
      />
      <Button title="Submit Budget" onPress={handleSubmit} />
      {message ? <ThemedText>{message}</ThemedText> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    width: '80%',
  },
});