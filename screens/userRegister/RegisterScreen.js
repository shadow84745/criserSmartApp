import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, View, Image, ScrollView, ImageBackground, TextInput, TouchableOpacity, Platform, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword, getReactNativePersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig, db } from '../../firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import AsyncStorage from '@react-native-async-storage/async-storage';


const RegisterScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [surname, setSurname] = useState('');
  const [secondSurname, setSecondSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);




  const navigation = useNavigation();

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

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

  // ...

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
        const ageDiff = today - dob;
        const ageDate = new Date(ageDiff);
        const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);


        if (calculatedAge < 18) {
          setError('Debes tener al menos 18 años para registrarte.');
          setAge('');
        } else {
          setError('');
          setAge(calculatedAge.toString());
        }
      } else {
        setError('Formato de fecha de nacimiento no válido. Utiliza DD-MM-YYYY.');
        setAge('');
      }
    }
  }, [dateOfBirth]);

  // ...

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibilityConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };


  const handleCreateAccount = async () => {
    // Validaciones
    if (!email.includes('@') || !email.includes('.')) {
      setError('Correo electrónico no válido');
      return;
    }

    if (!/^(300|301|302|303|304|324|305|310|311|312|313|314|320|321|322|323|315|316|317|318|319|350|351|323|324|333)/.test(phone) || phone.length !== 10 || isNaN(phone)) {
      setError('Número de teléfono no válido.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      // La contraseña no cumple con los requisitos de contener al menos una mayúscula,
      // un dígito y uno de los caracteres especiales: !@#$%^&*
      setError('La contraseña debe tener mas de 6 caracteres');
      return;
    } else if (!/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-_,.?¿!¡/()=])/.test(password)) {
      // La contraseña no cumple con los requisitos de contener al menos una mayúscula,
      // un dígito y uno de los caracteres especiales: !@#$%^&*
      setError('La contraseña debe tener al menos una mayúscula, un dato numérico y un caracter especial');
      return;
    }

    if (password.includes(' ')) {
      setError('La contraseña no puede contener espacios en blanco.');
      return;
    }


    try {
      setModalVisible(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        first_name: firstName,
        second_name: secondName || '',
        surname: surname,
        second_surname: secondSurname || '',
        phone: phone,
        username: username,
        date_of_birth: dateOfBirth,
        age: age,
        user_id: user.uid,
      });

      console.log("Usuario creado exitosamente");
      console.log("Document ID:", doc.id);
      console.log("User UID:", user.uid);
      // Redirigir al usuario a la pantalla de inicio o a donde desees


      setModalVisible(false)
      navigation.navigate('Home');

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError('El correo electrónico ya está registrado en otra cuenta.');
        setModalVisible(false)


      } else if (error.code === "auth/weak-password") {
        setError('La contraseña es muy corta, debe tener al menos 6 caracteres');
        setModalVisible(false)
      } else {
        setError('Se presento un error en el registro');
        setModalVisible(false)
      }
      console.error("Error al crear el usuario:", error);
      setModalVisible(false)
    }
    setModalVisible(false)
  };

  const onChangeFirstName = (text) => {

    text = text.replace(/[\s!@#$%^&*+-/;:,.]/g, '');
    // Verificar si el valor contiene números o espacios en blanco
    if (/\d/.test(text)) {
      setError('El campo de nombre no debe contener números.');
    } else if (/\s/.test(text)) {
      setError('No pueden haber espacios en el campo de nombre.');
    } else {
      setError('');
    }
    setFirstName(text);
  };

  const onChangeSecondName = (text) => {
    text = text.replace(/[\s!@#$%^&*+-/;:,.]/g, '');
        // Verificar si el valor contiene números
    if (/\d/.test(text)) {
      setError('El campo de segundo nombre no debe contener números.');
    } else if (/\s/.test(text)) {
      setError('No pueden haber espacios en el campo de nombre.');
    } else {
      setError('');
    }
    setSecondName(text);
  };

  const onChangeSurname = (text) => {
    text = text.replace(/[\s!@#$%^&*+-/;:,.]/g, '');    
    // Verificar si el valor contiene números
    if (/\d/.test(text)) {
      setError('El campo de apellido no debe contener números.');
    } else if (/\s/.test(text)) {
      setError('No pueden haber espacios en el campo de apellido.');
    } else {
      setError('');
    }
    setSurname(text);
  };

  const onChangeSecondSurname = (text) => {
    text = text.replace(/[\s!@#$%^&*+-/;:,.]/g, '');    
    // Verificar si el valor contiene números
    if (/\d/.test(text)) {
      setError('El campo de segundo apellido no debe contener números.');
    } else if (/\s/.test(text)) {
      setError('No pueden haber espacios en el campo de apellido.');
    } else {
      setError('');
    }
    setSecondSurname(text);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ScrollView style={styles.lowerSection} contentContainerStyle={styles.scrollContent}>
        {/* Sección superior con espacio para imagen y texto */}
        <View style={styles.upperSection}>
          <Image
            source={require('../../images/logoCriserLogin.png')}
            style={styles.logo}
          />
          <Text style={styles.welcomeText}>¡Todo sea por tu mascota!</Text>
        </View>

        {/* Sección inferior con formulario */}

        <ImageBackground
          source={require('../../images/fondoLogin.png')}
          style={styles.imagenFondo}
        >
          <Text style={styles.welcomeText2}>Regístrate:</Text>
          <View style={styles.contenedorUno}>
            <TextInput
              placeholder="Primer nombre"
              style={styles.inputUno}
              value={firstName}
              onChangeText={onChangeFirstName}
            />
            <TextInput
              placeholder="Segundo nombre"
              value={secondName}
              onChangeText={onChangeSecondName}
              style={styles.inputUno}
            />
          </View>
          <View style={styles.contenedorUno}>
            <TextInput
              placeholder="Primer apellido"
              style={styles.inputUno}
              value={surname}
              onChangeText={onChangeSurname}
            />
            <TextInput
              placeholder="Segundo apellido"
              value={secondSurname}
              onChangeText={onChangeSecondSurname}
              style={styles.inputUno}
            />
          </View>
          <View>
            <TextInput
              placeholder="Correo Electrónico"
              style={styles.input}
              value={email}
              onChangeText={text => setEmail(text)}
              maxLength={45}
            />
            <TextInput
              placeholder="Número de teléfono"
              value={phone}
              onChangeText={text => setPhone(text)}
              style={styles.input}
              keyboardType="numeric"
              maxLength={10}
            />
            {showPicker && (
              <RNDateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                locale="es-ES"
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
            <TextInput
              placeholder="Nombre de usuario"
              value={username}
              onChangeText={text => setUsername(text)}
              style={styles.input}
              maxLength={20}
            />
            <View style={styles.passwordInputContainer}>
              <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                maxLength={35}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Image
                  source={require('../../images/showPass.png')}
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.passwordInputContainer}>
              <TextInput
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
                style={styles.passwordInput}
                secureTextEntry={!showPasswordConfirm}
                maxLength={35}
              />
              <TouchableOpacity onPress={togglePasswordVisibilityConfirm}>
                <Image
                  source={require('../../images/showPass.png')}
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleCreateAccount}
              style={styles.button}>
              <Text style={styles.buttonText}>Registrarte</Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType='fade'
            transparent={true}
            visible={modalVisible}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ActivityIndicator size="large" color="#00B5E2" />
                <Text style={styles.modalText}>Validando tu registro...</Text>
              </View>
            </View>
          </Modal>
          <View style={styles.contenedorTexto}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Text style={styles.textoLinks}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity
              onPress={() => { navigation.navigate('Login') }}
              style={styles.link}>
              <Text style={styles.link}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Estilos de tu pantalla
  container: {
    flex: 1,
  },
  contenedorUno: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  upperSection: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF', // Cambia el color de fondo si es necesario
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    margin: 0,
  },
  welcomeText: {
    color: '#00B5E2',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -40,
    textTransform: 'uppercase',
  },
  welcomeText2: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  lowerSection: {
    flex: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imagenFondo: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center', // Alinear contenido al centro verticalmente
    paddingHorizontal: 20, // Espacio en los bordes para evitar que el contenido toque los extremos
  },
  input: {
    backgroundColor: '#FFF',
    color: '#000',
    marginBottom: 10,
    padding: 10,
  },
  inputUno: {
    backgroundColor: '#FFF',
    color: '#000',
    marginBottom: 10,
    padding: 10,
    marginRight: 20,
    width: '44%',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#00B5E2',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
  },
  link: {
    fontWeight: 'bold',
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  textoLinks: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contenedorTexto: {
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
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
  passwordInputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: -5,
    alignItems: 'center'
  },
  eyeIcon: {
    width: 20, // Ancho de la imagen del ojo
    height: 20, // Alto de la imagen del ojo
    marginLeft: 5,
    backgroundColor: 'white' // Espacio entre el campo de contraseña y el ícono del ojo
  },
  passwordInput: {
    backgroundColor: '#FFF',
    color: '#000',
    flex: 1, // Hace que el input ocupe todo el espacio disponible
    padding: 10,
    marginLeft: 5, // Espacio entre el ícono del ojo y el input de contraseña
  },
});

export default RegisterScreen;
