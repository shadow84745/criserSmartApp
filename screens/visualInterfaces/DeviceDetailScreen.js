import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const DeviceDetailScreen = ({ route , navigation}) => {
  // Recupera los datos del dispositivo seleccionado de las propiedades de navegación
  const { device } = route.params;
  

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

        <View style={styles.dispenserSection}>
      <Image source={{ uri: device.image }} style={styles.deviceImage} />
      <Text style={styles.deviceName}>{device.device_name}</Text>
      <Text style={styles.deviceInfo}>Otra información del dispositivo</Text>
      {/* Agrega aquí más información específica del dispositivo */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
  dispenserSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceImage: {
    width: 200,
    height: 200,
  },
  deviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
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
});

export default DeviceDetailScreen;
