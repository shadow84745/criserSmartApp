import React, { createContext, useState } from 'react';
import { BleManager } from 'react-native-ble-plx';

export const BleContext = createContext();

export const BleProvider = ({ children }) => {
  const [manager] = useState(new BleManager());
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [serviceUUID, setServiceUUID] = useState('');
  const [characteristicUUID, setCharacteristicUUID] = useState('');

  return (
    <BleContext.Provider value={{ 
      manager, 
      connectedDevice, 
      setConnectedDevice, 
      serviceUUID, 
      setServiceUUID, 
      characteristicUUID, 
      setCharacteristicUUID 
    }}>
      {children}
    </BleContext.Provider>
  );
};
