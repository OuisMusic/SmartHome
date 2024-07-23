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
  on(C) => {

  const renderDeviceControls = (device: Device) => (
    <>
      <button onClick={() => onToggle(device.id)}>
        {device.status === 'on' ? 'Turn Off' : 'Turn On'}
      </button>
      <button onClick={() => onDelete(device.id)}>Delete</button>
    </>
  );

  const renderDeviceInfo = (device: Device) => (
    <>
      <div>Name: {device.name}</div>
      <div>Type: {device.type}</div>
      <div>Status: {device.status}</div>
    </>
  );

  const renderDeviceItem = (device: Device) => (
    <li key={device.id}>
      {renderDeviceInfo(device)}
      {renderDeviceControls(device)}
    </li>
  );

  return <ul>{devices.map(renderDeviceItem)}</ul>;
};

export default SmartHomeDeviceList;