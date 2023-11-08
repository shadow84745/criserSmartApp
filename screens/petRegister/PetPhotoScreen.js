import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView, TextInput, ActivityIndicator, Pressable } from 'react-native';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { db, firebaseConfig } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadString } from '@firebase/storage';
import { dog_name, dog_ccc, dog_activity, dog_size, dog_stage, dog_weight, edad_can, dog_healthy_conditions, food, food_brand } from './NewPetScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { getImageExtension, uriToBlob } from '../../utils';


const PetPhotoScreen = () => {

    const [race, setRace] = useState('Seleccionar'); // Nuevo estado
    const [dogPhoto, setDogPhoto] = useState("");


    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [foodInformation, setFoodInformation] = useState([]);



    const navigation = useNavigation();

    const app = initializeApp(firebaseConfig);


    const openGallery = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
            });

            if (!result.canceled) {
                setDogPhoto(result.assets[0].uri);
            }
            console.log(dogPhoto);
        } else {
            console.log('Permission to access media library denied');
        }
    };



    const openCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (permission.granted) {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1], // Establece la relación de aspecto 1:1 para una forma circular
            });

            if (!result.canceled) {
                setDogPhoto(result.assets[0].uri);
            }
            console.log(dogPhoto);
        } else {
            console.log('Permission to access the camera denied');
        }
    };




    const auth = getAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });

    const user = auth.currentUser;



    const handleRegisterPet = async () => {
        // Validaciones
        if (
            race === 'Seleccionar' ||
            dogPhoto === ""
        ) {
            setError('Todos los campos son obligatorios y no pueden estar vacíos');
            return;
        }

        try {
            setModalVisible(true);

            try {
                const docRef = await addDoc(collection(db, "dogs"), {
                    race_can: race,
                    dog_name: dog_name,
                    dog_ccc: dog_ccc,
                    dog_size: dog_size,
                    dog_stage: dog_stage,
                    dog_weight: dog_weight,
                    dog_activity: dog_activity,
                    dog_healthy_conditions: dog_healthy_conditions,
                    edad_can: edad_can,
                    propietary_id: user.uid,
                });

                console.log("Mascota registrada exitosamente");
                console.log("Mascota registrado con el ID: ", docRef.id);




                const imageUrl = await uploadImageToStorage(dogPhoto, user.uid, docRef.id);



                const dogCollectionRef = collection(db, "dogs");
                const dogDocRef = doc(dogCollectionRef, docRef.id);



                await setDoc(dogDocRef, {
                    dog_id: docRef.id,
                    photo_can: imageUrl,
                }, { merge: true });

                console.log("Se creo el identificador unico exitosamente")

                //OBTENER INFORMACION DE LA TABLA DE LA MARCA DE COMIDA

                console.log("Valor de 'food':", food);
                console.log("Valor de 'food_brand':", food_brand);

                const foodRef = collection(db, "dog_food");
                const foodQuery = query(foodRef, where("nombre", "==", food), where("marca", "==", food_brand));

                const foodDocSnapshot = await getDocs(foodQuery); // Esperar la respuesta de Firestore

                if (!foodDocSnapshot.empty) {
                    const foodData = foodDocSnapshot.docs[0].data();
                    setFoodInformation(foodData);

                    let REM; // Variable para almacenar el valor de REM

                    if (dog_activity === "sedentaria") {
                        REM = 1.3;
                    } else if (dog_activity === "activa") {
                        REM = 1.5;
                    } else if (dog_activity === "muy_activa") {
                        REM = 1.8;
                    } else {
                        console.log("Hay errores");
                    }


                    // Realizar cálculos con 'calories_per_gram' mientras agregas datos a la base de datos
                    const MER = 110 * Math.pow(dog_weight, 0.75);
                    console.log("Las necesidades nutricionales son: " + MER);


                    const kcal_day = MER * REM;
                    console.log("Las kilocalorías diarias totales son: " + kcal_day);

                    console.log("Calories Per Gram:", foodData.calories_per_gram);

                    const grams_day = kcal_day / foodData.calories_per_gram;

                    // Continuar con la creación de datos en Firestore
                    const docRefPlan = await addDoc(collection(db, "food_plan"), {
                        propietary_id: user.uid,
                        dog_id_ref: docRef.id,
                        food: food,
                        food_brand: food_brand,
                        kcal_day: kcal_day,
                        grams_day: grams_day,
                        portions_day: 2,
                    });

                    console.log("Plan registro iniciado exitosamente");
                    console.log("Plan registrado con el ID: ", docRefPlan.id);

                    setIsButtonVisible(false);
                    setModalVisible(false);
                    setError('');
                    setSuccessMessage('Mascota registrada con éxito');

                    setTimeout(() => {
                        setSuccessMessage('');
                        navigation.navigate('DogEatingPlan', { dogId: docRef.id });
                    }, 3000);
                } else {
                    console.log("No se encontró ningún documento en la colección 'dog_food' que coincida con los criterios de búsqueda.");
                }

            } catch (error) {
                console.error('Error al agregar datos a Firestore:', error);
            }

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


    const uploadImageToStorage = async (dogPhoto, uid, IDmascotaRegistrada) => {
        try {
            const storage = getStorage();
            const userUID = user.uid;


            const extension = getImageExtension(dogPhoto);


            const userStorageRef = ref(storage, `userDogsProfileImage/${userUID}`);

            const imageFileName = `${IDmascotaRegistrada}_${user.uid}.${extension}`;

            const imageRef = ref(userStorageRef, imageFileName);

            const blob = await uriToBlob(dogPhoto);



            await uploadBytes(imageRef, blob, 'data_url', { contentType: "image/jpeg" });

            const downloadUrl = await getDownloadURL(imageRef);

            console.log('Imagen subida con éxito y URL de descarga obtenida:', downloadUrl);
            return downloadUrl;
        } catch (error) {
            console.error('Error al subir la imagen a Storage:', error);
            return null;
        }
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
                        <Text style={styles.descriptionInput}>Foto de perfil</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.imagePreviewContainer}>
                                {dogPhoto && (
                                    <Image source={{ uri: dogPhoto }} style={styles.circularImage} />
                                )}
                                {!dogPhoto && (
                                    <Image source={require('../../images/blueCircle.png')} style={styles.circularImage} />
                                )}
                            </View>
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity onPress={openGallery} style={styles.galleryButton}>
                                    <Text style={styles.buttonText}>Abrir galería</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={openCamera} style={styles.cameraButton}>
                                    <Text style={styles.buttonText}>Abrir cámara</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.descriptionInput}>Raza</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Picker
                                selectedValue={race}
                                onValueChange={(itemValue, itemIndex) => setRace(itemValue)}
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
                    <View style={styles.buttonContainer}>
                        {isButtonVisible && (
                            <TouchableOpacity onPress={handleRegisterPet} style={styles.button}>
                                <Text style={styles.buttonText}>Continuar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
                    </View>
                </View>

                <Modal animationType='fade' transparent={true} visible={modalVisible}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <ActivityIndicator size="large" color="#00B5E2" />
                            <Text style={styles.modalText}>Realizando registro...</Text>
                        </View>
                    </View>
                </Modal>



                <View style={styles.contactSection}>
                    <TouchableOpacity>
                        <Text style={styles.contactText}>Contactar con soporte</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.contactText}>Ver la guía</Text>
                    </TouchableOpacity>
                </View>


                <Modal animationType='fade' transparent={true} visible={modalVisible}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <ActivityIndicator size="large" color="#00B5E2" />
                            <Text style={styles.modalText}>Realizando registro...</Text>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};


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
    inputContainer: {
        justifyContent: 'space-between',
    },
    section: {
        backgroundColor: "#595959",
        paddingHorizontal: 30,
        paddingVertical: 20,
        marginVertical: 5,
    },
    selectorInput: {
        backgroundColor: '#FFF',
        color: '#000',
        marginBottom: 10,
        padding: 10,
        flex: 1,
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
    circularImage: {
        width: 150,
        height: 150,
        borderRadius: 75, // Esto hará que la imagen tenga forma circular
        marginVertical: 20,
    },
    buttonsContainer: {
        marginTop: 15,
        flexDirection: 'column', // Muestra los botones uno sobre otro
        alignItems: 'flex-end', // Alinea los botones a la derecha
        flex: 1, // Para que los botones ocupen el espacio disponible
    },
    imagePreviewContainer: {
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