import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../screens/userLogin/LoginScreen';

// Prueba básica para verificar que el componente se renderiza correctamente
test('LoginScreen se renderiza correctamente', () => {
  const { getByText, getByPlaceholderText } = render(<LoginScreen />);

  // Verificar que algunos elementos esperados estén en la pantalla
  expect(getByText('!SEA BIENVENIDO!')).toBeTruthy();
  expect(getByPlaceholderText('Correo Electrónico o Teléfono')).toBeTruthy();
  expect(getByPlaceholderText('Contraseña')).toBeTruthy();
});

// Prueba para verificar el manejo de inicio de sesión
test('Iniciar sesión con credenciales válidas', async () => {
  const { getByPlaceholderText, getByText } = render(<LoginScreen />);

  // Simular la entrada de datos del usuario
  const emailInput = getByPlaceholderText('Correo Electrónico o Teléfono');
  const passwordInput = getByPlaceholderText('Contraseña');
  const loginButton = getByText('Iniciar Sesión');

  fireEvent.changeText(emailInput, 'usuario@ejemplo.com');
  fireEvent.changeText(passwordInput, 'contraseñaSegura');
  fireEvent.press(loginButton);

  // Asegúrate de que se muestre el modal de carga
  await waitFor(() => {
    expect(getByText('Validando datos...')).toBeTruthy();
  });

  // Puedes agregar más aserciones aquí para verificar el comportamiento después del inicio de sesión.
});

// Prueba para verificar el manejo de errores en el inicio de sesión
test('Manejo de errores en el inicio de sesión', async () => {
  const { getByPlaceholderText, getByText } = render(<LoginScreen />);

  // Simular la entrada de datos del usuario
  const emailInput = getByPlaceholderText('Correo Electrónico o Teléfono');
  const passwordInput = getByPlaceholderText('Contraseña');
  const loginButton = getByText('Iniciar Sesión');

  fireEvent.changeText(emailInput, 'usuario@ejemplo.com');
  fireEvent.changeText(passwordInput, 'contraseñaIncorrecta');
  fireEvent.press(loginButton);

  // Asegúrate de que se muestre el mensaje de error
  await waitFor(() => {
    expect(getByText('Ocurrió un error al iniciar sesión')).toBeTruthy();
  });
});
