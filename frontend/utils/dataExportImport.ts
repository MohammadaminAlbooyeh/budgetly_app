import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getExpenses, getIncomes, getExpenseCategories, getIncomeCategories, getBudgetGoals, getRecurringPayments } from '@/db';

export async function exportAllDataToCSV() {
  // Fetch all data
  let expenses: any[] = [];
  let incomes: any[] = [];
  let expenseCategories: string[] = [];
  let incomeCategories: string[] = [];
  let goals: any[] = [];
  let recurring: any[] = [];

  await new Promise(resolve => getExpenses(data => { expenses = data; resolve(null); }));
  await new Promise(resolve => getIncomes(data => { incomes = data; resolve(null); }));
  await new Promise(resolve => getExpenseCategories(data => { expenseCategories = data; resolve(null); }));
  await new Promise(resolve => getIncomeCategories(data => { incomeCategories = data; resolve(null); }));
  await new Promise(resolve => getBudgetGoals(data => { goals = data; resolve(null); }));
  await new Promise(resolve => getRecurringPayments(data => { recurring = data; resolve(null); }));

  // Build CSV
  let csv = '';
  csv += 'Expense Categories\n' + expenseCategories.join(',') + '\n\n';
  csv += 'Income Categories\n' + incomeCategories.join(',') + '\n\n';
  csv += 'Expenses\ncategory,value,date\n' + expenses.map(e => `${e.category},${e.value},${e.date}`).join('\n') + '\n\n';
  csv += 'Incomes\ncategory,value,date\n' + incomes.map(i => `${i.category},${i.value},${i.date}`).join('\n') + '\n\n';
  csv += 'Budget Goals\ntype,period,amount\n' + goals.map(g => `${g.type},${g.period},${g.amount}`).join('\n') + '\n\n';
  csv += 'Recurring Payments\ntype,category,value,start_date,frequency,note,reminders\n' + recurring.map(r => `${r.type},${r.category},${r.value},${r.start_date},${r.frequency},${r.note},${JSON.stringify(r.reminders)}`).join('\n') + '\n';

  // Save and share
  const fileUri = FileSystem.documentDirectory + 'budgetly_export.csv';
  await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(fileUri);
}

// Import logic would parse CSV and update DB accordingly (not implemented here for brevity)
export async function importAllDataFromCSV(csv: string) {
  // Parse CSV and update DB
  // ...
}
