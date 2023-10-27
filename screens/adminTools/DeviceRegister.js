import React, { useState } from 'react';
import { View, Text, Image, Button, TextInput } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { storage, db } from '../../firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  getFirestore,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadFile,
} from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';

const DeviceRegisterScreen = () => {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const navigation = useNavigation();

  const pickImage = () => {
    const options = {
      title: 'Seleccionar una imagen',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('Selección de imagen cancelada');
      } else if (response.error) {
        console.log('Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        setImage(source);
      }
    });
  };

  const uploadImageToFirebase = async () => {
    if (image) {
      try {
        const storageRef = ref(storage, `devicesImages/${imageName}`);
        await uploadFile(storageRef, image.uri);
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
      } catch (error) {
        console.error('Error al cargar la imagen:', error);
      }
    }
  };

  const saveImageUrlToFirestore = async () => {
    if (imageUrl) {
      try {
        const dbInstance = getFirestore();
        const collectionRef = collection(dbInstance, 'registeredDevices'); // Reemplaza con el nombre de tu colección
        const customDocId = 'ID_PERSONALIZADO'; // Reemplaza con el ID personalizado que desees

        // Crea un documento con el ID personalizado
        await setDoc(doc(collectionRef, customDocId), {
          imageUrl: imageUrl, // Guarda la URL de descarga en el campo 'imageUrl'
        });

        console.log('Imagen y URL guardadas en Firestore con éxito.');
      } catch (error) {
        console.error('Error al guardar la URL en Firestore: ', error);
      }
    }
  };

  return (
    <View>
      <Text>Selecciona una imagen:</Text>
      <Button title="Seleccionar Imagen" onPress={pickImage} />

      {image && (
        <Image source={image} style={{ width: 200, height: 200 }} />
      )}

      <TextInput
        placeholder="Nombre de la imagen en Storage"
        value={imageName}
        onChangeText={(text) => setImageName(text)}
      />

      <Button title="Subir Imagen a Firebase" onPress={uploadImageToFirebase} />
      <Button
        title="Guardar URL en Firestore"
        onPress={saveImageUrlToFirestore}
      />
    </View>
  );
}
export default DeviceRegisterScreen;
