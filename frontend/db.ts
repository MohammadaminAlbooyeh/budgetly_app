import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('budgetly.db');

export function initDB() {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS budget_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT, -- 'expense' or 'income'
        period TEXT, -- 'monthly' or 'weekly'
        amount REAL
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS expense_categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS income_categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, value REAL, date TEXT);`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS incomes (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, value REAL, date TEXT);`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS recurring_payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT, -- 'expense' or 'income'
        category TEXT,
        value REAL,
        start_date TEXT,
        frequency TEXT, -- 'daily', 'weekly', 'monthly', 'yearly'
        note TEXT,
        reminders TEXT -- JSON string: [{days: number, hours: number}]
      );`
    );
  });
}

// Budget Goals CRUD
export function getBudgetGoals(callback: (items: {id: number, type: string, period: string, amount: number}[]) => void) {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM budget_goals;', [], (_, { rows }) => callback(rows._array));
  });
}

export function addBudgetGoal(type: string, period: string, amount: number, callback?: () => void) {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO budget_goals (type, period, amount) VALUES (?, ?, ?);', [type, period, amount], () => callback && callback());
  });
}

export function updateBudgetGoal(id: number, amount: number, callback?: () => void) {
  db.transaction(tx => {
    tx.executeSql('UPDATE budget_goals SET amount = ? WHERE id = ?;', [amount, id], () => callback && callback());
  });
}

export function deleteBudgetGoal(id: number, callback?: () => void) {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM budget_goals WHERE id = ?;', [id], () => callback && callback());
  });
}
// Recurring Payments CRUD
export function getRecurringPayments(callback: (items: {id: number, type: string, category: string, value: number, start_date: string, frequency: string, note: string, reminders: Array<{days: number, hours: number}>}[]) => void) {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM recurring_payments;', [], (_, { rows }) => {
      const arr = rows._array.map((row: any) => ({
        ...row,
        reminders: row.reminders ? JSON.parse(row.reminders) : [],
      }));
      callback(arr);
    });
  });
}

export function addRecurringPayment(type: string, category: string, value: number, start_date: string, frequency: string, note: string, reminders: Array<{days: number, hours: number}>, callback?: () => void) {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO recurring_payments (type, category, value, start_date, frequency, note, reminders) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [type, category, value, start_date, frequency, note, JSON.stringify(reminders)],
      () => callback && callback()
    );
  });
}

export function deleteRecurringPayment(id: number, callback?: () => void) {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM recurring_payments WHERE id = ?;', [id], () => callback && callback());
  });
}

export function updateRecurringPayment(id: number, type: string, category: string, value: number, start_date: string, frequency: string, note: string, reminders: Array<{days: number, hours: number}>, callback?: () => void) {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE recurring_payments SET type = ?, category = ?, value = ?, start_date = ?, frequency = ?, note = ?, reminders = ? WHERE id = ?;',
      [type, category, value, start_date, frequency, note, JSON.stringify(reminders), id],
      () => callback && callback()
    );
  });
}

export function getExpenseCategories(callback: (cats: string[]) => void) {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT name FROM expense_categories;',
      [],
      (_, { rows }) => callback(rows._array.map(row => row.name))
    );
  });
}

export function addExpenseCategory(name: string, callback?: () => void) {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO expense_categories (name) VALUES (?);', [name], () => callback && callback());
  });
}

export function deleteExpenseCategory(name: string, callback?: () => void) {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM expense_categories WHERE name = ?;', [name], () => callback && callback());
  });
}

export function getIncomeCategories(callback: (cats: string[]) => void) {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT name FROM income_categories;',
      [],
      (_, { rows }) => callback(rows._array.map(row => row.name))
    );
  });
}

export function addIncomeCategory(name: string, callback?: () => void) {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO income_categories (name) VALUES (?);', [name], () => callback && callback());
  });
}

export function deleteIncomeCategory(name: string, callback?: () => void) {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM income_categories WHERE name = ?;', [name], () => callback && callback());
  });
}

export function getExpenses(callback: (items: {category: string, value: number, date: string}[]) => void) {
  db.transaction(tx => {
    tx.executeSql('SELECT category, value, date FROM expenses;', [], (_, { rows }) => callback(rows._array));
  });
}

export function addExpense(category: string, value: number, date: string, callback?: () => void) {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO expenses (category, value, date) VALUES (?, ?, ?);', [category, value, date], () => callback && callback());
  });
}

export function getIncomes(callback: (items: {category: string, value: number, date: string}[]) => void) {
  db.transaction(tx => {
    tx.executeSql('SELECT category, value, date FROM incomes;', [], (_, { rows }) => callback(rows._array));
  });
}

export function addIncome(category: string, value: number, date: string, callback?: () => void) {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO incomes (category, value, date) VALUES (?, ?, ?);', [category, value, date], () => callback && callback());
  });
}
