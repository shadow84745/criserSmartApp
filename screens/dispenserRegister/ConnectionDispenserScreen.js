import React, { useRef, useState } from 'react';
import { PermissionsAndroid, Linking, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView, FlatList, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BleManager } from 'react-native-ble-plx';


const manager = new BleManager();

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



const ConnectionDispenserScreen = () => {

  const navigation = useNavigation();

  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isDevicePaired, setIsDevicePaired] = useState(false);



  const handleContactSupport = () => {
    // Número de teléfono al que se redirigirá
    const phoneNumber = "3184756135";

    // Utiliza la función Linking para abrir la aplicación de teléfono con el número
    Linking.openURL(`tel:${phoneNumber}`);
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
            <Text style={styles.sectionTitleText}>Conexion con un nuevo dispositivo</Text>
          </View>
          <View style={styles.sectionCarrusel}>
            <View style={styles.titleContainer}>
              <Text style={styles.descriptionInput}>Mantenga presionado el botón de bluetooth en su dispositivo </Text>
              <Image source={require('../../images/bluetoothLogo.png')}
                style={styles.logoBluetooth}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionCarrusel}>
            <View style={styles.titleContainer}>
              <Text style={styles.descriptionInput}>Una vez este esté lanzando una luz verde intermitente realice la búsqueda del dispositivo a través de su celular móvil y conéctelo</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionCarrusel}>
            <View style={styles.titleContainer}>
              <Text style={styles.descriptionInput}>Una vez se haya realizado la conexión, la luz deberá cambiar de verde intermitente a un azul constante. Esto quiere decir que la conexión ha sido exitosa</Text>
            </View>
          </View>
        </View>

        {!isDevicePaired && (
          <View style={styles.section}>
            <View style={styles.sectionCarrusel}>
              <View style={styles.titleContainer}>
                <Text style={styles.descriptionInput}>
                  ¿El dispositivo está emparejado por Bluetooth al dispensador?
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsDevicePaired(true);
                      setIsButtonVisible(true);
                    }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Sí</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}


        <View style={styles.buttonContainer}>
          {isButtonVisible && (
            <View style={styles.confirmationButtons}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setIsDevicePaired(false);
                    setIsButtonVisible(false);
                  }}
                  style={styles.buttonRed}
                >
                  <Text style={styles.buttonText}>No, no he realizado la conexion</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ScanBleDevice')}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Paso siguiente</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}





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

export default ConnectionDispenserScreen;

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
    backgroundColor: '#00B5E2',
    borderRadius: 5,
  },
  deviceText: {
    color: '#FFF',
    textAlign: 'center',
  },
});
