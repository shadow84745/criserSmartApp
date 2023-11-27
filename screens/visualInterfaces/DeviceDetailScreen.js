import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { collection, deleteDoc, doc, getDocs, query, where } from '@firebase/firestore';
import { db } from '../../firebaseConfig';
import { AjustesModal, ConfirmDeleteModal, RecomendacionesModal } from './hooks/DeviceModals';

let deviceID;



const DeviceDetailScreen = ({ route, navigation }) => {
  // Recupera los datos del dispositivo seleccionado de las propiedades de navegación
  const { device } = route.params;

  const [recomendationsVisible, setRecomendationsVisible] = useState(false);
  const [ajustesVisible, setAjustesVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  const [modelData, setModelData] = useState([]);


  // useCallback para evitar re-creaciones innecesarias
  const openRecomendations = useCallback(() => setRecomendationsVisible(true), []);
  const closeRecomendations = useCallback(() => setRecomendationsVisible(false), []);

  const openAjustes = useCallback(() => setAjustesVisible(true), []);
  const closeAjustes = useCallback(() => setAjustesVisible(false), []);

  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  const editDevice = useCallback(() => navigation.navigate("UpdateDeviceInfo"), []);

  deviceID = device.device_identifier;

  const handleDeleteDevice = useCallback(async () => {
    const deviceRef = device.device_identifier;
    try {
      await deleteDoc(doc(db, "devices", deviceRef));
      console.log("Documento borrado con exito")
      navigation.navigate("Home")
    } catch (error) {
      console.log("erros al tratar de borrar el documento" + error)
    }
  }, [device.device_identifier, navigation]);


  useEffect(() => {
    const fetchModelDevice = async () => {
      try {
        const modelRef = collection(db, "registeredDevices");
        const modelQuery = query(modelRef, where("deviceSerial", "==", device.serial_device));
        const modelPlanDocSnapshot = await getDocs(modelQuery);

        if (!modelPlanDocSnapshot.empty) {
          const modelData = modelPlanDocSnapshot.docs[0].data();
          setModelData(modelData);
        }
      } catch (error) {
        console.error('Error al obtener el plan nutricional:', error);
      }

      
      /* try {
          const dogRef = collection(db, "dogs");
          const dogQuery = query(dogRef, where("dog_id", "==", dogId));
          const dogDocSnapshot = await getDocs(dogQuery);

          if (!dogDocSnapshot.empty) {
              const dogData = dogDocSnapshot.docs[0].data();
              setDog(dogData);
          }
      } catch (error) {
          console.error('Error al obtener la informacion del perro:', error);
      } */

    };

    fetchModelDevice();
  },);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../images/logoCriserLogin.png')} style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Options')}>
          <Image source={require('../../images/hamburgerIcon.png')} style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>{modelData.name}</Text>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <View style={styles.dispenserSectionTitle}>
            <Text style={styles.deviceName}>{device.device_name}</Text>
          </View>
          <View style={styles.dispenserSection}>
            <View style={styles.dispenser}>
              <Image source={{ uri: device.image }} style={styles.deviceImage} />
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff'
              }}
              >
                Estado: </Text>
            </View>
            <View style={{ maxWidth: 170 }}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Dispensar Racion</Text>
                  <Image source={require('../../images/turnOnIcon.png')} style={{ width: 50, height: 50 }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionInformation}>
          <View style={styles.dispenserSection}>
            <View style={styles.dispenser}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff'
              }}
              >
                Comida en reserva </Text>
              <Image source={require('../../images/dogFood.png')} style={{ width: 180, height: 180 }} />
              {device.food_capacity > 80 && (
                <Image source={require('../../images/battery-100.png')} style={{ width: 150, height: 50 }} />
              )}
              {device.food_capacity > 50 && device.food_capacity <= 80 && (
                <Image source={require('../../images/battery-75.png')} style={{ width: 150, height: 50 }} />
              )}
              {device.food_capacity > 30 && device.food_capacity <= 50 && (
                <Image source={require('../../images/battery-50.png')} style={{ width: 150, height: 50 }} />
              )}
              {device.food_capacity > 10 && device.food_capacity <= 30 && (
                <Image source={require('../../images/battery-25.png')} style={{ width: 150, height: 50 }} />
              )}
              {device.food_capacity <= 10 && (
                <Image source={require('../../images/battery-0.png')} style={{ width: 150, height: 50 }} />
              )}
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff'
              }}
              >
                {device.food_capacity}%</Text>
            </View>
            <View style={styles.dispenser}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff'
              }}
              >
                Agua en reserva </Text>
              <Image source={require('../../images/waterDog.png')} style={{ width: 180, height: 180 }} />
              {device.water_capacity > 80 && (
                <Image source={require('../../images/battery-100.png')} style={{ width: 150, height: 50, margin: 5 }} />
              )}
              {device.water_capacity > 50 && device.water_capacity <= 80 && (
                <Image source={require('../../images/battery-75.png')} style={{ width: 150, height: 50, margin: 5 }} />
              )}
              {device.water_capacity > 30 && device.water_capacity <= 50 && (
                <Image source={require('../../images/battery-50.png')} style={{ width: 150, height: 50, margin: 5 }} />
              )}
              {device.water_capacity > 10 && device.water_capacity <= 30 && (
                <Image source={require('../../images/battery-25.png')} style={{ width: 150, height: 50, margin: 5 }} />
              )}
              {device.water_capacity <= 10 && (
                <Image source={require('../../images/battery-0.png')} style={{ width: 150, height: 50, margin: 5 }} />
              )}
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff'
              }}
              >
                {device.water_capacity}%</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={openRecomendations} style={styles.buttonRecomendations}>
              <Text style={styles.buttonText}>Recomendaciones</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={openAjustes} style={styles.buttonConfig}>
              <Text style={styles.buttonText}>Ajustes</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/*Seccion de los modales*/}

      <AjustesModal
        visible={ajustesVisible}
        onClose={closeAjustes}
        onDelete={openModal}
        onEdit={editDevice} // Abre el modal de confirmación para borrar
      />
      <ConfirmDeleteModal
        visible={modalVisible}
        onClose={closeModal}
        onConfirm={handleDeleteDevice}
      />
      <RecomendacionesModal
        visible={recomendationsVisible}
        onClose={closeRecomendations}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dispenserSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceImage: {
    width: 200,
    height: 200,
  },
  deviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#fff'
  },
  deviceInfo: {
    fontSize: 16,
    marginTop: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#00B5E2',
    width: 100,
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalButtonExit: {
    backgroundColor: 'red',
    width: 100,
    padding: 10,
    borderRadius: 5,
    margin: 10,
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
  section: {
    backgroundColor: "#00B5E2",
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginVertical: 5,
    marginBottom: -10
  },
  sectionInformation: {
    backgroundColor: "#F1C400",
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginVertical: 5,
  },
  dispenserSectionTitle: {
    alignItems: 'center'
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#F1C400',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dispenser: {
    alignItems: 'center',
  },
  buttonRecomendations: {
    backgroundColor: '#0071A4',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonConfig: {
    backgroundColor: '#00B5E2',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
});

export {deviceID};
export default DeviceDetailScreen;
