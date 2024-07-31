import React, { useState, useEffect } from 'react';

interface SmartDeviceControlProps {
  deviceId: string;
  updateDeviceStatus: (deviceId: string, status: boolean) => void;
}

const SmartDeviceControl: React.FC<SmartDeviceControlProps> = ({ deviceId, updateDeviceStatus }) => {
  const [deviceStatus, setDeviceStatus] = useState<boolean>(false);
  const [isDeviceOnline, setIsDeviceOnline] = useState<boolean>(true);

  const handleStatusChange = (status: boolean) => {
    // Only attempt to change status if the device is online
    if (isDeviceOnline) {
      setDeviceStatus(status);
      updateDeviceStatus(deviceId, status);
    } else {
      alert("Device is offline and cannot be controlled at the moment.");
    }
  };

  const checkDeviceOnlineStatus = async (deviceId: string): Promise<boolean> => {
    // Placeholder for an actual network check function
    // In a real-world application, this might involve an API call to check the device's connectivity
    return Promise.resolve(true); // Simulating all devices being online for this example
  };

  useEffect(() => {
    // Effect to periodically check if the device is online
    const interval = setInterval(() => {
      checkDeviceOnlineStatus(deviceId)
        .then((isOnline) => setIsDeviceOnline(isOnline))
        .catch((error) => {
          console.error("Error checking device status", error);
          setIsDeviceOnline(false); // Assume offline on error
        });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [deviceId]);

  return (
    <div>
      <h3>Smart Device Control</h3>
      <p>Device ID: {deviceId}</p>
      <p>Status: {deviceStatus ? 'On' : 'Off'}</p>
      <p>Network Status: {isDeviceOnline ? 'Online' : 'Offline'}</p>
      <button onClick={() => handleStatusChange(true)} disabled={!isDeviceOnline}>Turn On</button>
      <button onClick={() => handleStatusChange(false)} disabled={!isDeviceOnline}>Turn Off</button>
    </div>
  );
};

export default SmartDeviceControl;