import React from 'react';
import {View, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { store } from './src/store';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import StackNavigator from './src/navigation/StackNavigator';
import { navigationRef } from './src/navigation/NavigationService';

 export default function App() {
  
  return (
    
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <NavigationContainer ref={navigationRef}>
              <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />
              <StackNavigator />
            </NavigationContainer>
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    
  );
  

}
