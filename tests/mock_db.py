"""
Mock database functions for testing (Python version of frontend db.ts)
"""
import json
from typing import List, Dict, Any, Callable


class MockLocalStorage:
    """Mock localStorage for testing"""

    def __init__(self):
        self.storage = {}

    def getItem(self, key: str) -> str:
        return self.storage.get(key)

    def setItem(self, key: str, value: str) -> None:
        self.storage[key] = value

    def removeItem(self, key: str) -> None:
        self.storage.pop(key, None)

    def clear(self) -> None:
        self.storage.clear()


# Global mock localStorage instance
localStorage = MockLocalStorage()


def generateId() -> str:
    """Generate a unique ID"""
    import uuid
    return str(uuid.uuid4())


# Expense Categories
def addExpenseCategory(category: str) -> None:
    """Add an expense category"""
    categories = getExpenseCategoriesList()
    if category not in categories:
        categories.append(category)
        localStorage.setItem('expense_categories', json.dumps(categories))


def getExpenseCategories(callback: Callable[[List[str]], None]) -> None:
    """Get all expense categories"""
    categories = getExpenseCategoriesList()
    callback(categories)


def getExpenseCategoriesList() -> List[str]:
    """Get expense categories as list"""
    data = localStorage.getItem('expense_categories')
    return json.loads(data) if data else []


# Income Categories
def addIncomeCategory(category: str) -> None:
    """Add an income category"""
    categories = getIncomeCategoriesList()
    if category not in categories:
        categories.append(category)
        localStorage.setItem('income_categories', json.dumps(categories))


def getIncomeCategories(callback: Callable[[List[str]], None]) -> None:
    """Get all income categories"""
    categories = getIncomeCategoriesList()
    callback(categories)


def getIncomeCategoriesList() -> List[str]:
    """Get income categories as list"""
    data = localStorage.getItem('income_categories')
    return json.loads(data) if data else []


# Expenses
def addExpense(category: str, value: float, date: str) -> None:
    """Add an expense"""
    expenses = getExpensesList()
    expense = {
        'id': generateId(),
        'category': category,
        'value': value,
        'date': date
    }
    expenses.append(expense)
    localStorage.setItem('expenses', json.dumps(expenses))


def getExpenses(callback: Callable[[List[Dict[str, Any]]], None]) -> None:
    """Get all expenses"""
    expenses = getExpensesList()
    callback(expenses)


def getExpensesList() -> List[Dict[str, Any]]:
    """Get expenses as list"""
    data = localStorage.getItem('expenses')
    return json.loads(data) if data else []


# Incomes
def addIncome(category: str, value: float, date: str) -> None:
    """Add an income"""
    incomes = getIncomesList()
    income = {
        'id': generateId(),
        'category': category,
        'value': value,
        'date': date
    }
    incomes.append(income)
    localStorage.setItem('incomes', json.dumps(incomes))


def getIncomes(callback: Callable[[List[Dict[str, Any]]], None]) -> None:
    """Get all incomes"""
    incomes = getIncomesList()
    callback(incomes)


def getIncomesList() -> List[Dict[str, Any]]:
    """Get incomes as list"""
    data = localStorage.getItem('incomes')
    return json.loads(data) if data else []


# Budget Goals
def addBudgetGoal(type_: str, period: str, amount: float) -> None:
    """Add a budget goal"""
    goals = getBudgetGoalsList()
    goal = {
        'id': generateId(),
        'type': type_,
        'period': period,
        'amount': amount
    }
    goals.append(goal)
    localStorage.setItem('budget_goals', json.dumps(goals))


def getBudgetGoals(callback: Callable[[List[Dict[str, Any]]], None]) -> None:
    """Get all budget goals"""
    goals = getBudgetGoalsList()
    callback(goals)


def getBudgetGoalsList() -> List[Dict[str, Any]]:
    """Get budget goals as list"""
    data = localStorage.getItem('budget_goals')
    return json.loads(data) if data else []


def updateBudgetGoal(id_: str, amount: float) -> None:
    """Update a budget goal"""
    goals = getBudgetGoalsList()
    for goal in goals:
        if goal['id'] == id_:
            goal['amount'] = amount
            break
    localStorage.setItem('budget_goals', json.dumps(goals))


def deleteBudgetGoal(id_: str) -> None:
    """Delete a budget goal"""
    goals = getBudgetGoalsList()
    goals = [g for g in goals if g['id'] != id_]
    localStorage.setItem('budget_goals', json.dumps(goals))


# Recurring Payments
def addRecurringPayment(type_: str, category: str, value: float, startDate: str,
                       frequency: str, description: str, reminders: List[Dict[str, Any]]) -> None:
    """Add a recurring payment"""
    payments = getRecurringPaymentsList()
    payment = {
        'id': generateId(),
        'type': type_,
        'category': category,
        'value': value,
        'startDate': startDate,
        'frequency': frequency,
        'description': description,
        'reminders': reminders
    }
    payments.append(payment)
    localStorage.setItem('recurring_payments', json.dumps(payments))


def getRecurringPayments(callback: Callable[[List[Dict[str, Any]]], None]) -> None:
    """Get all recurring payments"""
    payments = getRecurringPaymentsList()
    callback(payments)


def getRecurringPaymentsList() -> List[Dict[str, Any]]:
    """Get recurring payments as list"""
    data = localStorage.getItem('recurring_payments')
    return json.loads(data) if data else []


def updateRecurringPayment(id_: str, type_: str, category: str, value: float,
                          startDate: str, frequency: str, description: str,
                          reminders: List[Dict[str, Any]]) -> None:
    """Update a recurring payment"""
    payments = getRecurringPaymentsList()
    for payment in payments:
        if payment['id'] == id_:
            payment.update({
                'type': type_,
                'category': category,
                'value': value,
                'startDate': startDate,
                'frequency': frequency,
                'description': description,
                'reminders': reminders
            })
            break
    localStorage.setItem('recurring_payments', json.dumps(payments))


def deleteRecurringPayment(id_: str) -> None:
    """Delete a recurring payment"""
    payments = getRecurringPaymentsList()
    payments = [p for p in payments if p['id'] != id_]
    localStorage.setItem('recurring_payments', json.dumps(payments))