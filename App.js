import React from 'react';
import { StyleSheet } from 'react-native';
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


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, unmountOnBlur: true}} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Method" component={MethodScreen} options={{ headerShown: false}} />
        <Stack.Screen name="EmailMethod" component={EmailMethodScreen} options={{ headerShown: false}} />
        <Stack.Screen name="PhoneMethod" component={PhoneMethodScreen} options={{headerShown: false}} /> 
        <Stack.Screen name="Options" component={OptionsScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false}} />
        <Stack.Screen name="NewDispenser" component={NewDispenserScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ConnectionDispenser" component={ConnectionDispenser} options={{headerShown: false}} />
        <Stack.Screen name="WiffiConnection" component={WiffiConnection} options={{headerShown: false}} /> 
        <Stack.Screen name="DispenserTest" component={DispenserTest} options={{headerShown: false}} /> 
        <Stack.Screen name="DeviceRegister" component={DeviceRegister} options={{headerShown: false}} />
        <Stack.Screen name="NewPet" component={NewPetScreen} options={{headerShown: false}} /> 
        <Stack.Screen name="DeviceDetail" component={DeviceDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DogDetail" component={DogDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PetPhoto" component={PetPhotoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DogEatingPlan" component={DogEatingPlanScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateDogInfo" component={UpdateDogInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateDeviceInfo" component={UpdateDeviceInfoScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
