import React, { useRef, useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView, TextInput, ActivityIndicator, Pressable } from 'react-native';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { db, firebaseConfig } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import RNDateTimePicker from '@react-native-community/datetimepicker';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';


let IDmascotaregistrada = null;


const PetPhotoScreen = () => {

    const [nombreCan, setNombreCan] = useState('');
    const [edadCan, setEdadCan] = useState('');
    const [pesoCan, setPesoCan] = useState('');
    const [tamañoCan, setTamañoCan] = useState('');
    const [actividadFisica, setActividadFisica] = useState('');
    const [condicionesSalud, setCondicionesSalud] = useState('');
    const [marcaComida, setMarcaComida] = useState('');
    const [tipoComida, setTipoComida] = useState('Seleccionar');
    const [cccCalificacion, setCccCalificacion] = useState('Seleccionar'); // Nuevo estado
    const [etapa, setEtapa] = useState('Seleccionar'); // Nuevo estado
    const [dateOfBirth, setDateOfBirth] = useState('');



    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());



    const [cccModalVisible, setCccModalVisible] = useState(false); // Nuevo estado para el modal CCC
    const [modalTamaño, setModalTamaño] = useState(''); // Nuevo estado para controlar qué modal se muestra
    const [modalEtapa, setModalEtapa] = useState(''); // Nuevo estado para controlar qué modal se muestra



    const navigation = useNavigation();

    const app = initializeApp(firebaseConfig);

    const auth = getAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });

    const modalInfo = () => {
        setCccModalVisible(true);
    };

    const modalSize = () => {
        setModalTamaño(true);
    };

    const infoModalEtapa = () => {
        setModalEtapa(true);
    };

    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    };

    const formatDate = (rawDate) => {
        let date = new Date(rawDate);

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        return `${day} - ${month} -${year}`;
    }

    const onChange = ({ type }, selectedDate) => {
        if (type == "set") {
            const currentDate = selectedDate;
            setDate(currentDate);
            if (Platform.OS === "android") {
                toggleDatePicker();
                setDateOfBirth(formatDate(currentDate));
            }

        } else {
            toggleDatePicker();
        }
    };


    useEffect(() => {
        if (dateOfBirth) {
            // Dividir la fecha de nacimiento en día, mes y año
            const parts = dateOfBirth.split('-').map(part => parseInt(part.trim(), 10));

            // Verificar que haya tres partes (día, mes, año) y que todas sean números válidos
            if (parts.length === 3 && !parts.includes(NaN)) {
                const day = parts[0];
                const month = parts[1];
                const year = parts[2];

                // Crear un objeto Date con la fecha de nacimiento
                const dob = new Date(year, month - 1, day);
                const today = new Date();

                // Calcular la diferencia de tiempo en milisegundos
                const ageDiff = today - dob;

                // Crear un objeto Date con la diferencia de tiempo
                const ageDate = new Date(ageDiff);

                // Calcular la edad en años y meses
                const years = ageDate.getUTCFullYear() - 1970;
                const months = ageDate.getUTCMonth();
                const days = ageDate.getUTCDate();

                // Construir la edad en un formato legible
                let ageText = '';
                if (years > 0) {
                    ageText += `${years} ${years === 1 ? 'año' : 'años'}`;
                    if (months > 0) {
                        ageText += `, ${months} ${months === 1 ? 'mes' : 'meses'}`;
                    }
                    if (days > 0) {
                        ageText += ` y ${days} ${days === 1 ? 'día' : 'días'}`;
                    }
                } else if (months > 0) {
                    ageText += `${months} ${months === 1 ? 'mes' : 'meses'}`;
                    if (days > 0) {
                        ageText += ` y ${days} ${days === 1 ? 'día' : 'días'}`;
                    }
                } else if (days > 0) {
                    ageText += `${days} ${days === 1 ? 'día' : 'días'}`;
                } else {
                    ageText = "0 años, 0 meses y 0 días";
                }

                setEdadCan(ageText); // Actualiza el estado con la edad calculada
            } else {
                setError('Formato de fecha de nacimiento no válido. Utiliza DD-MM-YYYY.');
                setEdadCan(''); // Restablece la edad si el formato no es válido
            }
        }
    }, [dateOfBirth]);


    const handleRegisterPet = async () => {
        // Validaciones
        if (
            nombreCan === '' ||
            dateOfBirth === '' ||
            cccCalificacion === 'Seleccionar' ||
            tamañoCan === 'Seleccionar' ||
            etapa === 'Seleccionar' ||
            pesoCan === '' ||
            actividadFisica === 'Seleccionar' ||
            condicionesSalud === 'Seleccionar' ||
            marcaComida === 'Seleccionar' ||
            tipoComida === 'Seleccionar'
        ) {
            setError('Todos los campos son obligatorios y no pueden estar vacíos');
            return;
        }

        // Validación para no colocar números en el nombre del can
        if (/\d/.test(nombreCan)) {
            setError('El nombre del can no puede contener números');
            return;
        }

        // Validación para el campo "Peso(KG)" solo acepta datos numéricos
        if (isNaN(parseFloat(pesoCan))) {
            setError('El campo "Peso(KG)" debe ser un valor numérico');
            return;
        }

        // Additional validation for the "Tipo" field
        if (tipoComida === 'Seleccionar') {
            setError('El campo "Tipo" no puede quedar en "Seleccionar"');
            return;
        }

        try {
            setModalVisible(true);

            const user = auth.currentUser;

            const docRef = await addDoc(collection(db, "dogs"), {
                dog_name: nombreCan,
                dog_ccc: cccCalificacion,
                dog_size: tamañoCan,
                dog_stage: etapa,
                dog_weight: pesoCan,
                dog_activity: actividadFisica,
                dog_healthy_conditions: condicionesSalud,
                edad_can: edadCan,
                propietary_id: user.uid,
            });

            console.log("Mascota registrada exitosamente");
            console.log("Mascota registrado con el ID: ", docRef.id);


            const docRefPlan = await addDoc(collection(db, "food_plan"), {
                propietary_id: user.uid,
                dog_id_ref: docRef.id,
                food: tipoComida,
                food_brand: marcaComida,
            });

            console.log("Plan registro iniciado exitosamente");
            console.log("Plan registrado con el ID: ", docRefPlan.id);

            IDmascotaregistrada = docRef.id;

            setIsButtonVisible(false);
            setModalVisible(false);
            setError('');
            setSuccessMessage('Mascota registrada con éxito');

            setTimeout(() => {
                setSuccessMessage('');
                navigation.navigate('Home');
            }, 3000);
            setModalVisible(false);
        } catch (error) {
            console.error("Error al crear la mascota:", error);
        }
    };

    const pickerRef = useRef();

    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }

    const [tiposComidaFiltrados, setTiposComidaFiltrados] = useState([]);


    const obtenerTiposComida = async (marcaComida) => {
        const dogFoodRef = collection(db, "dog_food");
        const dogQuery = query(dogFoodRef, where("marca", "==", marcaComida));
        const querySnapshot = await getDocs(dogQuery);

        const nombres = querySnapshot.docs.map(doc => doc.data().nombre);

        setTiposComidaFiltrados(nombres);
    };

    const handleTipoComidaChange = (itemValue, itemIndex) => {
        setTipoComida(itemValue);
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
                <View style={styles.sectionTitle}>
                    <Text style={styles.sectionTitleText}>Registra un nuevo canino</Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.descriptionInput}>Reconocimiento de raza</Text>
                        </View>
                        <View style={styles.centeredCameraImageContainer}>
                            <Image source={require('../../images/cameraImage.png')} style={styles.cameraImage} />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.descriptionInput}>Raza</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Picker
                                selectedValue={etapa}
                                onValueChange={(itemValue, itemIndex) => setEtapa(itemValue)}
                                style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
                            >
                                <Picker.Item label="Seleccionar" value="Seleccionar" />
                                <Picker.Item label="Criollo" value="criollo" />
                                <Picker.Item label="Golden Retriever" value="golden_retriever" />
                                <Picker.Item label="Beagle" value="beagle" />
                                <Picker.Item label="Pastor Aleman" value="pastor_aleman" />
                                <Picker.Item label="Husky" value="husky" />
                                <Picker.Item label="Chihuahua" value="chihuahua" />
                                <Picker.Item label="San Bernardo" value="san_bernardo" />
                            </Picker>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.descriptionInput}>Foto de perfil</Text>
                        <Picker
                            ref={pickerRef}
                            selectedValue={actividadFisica}
                            onValueChange={(itemValue, itemIndex) => setActividadFisica(itemValue)}
                            style={styles.input}
                        >
                            <Picker.Item label="Seleccionar" value="default" />
                            <Picker.Item label="Vida Activa" value="activa" />
                            <Picker.Item label="Sedentaria" value="sedentaria" />
                            {/* Agrega más opciones según tus necesidades */}
                        </Picker>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    {isButtonVisible && (
                        <TouchableOpacity onPress={handleRegisterPet} style={styles.button}>
                            <Text style={styles.buttonText}>Continuar</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Modal animationType='fade' transparent={true} visible={modalVisible}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <ActivityIndicator size="large" color="#00B5E2" />
                            <Text style={styles.modalText}>Realizando registro...</Text>
                        </View>
                    </View>
                </Modal>
                {/*Modal de la calificacion corporal CCC*/}
                <Modal
                    visible={cccModalVisible}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>¿Que es la calificacion de la condicion corporal (CCC)?</Text>
                        <Image source={require('../../images/perroSalud.png')} style={styles.imagenCCC} />
                        <TouchableOpacity onPress={() => setCccModalVisible(false)} style={styles.closeButton}>
                            <Image source={require('../../images/closeButton.png')} style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>
                </Modal>
                {/*Modal del tamaño de la mascota*/}
                <Modal
                    visible={modalTamaño}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>¿Como puedo saber cual es el tamaño de mi mascota?</Text>
                        <Image source={require('../../images/tamañosInfo.png')} style={styles.imagenTamaño} />
                        <TouchableOpacity onPress={() => setModalTamaño(false)} style={styles.closeButton}>
                            <Image source={require('../../images/closeButton.png')} style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>
                </Modal>
                {/*Modal de la etapa de la mascota*/}
                <Modal
                    visible={modalEtapa}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>¿Como puedo saber cual es la etapa de mi mascota?</Text>
                        <Image source={require('../../images/etapaInfo.png')} style={styles.imagenEtapa} />
                        <TouchableOpacity onPress={() => setModalEtapa(false)} style={styles.closeButton}>
                            <Image source={require('../../images/closeButton.png')} style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>
                </Modal>

                <View>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
                </View>

                <View style={styles.contactSection}>
                    <TouchableOpacity>
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


export { IDmascotaregistrada };
export default PetPhotoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
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
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#00B5E2',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    successText: {
        color: 'green',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        paddingHorizontal: 10,
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
        color: '#fff',
    },
    modalCloseButton: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#00B5E2',
        marginTop: 10,
    },
    inputSection: {
        width: '50%',
        padding: 5,
    },
    inputContainer: {
        justifyContent: 'space-between',
    },
    section: {
        backgroundColor: "#595959",
        paddingHorizontal: 30,
        paddingVertical: 20,
        marginVertical: 5,
    },
    infoIcon: {
        width: 20,
        height: 20,
        marginLeft: 10, // Espacio entre el botón y el ícono
    },
    selectorInput: {
        backgroundColor: '#FFF',
        color: '#000',
        marginBottom: 10,
        padding: 10,
        flex: 1,
    },
    imagenCCC: {
        width: 410, // Ajusta el ancho según tus necesidades
        height: 430, // Ajusta el alto según tus necesidades
        resizeMode: 'cover', // Ajusta el modo de redimensionamiento
        marginLeft: -10,
    },
    closeIcon: {
        width: 50,
        height: 50,
    },
    imagenEtapa: {
        width: 390, // Ajusta el ancho según tus necesidades
        height: 240, // Ajusta el alto según tus necesidades
        resizeMode: 'cover', // Ajusta el modo de redimensionamiento
    },
    imagenTamaño: {
        width: 390,
        resizeMode: 'center'
    },
    inputNonEditable: {
        backgroundColor: '#ccc',
        color: '#000',
        marginBottom: 10,
        padding: 10,
    },
    cameraImage: {
        height: 100,
        width: 100,
        resizeMode: "center",
    },
    centeredCameraImageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});