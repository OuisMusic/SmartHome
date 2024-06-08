from flask import Flask, request, jsonify
import os

app = Flask(__name__)

light_status = os.getenv('LIGHT_STATUS', 'off')  # More Pythonic variable naming
temperature_setting = os.getenv('TEMPERATURE', '20')  # Clearer variable name

@app.route('/status', methods=['GET'])
def get_device_status():
    try:
        status = {
            'light': light_status,
            'temperature': temperature_setting
        }
        return jsonify(status), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve device status: {str(e)}'}), 500

@app.route('/light', methods=['POST'])
def update_light_status():
    global light_status
    try:
        request_data = request.get_json()
        if not request_data:
            raise ValueError("No data provided")
        if 'status' in request_data:
            light_status = request_data['status'].lower()
            if light_status not in ['on', 'off']:
                return jsonify({'error': 'Invalid status, must be "on" or "off"'}), 400
            return jsonify({'message': f'Light turned {light_warning}'}), 200
        else:
            return jsonify({'error': 'Missing status in request'}), 400
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/temperature', methods=['POST'])
def update_temperature_setting():
    global temperature_setting
    try:
        request_data = request.get_json()
        if not request_data:
            raise ValueError("No data provided")
        if 'temperature' in request_data:
            new_temperature = request_data['temperature']
            try:
                # Validate and convert to integer, then back to string for consistency
                new_temperature = str(int(float(new_temperature)))
                temperature_setting = new_temperature
                return jsonify({'message': f'Temperature set to {temperature_setting} degrees'}), 200
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