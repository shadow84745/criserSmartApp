// MethodScreenNavigation.test.js
import * as React from 'react';
import { screen, render, fireEvent, waitFor } from '@testing-library/react-native';
import MethodScreen from '../../screens/recoverUser/MethodScreen';

// Prueba para verificar la navegación a la pantalla de inicio de sesión

test('Navegación de MethodScreen a LoginScreen', () => {
  render(

      <MethodScreen />
      
  );

  // Simular la navegación a la pantalla de inicio de sesión
  fireEvent.press(screen.getByText('Inicia Sesion'));

  // Asegurarse de que se haya navegado a la pantalla de inicio de sesión (LoginScreen)
    // Verificar que un elemento específico en la pantalla de LoginScreen esté presente.
    expect(screen.getByText('Correo Electrónico')).toBeOnTheScreen();

  });
