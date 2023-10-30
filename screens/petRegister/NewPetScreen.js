import React, { useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { db, firebaseConfig } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';


let IDdispositivoregistrado = null;


const NewPetScreen = () => {

  const [nombreCan, setNombreCan] = useState('');
  const [edadCan, setEdadCan] = useState('');
  const [pesoCan, setPesoCan] = useState('');
  const [tamañoCan, setTamañoCan] = useState('');
  const [actividadFisica, setActividadFisica] = useState('');
  const [condicionesSalud, setCondicionesSalud] = useState('');
  const [marcaComida, setMarcaComida] = useState('');
  const [tipoComida, setTipoComida] = useState('');
  const [cccCalificacion, setCccCalificacion] = useState('Seleccionar'); // Nuevo estado
  const [etapa, setEtapa] = useState('Seleccionar'); // Nuevo estado


  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [cccModalVisible, setCccModalVisible] = useState(false); // Nuevo estado para el modal CCC
  const [modalTamaño, setModalTamaño] = useState(''); // Nuevo estado para controlar qué modal se muestra
  const [modalEtapa, setModalEtapa] = useState(''); // Nuevo estado para controlar qué modal se muestra



  const navigation = useNavigation();

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

  const modalInfo = () => {
    setCccModalVisible(true);
  };

  const modalSize = () => {
    setModalTamaño(true);
  };

  const infoModalEtapa = () => {
    setModalEtapa(true);
  };

  const handleRegisterPet = async () => {
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

      const devicesRef = collection(db, "devices");
      const devicesQuery = query(devicesRef, where("id_device", "==", idDevice));
      const devicesQuerySnapshot = await getDocs(devicesQuery);

      if (activeDevicesQuerySnapshot.size != 0) {
        // Ya existe un documento en la colección activeDevices con este idDevice, puedes continuar con el registro
        if (registeredDevicesQuerySnapshot.size != 0) {
          if (devicesQuerySnapshot.size == 0) {
            // Ya existe un documento en la colección registeredDevices con este deviceSerial, muestra un mensaje de error
            const docRef = await addDoc(collection(db, "devices"), {
              device_name: deviceName,
              id_device: idDevice,
              serial_device: deviceSerial,
              propietary_id: user.uid,
            });

            console.log("Dispositivo registrado exitosamente");
            console.log("Dispositivo registrado con el ID: ", docRef.id);

            IDdispositivoregistrado = docRef.id;

            setIsButtonVisible(false);
            setModalVisible(false);
            setError('');
            setSuccessMessage('Dispositivo registrado con éxito');

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

  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

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
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Registra un nuevo canino</Text>
        </View>
        <View style={styles.section}>

          <View style={styles.inputContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.descriptionInput}>Nombre del can</Text>
              <TextInput
                style={styles.input}
                value={nombreCan}
                onChangeText={text => setNombreCan(text)}
                maxLength={15}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.descriptionInput}>Edad del can</Text>
              <TextInput
                style={styles.input}
                value={edadCan}
                keyboardType="numeric"
                onChangeText={text => setEdadCan(text)}
                maxLength={2}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Calificación de la condición corporal (CCC)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Picker
                selectedValue={cccCalificacion}
                onValueChange={(itemValue, itemIndex) => setCccCalificacion(itemValue)}
                style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
              >
                <Picker.Item label="Seleccionar" value="Seleccionar" />
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5" value="5" />
                <Picker.Item label="6" value="6" />
                <Picker.Item label="7" value="7" />
                <Picker.Item label="8" value="8" />
                <Picker.Item label="9" value="9" />
              </Picker>
              <TouchableOpacity onPress={modalInfo} >
                <Image source={require('../../images/infoImage.png')} style={styles.infoIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Tamaño</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Picker
                selectedValue={tamañoCan}
                onValueChange={(itemValue, itemIndex) => setTamañoCan(itemValue)}
                style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
              >
                <Picker.Item label="Seleccionar" value="Seleccionar" />
                <Picker.Item label="Pequeño" value="pequeño" />
                <Picker.Item label="Mediano" value="mediano" />
                <Picker.Item label="Grande" value="grande" />
                <Picker.Item label="Extra Grande" value="extra-grande" />
              </Picker>
              <TouchableOpacity onPress={modalSize} >
                <Image source={require('../../images/infoImage.png')} style={styles.infoIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Etapa</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Picker
                selectedValue={etapa}
                onValueChange={(itemValue, itemIndex) => setEtapa(itemValue)}
                style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
              >
                <Picker.Item label="Seleccionar" value="Seleccionar" />
                <Picker.Item label="Cachorro" value="cachorro" />
                <Picker.Item label="Adulto" value="adulto" />
                <Picker.Item label="Senior" value="senior" />
              </Picker>
              <TouchableOpacity onPress={infoModalEtapa} >
                <Image source={require('../../images/infoImage.png')} style={styles.infoIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Peso(KG)</Text>
            <TextInput
              style={styles.input}
              value={pesoCan}
              keyboardType="numeric"
              onChangeText={text => setPesoCan(text)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Actividad Física</Text>
            <Picker
              ref={pickerRef}
              selectedValue={actividadFisica}
              onValueChange={(itemValue, itemIndex) => setActividadFisica(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Seleccionar" value="default" />
              <Picker.Item label="Vida Activa" value="activa" />
              <Picker.Item label="Sedentaria" value="sedentaria" />
              {/* Agrega más opciones según tus necesidades */}
            </Picker>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Condiciones de Salud</Text>
            <TextInput
              style={styles.input}
              value={condicionesSalud}
              onChangeText={text => setCondicionesSalud(text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Marca de Comida</Text>
            <Picker
              ref={pickerRef}
              selectedValue={marcaComida}
              onValueChange={(itemValue, itemIndex) => setMarcaComida(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Seleccionar" value="default" />
              <Picker.Item label="Chunky" value="chunky" />
              <Picker.Item label="Dogourmet" value="dogourmet" />
              <Picker.Item label="Dog Chow" value="dog chow" />
              {/* Agrega más opciones según tus necesidades */}
            </Picker>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Tipo</Text>
            <TextInput
              style={styles.input}
              value={tipoComida}
              onChangeText={text => setTipoComida(text)}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isButtonVisible && (
            <TouchableOpacity onPress={handleRegisterPet} style={styles.button}>
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>
        <Modal animationType='fade' transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color="#00B5E2" />
              <Text style={styles.modalText}>Realizando registro...</Text>
            </View>
          </View>
        </Modal>
        {/*Modal de la calificacion corporal CCC*/}
        <Modal
          visible={cccModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>¿Que es la calificacion de la condicion corporal (CCC)?</Text>
            <Image source={require('../../images/perroSalud.png')} style={styles.imagenCCC} />
            <TouchableOpacity onPress={() => setCccModalVisible(false)} style={styles.closeButton}>
              <Image source={require('../../images/closeButton.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
        </Modal>
        {/*Modal del tamaño de la mascota*/}
        <Modal
          visible={modalTamaño}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>¿Como puedo saber cual es el tamaño de mi mascota?</Text>
            <Image source={require('../../images/tamañoInfo.png')} style={styles.imagenTamaño} />
            <TouchableOpacity onPress={() => setModalTamaño(false)} style={styles.closeButton}>
              <Image source={require('../../images/closeButton.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
        </Modal>
        {/*Modal de la etapa de la mascota*/}
        <Modal
          visible={modalEtapa}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>¿Como puedo saber cual es la etapa de mi mascota?</Text>
            <Image source={require('../../images/tamañoInfo.png')} style={styles.imagenTamaño} />
            <TouchableOpacity onPress={() => setModalEtapa(false)} style={styles.closeButton}>
              <Image source={require('../../images/closeButton.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
        </Modal>

        <View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
        </View>

        <View style={styles.contactSection}>
          <TouchableOpacity>
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


export { IDdispositivoregistrado };
export default NewPetScreen;

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
    justifyContent: 'space between',
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
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#00B5E2',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingHorizontal: 10,
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
    color: '#fff',
  },
  modalCloseButton: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00B5E2',
    marginTop: 10,
  },
  inputSection: {
    width: '50%',
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  section: {
    backgroundColor: "#595959",
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginVertical: 5,
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginLeft: 10, // Espacio entre el botón y el ícono
  },
  selectorInput: {
    backgroundColor: '#FFF',
    color: '#000',
    marginBottom: 10,
    padding: 10,
    flex: 1,
  },
  imagenCCC: {
    width: 410, // Ajusta el ancho según tus necesidades
    height: 430, // Ajusta el alto según tus necesidades
    resizeMode: 'cover', // Ajusta el modo de redimensionamiento
    marginLeft: -10,
  },
  closeIcon: {
    width: 50,
    height: 50,
  },
  imagenTamaño: {
    width: 390, // Ajusta el ancho según tus necesidades
    height: 240, // Ajusta el alto según tus necesidades
    resizeMode: 'cover', // Ajusta el modo de redimensionamiento
  }
});