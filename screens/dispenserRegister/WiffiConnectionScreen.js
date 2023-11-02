import React, { Linking, useState, useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, View, Text, FlatList, TextInput, Button, PermissionsAndroid, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db, firebaseConfig } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { IDdispositivoregistrado } from './NewDispenserScreen';

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
          loadWifiList();
        } else {
          console.log('Location permission denied');
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

      const devicesCollectionRef = collection(db, "devices");
      const deviceDocRef = doc(devicesCollectionRef, IDdispositivoregistrado);

      try {
        await setDoc(deviceDocRef, {
          ssid: ssid,
          password: wifiPassword,
          isWEP: false,
          isHidden: false,
        }, { merge: true });

        console.log('Datos agregados a Firestore con éxito');

        setSelectedWifi("");
        setShowWifiConnection(false);
        setConnectionSuccessful(true);
        setModal2Visible(false);

      } catch (error) {
        console.error('Error al agregar datos a Firestore:', error);
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
