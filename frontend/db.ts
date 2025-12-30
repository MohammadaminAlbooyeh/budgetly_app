// Database module for Budgetly App
// Uses localStorage for web compatibility

// Web storage using localStorage
const webStorage = {
  budget_goals: [] as any[],
  expense_categories: [] as any[],
  income_categories: [] as any[],
  expenses: [] as any[],
  incomes: [] as any[],
  recurring_payments: [] as any[],
};

// Load data from localStorage
const loadWebStorage = () => {
  try {
    const data = localStorage.getItem('budgetly_data');
    if (data) {
      Object.assign(webStorage, JSON.parse(data));
    }
  } catch (e) {
    console.warn('Failed to load web storage data:', e);
  }
};

// Save data to localStorage
const saveWebStorage = () => {
  try {
    localStorage.setItem('budgetly_data', JSON.stringify(webStorage));
  } catch (e) {
    console.warn('Failed to save web storage data:', e);
  }
};

// Initialize web storage
loadWebStorage();

export function initDB() {
  // Web: Just ensure localStorage is initialized
  saveWebStorage();
  console.log('Database initialized for web');
}

// Budget Goals CRUD
export function getBudgetGoals(callback: (items: {id: number, type: string, period: string, amount: number}[]) => void) {
  if (isWeb) {
    callback(webStorage.budget_goals);
  } else {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM budget_goals;', [], (_, { rows }) => callback(rows._array));
    });
  }
}

export function addBudgetGoal(type: string, period: string, amount: number, callback?: () => void) {
  if (isWeb) {
    const newGoal = {
      id: Date.now(), // Simple ID generation for web
      type,
      period,
      amount
    };
    webStorage.budget_goals.push(newGoal);
    saveWebStorage();
    callback && callback();
  } else {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO budget_goals (type, period, amount) VALUES (?, ?, ?);', [type, period, amount], () => callback && callback());
    });
  }
}

export function updateBudgetGoal(id: number, amount: number, callback?: () => void) {
  if (isWeb) {
    const goal = webStorage.budget_goals.find(g => g.id === id);
    if (goal) {
      goal.amount = amount;
      saveWebStorage();
    }
    callback && callback();
  } else {
    db.transaction(tx => {
      tx.executeSql('UPDATE budget_goals SET amount = ? WHERE id = ?;', [amount, id], () => callback && callback());
    });
  }
}

export function deleteBudgetGoal(id: number, callback?: () => void) {
  if (isWeb) {
    webStorage.budget_goals = webStorage.budget_goals.filter(g => g.id !== id);
    saveWebStorage();
    callback && callback();
  } else {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM budget_goals WHERE id = ?;', [id], () => callback && callback());
    });
  }
}
// Recurring Payments CRUD
export function getRecurringPayments(callback: (items: {id: number, type: string, category: string, value: number, start_date: string, frequency: string, note: string, reminders: Array<{days: number, hours: number}>}[]) => void) {
  if (isWeb) {
    callback(webStorage.recurring_payments);
  } else {
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
}

export function addRecurringPayment(type: string, category: string, value: number, start_date: string, frequency: string, note: string, reminders: Array<{days: number, hours: number}>, callback?: () => void) {
  if (isWeb) {
    const newPayment = {
      id: Date.now(),
      type,
      category,
      value,
      start_date,
      frequency,
      note,
      reminders
    };
    webStorage.recurring_payments.push(newPayment);
    saveWebStorage();
    callback && callback();
  } else {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO recurring_payments (type, category, value, start_date, frequency, note, reminders) VALUES (?, ?, ?, ?, ?, ?, ?);',
        [type, category, value, start_date, frequency, note, JSON.stringify(reminders)],
        () => callback && callback()
      );
    });
  }
}

export function deleteRecurringPayment(id: number, callback?: () => void) {
  if (isWeb) {
    webStorage.recurring_payments = webStorage.recurring_payments.filter(p => p.id !== id);
    saveWebStorage();
    callback && callback();
  } else {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM recurring_payments WHERE id = ?;', [id], () => callback && callback());
    });
  }
}

