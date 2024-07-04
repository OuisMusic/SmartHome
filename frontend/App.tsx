import React, { useState } from 'react';

interface Device {
  id: number;
  name: string;
  status: 'on' | 'off';
}

interface DeviceProps {
  device: Device;
  controlDevice: (id: number, status: Device['status']) => void;
}

interface AddDeviceProps {
  addDevice: (name: string) => void;
}

const DeviceListComponent: React.FC<{ devices: Device[], controlDevice: (id: number, status: Device['status']) => void }> = ({ devices, controlDevice }) => {
  return (
    <div>
      {devices.map(device => (
        <DeviceComponent key={device.id} device={device} controlDevice={controlDevice} />
      ))}
    </div>
  );
};

const DeviceComponent: React.FC<DeviceProps> = ({ device, controlDevice }) => {
  return (
    <div>
      <span>{device.name}</span>
      <button onClick={() => controlDevice(device.id, device.status === 'on' ? 'off' : 'on')}>
        Turn {device.status === 'on' ? 'Off' : 'On'}
      </button>
    </div>
  );
};

const AddDeviceComponent: React.FC<AddDeviceProps> = ({ addDevice }) => {
  const [newDeviceName, setNewDeviceName] = useState('');
  const [error, setError] = useState('');

  const handleAddDevice = () => {
    if (!newDeviceEitherMessage.trim()) {
      setError('Device name cannot be empty');
      return;
    }
    try {
      addDevice(newDeviceName);
      setNewDeviceName('');
      setError(''); // Reset error message after successful operation
    } catch (error) {
      setError('An error occurred while adding the device.');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={newDeviceName}
        onChange={(e) => setNewDeviceName(e.target.value)}
      />
      <button onClick={handleAddDevice}>Add Device</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

const SmartHome: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filter, setFilter] = useState<'all' | 'on' | 'off'>('all');

  const addDevice = (name: string) => {
    try {
      const newDevice = { id: devices.length + 1, name, status: 'off' };
      setDevices([...devices, newDevice]);
    } catch (error) {
      console.error('Failed to add device:', error);
    }
  };

  const controlDevice = (id: number, status: Device['status']) => {
    setDevices(
      devices.map(device =>
        device.id === id ? {...device, status} : device
      )
    );
  };

  const filteredDevices = devices.filter(device => {
    if (filter === 'all') return true;
    return device.status === filter;
  });

  return (
    <div>
      <h1>Smart Home Automation System</h1>
      <AddDeviceComponent addDevice={addDevice} />
      <div>
        <button onClick={() => setFilter('all')}>All Devices</button>
        <button onClick={() => setFilter('on')}>On</button>
        <button onClick={() => setFilter('off')}>Off</button>
      </div>
      <DeviceListComponent devices={filteredDevices} controlDevice={controlDevice} />
    </div>
  );
};

export default SmartHome;