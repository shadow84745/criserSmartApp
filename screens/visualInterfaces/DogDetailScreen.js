import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../../firebaseConfig';



const DogDetailScreen = ({ route , navigation}) => {
  // Recupera los datos del dispositivo seleccionado de las propiedades de navegación
  const { dog } = route.params;

  const [modalVisible, setModalVisible] = useState(false);


  const handleDeleteDog = async () => {
    const dogRef = dog.dog_id;
    try{
        await deleteDoc(doc(db, "dogs", dogRef));
        console.log("Documento borrado con exito")
        navigation.navigate("Home")
    }catch(error){
        console.log("erros al tratar de borrar el documento" + error)
    }
  }

  const closeModal = () => {
    setModalVisible(false)
  }
  

  return (
    <View style={styles.container}> 
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('../../images/logoCriserLogin.png')} style={styles.logo} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Options')}>
            <Image source={require('../../images/hamburgerIcon.png')} style={styles.menuIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.dispenserSection}>
      <Image source={{ uri: dog.photo_can }} style={styles.deviceImage} />
      <Text style={styles.deviceName}>{dog.dog_name}</Text>
      <Text style={styles.deviceInfo}>Otra información del perro</Text>
      {/* Agrega aquí más información específica del dispositivo */}
      </View>
      <View>
        <TouchableOpacity onPress={()=>{setModalVisible(true)}}>
            <Text>
                Borrar mascota
            </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Está seguro de que desea eliminar esta mascota?</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={closeModal}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonExit}
              onPress={handleDeleteDog}
            >
              <Text style={styles.modalButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
  dispenserSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceImage: {
    width: 200,
    height: 200,
  },
  deviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  deviceInfo: {
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 40,
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#00B5E2',
    width: 100,
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalButtonExit: {
    backgroundColor: 'red',
    width: 100,
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
});

export default DogDetailScreen;
