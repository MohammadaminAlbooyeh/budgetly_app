"""
Integration tests for the Budgetly application
"""
import json
import pytest
import requests
from unittest.mock import patch
from mock_db import (
    addExpense, getExpenses,
    addIncome, getIncomes,
    addBudgetGoal, getBudgetGoals, updateBudgetGoal, deleteBudgetGoal,
    addExpenseCategory, getExpenseCategories,
    addIncomeCategory, getIncomeCategories,
    addRecurringPayment, getRecurringPayments, updateRecurringPayment
)


class TestBudgetlyIntegration:
    """Integration tests for the complete Budgetly application"""

    def test_full_budget_workflow(self):
        """Test complete budget management workflow"""
        # This would test the full integration between frontend and backend
        # For now, we'll test the backend API integration

        # Note: In a real integration test, you'd start the Flask server
        # and test against the actual running application
        pass

    def test_data_consistency(self):
        """Test data consistency across different operations"""
        # Test that data remains consistent when performing multiple operations

        # Add multiple expenses and incomes
        addExpense('Food', 50.0, '2024-01-01')
        addExpense('Transportation', 25.0, '2024-01-02')
        addIncome('Salary', 3000.0, '2024-01-01')
        addIncome('Freelance', 500.0, '2024-01-15')
        addBudgetGoal('expense', 'monthly', 1000.0)

        # Verify all data is consistent
        expenses = []
        getExpenses(lambda items: expenses.extend(items))
        assert len(expenses) == 2

        incomes = []
        getIncomes(lambda items: incomes.extend(items))
        assert len(incomes) == 2

        goals = []
        getBudgetGoals(lambda items: goals.extend(items))
        assert len(goals) == 1

        # Calculate totals
        total_expenses = sum(e['value'] for e in expenses)
        total_income = sum(i['value'] for i in incomes)
        budget_limit = goals[0]['amount']

        assert total_expenses == 75.0
        assert total_income == 3500.0
        assert budget_limit == 1000.0

    def test_category_management_workflow(self):
        """Test complete category management workflow"""

        # Add categories
        addExpenseCategory('Food')
        addExpenseCategory('Transportation')
        addIncomeCategory('Salary')
        addIncomeCategory('Freelance')

        # Verify categories were added
        expense_cats = []
        getExpenseCategories(lambda cats: expense_cats.extend(cats))
        assert len(expense_cats) == 2

        income_cats = []
        getIncomeCategories(lambda cats: income_cats.extend(cats))
        assert len(income_cats) == 2

        # Add transactions using these categories
        addExpense('Food', 100.0, '2024-01-01')
        addExpense('Transportation', 50.0, '2024-01-02')
        addIncome('Salary', 3000.0, '2024-01-01')
        addIncome('Freelance', 500.0, '2024-01-15')

        # Verify transactions
        expenses = []
        getExpenses(lambda items: expenses.extend(items))
        assert len(expenses) == 2

        incomes = []
        getIncomes(lambda items: incomes.extend(items))
        assert len(incomes) == 2

    def test_recurring_payments_workflow(self):
        """Test recurring payments management workflow"""

        # Add recurring payments
        reminders1 = [{'days': 1, 'hours': 9}]
        reminders2 = [{'days': 15, 'hours': 10}]

        addRecurringPayment('expense', 'Rent', 1000.0, '2024-01-01',
                          'monthly', 'Monthly rent', reminders1)
        addRecurringPayment('expense', 'Utilities', 200.0, '2024-01-01',
                          'monthly', 'Monthly utilities', reminders2)
        addRecurringPayment('income', 'Salary', 3000.0, '2024-01-01',
                          'monthly', 'Monthly salary', [])

        # Verify recurring payments
        payments = []
        getRecurringPayments(lambda items: payments.extend(items))
        assert len(payments) == 3

        expense_payments = [p for p in payments if p['type'] == 'expense']
        income_payments = [p for p in payments if p['type'] == 'income']

        assert len(expense_payments) == 2
        assert len(income_payments) == 1

        # Update a payment
        rent_payment = next(p for p in payments if p['category'] == 'Rent')
        updateRecurringPayment(rent_payment['id'], 'expense', 'Rent', 1200.0,
                             '2024-01-01', 'monthly', 'Updated rent', reminders1)

        # Verify update
        payments = []
        getRecurringPayments(lambda items: payments.extend(items))
        updated_rent = next(p for p in payments if p['category'] == 'Rent')
        assert updated_rent['value'] == 1200.0

    def test_budget_goals_workflow(self):
        """Test budget goals management workflow"""

        # Add budget goals
        addBudgetGoal('expense', 'monthly', 1000.0)
        addBudgetGoal('expense', 'weekly', 250.0)
        addBudgetGoal('income', 'monthly', 3500.0)

        # Verify goals
        goals = []
        getBudgetGoals(lambda items: goals.extend(items))
        assert len(goals) == 3

        expense_goals = [g for g in goals if g['type'] == 'expense']
        income_goals = [g for g in goals if g['type'] == 'income']

        assert len(expense_goals) == 2
        assert len(income_goals) == 1

        # Update a goal
        monthly_expense_goal = next(g for g in expense_goals if g['period'] == 'monthly')
        updateBudgetGoal(monthly_expense_goal['id'], 1200.0)

        # Verify update
        goals = []
        getBudgetGoals(lambda items: goals.extend(items))
        updated_goal = next(g for g in goals if g['id'] == monthly_expense_goal['id'])
        assert updated_goal['amount'] == 1200.0

        # Delete a goal
        deleteBudgetGoal(monthly_expense_goal['id'])

        goals = []
        getBudgetGoals(lambda items: goals.extend(items))
        assert len(goals) == 2


class TestDataValidation:
    """Test data validation and error handling"""

    def test_invalid_budget_goal_data(self):
        """Test handling of invalid budget goal data"""

        # Test with invalid data types
        addBudgetGoal('invalid_type', 'monthly', 1000.0)  # Should still work as strings
        addBudgetGoal('expense', 'invalid_period', 1000.0)  # Should still work

        # The database functions should handle string data gracefully
        # In a real app, you'd add more validation
        goals = []
        getBudgetGoals(lambda items: goals.extend(items))
        assert len(goals) == 2

    def test_empty_categories(self):
        """Test handling of empty category lists"""

        # Initially should be empty
        expense_cats = []
        getExpenseCategories(lambda cats: expense_cats.extend(cats))
        assert len(expense_cats) == 0

        income_cats = []
        getIncomeCategories(lambda cats: income_cats.extend(cats))
        assert len(income_cats) == 0

    def test_duplicate_categories(self):
        """Test handling of duplicate categories"""

        # Add same category multiple times
        addExpenseCategory('Food')
        addExpenseCategory('Food')
        addExpenseCategory('Food')

        # Should only appear once
        categories = []
        getExpenseCategories(lambda cats: categories.extend(cats))
        food_count = categories.count('Food')
        assert food_count == 1