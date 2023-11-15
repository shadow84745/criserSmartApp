import React, { useState } from 'react';
import { Linking, Modal, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { db, firebaseConfig } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';


let device_name = null;
let id_device = null;
let image = null;
let serial_device = null;

const NewDispenserScreen = () => {

  const [deviceSerial, setDeviceSerial] = useState("");
  const [idDevice, setIdDevice] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);




  const navigation = useNavigation();

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

  const handleContactSupport = () => {
    // Número de teléfono al que se redirigirá
    const phoneNumber = "3184756135";
    
    // Utiliza la función Linking para abrir la aplicación de teléfono con el número
    Linking.openURL(`tel:${phoneNumber}`);
  };


  const handleRegisterDispenser = async () => {
    // Validaciones
    if (idDevice.length !== 15 || idDevice.includes('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z', 'w')) {
      setError('El ID del dispositivo es erroneo');
      return;
    }

    if (deviceSerial.length !== 15) {
      setError('El serial del dispositivo es erroneo');
      return;
    }

    if (idDevice == "" || deviceSerial == "" || deviceName == "") {
      setError('Los campos no pueden estar vacios');
      return;
    }

    try {
      setModalVisible(true);

      const user = auth.currentUser;

      // Consulta para verificar si existe un documento con el mismo idDevice en la colección activeDevices
      const activeDevicesRef = collection(db, "activeDevices");
      const activeDevicesQuery = query(activeDevicesRef, where("idDevice", "==", idDevice));
      const activeDevicesQuerySnapshot = await getDocs(activeDevicesQuery);

      // Consulta para verificar si existe un documento con el mismo deviceSerial en la colección registeredDevices
      const registeredDevicesRef = collection(db, "registeredDevices");
      const registeredDevicesQuery = query(registeredDevicesRef, where("deviceSerial", "==", deviceSerial));
      const registeredDevicesQuerySnapshot = await getDocs(registeredDevicesQuery);
     // Inicializa la variable para almacenar la URL de la imagen

      if (registeredDevicesQuerySnapshot.size > 0) {
        registeredDevicesQuerySnapshot.forEach((doc) => {
          const data = doc.data();
          image = data.image; // Recupera la URL de la imagen
        });
      }

      const devicesRef = collection(db, "devices");
      const devicesQuery = query(devicesRef, where("id_device", "==", idDevice));
      const devicesQuerySnapshot = await getDocs(devicesQuery);

      if (activeDevicesQuerySnapshot.size != 0) {
        // Ya existe un documento en la colección activeDevices con este idDevice, puedes continuar con el registro
        if (registeredDevicesQuerySnapshot.size != 0) {
          if (devicesQuerySnapshot.size == 0) {
            // Ya existe un documento en la colección registeredDevices con este deviceSerial, muestra un mensaje de error
              device_name = deviceName;
              id_device = idDevice;
              serial_device = deviceSerial;
              image = image;

            console.log("Dispositivo pendiente para completar");

            setIsButtonVisible(false);
            setModalVisible(false);
            setError('');
            setSuccessMessage('Registro inicializado con éxito');

            setTimeout(() => {
              setSuccessMessage('');
              navigation.navigate('ConnectionDispenser');
            }, 3000);
            setModalVisible(false);
          } else {
            setModalVisible(false);
            setError('El ID del dispositivo ya esta siendo usado');
          }
        } else {
          setError('El Serial del dispositivo no es valido');
          setModalVisible(false);
        }
      } else {
        // No existe un documento en la colección activeDevices con este idDevice, muestra un mensaje de error
        setModalVisible(false);
        setError('El ID del dispositivo no es válido');
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
            <Text style={styles.sectionTitleText}>Registra un nuevo dispositivo</Text>
          </View>
          <View style={styles.sectionCarrusel}>
            <View style={styles.titleContainer}>
              <Text style={styles.descriptionInput}>Ingresa el serial del dispositivo</Text>
            </View>
            <TextInput
              style={styles.input}
              maxLength={15}
              value={deviceSerial}
              keyboardType="numeric"
              onChangeText={text => setDeviceSerial(text)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionCarrusel}>
            <View style={styles.titleContainer}>
              <Text style={styles.descriptionInput}>Ingresa el ID de tu dispositivo</Text>
            </View>
            <TextInput
              style={styles.input}
              maxLength={15}
              value={idDevice}
              keyboardType="numeric"
              onChangeText={text => setIdDevice(text)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionCarrusel}>
            <View style={styles.titleContainer}>
              <Text style={styles.descriptionInput}>Ingresa un nombre personalizado para tu dispositivo</Text>
            </View>
            <TextInput
              style={styles.input}
              maxLength={30}
              value={deviceName}
              onChangeText={text => setDeviceName(text)}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isButtonVisible && (


            <TouchableOpacity
              onPress={handleRegisterDispenser}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Iniciar Conexion</Text>
            </TouchableOpacity>
          )}
        </View>
        <Modal
          animationType='fade'
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color="#00B5E2" />
              <Text style={styles.modalText}>Realizando registro...</Text>
            </View>
          </View>
        </Modal>
        <View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
        </View>

        <View style={styles.contactSection}>
          <TouchableOpacity onPress={handleContactSupport}>
            <Text style={styles.contactText}>Contactar con soporte</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.contactText}>Ver la guía</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export { device_name, id_device, serial_device, image };

export default NewDispenserScreen;

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
  input: {
    backgroundColor: '#FFF',
    color: '#000',
    marginBottom: 10,
    padding: 10,
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
  smartHomeImages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  smartHomeImage: {
    width: 100,
    height: 100,
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
    alignItems: 'flex-end',
    marginTop: 10,
    marginRight: 25,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalCloseButton: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00B5E2',
    marginTop: 10,
  },
});
