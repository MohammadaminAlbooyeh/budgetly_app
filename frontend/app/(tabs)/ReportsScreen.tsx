import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useBudget } from '@/context/BudgetContext';
import { PieChart } from 'react-native-chart-kit';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

import { Entry } from '@/context/BudgetContext';

function getChartData(entries: Entry[]): Array<{ name: string; value: number; color: string; legendFontColor: string; legendFontSize: number }> {
  const categoryTotals = entries.reduce((acc: Record<string, number>, entry: Entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + Number(entry.value);
    return acc;
  }, {});
  return Object.entries(categoryTotals).map(([category, value], idx) => ({
    name: category,
    value,
    color: chartColors[idx % chartColors.length],
    legendFontColor: '#333',
    legendFontSize: 14,
  }));
}

const chartColors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#E2E2E2', '#BDBDBD', '#8BC34A', '#FF9800'
];

export default function ReportsScreen() {
  const { expenses, incomes } = useBudget();
  const incomeData = getChartData(incomes);
  const expenseData = getChartData(expenses);

  // Monthly trends
  function getMonthlyTotals(entries: Entry[]) {
    const monthly: Record<string, number> = {};
    entries.forEach(e => {
      const month = e.date ? e.date.slice(0, 7) : 'Unknown';
      monthly[month] = (monthly[month] || 0) + Number(e.value);
    });
    return monthly;
  }
  const expenseMonthly = getMonthlyTotals(expenses);
  const incomeMonthly = getMonthlyTotals(incomes);
  const months = Array.from(new Set([...Object.keys(expenseMonthly), ...Object.keys(incomeMonthly)])).sort();
  const expenseMonthlyData = months.map(m => expenseMonthly[m] || 0);
  const incomeMonthlyData = months.map(m => incomeMonthly[m] || 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <Text style={styles.sectionTitle}>Monthly Trends</Text>
      {months.length > 0 ? (
        <LineChart
          data={{
            labels: months,
            datasets: [
              { data: expenseMonthlyData, color: () => '#F7464A', strokeWidth: 2, label: 'Expenses' },
              { data: incomeMonthlyData, color: () => '#36A2EB', strokeWidth: 2, label: 'Incomes' },
            ],
            legend: ['Expenses', 'Incomes'],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      ) : <Text style={styles.emptyText}>No monthly data</Text>}
      <Text style={styles.sectionTitle}>Income by Category</Text>
      {incomeData.length > 0 ? (
        <PieChart
          data={incomeData.map(item => ({
            name: item.name,
            population: item.value,
            color: item.color,
            legendFontColor: item.legendFontColor,
            legendFontSize: item.legendFontSize,
          }))}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'16'}
          absolute
        />
      ) : <Text style={styles.emptyText}>No income data</Text>}
      <Text style={styles.sectionTitle}>Expenses by Category</Text>
      {expenseData.length > 0 ? (
        <PieChart
          data={expenseData.map(item => ({
            name: item.name,
            population: item.value,
            color: item.color,
            legendFontColor: item.legendFontColor,
            legendFontSize: item.legendFontSize,
          }))}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'16'}
          absolute
        />
      ) : <Text style={styles.emptyText}>No expense data</Text>}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

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
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 16,
  },
});
