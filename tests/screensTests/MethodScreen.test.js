import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MethodScreen from '../../screens/recoverUser/MethodScreen';

// Prueba básica para verificar que el componente se renderiza correctamente
test('MethodScreen se renderiza correctamente', () => {
  const { getByText, getByTestId } = render(<MethodScreen />);

  // Verificar que algunos elementos esperados estén en la pantalla
  expect(getByText('METODOS DE RECUPERACION')).toBeTruthy();
  expect(getByText('A traves del correo')).toBeTruthy();
  expect(getByText('A traves del numero de telefono')).toBeTruthy();
  expect(getByText('Contacta con soporte')).toBeTruthy();
  expect(getByText('¿Ya tienes una cuenta?')).toBeTruthy();
  expect(getByText('Inicia Sesion')).toBeTruthy();
});

// Prueba para verificar la navegación a la pantalla de inicio de sesión
test('Navegación a la pantalla de inicio de sesión', async () => {
  const { getByText, getByTestId } = render(<MethodScreen />);

  // Simular la navegación a la pantalla de inicio de sesión
  fireEvent.press(getByText('Inicia Sesion'));

  // Asegurarse de que se navegue correctamente a la pantalla de inicio de sesión
  await waitFor(() => {
    expect(getByText('¡SEA BIENVENIDO!')).toBeTruthy(); // Verificar un elemento en la pantalla de inicio de sesión
  });
});

// Prueba para verificar la navegación a la pantalla de recuperación de correo
test('Navegación a la pantalla de recuperación de correo', async () => {
  const { getByText, getByTestId } = render(<MethodScreen />);

  // Simular la navegación a la pantalla de recuperación de correo
  fireEvent.press(getByText('A traves del correo'));

  // Asegurarse de que se navegue correctamente a la pantalla de recuperación de correo
  await waitFor(() => {
    expect(getByText('Recuperación de Correo')).toBeTruthy(); // Verificar un elemento en la pantalla de recuperación de correo
  });
});

// Prueba para verificar la navegación a la pantalla de recuperación de número de teléfono
test('Navegación a la pantalla de recuperación de número de teléfono', async () => {
  const { getByText, getByTestId } = render(<MethodScreen />);

  // Simular la navegación a la pantalla de recuperación de número de teléfono
  fireEvent.press(getByText('A traves del numero de telefono'));

  // Asegurarse de que se navegue correctamente a la pantalla de recuperación de número de teléfono
  await waitFor(() => {
    expect(getByText('Recuperación de Número de Teléfono')).toBeTruthy(); // Verificar un elemento en la pantalla de recuperación de número de teléfono
  });
});
