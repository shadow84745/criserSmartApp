import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage , ref, uploadBytes, getDownloadURL} from  "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';


export const firebaseConfig = {
    apiKey: "AIzaSyBBF9swuBhIc1Dx6PycR2mgSRnrSuDmLZM",
    authDomain: "aplicacion-del-dispensador.firebaseapp.com",
    projectId: "aplicacion-del-dispensador",
    storageBucket: "aplicacion-del-dispensador.appspot.com",
    messagingSenderId: "994194243827",
    appId: "1:994194243827:web:aff89b9983e6e220e4b786",
    measurementId: "G-BVJP6G0289"
  };

const app = initializeApp(firebaseConfig);



export const db = getFirestore(app);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { getAuth };

export const storage = getStorage(app); 






