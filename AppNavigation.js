import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, View, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, createContext, useContext } from 'react';

import HomeScreen from "./frontend/src/screens/HomeScreen";
import DataEntryScreen from "./frontend/src/screens/DataEntryScreen";
import ListScreen from "./frontend/src/screens/ListScreen";
import ProfileScreen from "./frontend/src/screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Context para el tema
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(true);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('appTheme');
            if (savedTheme) {
                setIsDarkTheme(savedTheme === 'dark');
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    };

    const toggleTheme = async () => {
        const newTheme = !isDarkTheme;
        setIsDarkTheme(newTheme);
        await AsyncStorage.setItem('appTheme', newTheme ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

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

const HeaderButtons = ({ navigation }) => {
    const { isDarkTheme, toggleTheme } = useTheme();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons 
                name={isDarkTheme ? "weather-sunny" : "weather-night"} 
                size={24} 
                color={isDarkTheme ? "#FFFFFF" : "#FF6B6B"} 
                style={{ marginRight: 15 }}
                onPress={toggleTheme}
            />
            
            <MaterialCommunityIcons 
                name="logout" 
                size={24} 
                color="#FF6B6B" 
                style={{ marginRight: 15 }}
                onPress={() => handleLogout(navigation)}
            />
        </View>
    );
};

const MoviesStack = ({ navigation }) => {
    const { isDarkTheme } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { 
                    backgroundColor: isDarkTheme ? '#0A0F1C' : '#FFFFFF'
                },
                headerTintColor: isDarkTheme ? '#FFFFFF' : '#333333',
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
                    headerRight: () => <HeaderButtons navigation={navigation} />,
                }}
            />
            <Stack.Screen 
                name="AgregarPelicula" 
                component={DataEntryScreen}
                options={{ 
                    title: "Agregar Película",
                    headerRight: () => <HeaderButtons navigation={navigation} />,
                    headerBackTitle: "Atrás"
                }}
            />
        </Stack.Navigator>
    );
};

const HomeStack = ({ navigation }) => {
    const { isDarkTheme } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { 
                    backgroundColor: isDarkTheme ? '#0A0F1C' : '#FFFFFF'
                },
                headerTintColor: isDarkTheme ? '#FFFFFF' : '#333333',
            }}
        >
            <Stack.Screen 
                name="InicioPrincipal" 
                component={HomeScreen}
                options={{ 
                    title: "CineApp",
                    headerRight: () => <HeaderButtons navigation={navigation} />,
                }}
            />
        </Stack.Navigator>
    );
};

const ProfileStack = ({ navigation }) => {
    const { isDarkTheme } = useTheme();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            setIsAuthenticated(!!token);
        } catch (error) {
            console.error('Error checking auth:', error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: isDarkTheme ? '#0A0F1C' : '#FFFFFF' 
            }}>
                <Text style={{ color: isDarkTheme ? '#FFFFFF' : '#333333' }}>
                    Cargando...
                </Text>
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { 
                    backgroundColor: isDarkTheme ? '#0A0F1C' : '#FFFFFF'
                },
                headerTintColor: isDarkTheme ? '#FFFFFF' : '#333333',
            }}
        >
            {isAuthenticated ? (
                <Stack.Screen 
                    name="MiPerfil" 
                    component={ProfileScreen}
                    options={{ 
                        title: "Mi Perfil",
                        headerRight: () => <HeaderButtons navigation={navigation} />,
                    }}
                />
            ) : (
                <Stack.Screen 
                    name="RedireccionLogin" 
                    component={LoginRedirectScreen}
                    options={{ 
                        title: "Acceso Requerido",
                        headerShown: false
                    }}
                />
            )}
        </Stack.Navigator>
    );
};

const LoginRedirectScreen = ({ navigation }) => {
    const { isDarkTheme } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: isDarkTheme ? '#0A0F1C' : '#FFFFFF' 
        }}>
            <MaterialCommunityIcons 
                name="alert-circle" 
                size={60} 
                color="#FF6B6B" 
            />
            <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: isDarkTheme ? '#FFFFFF' : '#333333',
                marginTop: 20,
                textAlign: 'center',
                marginHorizontal: 40
            }}>
                Debes iniciar sesión para acceder a tu perfil
            </Text>
            <Text style={{ 
                fontSize: 14, 
                color: isDarkTheme ? '#8A8D9F' : '#666666',
                marginTop: 10,
                textAlign: 'center'
            }}>
                Redirigiendo al login...
            </Text>
        </View>
    );
};

const AppTabs = () => {
    const { isDarkTheme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: isDarkTheme ? '#0A0F1C' : '#FFFFFF',
                },
                headerTintColor: isDarkTheme ? '#FFFFFF' : '#333333',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                tabBarStyle: {
                    backgroundColor: isDarkTheme ? '#1A1F2E' : '#F8F9FA',
                    borderTopColor: isDarkTheme ? '#2A2F3E' : '#E0E0E0',
                    height: 80,
                    paddingBottom: 12,
                    paddingTop: 5,
                },
                tabBarItemStyle: {
                    marginTop: 5,
                },
                tabBarActiveTintColor: '#FF6B6B',
                tabBarInactiveTintColor: isDarkTheme ? '#8A8D9F' : '#999999',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginBottom: 4,
                },
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
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Películas', { 
                            screen: 'ListaPeliculas' 
                        });
                    },
                })}
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

const AppNavigation = () => {
    return (
        <ThemeProvider>
            <AppTabs />
        </ThemeProvider>
    );
}

export default AppNavigation;