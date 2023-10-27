import React, { useState, useEffect } from 'react';
import { Modal, Image, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getAuth, currentUser, updateProfile } from 'firebase/auth';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Asegúrate de importar tu instancia de Firebase aquí
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {

    const [userData, setUserData] = useState({}); // Almacena los datos del usuario desde Firestore
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [surname, setSurname] = useState('');
    const [secondSurname, setSecondSurname] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false); // Estado para el mensaje de éxito
    const [isAdmin, setIsAdmin] = useState(false); // Nuevo estado para verificar si es administrador
    const [adminMessageShown, setAdminMessageShown] = useState(false); // Nuevo estado para controlar el mensaje
    const [modalVisible, setModalVisible] = useState(false);


    //ESTAN DESHABILITADAS YA QUE SON DATOS NO MODIFICABLES POR EL USUARIO
    //const [age, setAge] = useState('');
    //const [email, setEmail] = useState('');
    //const [phone, setPhone] = useState('');
    //const [dateOfBirth, setDateOfBirth] = useState('');
    //const [newUsername, setNewUsername] = useState('');

    const navigation = useNavigation();

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData(data);
                }
            } catch (error) {
                console.error('Error al obtener los datos del usuario desde Firestore:', error);
            }
        };

        if (user) {
            fetchUserData();
        }

        if (userData.role === "admin") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [user, userData]);

    useEffect(() => {
        // Mostrar el mensaje una sola vez cuando se detecta que es administrador
        if (isAdmin && !adminMessageShown) {
            console.log("Funciones de administrador habilitadas");
            setAdminMessageShown(true);
        }
    }, [isAdmin, adminMessageShown]);

    const updateProfileInfo = async () => {
        try {
            setModalVisible(true)
            const docRef = doc(db, 'users', user.uid);

            const updatedData = {}; // Crear un objeto para almacenar los datos actualizados

            if (firstName !== "") {
                updatedData.first_name = firstName;
            } else {
                updatedData.first_name = userData.first_name;
            }

            if (secondName !== "") {
                updatedData.second_name = secondName;
            } else {
                updatedData.second_name = userData.second_name;
            }

            if (surname !== "") {
                updatedData.surname = surname;
            } else {
                updatedData.surname = userData.surname;
            }

            if (secondSurname !== "") {
                updatedData.second_surname = secondSurname;
            } else {
                updatedData.second_surname = userData.second_surname;
            }

            await updateDoc(docRef, updatedData);

            // Actualización exitosa, establece el estado de éxito en true
            setModalVisible(false);
            setUpdateSuccess(true);
        } catch (error) {
            setModalVisible(false);
            console.error('Error al subir datos a Firestore:', error);
        }
    };

    const validateInput = (text) => {
        // Utiliza una expresión regular para comprobar que el texto no contiene espacios ni números,
        // o es una cadena vacía.
        return text === '' || /^[A-Za-z]+$/.test(text);
    };





    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    {/* Coloca tu logo aquí */}
                    <Image source={require('../../images/logoCriserLogin.png')} style={styles.logo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Options')}>
                    {/* Icono de menú de hamburguesa */}
                    <Image source={require('../../images/hamburgerIcon.png')} style={styles.menuIcon} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <Text style={styles.mainLabel}>¡Sea bienvenido a su perfil <Text style={styles.mainLabelName}>{userData.username}</Text>! </Text>

                <Text style={styles.label}>Primer Nombre:</Text>
                {/* Mostrar los datos del usuario desde Firestore */}
                <TextInput
                    placeholder={userData.first_name}
                    style={styles.inputUno}
                    value={firstName}
                    onChangeText={(text) => {
                        if (validateInput(text)) {
                            setFirstName(text);
                        }
                    }}
                    maxLength={20}
                />
                <Text style={styles.label}>Segundo Nombre:</Text>
                <TextInput
                    placeholder={userData.second_name ? userData.second_name : "Este campo esta vacio"}
                    style={styles.inputUno}
                    value={secondName}
                    onChangeText={(text) => {
                        if (validateInput(text)) {
                            setSecondName(text);
                        }
                    }}
                    maxLength={20}

                />
                <Text style={styles.label}>Primer Apellido:</Text>
                <TextInput
                    placeholder={userData.surname}
                    style={styles.inputUno}
                    value={surname}
                    onChangeText={(text) => {
                        if (validateInput(text)) {
                            setSurname(text);
                        }
                    }}
                    maxLength={20}

                />
                <Text style={styles.label}>Segundo Apellido:</Text>
                <TextInput
                    placeholder={userData.second_surname ? userData.second_surname : "Este campo esta vacio"}
                    style={styles.inputUno}
                    value={secondSurname}
                    onChangeText={(text) => {
                        if (validateInput(text)) {
                            setSecondSurname(text);
                        }
                    }}
                    maxLength={20}
                />
                <Text style={styles.label}>Fecha de nacimiento:</Text>
                <TextInput
                    placeholder={userData.date_of_birth}
                    style={styles.inputUnoNonEditable}
                    editable={false}
                />
                <Text style={styles.label}>Edad:</Text>
                <TextInput
                    placeholder={userData.age}
                    style={styles.inputUnoNonEditable}
                    editable={false}
                />
                <Text style={styles.label}>Email:</Text>
                <TextInput
                    placeholder={user.email}
                    style={styles.inputUnoNonEditable}
                    editable={false}
                />
                <Text style={styles.label}>Numero de telefono:</Text>
                <TextInput
                    placeholder={userData.phone}
                    style={styles.inputUnoNonEditable}
                    editable={false}
                />
                {!updateSuccess && (
                    <TouchableOpacity style={styles.button} onPress={updateProfileInfo}>
                        <Text style={styles.buttonText}>Guardar Cambios</Text>
                    </TouchableOpacity>
                )}
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <ActivityIndicator size="large" color="#00B5E2" />
                            <Text style={styles.modalText}>Realizando actualización...</Text>
                        </View>
                    </View>
                </Modal>


                {/* Mostrar el mensaje de éxito si la actualización fue exitosa */}
                {
                    updateSuccess && (
                        <Text style={styles.successMessage}>Se han actualizado los campos correctamente.</Text>
                    )
                }

                {
                    isAdmin && (
                        <View style={styles.adminContainer}>
                            <View style={styles.adminTittleContainer}>
                                <Text style={styles.adminTittle}>OPCIONES DE ADMINISTRADOR ACTIVAS</Text>
                            </View>
                            <View style={styles.adminOptionsContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DeviceRegister')}>
                                    <Text style={styles.buttonText}>Registrar un nuevo dispositivo al sistema</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    mainLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    mainLabelName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00B5E2',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    inputUno: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
    },
    button: {
        marginTop: 15,
        backgroundColor: '#00B5E2',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputUnoNonEditable: {
        backgroundColor: '#d4d1d0',
        color: '#000',
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 40,
        // Estilos para tu logo
    },
    menuIcon: {
        width: 30,
        height: 30,
        // Estilos para el icono de menú
    },
    successMessage: {
        color: 'green',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    adminTittleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    adminTittle: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    adminOptionsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    adminContainer: {
        borderWidth: 1,
        borderColor: '#000',
        marginTop: 20,
        paddingVertical: 20,
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

export default ProfileScreen;
