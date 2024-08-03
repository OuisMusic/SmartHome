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
    if (!isDeviceOnline) {
      setError('Device is offline and cannot be controlled at the moment.');
      return;
    }
    try {
      setLoading(true);
      await updateDeviceStatus(deviceId, status);
      setDeviceStatus(status);
      setError(null); // Reset error state on successful execution
    } catch (updateError) {
      console.error("Error updating device status", updateError);
      setError(`Failed to update device status: ${updateError instanceof Error ? updateError.message : updateError}`);
    } finally {
      setLoading(false);
    }
  };

  const checkDeviceOnlineStatus = async (deviceId: string): Promise<boolean> => {
    try {
      // Simulate network status check - replace with actual HTTP request or other async operation in a real scenario
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error checking device online status", error);
      setError(`Failed to check device online status: ${error instanceof Error ? error.message : error}`);
      return false;
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const isOnline = await checkDeviceOnlineStatus(deviceId);
      setIsDeviceOnline(isOnline);
      if (!isOnline) {
        setError('Device went offline.'); // Inform the user immediately when a device goes offline
      } else {
        setError(null); // Clear error if device is back online
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [deviceId]);

  return (
    <div>
      <h3>Smart Device Control</h3>
      <p>Device ID: {deviceId}</p>
      <p>Status: {deviceStatus ? 'On' : 'Off'}{loading && ' (Updating...)'} </p>
      <p>Network Status: {isDeviceOnline ? 'Online' : 'Offline'}{!isDeviceOnline && ' - Device functions limited'}</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Enhanced error visibility */}
      <button onClick={() => handleStatusChange(true)} disabled={!isDeviceOnline || loading}>Turn On</button>
      <button onClick={() => handleStatusChange(false)} disabled={!isDeviceOnline || loading}>Turn Off</button>
    </div>
  );
};

export default SmartDeviceControl;