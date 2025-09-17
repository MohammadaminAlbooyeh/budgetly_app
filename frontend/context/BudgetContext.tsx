import React, { createContext, useContext, useState } from 'react';

export type Entry = { category: string; value: string };
export type BudgetContextType = {
  expenses: Entry[];
  incomes: Entry[];
  expenseCategories: string[];
  incomeCategories: string[];
  addExpense: (entry: Entry) => void;
  addIncome: (entry: Entry) => void;
  addExpenseCategory: (category: string) => void;
  editExpenseCategory: (oldCategory: string, newCategory: string) => void;
  deleteExpenseCategory: (category: string) => void;
  addIncomeCategory: (category: string) => void;
  editIncomeCategory: (oldCategory: string, newCategory: string) => void;
  deleteIncomeCategory: (category: string) => void;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Entry[]>([]);
  const [incomes, setIncomes] = useState<Entry[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<string[]>([
    'Grocery', 'Restaurants', 'Home', 'Transport', 'Health', 'Education', 'Entertainment', 'Shopping', 'Travel', 'Utilities', 'Insurance', 'Gifts', 'Other'
  ]);
  const [incomeCategories, setIncomeCategories] = useState<string[]>([
    'Salary', 'Bonus', 'Investments', 'Gifts', 'Refunds', 'Interest', 'Dividends', 'Business Income', 'Pension', 'Sale of Assets', 'Other'
  ]);

  const addExpense = (entry: Entry) => setExpenses((prev) => [...prev, entry]);
  const addIncome = (entry: Entry) => setIncomes((prev) => [...prev, entry]);

  // Expense Category Management
  const addExpenseCategory = (category: string) => {
    if (!expenseCategories.includes(category)) {
      setExpenseCategories((prev) => [...prev, category]);
    }
  };
  const editExpenseCategory = (oldCategory: string, newCategory: string) => {
    setExpenseCategories((prev) => prev.map(cat => cat === oldCategory ? newCategory : cat));
    setExpenses((prev) => prev.map(entry => entry.category === oldCategory ? { ...entry, category: newCategory } : entry));
  };
  const deleteExpenseCategory = (category: string) => {
    setExpenseCategories((prev) => prev.filter(cat => cat !== category));
    setExpenses((prev) => prev.filter(entry => entry.category !== category));
  };

  // Income Category Management
  const addIncomeCategory = (category: string) => {
    if (!incomeCategories.includes(category)) {
      setIncomeCategories((prev) => [...prev, category]);
    }
  };
  const editIncomeCategory = (oldCategory: string, newCategory: string) => {
    setIncomeCategories((prev) => prev.map(cat => cat === oldCategory ? newCategory : cat));
    setIncomes((prev) => prev.map(entry => entry.category === oldCategory ? { ...entry, category: newCategory } : entry));
  };
  const deleteIncomeCategory = (category: string) => {
    setIncomeCategories((prev) => prev.filter(cat => cat !== category));
    setIncomes((prev) => prev.filter(entry => entry.category !== category));
  };

  return (
    <BudgetContext.Provider value={{
      expenses,
      incomes,
      expenseCategories,
      incomeCategories,
      addExpense,
      addIncome,
      addExpenseCategory,
      editExpenseCategory,
      deleteExpenseCategory,
      addIncomeCategory,
      editIncomeCategory,
      deleteIncomeCategory,
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider');
  return ctx;
};
