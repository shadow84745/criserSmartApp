import { Linking, StyleSheet,Modal, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { initializeApp } from 'firebase/app';
import { db, firebaseConfig } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';



const DispenserTestScreen = () => {

    const navigation = useNavigation();

    const [isModalVisible, setIsModalVisible] = useState(false);
    // Estado para almacenar la información de los botones
    const [buttonInfo, setButtonInfo] = useState('');

    // ...

    // Función para mostrar el modal y configurar la información
    const showInfoModal = (info) => {
        setButtonInfo(info);
        setIsModalVisible(true);
    };

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

                <View style={styles.sectionMain}>
                    <View style={styles.sectionTitle}>
                        <Text style={styles.sectionTitleText}>Conexion con un nuevo dispositivo</Text>
                    </View>
                    <View style={styles.sectionMainTittle}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.descriptionTitle}>Testeo del dispositivo</Text>
                            <Image source={require('../../images/testImage.png')}
                                style={styles.logoBluetooth}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.sectionBody}>

                    <View style={styles.testButtonsContainer}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => showInfoModal('Aquí va la información de Prueba de compuertas')}
                                style={styles.buttonTest}
                            >
                                <Text style={styles.buttonText}>Prueba de compuertas</Text>
                            </TouchableOpacity>
                            {/* Agrega un ícono de pregunta en el botón */}
                            <TouchableOpacity onPress={() => showInfoModal('Aquí va la información de Prueba de compuertas')}>
                                <Image source={require('../../images/infoImage.png')} style={styles.infoIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsDevicePaired(true);
                                    setIsButtonVisible(true);
                                }}
                                style={styles.buttonTest}
                            >
                                <Text style={styles.buttonText}>Prueba de sensores</Text>
                            </TouchableOpacity>
                            {/* Agrega un ícono de pregunta en el botón */}
                            <TouchableOpacity onPress={() => showInfoModal('Aquí va la información de Prueba de sensores')}>
                                <Image source={require('../../images/infoImage.png')} style={styles.infoIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsDevicePaired(true);
                                    setIsButtonVisible(true);
                                }}
                                style={styles.buttonTest}
                            >
                                <Text style={styles.buttonText}>Prueba de notificaciones</Text>
                            </TouchableOpacity>
                            {/* Agrega un ícono de pregunta en el botón */}
                            <TouchableOpacity onPress={() => showInfoModal('Aquí va la información de Prueba de notificaciones')}>
                                <Image source={require('../../images/infoImage.png')} style={styles.infoIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsDevicePaired(true);
                                    setIsButtonVisible(true);
                                }}
                                style={styles.buttonTest}
                            >
                                <Text style={styles.buttonText}>Prueba de luces led</Text>
                            </TouchableOpacity>
                            {/* Agrega un ícono de pregunta en el botón */}
                            <TouchableOpacity onPress={() => showInfoModal('Aquí va la información de Prueba de luces')}>
                                <Image source={require('../../images/infoImage.png')} style={styles.infoIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.sectionCarrusel}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.descriptionInput}>Si todas las pruebas fueron realizadas con éxito, quiere decir que el dispositivo está listo para configurarse</Text>
                        </View>
                    </View>
                </View>


                <View style={styles.buttonsContainer}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('NewPet')}
                            style={styles.buttonEnd}
                        >
                            <Text style={styles.buttonText}>Registrar mascota</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Home')}
                            style={styles.buttonEnd}
                        >
                            <Text style={styles.buttonText}>Configurar dispositivo</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={styles.contactSection}>
                    <TouchableOpacity onPress={handleContactSupport}>
                        <Text style={styles.contactText}>Contactar con soporte</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.contactText}>Ver la guía</Text>
                    </TouchableOpacity>
                </View>


                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>{buttonInfo}</Text>
                        <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                            <Image source={require('../../images/closeButton.png')} style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DispenserTestScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    sectionMainTittle: {
        marginTop: 20,
        backgroundColor: '#00B5E2',
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
    descriptionTitle: {
        color: '#FFF',
        fontSize: 25,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
        textAlign: 'center',
        margin: -3,
    },
    descriptionInput: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
        textAlign: 'center',
        marginHorizontal: 15,
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
        flexDirection: 'row',
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
        textShadowColor: 'black',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
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
    buttonsContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    buttonTest: {
        backgroundColor: '#F1C400',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 15,
        borderColor: '#000',
        borderWidth: 1,
    },
    sectionBody: {
        marginTop: 10,
        backgroundColor: "#C3C3C3"
    },
    testButtonsContainer: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonEnd: {
        backgroundColor: '#00B5E2',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: 1,
    },
    infoIcon: {
        width: 20,
        height: 20,
        marginLeft: 10, // Espacio entre el botón y el ícono
      },
    
      // Estilos para el modal
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
      modalText: {
        fontSize: 20,
        color: '#FFF',
        marginBottom: 20,
        textAlign: 'center',
      },
      closeButton: {
        backgroundColor: '#00B5E2',
        padding: 10,
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: 1,
      },
      closeIcon: {
        width: 20,
        height: 20,
      },
});
