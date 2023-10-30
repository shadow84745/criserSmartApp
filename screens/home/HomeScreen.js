import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView, BackHandler, Modal } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig, db } from '../../firebaseConfig';
import { useNavigation, useIsFocused } from '@react-navigation/native';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';


const HomeScreen = () => {

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  

  const app = initializeApp(firebaseConfig);



  const auth = getAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });


  const [userData, setUserData] = useState({}); // Almacena los datos del usuario desde Firestore
  const user = auth.currentUser;
  const [devices, setDevices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);



  const pets = [
    require('../../images/dogExample.png'),
    require('../../images/dogExample.png'),
    require('../../images/dogExample.png'),
    require('../../images/dogExample.png'),
    null,
  ];


  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFocused) {
        setModalVisible(true);
        return true; // Evita que el botón de retroceso cierre la aplicación
      }
      return false;
    });

    return () => {
      backHandler.remove();
    };
  }, [isFocused]);

  useEffect(() => {
    

    const devicesRef = collection(db, "devices");
    const devicesQuery = query(devicesRef, where("propietary_id", "==", user.uid));

    // Establecer la suscripción en tiempo real a la colección "devices"
    const unsubscribe = onSnapshot(devicesQuery, (snapshot) => {
      const updatedDevices = [];
      snapshot.forEach((doc) => {
        updatedDevices.push(doc.data());
      });
      updatedDevices.push(null);
      setDevices(updatedDevices);
    });

    

    return () => {      // Cancelar la suscripción cuando se desmonte la pantalla
      unsubscribe();
    };
  }, [user]);

  const closeModal = () => {
    setModalVisible(false);
  };



  const handleDeviceSelect = (device) => {
    navigation.navigate('DeviceDetail', { device });
  };
  

  // En la función renderCarouselItem, muestra el nombre del dispositivo
  const renderCarouselItem = ({ item, index }) => {
    //console.log("Longitud de devices:", devices.length); ----------- Testear que todos los dispositivos se muestren
    //console.log("Índice del elemento:", index);  
  
    if (item === null) {
      return (
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('NewDispenser')}>
          <Image source={require('../../images/addNew.png')} style={styles.addButton}/> 
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.deviceCarrousel} onPress={() => handleDeviceSelect(item)}>
          <Image source={{ uri: item.image }} style={styles.carouselImage} />
          <Text style={styles.buttonText}>{item.device_name}</Text>
        </TouchableOpacity>
      );
    }
  };

  const handleSignOut = () => {
    auth
        .signOut()
        .then(() => {
            navigation.replace('Login');
        })
        .catch((error) => alert(error.message));
};



  const renderCarouselItemDog = ({ item, index }) => {
    if (item === null) {
      return (
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('NewPet')}>
          <Image source={require('../../images/addNew.png')} style={styles.addButton}/> 
        </TouchableOpacity>
      );
    };

    return (
      <TouchableOpacity>
        <Image source={item} style={styles.carouselImage} />
      </TouchableOpacity>
    );
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
          <View style={styles.sectionCarruselTitle}>
            <Text style={styles.sectionTitle}>Tus dispositivos</Text>
          </View>
          <View style={styles.sectionCarrusel}>
            <Carousel
              data={devices}
              renderItem={renderCarouselItem}
              sliderWidth={350}
              itemWidth={200}
              layout={'default'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionCarruselTitle}>
            <Text style={styles.sectionTitle}>Tus mascotas</Text>
          </View>

          <View style={styles.sectionCarrusel}>
            <Carousel
              data={pets}
              renderItem={renderCarouselItemDog}
              sliderWidth={350}
              itemWidth={200}
              layout={'default'}
              style={styles.carrousel}
            />
          </View>

        </View>

        <View style={styles.section}>
          <View style={styles.sectionCarruselTitle}>
            <Text style={styles.sectionTitle}>Smart Home</Text>
          </View>
          <View style={styles.sectionCarrusel}>
            <View style={styles.smartHomeImages}>
              <Image source={require('../../images/alexaLogo.png')} style={styles.smartHomeImage} />
              <Image source={require('../../images/GHomeLogo.png')} style={styles.smartHomeImage} />
            </View>
          </View>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Está seguro de que desea salir?</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={closeModal}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonExit}
              onPress={handleSignOut}
            >
              <Text style={styles.modalButtonText}>Salir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
  sectionCarrusel: {
    marginTop: 20,
    backgroundColor: '#595959',
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00B5E2',
    marginLeft: 10,
    marginTop: 10,
  },
  carouselImage: {
    width: 200,
    height: 200,
    marginHorizontal: 10,
  },
  addButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
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
  smartHomeImages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  smartHomeImage: {
    width: 100,
    height: 100,
  },
  deviceCarrousel:{
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -50,
  },
  addButton:{
    marginLeft:20,
    padding:30,
    alignItems: 'center',
    width: 70,
    height: 70,
  },
  buttonText:{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
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
});
