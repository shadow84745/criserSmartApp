import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../../screens/userRegister/RegisterScreen';


// Prueba básica para verificar que el componente se renderiza correctamente
test('RegisterScreen se renderiza correctamente', () => {
  const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

  // Verificar que algunos elementos esperados estén en la pantalla
  expect(getByText('¡Todo sea por tu mascota!')).toBeTruthy();
  expect(getByText('Regístrate:')).toBeTruthy();
  expect(getByPlaceholderText('Primer nombre')).toBeTruthy();
  expect(getByPlaceholderText('Correo Electrónico')).toBeTruthy();
  // Agrega más verificaciones según sea necesario
});

// Prueba para verificar el manejo de creación de cuenta con datos válidos
test('Crear cuenta con datos válidos', async () => {
  const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

  // Simular la entrada de datos del usuario
  const firstNameInput = getByPlaceholderText('Primer nombre');
  const emailInput = getByPlaceholderText('Correo Electrónico');
  const passwordInput = getByPlaceholderText('Contraseña');
  const confirmPasswordInput = getByPlaceholderText('Confirmar contraseña');
  const phoneInput = getByPlaceholderText('Número de teléfono');
  const usernameInput = getByPlaceholderText('Nombre de usuario');
  const dateOfBirthInput = getByPlaceholderText('Fecha de Nacimiento (YYYY-MM-DD)');
  const createAccountButton = getByText('Registrarte');
  

  fireEvent.changeText(firstNameInput, 'Nombre');
  fireEvent.changeText(emailInput, 'usuario@ejemplo.com');
  fireEvent.changeText(passwordInput, 'contraseñaSegura');
  fireEvent.changeText(confirmPasswordInput, 'contraseñaSegura');
  fireEvent.changeText(phoneInput, '3001234567');
  fireEvent.changeText(usernameInput, 'nombredeusuario');
  fireEvent.changeText(dateOfBirthInput, '01 - 09 -1999');
  fireEvent.press(createAccountButton);

  // Asegúrate de que se muestre el mensaje de éxito o redirección
  await waitFor(() => {
    expect(getByText('Validando tu registro...')).toBeTruthy();
  });

  // Puedes agregar más aserciones aquí para verificar el comportamiento después de la creación de cuenta.
});

// Prueba para verificar el manejo de errores en la creación de cuenta
test('Manejo de errores en la creación de cuenta', async () => {
  const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

  // Simular la entrada de datos del usuario
  const emailInput = getByPlaceholderText('Correo Electrónico');
  const passwordInput = getByPlaceholderText('Contraseña');
  const confirmPasswordInput = getByPlaceholderText('Confirmar contraseña');
  const phoneInput = getByPlaceholderText('Número de teléfono');
  const usernameInput = getByPlaceholderText('Nombre de usuario');
  const createAccountButton = getByText('Registrarte');

 //correo
  fireEvent.changeText(emailInput, 'correo-invalido');
  fireEvent.changeText(passwordInput, 'contraseñaSegura');
  fireEvent.changeText(confirmPasswordInput, 'contraseñacontraseñaSeguraIncorrecta');
  fireEvent.changeText(phoneInput, '3184756135');
  fireEvent.changeText(usernameInput, 'nombredeusuario');
  fireEvent.press(createAccountButton);

  // Asegúrate de que se muestren los mensajes de error
  await waitFor(() => {
    expect(getByText('Correo electrónico no válido')).toBeTruthy();
  });

  //Telefono

  fireEvent.changeText(emailInput, 'correoejemplo@gmail.com');
  fireEvent.changeText(passwordInput, 'contraseñaSegura');
  fireEvent.changeText(confirmPasswordInput, 'contraseñaSegura');
  fireEvent.changeText(phoneInput, '123');
  fireEvent.changeText(usernameInput, 'nombredeusuario');
  fireEvent.press(createAccountButton);

  // Asegúrate de que se muestren los mensajes de error
  await waitFor(() => {
    expect(getByText('Número de teléfono no válido.')).toBeTruthy();
  });

  //Repetir contraseña

  fireEvent.changeText(emailInput, 'correoejemplo@gmail.com');
  fireEvent.changeText(passwordInput, 'contraseñaSegura');
  fireEvent.changeText(confirmPasswordInput, 'contraseñaIncorrecta');
  fireEvent.changeText(phoneInput, '3184756135');
  fireEvent.changeText(usernameInput, 'nombredeusuario');
  fireEvent.press(createAccountButton);

  // Asegúrate de que se muestren los mensajes de error
  await waitFor(() => {
    expect(getByText('Las contraseñas no coinciden')).toBeTruthy();
  });

});
