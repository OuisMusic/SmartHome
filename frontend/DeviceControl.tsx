import React, { useState, useEffect } from 'react';

interface SmartDeviceControlProps {
  deviceId: string;
  updateDeviceStatus: (deviceId: string, status: boolean) => void;
}

const SmartDeviceControl: React.FC<SmartDeviceControlProps> = ({ deviceId, updateDeviceStatus }) => {
  const [deviceStatus, setDeviceStatus] = useState<boolean>(false);
  const [isDeviceOnline, setIsDeviceOnline] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (status: boolean) => {
    if (loading) return;
    if (isDeviceOnline) {
      try {
        setLoading(true);
        setError(null);
        await updateDeviceStatus(deviceId, status);
        setDeviceStatus(status);
      } catch (updateError) {
        console.error("Error updating device status", updateError);
        setError('Failed to update device status');
      } finally {
        setLoading(false);
      }
    } else {
      alert("Device is offline and cannot be controlled at the moment.");
    }
  };

  const checkDeviceOnlineStatus = async (deviceId: string): Promise<boolean> => {
    try {
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error checking device online status", error);
      setError('Failed to check device online status');
      return false;
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const isOnline = await checkDeviceOnlineStatus(deviceId);
      setIsDeviceOnline(isOnline);
    }, 5000);

    return () => clearInterval(interval);
  }, [deviceId]);

  return (
    <div>
      <h3>Smart Device Control</h3>
      <p>Device ID: {deviceId}</p>
      <p>Status: {deviceStatus ? 'On' : 'Off'}{loading && ' (Updating...)'} </p>
      <p>Network Status: {isDeviceOnline ? 'Online' : 'Offline'}</p>
      {error && <p>Error: {error}</p>}
      <button onClick={() => handleStatusChange(true)} disabled={!isDeviceOnline || loading}>Turn On</button>
      <button onClick={() => handleStatusChange(false)} disabled={!isDeviceOnline || loading}>Turn Off</button>
    </div>
  );
};

export default SmartDeviceControl;