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

let dog_name = null;
let dog_ccc = null;
let dog_size = null;
let dog_stage = null;
let dog_weight = null;
let dog_activity = null;
let dog_healthy_conditions = null;
let edad_can = null;
let propietary_id = null;
let food = null;
let food_brand = null;


const NewPetScreen = () => {

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

      dog_name = nombreCan;
      dog_ccc = cccCalificacion;
      dog_size = tamañoCan;
      dog_stage = etapa;
      dog_weight = pesoCan;
      dog_activity = actividadFisica;
      dog_healthy_conditions = condicionesSalud;
      edad_can = edadCan;
      propietary_id = user.uid;

      console.log("Datos pendientes de aprobacion");


      food = tipoComida;
      food_brand = marcaComida;

      console.log("Plan registro pendiente de aprobacion");

      setIsButtonVisible(false);
      setModalVisible(false);
      setError('');
      setSuccessMessage('Mascota registrada con éxito');

      setTimeout(() => {
        setSuccessMessage('');
        navigation.navigate('PetPhoto');
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
              <Text style={styles.descriptionInput}>Nombre del can</Text>
              <TextInput
                style={styles.input}
                value={nombreCan}
                onChangeText={text => setNombreCan(text)}
                maxLength={15}
              />
            </View>

            <Text style={styles.descriptionInput}>Fecha de nacimiento</Text>
            <Text style={styles.descriptionInput}>(Aproximadamente)</Text>
            {showPicker && (
              <RNDateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                locale="es-ES"
                maximumDate={new Date()}
              />
            )}
            {!showPicker && (
              <Pressable onPress={toggleDatePicker}>
                <TextInput
                  placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  style={styles.input}
                  editable={false}
                />
              </Pressable>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.descriptionInput}>Edad del can</Text>
              <TextInput
                style={styles.inputNonEditable}
                value={edadCan}
                keyboardType="numeric"
                onChangeText={text => setEdadCan(text)}
                editable={false}
                placeholder="Selecciona una fecha de nacimiento"
              />
            </View>

          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Calificación de la condición corporal (CCC)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Picker
                selectedValue={cccCalificacion}
                onValueChange={(itemValue, itemIndex) => setCccCalificacion(itemValue)}
                style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
              >
                <Picker.Item label="Seleccionar" value="Seleccionar" />
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
              <TouchableOpacity onPress={modalInfo} >
                <Image source={require('../../images/infoImage.png')} style={styles.infoIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Tamaño</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Picker
                selectedValue={tamañoCan}
                onValueChange={(itemValue, itemIndex) => setTamañoCan(itemValue)}
                style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
              >
                <Picker.Item label="Seleccionar" value="Seleccionar" />
                <Picker.Item label="Pequeño" value="pequeño" />
                <Picker.Item label="Mediano" value="mediano" />
                <Picker.Item label="Grande" value="grande" />
                <Picker.Item label="Extra Grande" value="extra-grande" />
              </Picker>
              <TouchableOpacity onPress={modalSize} >
                <Image source={require('../../images/infoImage.png')} style={styles.infoIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Etapa</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Picker
                selectedValue={etapa}
                onValueChange={(itemValue, itemIndex) => setEtapa(itemValue)}
                style={styles.selectorInput} // Ajusta el estilo del Picker según tus necesidades
              >
                <Picker.Item label="Seleccionar" value="Seleccionar" />
                <Picker.Item label="Cachorro" value="cachorro" />
                <Picker.Item label="Adulto" value="adulto" />
                <Picker.Item label="Senior" value="senior" />
              </Picker>
              <TouchableOpacity onPress={infoModalEtapa} >
                <Image source={require('../../images/infoImage.png')} style={styles.infoIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Peso(KG)</Text>
            <TextInput
              style={styles.input}
              value={pesoCan}
              keyboardType="numeric"
              onChangeText={text => setPesoCan(text)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Actividad Física</Text>
            <Picker
              ref={pickerRef}
              selectedValue={actividadFisica}
              onValueChange={(itemValue, itemIndex) => setActividadFisica(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Seleccionar" value="default" />
              <Picker.Item label="Vida Activa" value="muy_activa" />
              <Picker.Item label="Moderadamente Activa" value="activa" />
              <Picker.Item label="Sedentaria" value="sedentaria" />
              {/* Agrega más opciones según tus necesidades */}
            </Picker>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Condiciones de Salud</Text>
            <Picker
              ref={pickerRef}
              selectedValue={condicionesSalud}
              onValueChange={(itemValue, itemIndex) => setCondicionesSalud(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Seleccionar" value="default" />
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
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Marca de Comida</Text>
            <Picker
              ref={pickerRef}
              selectedValue={marcaComida}
              onValueChange={(itemValue, itemIndex) => {
                setMarcaComida(itemValue);
                obtenerTiposComida(itemValue);
              }}
              style={styles.input}
            >
              <Picker.Item label="Seleccionar" value="default" />
              <Picker.Item label="Chunky" value="chunky" />
              <Picker.Item label="Dogourmet" value="dogourmet" />
              <Picker.Item label="Dog Chow" value="dogchow" />
              {/* Agrega más opciones según tus necesidades */}
            </Picker>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.descriptionInput}>Tipo</Text>
            <Picker
              selectedValue={tipoComida}
              onValueChange={handleTipoComidaChange}
              style={styles.input}
            >
              <Picker.Item label="Seleccionar" value="default" />
              {tiposComidaFiltrados.map((nombre, index) => (
                <Picker.Item key={index} label={nombre} value={nombre} style={{ color: '#000' }} />
              ))}
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


export { dog_name, dog_ccc, dog_activity, dog_size, dog_stage, dog_weight, edad_can, dog_healthy_conditions, propietary_id, food, food_brand };
export default NewPetScreen;

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
});