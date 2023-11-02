// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup';

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@react-navigation/elements/lib/commonjs/assets/back-icon.png', () => 'path-to-mock-image');
// Método de reemplazo de createNativeStackNavigator (solo un ejemplo)
jest.mock('@react-navigation/native-stack', () => {
    return {
      createNativeStackNavigator: jest.fn(() => ({
        Navigator: jest.fn(),
        Screen: jest.fn(),
      })),
    };
  });
  
  // Otros mocks relacionados con React Navigation si es necesario
  jest.mock('@react-navigation/native', () => {
    return {
      // Mock de NavigationContainer
      NavigationContainer: jest.fn(({ children }) => children),
    }; 
  });

  jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
  }));