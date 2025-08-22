
import { UserProvider } from './frontend/src/context/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './frontend/src/screens/LoginScreen';
import HomeScreen from './frontend/src/screens/HomeScreen';
import ProfileScreen from './frontend/src/screens/ProfileScreen';
import SettingsScreen from './frontend/src/screens/SettingsScreen';
import PatientsScreen from './frontend/src/screens/PatientsScreen';
import AppointmentScreen from './frontend/src/screens/AppointmentScreen';
import ClinicalHistoryScreen from './frontend/src/screens/MedicalHistoryScreen';



const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Patients" component={PatientsScreen} />
          <Stack.Screen name="Appointment" component={AppointmentScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );


};
export default App;