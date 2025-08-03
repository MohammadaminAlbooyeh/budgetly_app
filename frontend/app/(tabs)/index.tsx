import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Image } from 'expo-image';
import { StyleSheet, TextInput, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [selectedRange, setSelectedRange] = useState<'Day' | 'Week' | 'Month' | 'Year' | 'Period'>('Day');
  const [selectedDate, setSelectedDate] = useState('Today, July 25');
  // Example balance value
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState<'EXPENSES' | 'INCOME'>('EXPENSES');

  return (
    <>
      <ThemedView style={styles.header}>
        <TouchableOpacity style={styles.menuIcon} onPress={() => {}}>
          <Ionicons name="menu" size={32} color="#333" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.balanceLabel}>BALANCE</ThemedText>
        <ThemedText style={styles.balanceValue}>{balance} $</ThemedText>
        <ThemedView style={styles.tabs}>
          <Button
            title="EXPENSES"
            color="#D32F2F"
            onPress={() => setActiveTab('EXPENSES')}
          />
          <Button
            title="INCOME"
            color="#388E3C"
            onPress={() => setActiveTab('INCOME')}
          />
        </ThemedView>
      </ThemedView>
      {/* Time Filter Section - Show for both EXPENSES and INCOME tabs */}
      {(activeTab === 'EXPENSES' || activeTab === 'INCOME') && (
        <ThemedView style={styles.filterContainer}>
          <ThemedView style={styles.rangeRow}>
            {['Day', 'Week', 'Month', 'Year', 'Period'].map(range => (
              <Button
                key={range}
                title={range}
                color={selectedRange === range ? '#1976D2' : '#BDBDBD'}
                onPress={() => setSelectedRange(range as any)}
              />
            ))}
          </ThemedView>
          <ThemedText style={styles.selectedDate}>{selectedDate}</ThemedText>
        </ThemedView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
    gap: 4,
  },
  selectedDate: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 24,
    backgroundColor: '#A1CEDC',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    position: 'relative',
  },
  menuIcon: {
    position: 'absolute',
    left: 16,
    top: 44,
    zIndex: 10,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 12,
  },
});