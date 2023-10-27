import { useNavigation } from '@react-navigation/native'
import { StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import React from 'react'
import { View } from 'react-native';


const MethodScreen = () => {
  const navigation = useNavigation();


  const LoginScreen = () => {
    navigation.navigate("Login")
  }

  const EmailMethodScreen = () => {
    navigation.navigate("EmailMethod")
  }

  const PhoneMethodScreen = () => {
    navigation.navigate("PhoneMethod")
  }

  return (
    <View
      style={styles.container}>
      <View style={styles.upperSection}>
        <Image
          source={require('../../images/logoCriserLogin.png')}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>METODOS DE RECUPERACION</Text>
      </View>
      <TouchableOpacity
      onPress={EmailMethodScreen}>
        <View
          style={styles.metodoCorreo}>
          <Image
            source={require('../../images/correo.png')}></Image>
          <Text style={styles.correoText}>A traves del correo</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={PhoneMethodScreen}>
        <View
          style={styles.metodoNumero}>
          <Image
            source={require('../../images/telefonowpp.png')}></Image>
          <Text style={styles.numeroText}>A traves del numero de telefono</Text>

        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View
          style={styles.metodoSoporte}>
          <Image
            source={require('../../images/soporteicon.png')}></Image>
          <Text style={styles.soporteText}>Contacta con soporte</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.contenedorTexto}>
        <Text style={styles.textoLinks}>¿Ya tienes una cuenta?</Text>

        <TouchableOpacity
          onPress={LoginScreen}
          style={styles.link}>
          <Text style={styles.link}>Inicia Sesion</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MethodScreen

const styles = StyleSheet.create({
  link: {
    fontWeight: 'bold',
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: -1.5, height: 3 }, // Ajusta el ancho del borde
    textShadowRadius: 5, // Ajusta el radio del borde
},
  container: {
    flex: 1,
  },
  upperSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF', // Cambia el color de fondo si es necesario
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    margin: 0,
  },
  metodoCorreo: {
    backgroundColor: '#F1C400',
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metodoNumero: {
    backgroundColor: '#00B5E2',
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metodoSoporte: {
    backgroundColor: '#FF5A00',
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoLinks: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textoLinks2: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contenedorTexto: {
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -70,
    textTransform: 'uppercase',
},
})