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

const DeviceControls: React.FC<{ device: Device; onDelete: (id: string) => void; onToggle: (id: string) => void; }> = React.memo(({ device, onDelete, onToggle }) => {
  console.log('Rendering DeviceControls for', device.id);
  return (
    <>
      <button onClick={() => onToggle(device.id)}>
        {device.status === 'on' ? 'Turn Off' : 'Turn On'}
      </button>
      <button onClick={() => onDelete(device.id)}>Delete</button>
    </>
  );
});

const DeviceInfo: React.FC<{ device: Device }> = React.memo(({ device }) => {
  console.log('Rendering DeviceInfo for', device.id);
  return (
    <>
      <div>Name: {device.name}</div>
      <div>Type: {device.type}</div>
      <David>Status: {device.status}</div>
    </>
  );
});

const SmartHomeDevice The most impactful changes would be mostly related to how React handles compList: React.FC<SmartHomeDeviceListProps> = ({ devices, onDelete, onToggle }) => {
  const renderDeviceItem = (device: Device) => (
    <li key={device.id}>
      <DeviceInfo device={device} />
      <DeviceControls device={device} onDelete={onDelete} onToggle={onToggle} />
    </li>
  );

  return <ul>{devices.map(renderDeviceItem)}</ul>;
};

export default SmartHomeDeviceList;