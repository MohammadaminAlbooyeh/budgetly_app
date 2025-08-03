import React, { useEffect, useState } from 'react';
import { BudgetProvider, useBudget } from '@/context/BudgetContext';
import { Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState<'EXPENSES' | 'INCOME'>('EXPENSES');
  const navigation = useNavigation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { expenses, incomes } = useBudget();

  return (
    <>
      <ThemedView style={styles.header}>
        <TouchableOpacity style={styles.menuIcon} onPress={() => {}}>
          <Ionicons name="menu" size={32} color="#333" onPress={() => setDrawerOpen(true)} />
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
      {/* Sidebar Drawer */}
      {drawerOpen && (
        <ThemedView style={styles.drawerOverlay}>
          <ThemedView style={styles.drawer}>
            <TouchableOpacity style={styles.drawerClose} onPress={() => setDrawerOpen(false)}>
              <Ionicons name="close" size={32} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerExpensesButton} onPress={() => { setDrawerOpen(false); navigation.navigate('ExpensesScreen' as never); }}>
              <ThemedText style={styles.drawerExpensesButtonText}>Expenses</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerIncomeButton} onPress={() => { setDrawerOpen(false); navigation.navigate('IncomeScreen' as never); }}>
              <ThemedText style={styles.drawerIncomeButtonText}>Income</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      )}
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
          { name: 'Credits', population: 980, color: '#4CAF50', legendFontColor: '#fff', legendFontSize: 12 },
          { name: 'Grocery', population: 32, color: '#2196F3', legendFontColor: '#fff', legendFontSize: 12 },
          { name: 'Restaurants', population: 2500, color: '#FFC107', legendFontColor: '#fff', legendFontSize: 12 },
          { name: 'Home', population: 625, color: '#F44336', legendFontColor: '#fff', legendFontSize: 12 },
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
          backgroundColor="#fff"
        paddingLeft={"16"}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => {/* Add expense logic */}}>
          <Ionicons name="add-circle" size={48} color="#FFA000" />
        </TouchableOpacity>
        {/* Move total expenses text below chart and button */}
        <ThemedText style={styles.pieTotalText}>
          Total Expenses: {expenses.reduce((sum, e) => sum + Number(e.value), 0)} $
        </ThemedText>
        <ThemedText style={styles.pieTotalText}>
          Total Income: {incomes.reduce((sum, i) => sum + Number(i.value), 0)} $
        </ThemedText>
      </ThemedView>
      {/* Table of all expenses and incomes in a new box below Pie Chart */}
      <ThemedView style={styles.tableBox}>
        <ThemedView style={styles.tableHeaderRow}>
          <ThemedText style={styles.tableHeaderText}>Category</ThemedText>
          <ThemedText style={styles.tableHeaderText}>Value</ThemedText>
        </ThemedView>
        {/* Expenses Rows */}
        {expenses.map((item, idx) => (
          <ThemedView key={`expense-${idx}`} style={styles.tableRow}>
            <ThemedText style={styles.tableCell}>{item.category}</ThemedText>
            <ThemedText style={styles.tableCell}>{item.value}</ThemedText>
          </ThemedView>
        ))}
        {/* Incomes Rows */}
        {incomes.map((item, idx) => (
          <ThemedView key={`income-${idx}`} style={styles.tableRow}>
            <ThemedText style={styles.tableCell}>{item.category}</ThemedText>
            <ThemedText style={styles.tableCell}>{item.value}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </>
  );
}
  

const styles = StyleSheet.create({
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
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
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
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 8,
    marginLeft: 8,
  },
  exploreBottomButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#1976D2',
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  exploreBottomButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 100,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  drawer: {
    width: 220,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  drawerClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  drawerExpensesButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 64,
    marginBottom: 16,
  },
  drawerExpensesButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  drawerIncomeButton: {
    backgroundColor: '#388E3C',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  drawerIncomeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  pieContainer: {
    alignItems: 'center',
    marginVertical: 16,
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    position: 'absolute',
    right: 24,
    top: 24,
    zIndex: 10,
  },
  pieTotalText: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
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
  expensesBottomButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#D32F2F',
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  expensesBottomButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});