from flask import Flask, request, jsonify
import os

app = Flask(__name__)

LIGHT_STATUS = os.getenv('LIGHT_STATUS', 'off')
TEMPERATURE = os.getenv('TEMPERATURE', '20')

@app.route('/status', methods=['GET'])
def get_status():
    status = {
        'light': LIGHT_STATUS,
        'temperature': TEMPERATURE
    }
    return jsonify(status), 200

@app.route('/light', methods=['POST'])
def control_light():
    global LIGHT_STATUS
    data = request.get_json()
    if 'status' in data:
        LIGHT_STATUS = data['status']
        return jsonify({'message': f'Light turned {LIGHT_STATUS}'}), 200
    else:
        return jsonify({'error': 'Missing status in request'}), 400

@app.route('/temperature', methods=['POST'])
def set_temperature():
    global TEMPERATURE
    data = request.get_json()
    if 'temperature' in data:
        TEMPERATURE = data['temperature']
        return jsonify({'message': f'Temperature set to {TEMPERATURE} degrees'}), 200
    else:
        return jsonify({'error': 'Missing temperature in request'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)