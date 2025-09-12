
import { UserProvider } from './frontend/src/context/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './frontend/src/screens/LoginScreen';
import HomeScreen from './frontend/src/screens/HomeScreen';
// import ProfileScreen from './frontend/src/screens/ProfileScreen';
// import PatientsScreen from './frontend/src/screens/PatientsScreen';
// import AppointmentScreen from './frontend/src/screens/AppointmentScreen';
// import ClinicalHistoryScreen from './frontend/src/screens/MedicalHistoryScreen';
// import SettingsScreen from './frontend/src/screens/SettingsScreen';
import AppDrawer from './AppNavigation';
import AppTabs from './AppNavigation';



const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={AppTabs} />
    


        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );


};
export default App;