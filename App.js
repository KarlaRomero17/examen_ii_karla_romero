import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import LoginScreen from './frontend/src/screens/LoginScreen';
import HomeScreen from './frontend/src/screens/HomeScreen';
import ProfileScreen from './frontend/src/screens/ProfileScreen';
import SettingsScreen from './frontend/src/screens/SettingsScreen';
import UserInterfaceScreen from './frontend/src/screens/UserInterfaceScreen';
import AppointmentScreen from './frontend/src/screens/AppointmentScreen';
import ClinicalHistoryScreen from './frontend/src/screens/MedicalHistoryScreen';
const App = () => {

// return <LoginScreen />
  return <HomeScreen />
//  return <ProfileScreen /> //en la screen se cambia la constante "rolActual" para ver los diferentes perfiles (usuario, administrador o paciente)
  // return <SettingsScreen />
  // return <UserInterfaceScreen />
  // return <AppointmentScreen />
  // return <ClinicalHistoryScreen />;

  
};
export default App;