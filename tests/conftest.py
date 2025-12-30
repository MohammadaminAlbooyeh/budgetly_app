"""
Pytest configuration and shared fixtures for Budgetly tests
"""
import pytest
from unittest.mock import Mock, patch
import json


@pytest.fixture
def mock_localstorage():
    """Mock localStorage for testing"""
    mock_storage = {}

    def getItem(key):
        return mock_storage.get(key)

    def setItem(key, value):
        mock_storage[key] = value

    def removeItem(key):
        mock_storage.pop(key, None)

    def clear():
        mock_storage.clear()

    mock_ls = Mock()
    mock_ls.getItem = getItem
    mock_ls.setItem = setItem
    mock_ls.removeItem = removeItem
    mock_ls.clear = clear

    return mock_ls


@pytest.fixture
def sample_expense_data():
    """Sample expense data for testing"""
    return {
        'category': 'Food',
        'value': 50.0,
        'date': '2024-01-01'
    }


@pytest.fixture
def sample_income_data():
    """Sample income data for testing"""
    return {
        'category': 'Salary',
        'value': 3000.0,
        'date': '2024-01-01'
    }


@pytest.fixture
def sample_budget_goal():
    """Sample budget goal data for testing"""
    return {
        'type': 'expense',
        'period': 'monthly',
        'amount': 1000.0
    }


@pytest.fixture
def sample_recurring_payment():
    """Sample recurring payment data for testing"""
    return {
        'type': 'expense',
        'category': 'Rent',
        'value': 1000.0,
        'startDate': '2024-01-01',
        'frequency': 'monthly',
        'description': 'Monthly rent',
        'reminders': [{'days': 1, 'hours': 9}]
    }


@pytest.fixture
def mock_flask_app():
    """Mock Flask app for API testing"""
    from flask import Flask

    app = Flask(__name__)

    # Mock the database functions
    with patch('backend.app.addExpense'), \
         patch('backend.app.getExpenses'), \
         patch('backend.app.addIncome'), \
         patch('backend.app.getIncomes'), \
         patch('backend.app.addBudgetGoal'), \
         patch('backend.app.getBudgetGoals'), \
         patch('backend.app.addRecurringPayment'), \
         patch('backend.app.getRecurringPayments'), \
         patch('backend.app.updateRecurringPayment'), \
         patch('backend.app.deleteRecurringPayment'), \
         patch('backend.app.addExpenseCategory'), \
         patch('backend.app.getExpenseCategories'), \
         patch('backend.app.addIncomeCategory'), \
         patch('backend.app.getIncomeCategories'), \
         patch('backend.app.updateBudgetGoal'), \
         patch('backend.app.deleteBudgetGoal'):

        yield app


@pytest.fixture
def client(mock_flask_app):
    """Flask test client"""
    return mock_flask_app.test_client()


@pytest.fixture(autouse=True)
def reset_localstorage(mock_localstorage):
    """Reset localStorage before each test"""
    from mock_db import localStorage
    localStorage.clear()
    yield


@pytest.fixture
def populated_localstorage(mock_localstorage):
    """Populate localStorage with sample data"""
    # Add sample categories
    mock_localstorage.setItem('expense_categories', json.dumps(['Food', 'Transportation']))
    mock_localstorage.setItem('income_categories', json.dumps(['Salary', 'Freelance']))

    # Add sample expenses
    expenses = [
        {'id': '1', 'category': 'Food', 'value': 50.0, 'date': '2024-01-01'},
        {'id': '2', 'category': 'Transportation', 'value': 25.0, 'date': '2024-01-02'}
    ]
    mock_localstorage.setItem('expenses', json.dumps(expenses))

    # Add sample incomes
    incomes = [
        {'id': '1', 'category': 'Salary', 'value': 3000.0, 'date': '2024-01-01'},
        {'id': '2', 'category': 'Freelance', 'value': 500.0, 'date': '2024-01-15'}
    ]
    mock_localstorage.setItem('incomes', json.dumps(incomes))

    # Add sample budget goals
    goals = [
        {'id': '1', 'type': 'expense', 'period': 'monthly', 'amount': 1000.0}
    ]
    mock_localstorage.setItem('budget_goals', json.dumps(goals))

    # Add sample recurring payments
    payments = [
        {
            'id': '1',
            'type': 'expense',
            'category': 'Rent',
            'value': 1000.0,
            'startDate': '2024-01-01',
            'frequency': 'monthly',
            'description': 'Monthly rent',
            'reminders': [{'days': 1, 'hours': 9}]
        }
    ]
    mock_localstorage.setItem('recurring_payments', json.dumps(payments))

    return mock_localstorage