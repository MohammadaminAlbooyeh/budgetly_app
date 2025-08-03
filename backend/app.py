
from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)


# Connect to MongoDB (default local connection)
client = MongoClient('mongodb://localhost:27017/')
db = client['budgetly_db']
collection = db['balances']


@app.route('/')
def home():
    return 'Hello, the Flask backend is ready!'


# Example: Get balance from MongoDB
@app.route('/api/budget', methods=['GET'])
def get_budget():
    doc = collection.find_one()
    if doc:
        data = {
            'budget': doc.get('budget', 0),
            'currency': doc.get('currency', 'IRR')
        }
    else:
        data = {'budget': 0, 'currency': 'IRR'}
    return jsonify(data)


# Example: Set balance in MongoDB
@app.route('/api/budget', methods=['POST'])
def set_budget():
    req_data = request.get_json()
    collection.delete_many({})  # Remove old balance
    collection.insert_one(req_data)
    return jsonify({
        'message': 'Budget saved to MongoDB',
        'data': req_data
    })

if __name__ == '__main__':
    app.run(debug=True)
