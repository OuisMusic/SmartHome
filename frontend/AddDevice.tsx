import React, { useState, FormEvent } from 'react';

type DeviceType = 'LIGHT' | 'THERMOSTAT' | 'SECURITY_CAMERA';

interface Device {
  name: string;
  type: DeviceType;
  status: 'ON' | 'OFF';
}

interface AddDeviceFormProps {
  addDevice: (newDevice: Device) => void;
}

const AddDeviceForm: React.FC<AddDeviceFormProps> = ({ addDevice }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<DeviceType>('LIGHT');
  const [status, setStatus] = useState<'ON' | 'OFF'>('OFF');
  const [error, setError] = useState<string | null>(null);

  const validateDeviceName = (name: string): boolean => {
    if (name.length < 3) {
      setError('Device name must be at least 3 characters long.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateDeviceName(name)) return;

    const newDevice: Device = { name, type, status };
    addDevice(newDevice);

    setName('');
    setType('LIGHT');  
    setStatus('OFF');  
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="deviceName">Device Name:</label>
        <input
          id="deviceName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
      <div>
        <label htmlFor="deviceType">Device Type:</label>
        <select
          id="deviceType"
          value={type}
          onChange={(e) => setType(e.target.value as DeviceType)}
          required
        >
          <option value="LIGHT">Light</option>
          <option value="THERMOSTAT">Thermostat</option>
          <option value="SECURITY_CAMERA">Security Camera</option>
        </select>
      </div>
      <div>
        <label htmlFor="deviceStatus">Initial Status:</label>
        <select
          id="deviceStatus"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'ON' | 'OFF')}
          required
        >
          <option value="ON">On</option>
          <option value="OFF">Off</option>
        </select>
      </div>
      <button type="submit">Add Device</button>
    </form>
  );
};

export default AddDeviceForm;