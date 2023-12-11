import React, { Linking, useState, useEffect, useContext } from 'react';
import { ActivityIndicator, Image, StyleSheet, View, Text, FlatList, TextInput, Button, PermissionsAndroid, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db, firebaseConfig } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { device_name, id_device, image, serial_device } from './NewDispenserScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import DeviceInfo from 'react-native-device-info';
import { BleContext } from './hooks/BleContext';
import { Buffer } from 'buffer';





const WiffiConnectionScreen = () => {
  const [wifiList, setWifiList] = useState([]);
  const [selectedWifi, setSelectedWifi] = useState(null);
  const [password, setPassword] = useState('');
  const [connectionSuccessful, setConnectionSuccessful] = useState(false);
  const [showWifiConnection, setShowWifiConnection] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);


  const [visibleWifiList, setVisibleWifiList] = useState([]);
  const [loadedCount, setLoadedCount] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const app = initializeApp(firebaseConfig);
  const navigation = useNavigation();


  const auth = getAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

  const handleContactSupport = () => {
    // Número de teléfono al que se redirigirá
    const phoneNumber = "3184756135";

    // Utiliza la función Linking para abrir la aplicación de teléfono con el número
    Linking.openURL(`tel:${phoneNumber}`);
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Wi-Fi networks',
            message: 'Necesitamos acceso a tus redes Wi-Fi para',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
    
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
    
          // Verificar si el GPS está habilitado
        } else {
          console.log('Location permission denied');
        }

        if (await DeviceInfo.isLocationEnabled()) {
          console.log('Location is enabled');
          // Ubicación habilitada, carga la lista de Wi-Fi
          loadWifiList();
        } else {
          console.log('Location is not enabled');
          // Ubicación deshabilitada, muestra un mensaje al usuario
          alert('Por favor, activa la ubicación para encontrar redes Wi-Fi.(Una vez que la actives presiona "Actualizar redes wifi")');
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestLocationPermission();
  }, []);

  const loadWifiList = async () => {
    try {
      const wifiArray = await WifiManager.loadWifiList();
      setWifiList(wifiArray);
    } catch (error) {
      console.log(error);
    }
  };

  const connectToWifi = async () => {
    try {

      const ssid = selectedWifi.SSID;
      const wifiPassword = password;

      await WifiManager.connectToProtectedSSID(ssid, wifiPassword, false, false);
      console.log('Conexion Wi-Fi exitosa');
      setModalVisible(false)
      setModal2Visible(true);

      sendWifiCredentialsToBleDevice();

      try {
        setModalVisible(true);

        const user = auth.currentUser;


        // Ya existe un documento en la colección registeredDevices con este deviceSerial, muestra un mensaje de error
        const docRef = await addDoc(collection(db, "devices"), {
          device_name: device_name,
          id_device: id_device,
          serial_device: serial_device,
          propietary_id: user.uid,
          image: image,
          ssid: ssid,
          password: wifiPassword,
          isWEP: false,
          isHidden: false,
          food_capacity: 0,
          water_capacity: 0,
          food_plan_ref: "default",
          openMotor: false,
          measureFood: false,
          measureWater: false,
          dispenseWater: false
        });

        console.log("Dispositivo registrado exitosamente");
        console.log("Dispositivo registrado con el ID: ", docRef.id);

        const deviceCollectionRef = collection(db, "devices");
        const deviceDocRef = doc(deviceCollectionRef, docRef.id);

        await setDoc(deviceDocRef, {
          device_identifier: docRef.id,
        }, { merge: true });

        console.log("Se creo el identificador unico exitosamente")


        setSelectedWifi("");
        setShowWifiConnection(false);
        setConnectionSuccessful(true);
        setModal2Visible(false);


      } catch (error) {
        console.error("Error al crear el usuario:", error);
      }

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    const initialVisibleWifiList = wifiList.slice(0, loadedCount);
    setVisibleWifiList(initialVisibleWifiList);
  }, [wifiList]);

  const loadMoreWifi = () => {
    const additionalWifi = wifiList.slice(loadedCount, loadedCount + 10);
    setVisibleWifiList([...visibleWifiList, ...additionalWifi]);
    setLoadedCount(loadedCount + 10);
  };

  const filterWifiList = (query) => {
    const filteredWifi = wifiList.filter((wifi) =>
      wifi.SSID.toLowerCase().includes(query.toLowerCase())
    );
    setVisibleWifiList(filteredWifi);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedWifi(item)}>
      <View style={styles.contenedorRedWifi}>
        <Text style={styles.redWifiTexto}>{item.SSID}</Text>
      </View>
    </TouchableOpacity>
  );


  const { connectedDevice, serviceUUID, characteristicUUID } = useContext(BleContext);

  const sendWifiCredentialsToBleDevice = async (ssid, password) => {
    if (!connectedDevice || !serviceUUID || !characteristicUUID) {
      console.log('Dispositivo BLE no conectado o UUIDs no disponibles');
      return;
    }
  
    const wifiCredentials = `SSID:${ssid};PASSWORD:${password}`;
    try {
      await connectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(wifiCredentials, 'utf-8').toString('base64')
      );
      console.log('Credenciales WiFi enviadas');
    } catch (error) {
      console.error('Error al enviar credenciales WiFi:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkBleConnection();
    }, 5000); // Verifica la conexión cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al salir de la pantalla
  }, [connectedDevice, serviceUUID, characteristicUUID]);


  const checkBleConnection = async () => {
    if (!connectedDevice || !serviceUUID || !characteristicUUID) {
      console.log('Dispositivo BLE no conectado o UUIDs no disponibles');
      return false;
    }

    try {
      // Intenta leer una característica; si tiene éxito, aún estás conectado
      await connectedDevice.readCharacteristicForService(serviceUUID, characteristicUUID);
      console.log('Aún conectado al dispositivo BLE');
      return true;
    } catch (error) {
      console.error('Perdida de conexión BLE:', error);
      return false;
    }
  };


  
  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../images/logoCriserLogin.png')} style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Options')}>
          <Image source={require('../../images/hamburgerIcon.png')} style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.contenedorPresentacion}>
        <Text style={styles.descriptionInput}>Conexion del dispositivo a una red Wi-Fi</Text>
        <Image source={require('../../images/wiffiLogo.png')} style={styles.wifiLogo} />
        {showWifiConnection && (
          <Button
            title="Actualizar redes WiFi"
            onPress={loadWifiList}
          />
        )}
      </View>


      {showWifiConnection && (
        <View style={styles.contenedorListaWifi}>
          <TextInput
            placeholder="Buscar red WiFi"
            value={searchQuery}
            onChangeText={(query) => {
              setSearchQuery(query);
              filterWifiList(query);
            }}
            style={styles.searchInput}
          />

          <FlatList
            data={visibleWifiList}
            renderItem={({ item, index }) => (
              <TouchableOpacity key={index} onPress={() => { setSelectedWifi(item); setModalVisible(true); }}>
                <View style={styles.contenedorRedWifi}>
                  <Text style={styles.redWifiTexto}>{item.SSID}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {selectedWifi && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setSelectedWifi("");
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => {
                setSelectedWifi("");
                setModalVisible(false);
              }}
              style={styles.closeButton}
            >
              <Image source={require('../../images/closeButton.png')} style={styles.closeButtonIcon} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Red Wi-Fi seleccionada: {selectedWifi.SSID}</Text>
            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              style={styles.passwordInput}
            />
            <Button title="Conectar" onPress={connectToWifi} />
          </View>
        </Modal>

      )}

      <Modal
        animationType='fade'
        transparent={true}
        visible={modal2Visible}
      >
        <View style={styles.modalContainer2}>
          <View style={styles.modalContent2}>
            <ActivityIndicator size="large" color="#00B5E2" />
            <Text style={styles.modalText2}>Enviando datos de conexion...</Text>
            <Text style={styles.modalText2}>Aguarde un momento...</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.section}>
        <View style={styles.sectionCarrusel}>
          <Text style={styles.descriptionInput}>
            Una vez la luz LED del WiFi del dispositivo, se encienda lanzando una luz azul intermitente para después de unos segundos convertirse en constante, querrá decir que la conexión fue exitosa.
          </Text>
        </View>
      </View>

      {connectionSuccessful && (
        <View style={styles.section}>
          <View style={styles.sectionCarrusel}>
            <View style={styles.successMessageContainer}>
              <Text style={styles.successMessage}>¡Conexión exitosa!</Text>
              <Button title="Continuar" onPress={() => navigation.navigate('DispenserTest')} />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default WiffiConnectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  contenedorPresentacion: {
    backgroundColor: '#00B5E2',
    alignItems: 'center',
    padding: 10,
  },
  descriptionInput: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  wifiLogo: {
    width: 60,
    height: 60,
    marginTop: 10,
  },
  closeButtonIcon: {
    width: 30,
    height: 30,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
    width: 250,
  },
  section: {
    backgroundColor: '#595959',
    padding: 20,
  },
  sectionCarrusel: {
    marginTop: 5,
  },
  successMessageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  successMessage: {
    fontWeight: 'bold',
    color: '#00B5E2',
    fontSize: 30,
  },
  contenedorListaWifi: {
    backgroundColor: '#747474',
    padding: 15,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
    backgroundColor: "#fff"
  },
  contenedorRedWifi: {
    backgroundColor: '#F1C400',
    margin: 15,
    padding: 10,
    borderRadius: 25,
  },
  redWifiTexto: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent2: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalText2: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalCloseButton2: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00B5E2',
    marginTop: 10,
  },
});
