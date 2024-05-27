# Smart Home Automation System

The Smart Home Automation System is a comprehensive web application that allows users to control and monitor their home appliances and devices remotely. The application consists of a frontend built with TypeScript and React, a backend built with Python and Flask, and an IoT microservice built with Rust for device management.

## Features

- **Device Management:** Add, update, and delete devices.
- **Device Control:** Turn devices on and off remotely.
- **Device Status:** View real-time status of all devices.

## Tech Stack

- **Frontend:** TypeScript, React
- **Backend:** Python, Flask
- **IoT Microservice:** Rust
- **Database:** SQLite

## Getting Started

### Prerequisites

- Node.js and npm
- Python and pip
- Rust and Cargo
- SQLite

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/OuisMusic/SmartHome.git
    cd SmartHome
    ```

2. **Setup the frontend:**

    ```sh
    cd frontend
    npm install
    npm start
    ```

3. **Setup the backend:**

    ```sh
    pip install -r requirements.txt
    python app.py
    ```

4. **Setup the IoT microservice:**

    ```sh
    cd iot_service
    cargo run
    ```

## Usage

1. **Add a Device:** Use the form on the frontend to add a new device by specifying the device name, type, and initial status.
2. **View Devices:** The main page displays all devices with their current status.
3. **Control Devices:** Use the control buttons next to each device to turn them on or off.
4. **Update Device Status:** The status of each device is updated in real-time and can be viewed on the main page.
5. **Delete a Device:** Remove devices that are no longer needed by using the delete button.

## API Endpoints

### Backend (Flask)

- **GET /api/devices:** Retrieve a list of all devices.
- **POST /api/devices:** Add a new device.
- **PUT /api/devices/<int:device_id>:** Update the status of an existing device.
- **DELETE /api/devices/<int:device_id>:** Delete a device.

### IoT Microservice (Rust)

- **POST /device/on:** Turn a device on.
- **POST /device/off:** Turn a device off.
- **GET /device/status:** Check the status of a device.

---

Thank you for checking out the **Smart Home Automation System**! Enjoy managing your smart home devices effortlessly. 🏠🔌
