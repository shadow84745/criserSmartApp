import React, { useState, useEffect } from 'react';
import { Modal, Image, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getAuth, currentUser, updateProfile } from 'firebase/auth';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Asegúrate de importar tu instancia de Firebase aquí
import { useNavigation } from '@react-navigation/native';
import { dogId } from './DogDetailScreen';
import { Picker } from '@react-native-picker/picker';

const UpdateDogInfoScreen = () => {

    const [userData, setUserData] = useState({
        dog_weight: 0,
    }); // Almacena los datos del usuario desde Firestore
    const [dogName, setDogName] = useState('');
    const [dogWeight, setDogWeight] = useState('');
    const [dogSize, setDogSize] = useState('');
    const [dogRace, setDogRace] = useState('');
    const [dogStage, setDogStage] = useState('');
    const [dog_activity, setDog_activity] = useState('');
    const [cccCalificacion, setCccCalificacion] = useState('');
    const [dog_healthy_conditions, setDog_healthy_conditions] = useState('');
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
                const docRef = doc(db, 'dogs', dogId);
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

            if (dogName !== "") {
                updatedData.dog_name = dogName;
            } else {
                updatedData.dog_name = userData.dog_name;
            }

            if (dogWeight !== "") {
                updatedData.dog_weight = dogWeight;
            } else {
                updatedData.dog_weight = userData.dog_weight;
            }
            
            if (dogSize !== "Seleccionar") {
                updatedData.dog_size = dogSize;
            } else {
                updatedData.dog_size = userData.dog_size;
            }

            if (dogRace !== "Seleccionar") {
                updatedData.race_can = dogRace;
            } else {
                updatedData.race_can = userData.race_can;
            }

            if (dogStage !== "Seleccionar") {
                updatedData.dog_stage = dogStage;
            } else {
                updatedData.dog_stage = userData.dog_stage;
            }

            if (cccCalificacion !== "Seleccionar") {
                updatedData.dog_ccc = cccCalificacion;
            } else {
                updatedData.dog_ccc = userData.dog_ccc;
            }

            if (dog_healthy_conditions !== "Seleccionar") {
                updatedData.dog_healthy_conditions = dog_healthy_conditions;
            } else {
                updatedData.dog_healthy_conditions = userData.dog_healthy_conditions;
            }

            if (dog_activity !== "Seleccionar") {
                updatedData.dog_activity = dog_activity;
            } else {
                updatedData.dog_activity = userData.dog_activity;
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

    const getActivityLabel = (activity) => {
        switch (activity) {
            case 'muy_activa':
                return 'Vida Activa *';
            case 'activa':
                return 'Moderadamente Activa *';
            case 'sedentaria':
                return 'Sedentaria *';
            default:
                return activity;
        }
    };
    
    
    const getDiseaseLabel = (disease) => {
        switch (disease) {
            case 'ninguna':
                return 'Ninguna Enfermedad (Perro sano) *';
            case 'renal':
                return 'Enfermedad Renal *';
            case 'pancreatilis':
                return 'Problemas de Pancreatitis *';
            case 'diabetes':
                return 'Diabetes *';
            case 'tiroides':
                return 'Problemas de Tiroides *';
            case 'hepatica':
                return 'Enfermedad Hepática *';
            case 'alergias_alimentarias':
                return 'Alergias Alimentarias *';
            case 'estreñimiento':
                return 'Estreñimiento *';
            case 'cardiacos':
                return 'Problemas Cardíacos *';
            case 'articulares':
                return 'Enfermedades Articulares *';
            case 'piel':
                return 'Enfermedades en la Piel *';
            // Agrega más casos según tus necesidades
            default:
                return disease;
        }
    };
    


    const getRaceLabel = (race) => {
        switch (race) {
            case 'criollo':
                return 'Criollo *';
            case 'golden_retriever':
                return 'Golden Retriever *';
            case 'beagle':
                return 'Beagle *';
            case 'pastor_aleman':
                return 'Pastor Alemán *';
            case 'husky':
                return 'Husky *';
            case 'chihuahua':
                return 'Chihuahua *';
            case 'san_bernardo *':
                return 'San Bernardo *';
            // Agrega más casos según tus necesidades
            default:
                return race;
        }
    };

    const getDogSizeLabel = (size) => {
        switch (size) {
            case 'mini':
                return 'Mini Toy *';
            case 'pequeño':
                return 'Pequeño *';
            case 'mediano':
                return 'Mediano *';
            case 'grande':
                return 'Grande *';
            case 'extra-grande':
                return 'Extra Grande *';
            // Agrega más casos según tus necesidades
            default:
                return size;
        }
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
                <Text style={styles.mainLabel}>Actualizar informacion personal de <Text style={styles.mainLabelName}>{userData.dog_name}</Text></Text>

                <Text style={styles.label}>Nombre del can</Text>
                {/* Mostrar los datos del usuario desde Firestore */}
                <TextInput
                    placeholder={userData.dog_name}
                    style={styles.inputUno}
                    value={dogName}
                    onChangeText={(text) => {
                        if (validateInput(text)) {
                            setDogName(text);
                        }
                    }}
                    maxLength={20}
                />

                <Text style={styles.label}>Peso del perro:</Text>
                <TextInput
                    placeholder={userData.dog_weight.toString()}
                    style={styles.inputUno}
                    value={dogWeight}
                    onChangeText={(text) => {
                        if (validateInput(text)) {
                            setDogWeight(text);
                        }
                    }}
                    maxLength={20}

                />

                <Text style={styles.label}>Tamaño del perro:</Text>
                <Picker
                    selectedValue={dogSize}
                    onValueChange={(itemValue, itemIndex) => setDogSize(itemValue)}
                    style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
                >
                    <Picker.Item label={getDogSizeLabel(userData.dog_size)} value="Seleccionar" />
                    <Picker.Item label="Mini Toy" value="mini" />
                    <Picker.Item label="Pequeño" value="pequeño" />
                    <Picker.Item label="Mediano" value="mediano" />
                    <Picker.Item label="Grande" value="grande" />
                    <Picker.Item label="Extra Grande" value="extra-grande" />
                </Picker>

                <Text style={styles.label}>Raza del can:</Text>
                <Picker
                    selectedValue={dogRace}
                    onValueChange={(itemValue, itemIndex) => setDogRace(itemValue)}
                    style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
                >
                    <Picker.Item label={getRaceLabel(userData.race_can)} value="Seleccionar" />
                    <Picker.Item label="Criollo" value="criollo" />
                    <Picker.Item label="Golden Retriever" value="golden_retriever" />
                    <Picker.Item label="Beagle" value="beagle" />
                    <Picker.Item label="Pastor Aleman" value="pastor_aleman" />
                    <Picker.Item label="Husky" value="husky" />
                    <Picker.Item label="Chihuahua" value="chihuahua" />
                    <Picker.Item label="San Bernardo" value="san_bernardo" />
                </Picker>

                <Text style={styles.label}>Etapa del perro:</Text>
                <Picker
                    selectedValue={dogStage}
                    onValueChange={(itemValue, itemIndex) => setDogStage(itemValue)}
                    style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
                >
                    <Picker.Item label={userData.dog_stage + " *"} value="Seleccionar" />
                    <Picker.Item label="Cachorro" value="cachorro" />
                    <Picker.Item label="Adulto" value="adulto" />
                    <Picker.Item label="Senior" value="senior" />
                </Picker>

                <Text style={styles.label}>Calificación de la condición corporal (CCC)</Text>
                <Picker
                    selectedValue={cccCalificacion}
                    onValueChange={(itemValue, itemIndex) => setCccCalificacion(itemValue)}
                    style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
                >
                    <Picker.Item label={userData.dog_ccc + " *"} value="Seleccionar" />
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                    <Picker.Item label="7" value="7" />
                    <Picker.Item label="8" value="8" />
                    <Picker.Item label="9" value="9" />
                </Picker>


                <Text style={styles.label}>Condiciones de Salud</Text>
                <Picker
                    selectedValue={dog_healthy_conditions}
                    onValueChange={(itemValue, itemIndex) => setDog_healthy_conditions(itemValue)}
                    style={styles.selectorInput}
                >
                    <Picker.Item label={getDiseaseLabel(userData.dog_healthy_conditions)} value="Seleccionar" />
                    <Picker.Item label="Ninguna Enfermedad (Perro sano)" value="ninguna" />
                    <Picker.Item label="Enfermedad Renal" value="renal" />
                    <Picker.Item label="Problemas de Pancreatilis" value="pancreatilis" />
                    <Picker.Item label="Diabetes" value="diabetes" />
                    <Picker.Item label="Tirodes" value="tiroides" />
                    <Picker.Item label="Enfermedad Hepatica" value="hepatica" />
                    <Picker.Item label="Alergias Alimentarias" value="alergias_alimentarias" />
                    <Picker.Item label="Estreñimiento" value="estreñimiento" />
                    <Picker.Item label="Problemas Cardiacos" value="cardiacos" />
                    <Picker.Item label="Enfermedades Articulares" value="articulares" />
                    <Picker.Item label="Enfermedades en la Piel" value="piel" />
                    {/* Agrega más opciones según tus necesidades */}
                </Picker>

                <Text style={styles.label}>Actividad fisica:</Text>
                <Picker
                    selectedValue={dog_activity}
                    onValueChange={(itemValue, itemIndex) => setDog_activity(itemValue)}
                    style={styles.selectorInput}
                >
                    <Picker.Item label={getActivityLabel(userData.dog_activity)} value="Seleccionar" />
                    <Picker.Item label="Vida Activa" value="muy_activa" />
                    <Picker.Item label="Moderadamente Activa" value="activa" />
                    <Picker.Item label="Sedentaria" value="sedentaria" />
                    {/* Agrega más opciones según tus necesidades */}
                </Picker>


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
    selectorInput: {
        backgroundColor: '#FFF',
        color: '#000',
        marginBottom: 10,
        padding: 10,
        flex: 1,
    },
    mainLabelName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00B5E2',
    },

});

export default UpdateDogInfoScreen;
