import React, { createContext, useContext, useState } from 'react';

export type Entry = { category: string; value: string };
export type BudgetContextType = {
  expenses: Entry[];
  incomes: Entry[];
  addExpense: (entry: Entry) => void;
  addIncome: (entry: Entry) => void;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Entry[]>([]);
  const [incomes, setIncomes] = useState<Entry[]>([]);

  const addExpense = (entry: Entry) => setExpenses((prev) => [...prev, entry]);
  const addIncome = (entry: Entry) => setIncomes((prev) => [...prev, entry]);

  return (
    <BudgetContext.Provider value={{ expenses, incomes, addExpense, addIncome }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider');
  return ctx;
};
