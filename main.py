from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/get_data', methods=['POST'])
def get_data():
    user_input = request.json.get('input_value')
    processed_data = f"Processed: {user_input.upper()}"
    return jsonify(result=processed_data)

if __name__ == "__main__":
    app.run(debug=True)
