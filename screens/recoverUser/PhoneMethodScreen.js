import { Modal, KeyboardAvoidingView, StyleSheet, Text, View, Image, ScrollView, ImageBackground, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getAuth, getReactNativePersistence, signInWithPhoneNumber } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


const PhoneMethodScreen = () => {

    const [phone, setPhone] = useState('')
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const navigation = useNavigation();

    const app = initializeApp(firebaseConfig);

    const auth = getAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });

    auth.useDeviceLanguage();

    const LoginScreen = () => {
        navigation.navigate("Login")
    }

    const MethodScreen = () => {
        navigation.navigate("Method")
    }

    const handleSendRecoverSms = () => {
        signInWithPhoneNumber(auth, phone)
            .then(() => {
                console.log("Token Enviado")
            })
            .catch(error => {
                console.log(error);
            })

    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            {/* Sección superior con espacio para imagen y texto */}
            <View style={styles.upperSection}>
                <Image
                    source={require('../../images/logoCriserLogin.png')}
                    style={styles.logo}
                />
                <Text style={styles.welcomeText}>!SEA BIENVENIDO!</Text>
            </View>

            {/* Sección inferior con formulario */}
            <ScrollView style={styles.lowerSection} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.textoAviso}>FUNCION ACTUALMENTE NO DISPONIBLE</Text>
                <Text style={styles.textoPrincipal}>Recupera tu cuenta</Text>
                <ImageBackground
                    source={require('../../images/fondoLogin.png')}
                    style={styles.imagenFondo}
                >
                    <View>
                        <TextInput
                            placeholder="Numero de telefono registrado"
                            style={styles.input}
                            value={phone}
                            onChangeText={text => setPhone(text)}
                            editable={false}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={openModal}
                        >
                            <Text style={styles.linkRegistro}>Enviar token</Text>
                        </TouchableOpacity>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={closeModal}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>Esta funcionalidad aún no está disponible</Text>
                                <TouchableOpacity onPress={closeModal}>
                                    <Text style={styles.modalCloseButton}>Cerrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <View style={styles.optionContainer}>
                        <Text style={styles.textoLink}>¿Tienes problemas con tu correo?</Text>
                        <TouchableOpacity
                            onPress={MethodScreen}
                            style={styles.link}>
                            <Text style={styles.link}>Prueba otro metodo</Text>
                        </TouchableOpacity>
                        <Text style={styles.textoLink}>¿Ya recordaste tu contraseña?</Text>
                        <TouchableOpacity
                            onPress={LoginScreen}
                            style={styles.link}>
                            <Text style={styles.link}>Inicia sesion</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </ScrollView>
        </KeyboardAvoidingView>


    )
}

export default PhoneMethodScreen

const styles = StyleSheet.create({
    optionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 20,
    },
    link: {
        fontWeight: 'bold',
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: { width: -1, height: 1 }, // Ajusta el ancho del borde
        textShadowRadius: 5, // Ajusta el radio del borde
    },
    textoLink: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',

    },
    container: {
        flex: 1,
    },
    textoPrincipal: {
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
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
    welcomeText: {
        color: '#00B5E2',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: -40,
        textTransform: 'uppercase',
    },
    lowerSection: {
        flex: 2,
    },
    scrollContent: {
        flexGrow: 1,
    },
    imagenFondo: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center', // Alinear contenido al centro verticalmente
        paddingHorizontal: 20, // Espacio en los bordes para evitar que el contenido toque los extremos
    },
    input: {
        backgroundColor: '#CCC',
        color: '#000',
        marginBottom: 10,
        padding: 10,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#00B5E2',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFF',
    },
    textoAviso: {
        color: 'red',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
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
      
})