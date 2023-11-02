import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView , Linking} from 'react-native';
import { getAuth, signOut, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = () => {
    const navigation = useNavigation();

    const app = initializeApp(firebaseConfig);


    const auth = getAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace('Login');
            })
            .catch((error) => alert(error.message));
    };
    const handleContactSupport = () => {
        // Número de teléfono al que se redirigirá
        const phoneNumber = "3184756135";
        
        // Utiliza la función Linking para abrir la aplicación de teléfono con el número
        Linking.openURL(`tel:${phoneNumber}`);
      };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Image source={require('../../images/logoCriserLogin.png')} style={styles.logo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../images/hamburgerIcon.png')} style={styles.menuIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.sectionItem} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.sectionTitle}>Inicio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sectionItem} onPress={() => navigation.navigate('Profile')}>
                    <Text style={styles.sectionTitle}>Perfil del usuario</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sectionItem}>
                    <Text style={styles.sectionTitle}>Tienda (PRÓXIMAMENTE)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sectionItem} onPress={handleContactSupport}>
                    <Text style={styles.sectionTitle}>Contactar con soporte</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sectionItem}>
                    <Text style={styles.sectionTitle}>Ver la guía</Text>
                </TouchableOpacity>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <Text style={styles.buttonText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 40,
    },
    menuIcon: {
        width: 30,
        height: 30,
    },
    section: {
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 10,
    },
    sectionItem: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    signOutButton: {
        backgroundColor: '#ff5a5f',
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    contactText: {
        fontSize: 16,
        color: 'blue',
    },
    smartHomeImages: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smartHomeImage: {
        width: 100,
        height: 100,
    },
});
