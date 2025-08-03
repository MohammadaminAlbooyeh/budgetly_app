import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExpensesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses Page</Text>
      {/* Add your expenses list or details here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
});
