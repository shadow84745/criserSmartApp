import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView, TextInput, ActivityIndicator, Pressable } from 'react-native';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { db, firebaseConfig } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';


const DogEatingPlanScreen = ({ route, navigation }) => {

    const { dogId } = route.params;
    const [nutritionPlan, setNutritionPlan] = useState([]);
    const [dog, setDog] = useState([]);
    const [dogFood, setDogFood] = useState([]);



    const [horario1, setHorario1] = useState("Seleccionar"); // Almacena los datos del usuario desde Firestore
    const [horario2, setHorario2] = useState("Seleccionar");
    const [horario3, setHorario3] = useState("Seleccionar");

    const [portionsDay, setPortionsDay] = useState("");
    const [kcal_day, setKcal_day] = useState("");
    const [nutritionPlanId, setNutritionPlanId] = useState("");





    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [recomendationsVisible, setRecomendationsVisible] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const openRecomendations = () => {
        setRecomendationsVisible(true);
    };

    const closeRecomendations = () => {
        setRecomendationsVisible(false);
    };




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
                const foodPlanSnapshot = await getDocs(planQuery);

                if (!foodPlanSnapshot.empty) {
                    const foodPlanData = foodPlanSnapshot.docs[0].data();
                    setNutritionPlan(foodPlanData);

                    setPortionsDay(foodPlanData.portions_day); // Actualiza portions_day directamente

                    const nutritionPlanId = foodPlanSnapshot.docs[0].id;

                    // Guardar el identificador único en el estado o donde lo necesites
                    setNutritionPlanId(nutritionPlanId);
                    

                    const dogRef = collection(db, "dogs");
                    const dogQuery = query(dogRef, where("dog_id", "==", dogId));
                    const dogSnapshot = await getDocs(dogQuery);

                    if (!dogSnapshot.empty) {
                        const dogData = dogSnapshot.docs[0].data();
                        setDog(dogData);

                        if (foodPlanData.food) {
                            const nombreComida = foodPlanData.food;
                            const dogFoodRef = collection(db, "dog_food");
                            const dogFoodQuery = query(dogFoodRef, where("nombre", "==", nombreComida));
                            const dogFoodSnapshot = await getDocs(dogFoodQuery);

                            if (!dogFoodSnapshot.empty) {
                                const dogFoodData = dogFoodSnapshot.docs[0].data();
                                setDogFood(dogFoodData);
                                console.log("Datos obtenidos correctamente");
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error al obtener la información:', error);
            }
        };
        fetchNutritionPlan();
    }, [dogId]);






    const handleUpdatePetPlan = async () => {
        // Validaciones
        
        try {

            const planDocRef = doc(db, 'food_plan', nutritionPlanId);

            const updatedData = {};

            if (kcal_day !== "") {
                updatedData.kcal_day = kcal_day;
                updatedData.grams_day = kcal_day / dogFood.calories_per_gram;
            } else {
                updatedData.kcal_day = nutritionPlan.kcal_day;
            }



            if (horario1 !== "Seleccionar") {
                updatedData.meal_schedule_1 = horario1;
            } else {
                updatedData.meal_schedule_1 = nutritionPlan.meal_schedule_1;
                setHorario1(nutritionPlan.meal_schedule_1);
            }

            if (horario2 !== "Seleccionar") {
                updatedData.meal_schedule_2 = horario2;
            } else {
                updatedData.meal_schedule_2 = nutritionPlan.meal_schedule_2;
                setHorario2(nutritionPlan.meal_schedule_2);
            }

            if (horario3 !== "Seleccionar") {
                updatedData.meal_schedule_3 = horario3;
            } else {
                updatedData.meal_schedule_3 = nutritionPlan.meal_schedule_3;
                setHorario3(nutritionPlan.meal_schedule_3);
            }

            if (portionsDay !== nutritionPlan.portions_day) {
                updatedData.portions_day = portionsDay;
            } else {
                updatedData.portions_day = nutritionPlan.portions_day;
            }

            if (portionsDay === 2) {
                updatedData.meal_schedule_3 = "";
            } else if (portionsDay === 1) {
                updatedData.meal_schedule_2 = ""
                updatedData.meal_schedule_3 = ""
            }


            //Validaciones 

            if (horario1==="Seleccionar" || horario2==="Seleccionar" || horario3==="Seleccionar") {
                setError('Todos los campos son obligatorios. Por favor, completa la información.');
                return;
    
            }




            await updateDoc(planDocRef, updatedData);


            setIsButtonVisible(false);
            setModalVisible(false);
            setError('');
            console.log('Plan actualizado con exito');
            setSuccessMessage('Plan actualizado con exito');

            setTimeout(() => {
                setSuccessMessage('');
                navigation.navigate('Home');
            }, 3000);
            setModalVisible(false);
        } catch (error) {
            setModalVisible(false);
            console.error('Error al subir datos a Firestore:', error);
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
                    <Text style={styles.sectionTitleText}>Personaliza tu plan alimenticio</Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.descriptionInput}>Plan alimenticio de {dog.dog_name}</Text>
                        </View>
                        <View style={styles.centeredCameraImageContainer}>
                            <Image source={dog.photo_can ? { uri: dog.photo_can } : require('../../images/blueCircle.png')} style={styles.circularImage} />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.descriptionInput}>Kilocalorias diarias</Text>
                        <TextInput
                            placeholder={nutritionPlan.kcal_day ? Math.round(nutritionPlan.kcal_day).toString() + " Kilocalorias Diarias (RECOMENDADO)" : ''} // Convierte el número a cadena de texto
                            style={styles.input}
                            value={kcal_day}
                            keyboardType="numeric"
                            onChangeText={text => setKcal_day(text)}
                        />
                        <Text style={styles.descriptionInput}>Gramos de comida diarios</Text>
                        <TextInput
                            placeholder={nutritionPlan.grams_day ? Math.round(nutritionPlan.grams_day).toString() + " Gramos de comida diarios" : ''} // Redondea el número y luego lo convierte a cadena de texto
                            style={styles.inputUnoNonEditable}
                            editable={false}
                        />

                        <Text style={styles.descriptionInput}>Porciones </Text>
                        {dog.dog_stage === "adulto" ? (
                            <Picker
                                selectedValue={portionsDay}
                                onValueChange={(itemValue, itemIndex) => setPortionsDay(itemValue)}
                                style={styles.selectorInput}
                            >
                                <Picker.Item label="2 Diarias (RECOMENDADO)" value={2} />
                                <Picker.Item label="1 Diaria" value={1} />
                                <Picker.Item label="3 Diarias" value={3} />
                            </Picker>
                        ) : dog.dog_stage === "cachorro" ? (
                            <Picker
                                selectedValue={portionsDay}
                                onValueChange={(itemValue, itemIndex) => setPortionsDay(itemValue)}
                                style={styles.selectorInput}
                            >
                                <Picker.Item label="3 Diarias(RECOMENDADO)" value={3} />
                                <Picker.Item label="1 (NO SE RECOMIENDA PARA CACHORROS)" value={1} />
                                <Picker.Item label="2 Diarias" value={2} />
                            </Picker>
                        ) : (
                            <Picker
                                selectedValue={portionsDay}
                                onValueChange={(itemValue, itemIndex) => setPortionsDay(itemValue)}
                                style={styles.selectorInput}
                            >
                                <Picker.Item label="2 Diarias (RECOMENDADO)" value={2} />
                                <Picker.Item label="1 Diaria" value={1} />
                                <Picker.Item label="3 Diarias" value={3} />
                            </Picker>
                        )}

                        <Text style={styles.descriptionInput}>Horas de las porciones </Text>
                        {portionsDay > 0 && (
                            <Picker
                                selectedValue={horario1}
                                onValueChange={(itemValue, itemIndex) => setHorario1(itemValue)}
                                style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
                            >
                                <Picker.Item
                                    label={nutritionPlan.meal_schedule_1 ? nutritionPlan.meal_schedule_1 + " (Actual)" : "Seleccione horario porcion 1"}
                                    value={nutritionPlan.meal_schedule_1 ? nutritionPlan.meal_schedule_1 : "Seleccionar"}
                                />
                                <Picker.Item label="01:00" value="01:00" />
                                <Picker.Item label="02:00" value="02:00" />
                                <Picker.Item label="03:00" value="03:00" />
                                <Picker.Item label="04:00" value="04:00" />
                                <Picker.Item label="05:00" value="05:00" />
                                <Picker.Item label="06:00" value="06:00" />
                                <Picker.Item label="07:00" value="07:00" />
                                <Picker.Item label="08:00" value="08:00" />
                                <Picker.Item label="09:00" value="09:00" />
                                <Picker.Item label="10:00" value="10:00" />
                                <Picker.Item label="11:00" value="11:00" />
                                <Picker.Item label="12:00" value="12:00" />
                                <Picker.Item label="13:00" value="13:00" />
                                <Picker.Item label="14:00" value="14:00" />
                                <Picker.Item label="15:00" value="15:00" />
                                <Picker.Item label="16:00" value="16:00" />
                                <Picker.Item label="17:00" value="17:00" />
                                <Picker.Item label="18:00" value="18:00" />
                                <Picker.Item label="19:00" value="19:00" />
                                <Picker.Item label="20:00" value="20:00" />
                                <Picker.Item label="21:00" value="21:00" />
                                <Picker.Item label="22:00" value="22:00" />
                                <Picker.Item label="23:00" value="23:00" />
                                <Picker.Item label="24:00" value="24:00" />
                            </Picker>
                        )}
                        {portionsDay > 1 && (
                            <Picker
                                selectedValue={horario2}
                                onValueChange={(itemValue, itemIndex) => setHorario2(itemValue)}
                                style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
                            >
                                <Picker.Item
                                    label={nutritionPlan.meal_schedule_2 ? nutritionPlan.meal_schedule_2 + " (Actual)" : "Seleccione horario porcion 2"}
                                    value={nutritionPlan.meal_schedule_2 ? nutritionPlan.meal_schedule_2 : "Seleccionar"}
                                />
                                <Picker.Item label="01:00" value="01:00" />
                                <Picker.Item label="02:00" value="02:00" />
                                <Picker.Item label="03:00" value="03:00" />
                                <Picker.Item label="04:00" value="04:00" />
                                <Picker.Item label="05:00" value="05:00" />
                                <Picker.Item label="06:00" value="06:00" />
                                <Picker.Item label="07:00" value="07:00" />
                                <Picker.Item label="08:00" value="08:00" />
                                <Picker.Item label="09:00" value="09:00" />
                                <Picker.Item label="10:00" value="10:00" />
                                <Picker.Item label="11:00" value="11:00" />
                                <Picker.Item label="12:00" value="12:00" />
                                <Picker.Item label="13:00" value="13:00" />
                                <Picker.Item label="14:00" value="14:00" />
                                <Picker.Item label="15:00" value="15:00" />
                                <Picker.Item label="16:00" value="16:00" />
                                <Picker.Item label="17:00" value="17:00" />
                                <Picker.Item label="18:00" value="18:00" />
                                <Picker.Item label="19:00" value="19:00" />
                                <Picker.Item label="20:00" value="20:00" />
                                <Picker.Item label="21:00" value="21:00" />
                                <Picker.Item label="22:00" value="22:00" />
                                <Picker.Item label="23:00" value="23:00" />
                                <Picker.Item label="24:00" value="24:00" />
                            </Picker>


                        )}
                        {portionsDay > 2 && (
                            <Picker
                                selectedValue={horario3}
                                onValueChange={(itemValue, itemIndex) => setHorario3(itemValue)}
                                style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
                            >
                                <Picker.Item
                                    label={nutritionPlan.meal_schedule_3 ? nutritionPlan.meal_schedule_3 + " (Actual)" : "Seleccione horario porcion 3"}
                                    value={nutritionPlan.meal_schedule_3 ? nutritionPlan.meal_schedule_3 : "Seleccionar"}
                                />
                                <Picker.Item label="01:00" value="01:00" />
                                <Picker.Item label="02:00" value="02:00" />
                                <Picker.Item label="03:00" value="03:00" />
                                <Picker.Item label="04:00" value="04:00" />
                                <Picker.Item label="05:00" value="05:00" />
                                <Picker.Item label="06:00" value="06:00" />
                                <Picker.Item label="07:00" value="07:00" />
                                <Picker.Item label="08:00" value="08:00" />
                                <Picker.Item label="09:00" value="09:00" />
                                <Picker.Item label="10:00" value="10:00" />
                                <Picker.Item label="11:00" value="11:00" />
                                <Picker.Item label="12:00" value="12:00" />
                                <Picker.Item label="13:00" value="13:00" />
                                <Picker.Item label="14:00" value="14:00" />
                                <Picker.Item label="15:00" value="15:00" />
                                <Picker.Item label="16:00" value="16:00" />
                                <Picker.Item label="17:00" value="17:00" />
                                <Picker.Item label="18:00" value="18:00" />
                                <Picker.Item label="19:00" value="19:00" />
                                <Picker.Item label="20:00" value="20:00" />
                                <Picker.Item label="21:00" value="21:00" />
                                <Picker.Item label="22:00" value="22:00" />
                                <Picker.Item label="23:00" value="23:00" />
                                <Picker.Item label="24:00" value="24:00" />
                            </Picker>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        {isButtonVisible && (
                            <TouchableOpacity style={styles.button} onPress={handleUpdatePetPlan}>
                                <Text style={styles.buttonText}>Actualizar</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonRecomendations} onPress={openRecomendations}>
                            <Text style={styles.buttonText}>Recomendaciones</Text>
                        </TouchableOpacity>
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

                <Modal animationType='fade' transparent={true} visible={recomendationsVisible}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={closeRecomendations} style={styles.closeButton}>
                                <Image source={require('../../images/closeButton.png')} style={styles.closeIcon} />
                            </TouchableOpacity>
                            <Text style={styles.modalText}>Recomendaciones</Text>
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
    buttonRecomendations: {
        backgroundColor: '#F1C400',
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
        color: '#000',
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
    closeIcon: {
        width: 50,
        height: 50,
    },
});