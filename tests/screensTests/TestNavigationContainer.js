import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../screens/userLogin/LoginScreen';
import MethodScreen from '../../screens/recoverUser/MethodScreen';

const Stack = createNativeStackNavigator();

const TestNavigationContainer = ({ children }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Method" component={MethodScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
    {children}
  </NavigationContainer>
);

export default TestNavigationContainer;
