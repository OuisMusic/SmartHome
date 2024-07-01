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

const AddDeviceComponent: React.FC<AddToGameProps> = ({ addDevice }) => {
  const [newDeviceName, setNewDeviceName] = useState('');

  return (
    <div>
      <input type="text" value={newDeviceName} onChange={(e) => setNewDeviceName(e.target.value)} />
      <button onClick={() => { addDevice(newDeviceName); setNewDeviceName(''); }}>Add Device</button>
    </div>
  );
};

const SmartHome: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  const addDevice = (name: string) => {
    const newDevice = { id: devices.length + 1, name: name, status: 'off' };
    setDevices([...devices, newDevice]);
  };

  const controlDevice = (id: number, status: Device['status']) => {
    setDevices(
      devices.map(device => 
        device.id === id ? { ...device, status: status } : device
      )
    );
  };

  return (
    <div>
      <h1>Smart Home Automation System</h1>
      <AddDeviceComponent addDevice={addDevice} />
      <DeviceListComponent devices={devices} controlDevice={controlController} />
    </div>
  );
};

export default SmartHome;