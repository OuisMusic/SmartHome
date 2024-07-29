import React, { useState } from 'react';

interface SmartDeviceControlProps {
  deviceId: string;
  updateDeviceStatus: (deviceId: string, status: boolean) => void;
}

const SmartDeviceControl: React.FC<SmartDeviceControlProps> = ({ deviceId, updateDeviceStatus }) => {
  const [deviceStatus, setDeviceStatus] = useState<boolean>(false);

  const handleStatusChange = (status: boolean) => {
    setDeviceStatus(status);
    updateDeviceStatus(deviceId, status);
  };

  return (
    <div>
      <h3>Smart Device Control</h3>
      <p>Device ID: {deviceId}</p>
      <p>Status: {deviceStatus ? 'On' : 'Off'}</p>
      <button onClick={() => handleStatusChange(true)}>Turn On</button>
      <button onClick={() => handleStatusChange(false)}>Turn Off</button>
    </div>
  );
};

export default SmartDeviceControl;