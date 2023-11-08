import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView, TextInput, ActivityIndicator, Pressable } from 'react-native';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { db, firebaseConfig } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadString } from '@firebase/storage';
import { IDmascotaregistrada, dog_name, dog_ccc, dog_activity, dog_size, dog_stage, dog_weight, edad_can, dog_healthy_conditions, propietary_id, food, food_brand } from './NewPetScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { getImageExtension, uriToBlob } from '../../utils';


const DogEatingPlanScreen = ({ route, navigation }) => {

    const { dogId } = route.params;
    const [nutritionPlan, setNutritionPlan] = useState([]);
    const [dog, setDog] = useState([]);


    const [horario1, setHorario1] = useState(""); // Almacena los datos del usuario desde Firestore
    const [horario2, setHorario2] = useState("");
    const [horario3, setHorario3] = useState("");
    const [portionsDay, setPortionsDay] = useState("");



    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [hasOnePortion, setHasOnePortion] = useState(false);
    const [hasTwoPortion, setHasTwoPortion] = useState(false);
    const [hasThreePortion, setHasThreePortion] = useState(false);



    const app = initializeApp(firebaseConfig);




    const auth = getAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });

    const user = auth.currentUser;



    useEffect(() => {
        const fetchNutritionPlan = async () => {
            try {
                const planRef = collection(db, "food_plan");
                const planQuery = query(planRef, where("dog_id_ref", "==", dogId));
                const foodPlanDocSnapshot = await getDocs(planQuery);

                if (!foodPlanDocSnapshot.empty) {
                    const foodPlanData = foodPlanDocSnapshot.docs[0].data();
                    setNutritionPlan(foodPlanData);
                }
            } catch (error) {
                console.error('Error al obtener el plan nutricional:', error);
            }

            try {
                const dogRef = collection(db, "dogs");
                const dogQuery = query(dogRef, where("dog_id", "==", dogId));
                const dogDocSnapshot = await getDocs(dogQuery);

                if (!dogDocSnapshot.empty) {
                    const dogData = dogDocSnapshot.docs[0].data();
                    setDog(dogData);
                }
            } catch (error) {
                console.error('Error al obtener la informacion del perro:', error);
            }

        };

        fetchNutritionPlan();
    }, [dogId]);

    useEffect(() => {
        if (portionsDay === 1) {
            setHasOnePortion(true);
            setHasTwoPortion(false);
            setHasThreePortion(false);
        } else if (portionsDay === 2) {
            setHasOnePortion(true);
            setHasTwoPortion(true);
            setHasThreePortion(false);
        } else if (portionsDay === 3) {
            setHasOnePortion(true);
            setHasTwoPortion(true);
            setHasThreePortion(true);
        } else {
            setHasOnePortion(false);
            setHasTwoPortion(false);
            setHasThreePortion(false);
        }
    }, [portionsDay]);
    




    /*const handleRegisterPetPlan = async () => {
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


            const imageUrl = await uploadImageToStorage(dogPhoto, user.uid);


            try {
                const docRef = await addDoc(collection(db, "dogs"), {
                    photo_can: imageUrl,
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


                const dogCollectionRef = collection(db, "dogs");
                const dogDocRef = doc(dogCollectionRef, docRef.id);

                await setDoc(dogDocRef, {
                    dog_id: docRef.id,
                }, { merge: true });

                console.log("Se creo el identificador unico exitosamente")


                const docRefPlan = await addDoc(collection(db, "food_plan"), {
                    propietary_id: user.uid,
                    dog_id_ref: docRef.id,
                    food: food,
                    food_brand: food_brand,
                });

                console.log("Plan registro iniciado exitosamente");
                console.log("Plan registrado con el ID: ", docRefPlan.id);


            } catch (error) {
                console.error('Error al agregar datos a Firestore:', error);
            }


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
    }; */


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
                    <Text style={styles.sectionTitleText}>Personaliza tu plan alimenticio</Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.descriptionInput}>Plan alimenticio de {dog.dog_name}</Text>
                        </View>
                        <View style={styles.centeredCameraImageContainer}>
                            <Image source={dog.photo_can ? { uri: dog.photo_can } : require('../../images/blueCircle.png')} style={styles.cameraImage} />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.descriptionInput}>Kilocalorias diarias</Text>
                        <TextInput
                            placeholder={nutritionPlan.kcal_day ? nutritionPlan.kcal_day.toString() + " Kilocalorias Diarias" : ''} // Convierte el número a cadena de texto
                            style={styles.inputUnoNonEditable}
                            editable={false}
                        />
                        <Text style={styles.descriptionInput}>Gramos de comida diarios</Text>
                        <TextInput
                            placeholder={nutritionPlan.grams_day ? Math.round(nutritionPlan.grams_day).toString() + " Gramos de comida diarios" : ''} // Redondea el número y luego lo convierte a cadena de texto
                            style={styles.inputUnoNonEditable}
                            editable={false}
                        />

                        <Text style={styles.descriptionInput}>Porciones </Text>
                        <Picker
                            selectedValue={portionsDay}
                            onValueChange={(itemValue, itemIndex) => setPortionsDay(itemValue)}
                            style={styles.selectorInput}>
                            <Picker.Item label={nutritionPlan.portions_day
                                + ' Diarias(Recomendado)'}
                                value="3" />
                            <Picker.Item label="1 Diaria" value="1" />
                            <Picker.Item label="2 Diarias" value="2" />
                        </Picker>
                        <Text style={styles.descriptionInput}>Horas de las porciones </Text>
                        {portionsDay > 0 && (
                            <Picker
                                selectedValue={horario1}
                                onValueChange={(itemValue, itemIndex) => setHorario1(itemValue)}
                                style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
                            >
                                <Picker.Item label="Seleccione horario porcion 1" value="Seleccionar" />
                                <Picker.Item label="1:00am" value="01:00" />
                                <Picker.Item label="2:00am" value="02:00" />
                                <Picker.Item label="3:00am" value="03:00" />
                                <Picker.Item label="4:00am" value="04:00" />
                                <Picker.Item label="5:00am" value="05:00" />
                                <Picker.Item label="6:00am" value="06:00" />
                                <Picker.Item label="7:00am" value="07:00" />
                                <Picker.Item label="8:00am" value="08:00" />
                                <Picker.Item label="9:00am" value="09:00" />
                                <Picker.Item label="10:00am" value="10:00" />
                                <Picker.Item label="11:00am" value="11:00" />
                                <Picker.Item label="12:00am" value="12:00" />
                                <Picker.Item label="1:00pm" value="13:00" />
                                <Picker.Item label="2:00pm" value="14:00" />
                                <Picker.Item label="3:00pm" value="15:00" />
                                <Picker.Item label="4:00pm" value="16:00" />
                                <Picker.Item label="5:00pm" value="17:00" />
                                <Picker.Item label="6:00pm" value="18:00" />
                                <Picker.Item label="7:00pm" value="19:00" />
                                <Picker.Item label="8:00pm" value="20:00" />
                                <Picker.Item label="9:00pm" value="21:00" />
                                <Picker.Item label="10:00pm" value="22:00" />
                                <Picker.Item label="11:00pm" value="23:00" />
                                <Picker.Item label="12:00pm" value="24:00" />
                            </Picker>
                        )}
                        {portionsDay > 1  && (
                            <Picker
                                selectedValue={horario2}
                                onValueChange={(itemValue, itemIndex) => setHorario2(itemValue)}
                                style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
                            >
                                <Picker.Item label="Seleccione horario porcion 2" value="Seleccionar" />
                                <Picker.Item label="1:00am" value="01:00" />
                                <Picker.Item label="2:00am" value="02:00" />
                                <Picker.Item label="3:00am" value="03:00" />
                                <Picker.Item label="4:00am" value="04:00" />
                                <Picker.Item label="5:00am" value="05:00" />
                                <Picker.Item label="6:00am" value="06:00" />
                                <Picker.Item label="7:00am" value="07:00" />
                                <Picker.Item label="8:00am" value="08:00" />
                                <Picker.Item label="9:00am" value="09:00" />
                                <Picker.Item label="10:00am" value="10:00" />
                                <Picker.Item label="11:00am" value="11:00" />
                                <Picker.Item label="12:00am" value="12:00" />
                                <Picker.Item label="1:00pm" value="13:00" />
                                <Picker.Item label="2:00pm" value="14:00" />
                                <Picker.Item label="3:00pm" value="15:00" />
                                <Picker.Item label="4:00pm" value="16:00" />
                                <Picker.Item label="5:00pm" value="17:00" />
                                <Picker.Item label="6:00pm" value="18:00" />
                                <Picker.Item label="7:00pm" value="19:00" />
                                <Picker.Item label="8:00pm" value="20:00" />
                                <Picker.Item label="9:00pm" value="21:00" />
                                <Picker.Item label="10:00pm" value="22:00" />
                                <Picker.Item label="11:00pm" value="23:00" />
                                <Picker.Item label="12:00pm" value="24:00" />
                            </Picker>
                        )}
                        {portionsDay > 2  && (
                            <Picker
                                selectedValue={horario3}
                                onValueChange={(itemValue, itemIndex) => setHorario3(itemValue)}
                                style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
                            >
                                <Picker.Item label="Seleccione horario porcion 3" value="Seleccionar" />
                                <Picker.Item label="1:00am" value="01:00" />
                                <Picker.Item label="2:00am" value="02:00" />
                                <Picker.Item label="3:00am" value="03:00" />
                                <Picker.Item label="4:00am" value="04:00" />
                                <Picker.Item label="5:00am" value="05:00" />
                                <Picker.Item label="6:00am" value="06:00" />
                                <Picker.Item label="7:00am" value="07:00" />
                                <Picker.Item label="8:00am" value="08:00" />
                                <Picker.Item label="9:00am" value="09:00" />
                                <Picker.Item label="10:00am" value="10:00" />
                                <Picker.Item label="11:00am" value="11:00" />
                                <Picker.Item label="12:00am" value="12:00" />
                                <Picker.Item label="1:00pm" value="13:00" />
                                <Picker.Item label="2:00pm" value="14:00" />
                                <Picker.Item label="3:00pm" value="15:00" />
                                <Picker.Item label="4:00pm" value="16:00" />
                                <Picker.Item label="5:00pm" value="17:00" />
                                <Picker.Item label="6:00pm" value="18:00" />
                                <Picker.Item label="7:00pm" value="19:00" />
                                <Picker.Item label="8:00pm" value="20:00" />
                                <Picker.Item label="9:00pm" value="21:00" />
                                <Picker.Item label="10:00pm" value="22:00" />
                                <Picker.Item label="11:00pm" value="23:00" />
                                <Picker.Item label="12:00pm" value="24:00" />
                            </Picker>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        {isButtonVisible && (
                            <TouchableOpacity style={styles.button}>
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


export default DogEatingPlanScreen;

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
    inputUnoNonEditable: {
        backgroundColor: '#d4d1d0',
        color: '#000',
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#000',
    },
});