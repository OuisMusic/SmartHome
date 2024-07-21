import React from 'react';

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'on' | 'off';
}

interface SmartHomeDeviceListProps {
  devices: Device[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const SmartHomeDeviceList: React.FC<SmartHomeDeviceListProps> = ({
  devices,
  onDelete,
  onToggle,
}) => {
  return (
    <ul>
      {devices.map((device) => (
        <li key={device.id}>
          <div>Name: {device.name}</div>
          <div>Type: {device.type}</div>
          <div>Status: {device.status}</div>
          <button onClick={() => onToggle(device.id)}>
            {device.status === 'on' ? 'Turn Off' : 'Turn On'}
          </button>
          <button onClick={() => onDelete(device.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default SmartHomeDeviceList;