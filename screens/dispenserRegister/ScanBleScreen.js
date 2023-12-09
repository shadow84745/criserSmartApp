import React, { useContext, useRef, useState } from 'react';
import { PermissionsAndroid, Linking, StyleSheet, Text, TouchableOpacity, View, Image, SafeAreaView, FlatList, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BleContext } from './hooks/BleContext';



const requestPermissions = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);
    return result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === 'granted' &&
      result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === 'granted' &&
      result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted';
  }
  return true;
};



const ScanBleScreen = () => {

  const { manager, setConnectedDevice, setServiceUUID, setCharacteristicUUID } = useContext(BleContext);


  const navigation = useNavigation();

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const foundDevicesRef = useRef(new Set()); // Using a ref to keep track of found devices


  const handleScan = () => {
    if (isScanning) {
      manager.stopDeviceScan();
      setIsScanning(false);
      console.log('Scanning stopped');
      return;
    }

    requestPermissions().then((permissionsGranted) => {
      if (permissionsGranted) {
        setIsScanning(true);
        setDevices([]);
        foundDevicesRef.current.clear();

        manager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            console.log(error);
            setIsScanning(false); // Stop scanning on error
            return;
          }

          if (device && device.name && !foundDevicesRef.current.has(device.id)) {
            foundDevicesRef.current.add(device.id);
            setDevices((prevDevices) => [...prevDevices, device]);
          }
        });

        // Stop scanning after 10 seconds
        setTimeout(() => {
          manager.stopDeviceScan();
          setIsScanning(false);
        }, 10000);
      } else {
        console.log('Permissions not granted');
      }
    });
  };

  const connectToDevice = async (device) => {
    try {
      console.log(`Intentando conectarse a ${device.name}`);
      const connectedDevice = await manager.connectToDevice(device.id);
      console.log(`Conectado a ${connectedDevice.name}`);

      const discoveredDevice = await connectedDevice.discoverAllServicesAndCharacteristics();
      const services = await discoveredDevice.services();

      console.log('Servicios encontrados:', services);
      let characteristicsArray = [];
      for (const service of services) {
        const characteristics = await service.characteristics();
        characteristicsArray.push(...characteristics);
      }

      console.log('Características encontradas:', characteristicsArray);

      if (services.length > 0 && characteristicsArray.length > 0) {
        const serviceUuid = services[2].uuid;
        const characteristicUuid = characteristicsArray[4].uuid;
        setServiceUUID(serviceUuid);
        setCharacteristicUUID(characteristicUuid);

        console.log('Service UUID:', serviceUuid);
        console.log('Characteristic UUID:', characteristicUuid);
      }

      // Aquí puedes procesar o guardar las características para usar más adelante
      setError("")
      setConnectedDevice(connectedDevice);
      setSuccessMessage("Conectado con exito")
      // Aquí deberías establecer también los UUIDs de los servicios y características
      setTimeout(() => {
        setSuccessMessage('');
        navigation.navigate('WiffiConnection');
      }, 3000);
    } catch (error) {
      console.error(`Error al conectar o leer: ${error}`);
      setError('No se pudo conectar a este dispositivo');
    }
  };


  const handleContactSupport = () => {
    // Número de teléfono al que se redirigirá
    const phoneNumber = "3184756135";

    // Utiliza la función Linking para abrir la aplicación de teléfono con el número
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.deviceContainer}
      onPress={() => connectToDevice(item)}
    >
      <Text style={styles.deviceText}>{item.name || 'Dispositivo sin nombre'}</Text>
    </TouchableOpacity>
  );


  
  



  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('../../images/logoCriserLogin.png')} style={styles.logo} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Options')}>
            <Image source={require('../../images/hamburgerIcon.png')} style={styles.menuIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Conexion con un nuevo dispositivo</Text>
          </View>
          <View style={styles.sectionCarrusel}>
            <View style={styles.titleContainer}>
              <Text style={styles.descriptionInput}>Debes tener encendido el bluetooth y la localizacion en tu dispositivo movil</Text>
              <Image source={require('../../images/bluetoothLogo.png')}
                style={styles.logoBluetooth}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.scanButtonContainer}>
            <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
              <Text style={styles.scanButtonText}>{isScanning ? 'Buscando...' : 'Buscar Dispositivos'}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={devices}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>

        <View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
        </View>

        {manager && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ConnectionDispenser')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Leer indicaciones</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.contactSection}>
          <TouchableOpacity onPress={handleContactSupport}>
            <Text style={styles.contactText}>Contactar con soporte</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.contactText}>Ver la guía</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
};

export default ScanBleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  sectionCarrusel: {
    marginTop: 20,
    backgroundColor: '#595959',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 40,
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  titleContainer: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  descriptionInput: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
    textAlign: 'center',
    margin: -3,
  },
  sectionTitle: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#00B5E2',
    paddingBottom: 10,
    marginBottom: 10,
  },
  sectionTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00B5E2',
    marginLeft: 10,
  },
  contactSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  contactText: {
    fontSize: 16,
    color: '#00B5E2',
  },
  buttonContainer: {
    alignItems: 'flex-start',
    marginTop: 10,
    marginLeft: 25,
  },
  button: {
    backgroundColor: '#00B5E2',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    borderColor: '#000',
    borderWidth: 1,
  },
  buttonText: {
    color: '#FFF',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  successText: {
    color: 'green',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  logoBluetooth: {
    marginTop: 10,
    width: 50,
    height: 50,
  },
  buttonRed: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    borderColor: '#000',
    borderWidth: 1,
  },
  deviceContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    borderColor: '#000',
    borderWidth: 2
  },
  deviceText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: '600'
  },
  scanButtonContainer: {
    marginHorizontal: 100,
    marginTop: 15,
  },
  scanButton: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1C400',
    padding: 10,
    borderRadius: 15,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17.5,
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  }
});
