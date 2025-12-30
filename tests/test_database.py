"""
Database function tests for Budgetly
"""
import pytest
from mock_db import (
    localStorage,
    addExpenseCategory, getExpenseCategories,
    addIncomeCategory, getIncomeCategories,
    addExpense, getExpenses,
    addIncome, getIncomes,
    addBudgetGoal, getBudgetGoals, updateBudgetGoal, deleteBudgetGoal,
    addRecurringPayment, getRecurringPayments, updateRecurringPayment, deleteRecurringPayment
)


class TestDatabaseFunctions:
    """Test cases for database functions"""

    def test_expense_categories_crud(self):
        """Test CRUD operations for expense categories"""
        # Clear storage
        localStorage.clear()

        # Add categories
        addExpenseCategory('Food')
        addExpenseCategory('Transportation')

        # Verify categories were added
        categories = []
        getExpenseCategories(lambda cats: categories.extend(cats))
        assert len(categories) == 2
        assert 'Food' in categories
        assert 'Transportation' in categories

        # Add duplicate category (should not duplicate)
        addExpenseCategory('Food')
        categories = []
        getExpenseCategories(lambda cats: categories.extend(cats))
        assert categories.count('Food') == 1

    def test_income_categories_crud(self):
        """Test CRUD operations for income categories"""
        # Clear storage
        localStorage.clear()

        # Add categories
        addIncomeCategory('Salary')
        addIncomeCategory('Freelance')

        # Verify categories were added
        categories = []
        getIncomeCategories(lambda cats: categories.extend(cats))
        assert len(categories) == 2
        assert 'Salary' in categories
        assert 'Freelance' in categories

    def test_expenses_crud(self):
        """Test CRUD operations for expenses"""
        # Clear storage
        localStorage.clear()

        # Add expenses
        addExpense('Food', 50.0, '2024-01-01')
        addExpense('Transportation', 25.0, '2024-01-02')

        # Verify expenses were added
        expenses = []
        getExpenses(lambda items: expenses.extend(items))
        assert len(expenses) == 2

        # Check expense data
        food_expense = next(e for e in expenses if e['category'] == 'Food')
        assert food_expense['value'] == 50.0
        assert food_expense['date'] == '2024-01-01'
        assert 'id' in food_expense

        transport_expense = next(e for e in expenses if e['category'] == 'Transportation')
        assert transport_expense['value'] == 25.0
        assert transport_expense['date'] == '2024-01-02'

    def test_incomes_crud(self):
        """Test CRUD operations for incomes"""
        # Clear storage
        localStorage.clear()

        # Add incomes
        addIncome('Salary', 3000.0, '2024-01-01')
        addIncome('Freelance', 500.0, '2024-01-15')

        # Verify incomes were added
        incomes = []
        getIncomes(lambda items: incomes.extend(items))
        assert len(incomes) == 2

        # Check income data
        salary_income = next(i for i in incomes if i['category'] == 'Salary')
        assert salary_income['value'] == 3000.0
        assert salary_income['date'] == '2024-01-01'

        freelance_income = next(i for i in incomes if i['category'] == 'Freelance')
        assert freelance_income['value'] == 500.0
        assert freelance_income['date'] == '2024-01-15'

    def test_budget_goals_crud(self):
        """Test CRUD operations for budget goals"""
        # Clear storage
        localStorage.clear()

        # Add budget goals
        addBudgetGoal('expense', 'monthly', 1000.0)
        addBudgetGoal('income', 'monthly', 3500.0)

        # Verify goals were added
        goals = []
        getBudgetGoals(lambda items: goals.extend(items))
        assert len(goals) == 2

        # Check goal data
        expense_goal = next(g for g in goals if g['type'] == 'expense')
        assert expense_goal['period'] == 'monthly'
        assert expense_goal['amount'] == 1000.0

        income_goal = next(g for g in goals if g['type'] == 'income')
        assert income_goal['period'] == 'monthly'
        assert income_goal['amount'] == 3500.0

        # Update a goal
        updateBudgetGoal(expense_goal['id'], 1200.0)

        # Verify update
        goals = []
        getBudgetGoals(lambda items: goals.extend(items))
        updated_goal = next(g for g in goals if g['id'] == expense_goal['id'])
        assert updated_goal['amount'] == 1200.0

        # Delete a goal
        deleteBudgetGoal(expense_goal['id'])

        goals = []
        getBudgetGoals(lambda items: goals.extend(items))
        assert len(goals) == 1

    def test_recurring_payments_crud(self):
        """Test CRUD operations for recurring payments"""
        # Clear storage
        localStorage.clear()

        # Add recurring payments
        reminders1 = [{'days': 1, 'hours': 9}]
        reminders2 = [{'days': 15, 'hours': 10}]

        addRecurringPayment('expense', 'Rent', 1000.0, '2024-01-01',
                          'monthly', 'Monthly rent', reminders1)
        addRecurringPayment('income', 'Salary', 3000.0, '2024-01-01',
                          'monthly', 'Monthly salary', reminders2)

        # Verify payments were added
        payments = []
        getRecurringPayments(lambda items: payments.extend(items))
        assert len(payments) == 2

        # Check payment data
        rent_payment = next(p for p in payments if p['category'] == 'Rent')
        assert rent_payment['type'] == 'expense'
        assert rent_payment['value'] == 1000.0
        assert rent_payment['frequency'] == 'monthly'
        assert rent_payment['reminders'] == reminders1

        salary_payment = next(p for p in payments if p['category'] == 'Salary')
        assert salary_payment['type'] == 'income'
        assert salary_payment['value'] == 3000.0
        assert salary_payment['reminders'] == reminders2

        # Update a payment
        updateRecurringPayment(rent_payment['id'], 'expense', 'Rent', 1200.0,
                             '2024-01-01', 'monthly', 'Updated rent', reminders1)

        # Verify update
        payments = []
        getRecurringPayments(lambda items: payments.extend(items))
        updated_rent = next(p for p in payments if p['category'] == 'Rent')
        assert updated_rent['value'] == 1200.0

    def test_data_persistence(self):
        """Test data persistence across operations"""
        # Clear storage
        localStorage.clear()

        # Add various data
        addExpenseCategory('Food')
        addIncomeCategory('Salary')
        addExpense('Food', 100.0, '2024-01-01')
        addIncome('Salary', 3000.0, '2024-01-01')
        addBudgetGoal('expense', 'monthly', 1000.0)
        addRecurringPayment('expense', 'Rent', 1000.0, '2024-01-01',
                          'monthly', 'Monthly rent', [])

        # Verify all data persists
        expense_cats = []
        getExpenseCategories(lambda cats: expense_cats.extend(cats))
        assert len(expense_cats) == 1

        income_cats = []
        getIncomeCategories(lambda cats: income_cats.extend(cats))
        assert len(income_cats) == 1

        expenses = []
        getExpenses(lambda items: expenses.extend(items))
        assert len(expenses) == 1

        incomes = []
        getIncomes(lambda items: incomes.extend(items))
        assert len(incomes) == 1

        goals = []
        getBudgetGoals(lambda items: goals.extend(items))
        assert len(goals) == 1

        payments = []
        getRecurringPayments(lambda items: payments.extend(items))
        assert len(payments) == 1