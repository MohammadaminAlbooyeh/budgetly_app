"""
Tests for the Budgetly Flask API
"""
import json
import pytest
from backend.app import app


@pytest.fixture
def client():
    """Create a test client for the Flask app"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def sample_budget_data():
    """Sample budget data for testing"""
    return {
        'budget': 5000.0,
        'currency': 'USD'
    }


class TestBudgetAPI:
    """Test cases for budget API endpoints"""

    def test_home_endpoint(self, client):
        """Test the home endpoint"""
        response = client.get('/')
        assert response.status_code == 200
        assert b'Hello, the Flask backend is ready!' in response.data

    def test_get_budget_initial(self, client):
        """Test getting budget when no data exists"""
        response = client.get('/api/budget')
        assert response.status_code == 200

        data = json.loads(response.data)
        assert 'budget' in data
        assert 'currency' in data
        assert data['budget'] == 0
        assert data['currency'] == 'IRR'

    def test_set_and_get_budget(self, client, sample_budget_data):
        """Test setting and then getting budget"""
        # Set budget
        response = client.post('/api/budget',
                             data=json.dumps(sample_budget_data),
                             content_type='application/json')
        assert response.status_code == 200

        data = json.loads(response.data)
        assert 'message' in data
        assert 'data' in data
        assert data['message'] == 'Budget saved to MongoDB'
        assert data['data'] == sample_budget_data

        # Get budget
        response = client.get('/api/budget')
        assert response.status_code == 200

        data = json.loads(response.data)
        assert data['budget'] == sample_budget_data['budget']
        assert data['currency'] == sample_budget_data['currency']

    def test_set_budget_invalid_data(self, client):
        """Test setting budget with invalid data"""
        # Test with non-JSON data
        response = client.post('/api/budget',
                             data='invalid json',
                             content_type='application/json')
        assert response.status_code == 400

    def test_budget_persistence(self, client, sample_budget_data):
        """Test that budget persists across requests"""
        # Set budget
        client.post('/api/budget',
                   data=json.dumps(sample_budget_data),
                   content_type='application/json')

        # Get budget multiple times
        for _ in range(3):
            response = client.get('/api/budget')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert data['budget'] == sample_budget_data['budget']
            assert data['currency'] == sample_budget_data['currency']

    def test_budget_override(self, client, sample_budget_data):
        """Test that setting budget multiple times overrides previous values"""
        # Set initial budget
        client.post('/api/budget',
                   data=json.dumps(sample_budget_data),
                   content_type='application/json')

        # Set new budget
        new_budget = {'budget': 10000.0, 'currency': 'EUR'}
        client.post('/api/budget',
                   data=json.dumps(new_budget),
                   content_type='application/json')

        # Verify new budget
        response = client.get('/api/budget')
        data = json.loads(response.data)
        assert data['budget'] == new_budget['budget']
        assert data['currency'] == new_budget['currency']