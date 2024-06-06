from flask import Flask, request, jsonify
import os

app = Flask(__name__)

LIGHT_STATUS = os.getenv('LIGHT_STATUS', 'off')
TEMPERATURE = os.getenv('TEMPERATURE', '20')

@app.route('/status', methods=['GET'])
def get_status():
    # Ensuring internal server errors are caught and handled
    try:
        status = {
            'light': LIGHT_STATUS,
            'temperature': TEMPERATURE
        }
        return jsonify(status), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve status: {str(e)}'}), 500

@app.route('/light', methods=['POST'])
def control_light():
    global LIGHT_STATUS
    try:
        data = request.get_json()
        if not data:
            raise ValueError("No data provided")
        if 'status' in data:
            LIGHT_STATUS = data['status'].lower()
            if LIGHT_STATUS not in ['on', 'off']:
                return jsonify({'error': 'Invalid status, must be "on" or "off"'}), 400
            return jsonify({'message': f'Light turned {LIGHT_STATUS}'}), 200
        else:
            return jsonify({'error': 'Missing status in request'}), 400
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


@app.route('/temperature', methods=['POST'])
def set_temperature():
    global TEMPERATURE
    try:
        data = request.get_json()
        if not data:
            raise ValueError("No data provided")
        if 'temperature' in data:
            new_temperature = data['temperature']
            try:
                # Assuming temperature must be a valid integer or float
                new_temperature = str(int(float(new_temperature)))  # Validate and convert to string representation
                TEMPERATURE = new_temperature
                return jsonify({'message': f'Temperature set to {TEMPERATURE} degrees'}), 200
            except ValueError:
                return jsonify({'error': 'Invalid temperature value'}), 400
        else:
            return jsonify({'error': 'Missing temperature in request'}), 400
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)