export function updateRecurringPayment(id: number, type: string, category: string, value: number, start_date: string, frequency: string, note: string, reminders: Array<{days: number, hours: number}>, callback?: () => void) {
  if (isWeb) {
    const payment = webStorage.recurring_payments.find(p => p.id === id);
    if (payment) {
      Object.assign(payment, { type, category, value, start_date, frequency, note, reminders });
      saveWebStorage();
    }
    callback && callback();
  } else {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE recurring_payments SET type = ?, category = ?, value = ?, start_date = ?, frequency = ?, note = ?, reminders = ? WHERE id = ?;',
        [type, category, value, start_date, frequency, note, JSON.stringify(reminders), id],
        () => callback && callback()
      );
    });
  }
}

export function getExpenseCategories(callback: (cats: string[]) => void) {
  if (isWeb) {
    callback(webStorage.expense_categories.map(c => c.name));
  } else {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT name FROM expense_categories;',
        [],
        (_, { rows }) => callback(rows._array.map(row => row.name))
      );
    });
  }
}

export function addExpenseCategory(name: string, callback?: () => void) {
  if (isWeb) {
    if (!webStorage.expense_categories.find(c => c.name === name)) {
      webStorage.expense_categories.push({ id: Date.now(), name });
      saveWebStorage();
    }
    callback && callback();
  } else {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO expense_categories (name) VALUES (?);', [name], () => callback && callback());
    });
  }
}

export function deleteExpenseCategory(name: string, callback?: () => void) {
  if (isWeb) {
    webStorage.expense_categories = webStorage.expense_categories.filter(c => c.name !== name);
    saveWebStorage();
    callback && callback();
  } else {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM expense_categories WHERE name = ?;', [name], () => callback && callback());
    });
  }
}

export function getIncomeCategories(callback: (cats: string[]) => void) {
  if (isWeb) {
    callback(webStorage.income_categories.map(c => c.name));
  } else {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT name FROM income_categories;',
        [],
        (_, { rows }) => callback(rows._array.map(row => row.name))
      );
    });
  }
}

export function addIncomeCategory(name: string, callback?: () => void) {
  if (isWeb) {
    if (!webStorage.income_categories.find(c => c.name === name)) {
      webStorage.income_categories.push({ id: Date.now(), name });
      saveWebStorage();
    }
    callback && callback();
  } else {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO income_categories (name) VALUES (?);', [name], () => callback && callback());
    });
  }
}

export function deleteIncomeCategory(name: string, callback?: () => void) {
  if (isWeb) {
    webStorage.income_categories = webStorage.income_categories.filter(c => c.name !== name);
    saveWebStorage();
    callback && callback();
  } else {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM income_categories WHERE name = ?;', [name], () => callback && callback());
    });
  }
}

export function getExpenses(callback: (items: {category: string, value: number, date: string}[]) => void) {
  if (isWeb) {
    callback(webStorage.expenses);
  } else {
    db.transaction(tx => {
      tx.executeSql('SELECT category, value, date FROM expenses;', [], (_, { rows }) => callback(rows._array));
    });
  }
}

export function addExpense(category: string, value: number, date: string, callback?: () => void) {
  if (isWeb) {
    const newExpense = {
      id: Date.now(),
      category,
      value,
      date
    };
    webStorage.expenses.push(newExpense);
    saveWebStorage();
    callback && callback();
  } else {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO expenses (category, value, date) VALUES (?, ?, ?);', [category, value, date], () => callback && callback());
    });
  }
}

export function getIncomes(callback: (items: {category: string, value: number, date: string}[]) => void) {
  if (isWeb) {
    callback(webStorage.incomes);
  } else {
    db.transaction(tx => {
      tx.executeSql('SELECT category, value, date FROM incomes;', [], (_, { rows }) => callback(rows._array));
    });
  }
}

export function addIncome(category: string, value: number, date: string, callback?: () => void) {
  if (isWeb) {
    const newIncome = {
      id: Date.now(),
      category,
      value,
      date
    };
    webStorage.incomes.push(newIncome);
    saveWebStorage();
    callback && callback();
  } else {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO incomes (category, value, date) VALUES (?, ?, ?);', [category, value, date], () => callback && callback());
    });
  }
}
