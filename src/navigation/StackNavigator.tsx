import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IndexS from '../screens/IndexS';
import LoginS from '../screens/LoginS';
import RegisterS from '../screens/RegisterS';
import ChatbotS from '../screens/ChatBotS';
import TabsNavigator from './TabsNavigator';
import { RootStackParamList } from './types';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../infoutils/theme';
import ScheduleS from '../screens/SchedulesS';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);


  return (
    <Stack.Navigator
      initialRouteName="Index"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerBackTitle: 'Atrás',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Index"
        component={IndexS}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen
        name="Login"
        component={LoginS}
        options={{ title: 'Iniciar Sesión' }}
      />
      
      <Stack.Screen
        name="Register"
        component={RegisterS}
        options={{ title: 'Crear Cuenta' }}
      />
      
      <Stack.Screen
        name="MainTabs"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen
        name="Chatbot"
        component={ChatbotS}
        options={{ title: 'Asistente Virtual' }}
      />
      <Stack.Screen
        name="Schedules"
        component={ScheduleS}
        options={{ title: 'Agendar Cita' }}
      />
    </Stack.Navigator>
  );
  

}
