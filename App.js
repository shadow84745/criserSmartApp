import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home/HomeScreen';
import MethodScreen from './screens/recoverUser/MethodScreen';
import EmailMethodScreen from './screens/recoverUser/EmailMethodScreen';
import OptionsScreen from './screens/home/OptionsScreen';
import ProfileScreen from './screens/userProfile/ProfileScreen';
import RegisterScreen from './screens/userRegister/RegisterScreen';
import LoginScreen from './screens/userLogin/LoginScreen';
import NewDispenserScreen from './screens/dispenserRegister/NewDispenserScreen';
import ConnectionDispenser from './screens/dispenserRegister/ConnectionDispenserScreen';
import WiffiConnection from './screens/dispenserRegister/WiffiConnectionScreen';
import DispenserTest from './screens/dispenserRegister/DispenserTestScreen';
import DeviceRegister from './screens/adminTools/DeviceRegister';
import PhoneMethodScreen from './screens/recoverUser/PhoneMethodScreen';
import NewPetScreen from './screens/petRegister/NewPetScreen';
import DeviceDetailScreen from './screens/visualInterfaces/DeviceDetailScreen';
import PetPhotoScreen from './screens/petRegister/PetPhotoScreen';
import DogDetailScreen from './screens/visualInterfaces/DogDetailScreen';
import DogEatingPlanScreen from './screens/petRegister/DogEatingPlanScreen';
import UpdateDogInfoScreen from './screens/visualInterfaces/UpdateDogInfoScreen';
import UpdateDeviceInfoScreen from './screens/visualInterfaces/UpdateDeviceInfoScreen';
import NetInfo from '@react-native-community/netinfo';
import ScanBleScreen from './screens/dispenserRegister/ScanBleScreen';
import { BleProvider } from './screens/dispenserRegister/hooks/BleContext';


const Stack = createNativeStackNavigator();

const InternetAlert = ({ isVisible, message }) => {
  if (!isVisible) return null;
  return (
    <View style={styles.alertContainer}>
      <Text style={styles.alertText}>{message}</Text>
    </View>
  );
};


export default function App() {

  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  return (
    <>
      <BleProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, unmountOnBlur: true }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Method" component={MethodScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EmailMethod" component={EmailMethodScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PhoneMethod" component={PhoneMethodScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Options" component={OptionsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="NewDispenser" component={NewDispenserScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConnectionDispenser" component={ConnectionDispenser} options={{ headerShown: false }} />
            <Stack.Screen name="ScanBleDevice" component={ScanBleScreen} options={{ headerShown: false }} />
            <Stack.Screen name="WiffiConnection" component={WiffiConnection} options={{ headerShown: false }} />
            <Stack.Screen name="DispenserTest" component={DispenserTest} options={{ headerShown: false }} />
            <Stack.Screen name="DeviceRegister" component={DeviceRegister} options={{ headerShown: false }} />
            <Stack.Screen name="NewPet" component={NewPetScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DeviceDetail" component={DeviceDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DogDetail" component={DogDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PetPhoto" component={PetPhotoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DogEatingPlan" component={DogEatingPlanScreen} options={{ headerShown: false }} />
            <Stack.Screen name="UpdateDogInfo" component={UpdateDogInfoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="UpdateDeviceInfo" component={UpdateDeviceInfoScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
      <InternetAlert
        isVisible={!isConnected || !isInternetReachable}
        message={!isConnected ? "No hay conexión a Internet" : "Conexión a Internet débil"}
      />
      </BleProvider>
    </>
  );
}

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'red',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    color: 'white',
    fontSize: 16,
  },
});
