import React, { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
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
        <>
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
          {/* Pie Chart Section */}
          <ThemedView style={styles.pieContainer}>
            <PieChart
              data={[
                { name: 'Credits', population: 980, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 12 },
                { name: 'Grocery', population: 32, color: '#2196F3', legendFontColor: '#333', legendFontSize: 12 },
                { name: 'Restaurants', population: 2500, color: '#FFC107', legendFontColor: '#333', legendFontSize: 12 },
                { name: 'Home', population: 625, color: '#F44336', legendFontColor: '#333', legendFontSize: 12 },
              ]}
              width={Dimensions.get('window').width - 32}
              height={180}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
              }}
              accessor="population"
              // Remove unsupported props: hasLegend, center, absolute
            />
            <TouchableOpacity style={styles.addButton} onPress={() => {/* Add expense logic */}}>
              <Ionicons name="add-circle" size={48} color="#FFA000" />
            </TouchableOpacity>
            <ThemedText style={styles.pieCenterText}>
              {activeTab === 'EXPENSES' ? 'Total Expenses: 2845 $' : 'Total Income: ...'}
            </ThemedText>
          </ThemedView>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  pieContainer: {
    alignItems: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    top: 24,
    zIndex: 10,
  },
  pieCenterText: {
    position: 'absolute',
    top: 80,
    left: '40%',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
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