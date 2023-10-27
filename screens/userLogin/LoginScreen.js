import React, { useEffect, useState } from 'react';
import { ScrollView, Image, ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, Modal, ActivityIndicator } from 'react-native';
import { getAuth, signInWithEmailAndPassword, getReactNativePersistence } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();

    const app = initializeApp(firebaseConfig);

    const auth = getAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.navigate("Home");
            }
        });
        return unsubscribe;
    }, []);

    const RegisterScreen = () => {
        navigation.navigate("Register");
    };

    const MethodScreen = () => {
        navigation.navigate("Method");
    };

    const handleValidation = () => {
        let isValid = true;

        if (!email) {
            setEmailError('El correo electrónico es requerido');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Correo electrónico no válido');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('La contraseña es requerida');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleLoginAcount = () => {
        if (handleValidation()) {
            setModalVisible(true)
            signInWithEmailAndPassword(auth, email.toLowerCase(), password)
                .then((userCredential) => {
                    console.log("Usuario logeado exitosamente");
                    const user = userCredential.user;
                    console.log(user);
                    setModalVisible(false);
                })
                .catch(error => {
                    const errorCode = error.code;
                    if (errorCode === 'auth/wrong-password') {
                        setLoginError('Contraseña incorrecta');
                        setModalVisible(false);
                    } else {
                        setLoginError('Ocurrió un error al iniciar sesión');
                        setModalVisible(false);
                    }
                });
        }
    };

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
                <ImageBackground
                    source={require('../../images/fondoLogin.png')}
                    style={styles.imagenFondo}
                >
                    <View>
                        <TextInput
                            placeholder="Correo Electrónico o Teléfono"
                            style={styles.input}
                            value={email}
                            maxLength={40}
                            onChangeText={text => setEmail(text)}
                        />
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                        <TextInput
                            placeholder="Contraseña"
                            value={password}
                            maxLength={50}
                            onChangeText={text => setPassword(text)}
                            style={styles.input}
                            secureTextEntry
                        />
                        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                        {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={handleLoginAcount}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Iniciar Sesión</Text>
                        </TouchableOpacity>
                    </View>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={modalVisible}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <ActivityIndicator size="large" color="#00B5E2" />
                                <Text style={styles.modalText}>Validando datos...</Text>
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.contenedorTexto}>
                        <TouchableOpacity
                            onPress={MethodScreen}
                            style={styles.link}>
                            <Text style={styles.link}>Olvidé mi contraseña</Text>
                        </TouchableOpacity>
                        <Text style={styles.textoLinks2}>¿No tienes cuenta?</Text>
                        <TouchableOpacity
                            onPress={RegisterScreen}
                            style={styles.link}>
                            <Text style={styles.link}>Regístrate</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    link: {
        fontWeight: 'bold',
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    textoLinks: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    textoLinks2: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    linkRegistro: {
        fontSize: 20,
        color: "#FFF",
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
    },
    upperSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
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
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    input: {
        backgroundColor: '#FFF',
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
    contenedorTexto: {
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 10,
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

export default LoginScreen;
