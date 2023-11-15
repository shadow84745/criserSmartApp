import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, TextInput } from 'react-native';
import { doc, deleteDoc, query, collection, where, getDocs } from "firebase/firestore";
import { db } from '../../firebaseConfig';
import { deleteObject, getStorage, ref } from 'firebase/storage';


let dogId;

const DogDetailScreen = ({ route, navigation }) => {
  // Recupera los datos del dispositivo seleccionado de las propiedades de navegación
  const { dog } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [chargeModal, setChargeModal] = useState(false);

  dogId = dog.dog_id;

  const handleDeleteDog = async () => {
    const dogRef = dog.dog_id;
    setModalVisible(false);
    setChargeModal(true);

    const imageURL = dog.photo_can;

    try {

      const foodPlanQuery = query(collection(db, "food_plan"), where("dog_id_ref", "==", dogRef));
      const foodPlanQuerySnapshot = await getDocs(foodPlanQuery);

      if (!foodPlanQuerySnapshot.empty) {
        // Supongamos que solo existe un documento relacionado, eliminarlo
        const foodPlanDoc = foodPlanQuerySnapshot.docs[0];
        await deleteDoc(doc(db, "food_plan", foodPlanDoc.id));
        console.log("Documento de plan de comida relacionado eliminado con éxito");
      }


      await deleteDoc(doc(db, "dogs", dogRef));
      console.log("Documento borrado con exito")


      if (imageURL) {
        const imageRef = ref(getStorage(), imageURL);
        await deleteObject(imageRef);
        console.log("Imagen de perro eliminada con éxito desde Firebase Storage");
      }

      setChargeModal(false);
      navigation.navigate("Home")
    } catch (error) {
      console.log("erros al tratar de borrar el documento" + error)
    }
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const handlePlanSelect = () => {
    navigation.navigate('DogEatingPlan', { dogId: dog.dog_id });
  };

  const handleUpdate = () => {
    navigation.navigate('UpdateDogInfo');
  };


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


      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>Perfil de mascota</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.dogSectionTitle}>
          <Text style={styles.deviceName}>{dog.dog_name}</Text>
        </View>
        <View style={styles.dogSection}>
          <View>
            <Image source={{ uri: dog.photo_can }} style={styles.dogImage} />
          </View>
          <View style={{ maxWidth: 200, marginLeft: 10 }}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Recomendaciones</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.dogSectionTitle}>
          <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>Estado: Peso normal</Text>
        </View>
      </View>


      <View style={styles.sectionDogInfo}>
        <View style={styles.inputContainer}>
          <View style={styles.inputGroup}>
            <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
              <Text style={styles.descriptionInput}>Edad:</Text>
              <TextInput
                style={styles.input}
                placeholder={dog.edad_can}
                editable={false}
              />
            </View>
            <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
              <Text style={styles.descriptionInput}>Peso:</Text>
              <TextInput
                style={styles.input}
                placeholder={dog.dog_weight.toString()}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
              <Text style={styles.descriptionInput}>Edad:</Text>
              <TextInput
                style={styles.input}
                placeholder={dog.edad_can}
                editable={false}
              />
            </View>
            <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
              <Text style={styles.descriptionInput}>Raza:</Text>
              <TextInput
                style={styles.input}
                placeholder={dog.race_can.charAt(0).toUpperCase() + dog.race_can.slice(1)}
                editable={false}
              />
            </View>

          </View>
        </View>
        <View>

        </View>
      </View>






      {/*opciones*/}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>
              Actualizar datos
            </Text>
          </TouchableOpacity>
        </View>
        {/*<View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => { setModalVisible(true) }}>
            <Text style={styles.buttonText}>
              Borrar mascota
            </Text>
          </TouchableOpacity>
  </View>*/}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePlanSelect}>
            <Text style={styles.buttonText}>
              Plan nutricional
            </Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* Seccion de modales */}
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


      <Modal animationType='fade' transparent={true} visible={chargeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#00B5E2" />
            <Text style={styles.modalText}>Eliminando...</Text>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dogSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dogSectionTitle: {
    alignItems: 'center'
  },
  dogImage: {
    width: 150,
    height: 150,
    borderRadius: 80,
  },
  deviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#fff'
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
  section: {
    backgroundColor: "#00B5E2",
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginVertical: 5,
    marginBottom: -10
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#F1C400',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
  input: {
    backgroundColor: '#FFF',
    color: '#000',
    marginBottom: 10,
    padding: 10,
    borderColor: '#000',
    borderWidth: 1,
  },
  inputContainer: {
    justifyContent: 'space-between',
  },
  sectionDogInfo: {
    backgroundColor: "#ddd",
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginVertical: 5,
    marginBottom: -10
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export { dogId };
export default DogDetailScreen;
