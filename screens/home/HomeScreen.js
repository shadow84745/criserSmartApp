import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig, db } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, query, where } from 'firebase/firestore';


const HomeScreen = ({ navigation }) => {
  

  const app = initializeApp(firebaseConfig);



  const auth = getAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });


  const [userData, setUserData] = useState({}); // Almacena los datos del usuario desde Firestore
  const user = auth.currentUser;
  const [devices, setDevices] = useState([]);


  const pets = [
    require('../../images/dogExample.png'),
    require('../../images/dogExample.png'),
    require('../../images/dogExample.png'),
    require('../../images/dogExample.png'),
    null,
  ];



  useEffect(() => {
    const fetchData = async () => {
      try {
        const devicesRef = collection(db, "devices");
        const devicesQuery = query(devicesRef, where("propietary_id", "==", user.uid));
        const devicesQuerySnapshot = await getDocs(devicesQuery);
  
        if (devicesQuerySnapshot.size > 0) {
          const deviceData = [];
          devicesQuerySnapshot.forEach((doc) => {
            const data = doc.data();
            deviceData.push(data);
          });
          // Agrega un elemento nulo al final del array
          deviceData.push(null);
          setDevices(deviceData);
          //console.log("Datos de dispositivos:", deviceData);   ------    Testear que datos se estan enviando
        } else {
          // Agrega un elemento nulo si no hay dispositivos
          setDevices([null]);
          console.log("No se pueden obtener datos");
        }
      } catch (error) {
        console.log("Error recopilando datos y mostrándolos" + error);
      }
    };
  
    fetchData();
  }, [user]);

  const handleDeviceSelect = (device) => {
    // Navegar a la pantalla de detalles y pasar los datos del dispositivo seleccionado
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
    padding: 10,
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
    width: 100,
    height: 100,
  },
  buttonText:{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  }
});
