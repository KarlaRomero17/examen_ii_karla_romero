import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importa las pantallas
import HomeScreen from "./frontend/src/screens/HomeScreen";
import DataEntryScreen from "./frontend/src/screens/DataEntryScreen";
import ListScreen from "./frontend/src/screens/ListScreen";
import ProfileScreen from "./frontend/src/screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Función de logout reutilizable
const handleLogout = (navigation) => {
  Alert.alert(
    "Cerrar Sesión",
    "¿Estás seguro de que quieres salir?",
    [
      {
        text: "Cancelar",
        style: "cancel"
      },
      { 
        text: "Salir", 
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          navigation.replace('Login');
        }
      }
    ]
  );
};

// Componente de botón de logout para header
const LogoutButton = ({ navigation }) => (
  <MaterialCommunityIcons 
    name="logout" 
    size={24} 
    color="#FF6B6B" 
    style={{ marginRight: 15 }}
    onPress={() => handleLogout(navigation)}
  />
);

// Stack para Películas
const MoviesStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { 
          backgroundColor: '#0A0F1C' 
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ListaPeliculas" 
        component={ListScreen}
        options={{ 
          title: "Mis Películas",
          headerRight: () => <LogoutButton navigation={navigation} />,
          headerLeft: () => (
            <MaterialCommunityIcons 
              name="menu" 
              size={24} 
              color="#FFFFFF" 
              style={{ marginLeft: 15 }}
              onPress={() => navigation.toggleDrawer()} // Si usas drawer
            />
          )
        }}
      />
      <Stack.Screen 
        name="AgregarPelicula" 
        component={DataEntryScreen}
        options={{ 
          title: "Agregar Película",
          headerRight: () => <LogoutButton navigation={navigation} />,
          headerBackTitle: "Atrás"
        }}
      />
    </Stack.Navigator>
  );
};

// Stack para Inicio
const HomeStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0A0F1C' },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Stack.Screen 
        name="InicioPrincipal" 
        component={HomeScreen}
        options={{ 
          title: "CineApp",
          headerRight: () => <LogoutButton navigation={navigation} />,
        }}
      />
    </Stack.Navigator>
  );
};

// Stack para Perfil
const ProfileStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0A0F1C' },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Stack.Screen 
        name="MiPerfil" 
        component={ProfileScreen}
        options={{ 
          title: "Mi Perfil",
          headerRight: () => <LogoutButton navigation={navigation} />,
        }}
      />
    </Stack.Navigator>
  );
};

// Tab Navigator principal
const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0A0F1C',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: '#1A1F2E',
          borderTopColor: '#2A2F3E',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#8A8D9F',
      }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeStack}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
          headerShown: false
        }}
      />
      
      <Tab.Screen 
        name="Películas" 
        component={MoviesStack}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="movie" size={size} color={color} />
          ),
          headerShown: false
        }}
      />
      
      <Tab.Screen 
        name="Perfil" 
        component={ProfileStack}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
}

export default AppTabs;