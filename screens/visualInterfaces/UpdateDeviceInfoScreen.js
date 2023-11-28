import React, { useState, useEffect, useRef } from 'react';
import { Modal, Image, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getAuth, currentUser, updateProfile } from 'firebase/auth';
import { getDoc, doc, updateDoc, where, query, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Asegúrate de importar tu instancia de Firebase aquí
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';


import { deviceID } from './DeviceDetailScreen';

const UpdateDeviceInfoScreen = () => {

    const [userData, setUserData] = useState({});
    const [planData, setPlanData] = useState([]);
    const [plan, setPlan] = useState('Seleccionar'); // Almacena los datos del usuario desde Firestore    // Almacena los datos del usuario desde Firestore
    // Almacena los datos del usuario desde Firestore    // Almacena los datos del usuario desde Firestore
    const [deviceName, setDeviceName] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false); // Estado para el mensaje de éxito
    const [modalVisible, setModalVisible] = useState(false);
    const [deviceSerial, setDeviceSerial] = useState("");
    const [selectedDogName, setSelectedDogName] = useState(''); // Agregado para almacenar el nombre de la mascota seleccionada



    const navigation = useNavigation();

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                const docRef = doc(db, 'devices', deviceID);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData(data);
                }
                try {
                    const planRef = collection(db, 'food_plan');
                    const planQuery = query(planRef, where("propietary_id", "==", user.uid))
                    const querySnapshot = await getDocs(planQuery);

                    const planes = querySnapshot.docs.map(doc => doc.data().dog_id_ref);

                    setPlanData(planes);

                } catch {
                    console.error('Error al obtener los datos de los planes:', error);
                }

            } catch (error) {
                console.error('Error al obtener los datos del dispositivo desde Firestore:', error);
            }

            if (user) {
                try {
                    const planRef = collection(db, 'food_plan');
                    const planQuery = query(planRef, where("propietary_id", "==", user.uid));
                    const querySnapshot = await getDocs(planQuery);

                    // Obtener los dog_id_ref y consultar la colección dogs para los nombres
                    const dogNamesPromises = querySnapshot.docs.map(async (planDoc) => {
                        const dogRef = doc(db, 'dogs', planDoc.data().dog_id_ref);
                        const dogSnap = await getDoc(dogRef);
                        if (dogSnap.exists()) {
                            // Retorna un objeto que tiene el nombre de la mascota y el ID del plan alimenticio
                            return {
                                planId: planDoc.id, // El ID del documento de food_plan
                                dogName: dogSnap.data().dog_name // El nombre de la mascota
                            };
                        }
                        return null;
                    });

                    const dogsData = await Promise.all(dogNamesPromises);
                    setPlanData(dogsData.filter(Boolean)); // Filtrar los nulos

                    if (userData.food_plan_ref === 'default') {
                        setSelectedDogName('Por favor seleccione un plan'); // Mensaje para el usuario
                        setPlan('Seleccionar');
                    } else if (userData.food_plan_ref && userData.food_plan_ref !== 'Seleccionar') {
                        const planRef = doc(db, 'food_plan', userData.food_plan_ref);
                        const planSnap = await getDoc(planRef);
                        if (planSnap.exists()) {
                            const dogRef = doc(db, 'dogs', planSnap.data().dog_id_ref);
                            const dogSnap = await getDoc(dogRef);
                            if (dogSnap.exists()) {
                                setSelectedDogName(dogSnap.data().dog_name); // Establecer el nombre de la mascota
                                setPlan(userData.food_plan_ref); // Establecer el plan seleccionado
                            }
                        }
                    }

                } catch (error) {
                    console.error('Error al obtener los datos de los planes:', error);
                }

            }

        };
        if (user) {
            fetchDeviceData();
        }
    }, [user, userData.food_plan_ref]);


    const handlePlanChange = (itemValue, itemIndex) => {
        setPlan(itemValue);
        console.log(itemValue);
    };

    const updateProfileInfo = async () => {
        try {


            setModalVisible(true)
            const docRef = doc(db, 'devices', deviceID);

            const updatedData = {}; // Crear un objeto para almacenar los datos actualizados

            if (deviceSerial !== "") {
                updatedData.serial_device = deviceSerial;
            } else {
                updatedData.serial_device = userData.serial_device;
            }
            if (deviceName !== "") {
                updatedData.device_name = deviceName;
            } else {
                updatedData.device_name = userData.device_name;
            }
            if (plan !== "Seleccionar") {
                updatedData.food_plan_ref = plan;
            } else {
                updatedData.food_plan_ref = userData.food_plan_ref;
            }



            await updateDoc(docRef, updatedData);

            // Actualización exitosa, establece el estado de éxito en true
            setUpdateSuccess(true);

            setTimeout(() => {
                navigation.navigate('Home');
            }, 1500);
            setModalVisible(false);

        } catch (error) {
            setModalVisible(false);
            console.error('Error al subir datos a Firestore:', error);
        }
    };
    const validateInput = (text) => {
        const numericRegex = /^[0-9]*$/; // Expresión regular que coincide solo con números
        return numericRegex.test(text);
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
                <Text style={styles.mainLabel}>Datos del Dispensador <Text style={styles.mainLabelName}>{userData.dog_name}</Text></Text>

                <Text style={styles.label}>Nombre del dispositivo</Text>
                {/* Mostrar los datos del usuario desde Firestore */}
                <TextInput
                    placeholder={userData.device_name}
                    style={styles.inputUno}
                    value={deviceName}
                    onChangeText={(text) => { setDeviceName(text); }}
                    maxLength={20}
                />

                <Text style={styles.label}>Modelo del dispositivo(serial):</Text>
                <TextInput
                    placeholder={userData.serial_device}
                    style={styles.inputUno}
                    value={deviceSerial}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        if (validateInput(text)) {
                            setDeviceSerial(text);
                        }
                    }}
                    maxLength={15}
                />


                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Selecciona Plan Alimenticio:</Text>
                    <Picker
                        selectedValue={plan}
                        onValueChange={handlePlanChange}
                        style={styles.input}
                    >
                        {/* Mostrar un mensaje si el plan es 'default' o 'Seleccionar' */}
                        {plan === 'Seleccionar' && (
                            <Picker.Item label={selectedDogName} value="Seleccionar" />
                        )}
                        {/* Resto de los planes alimenticios */}
                        {planData.map((item, index) => (
                            <Picker.Item key={index} label={item.dogName} value={item.planId} style={{ color: '#000' }} />
                        ))}
                    </Picker>
                </View>


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
    circularImage: {
        width: 150,
        height: 150,
        borderRadius: 75, // Esto hará que la imagen tenga forma circular
        marginVertical: 20,
    }, imagePreviewContainer: {
        flex: 1, // La imagen ocupa la mitad izquierda de la sección
        alignItems: 'center',
        justifyContent: 'center',
    },
    galleryButton: {
        // Puedes establecer un ancho mínimo o fijo para el botón "Abrir galería"
        minWidth: 150,
        backgroundColor: '#00B5E2',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginBottom: 10, // Ajusta el ancho mínimo según tus necesidades
    },
    cameraButton: {
        // Establece un ancho mínimo o fijo para el botón "Abrir cámara" para que coincida con el botón "Abrir galería"
        minWidth: 150,
        backgroundColor: '#00B5E2',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginBottom: 10, // Ajusta el ancho mínimo según tus necesidades
    },

});

export default UpdateDeviceInfoScreen;
