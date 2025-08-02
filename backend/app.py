from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, the Flask backend is ready!'

@app.route('/api/budget', methods=['GET'])
def get_budget():
    data = {
        'budget': 1000000,
        'currency': 'IRR'
    }
    return jsonify(data)

@app.route('/api/budget', methods=['POST'])
def set_budget():
    req_data = request.get_json()
    # Here you can save the data or just return it
    return jsonify({
        'message': 'Budget received',
        'data': req_data
    })

if __name__ == '__main__':
    app.run(debug=True)
