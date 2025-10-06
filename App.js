import { UserProvider } from './frontend/src/context/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './frontend/src/screens/LoginScreen';
import AppTabs from './AppNavigation';
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from './frontend/src/db/database';
import RegisterScreen from './frontend/src/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <SQLiteProvider databaseName='cineApp.db' onInit={initializeDatabase}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
              headerShown: false // Oculta headers del Stack principal
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={AppTabs} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            
          </Stack.Navigator>
        </NavigationContainer>
      </SQLiteProvider>
    </UserProvider>
  );
};
export default App;