import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    Animated,
    Dimensions
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState('');
    const scaleAnim = useState(new Animated.Value(0.8))[0];
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if(storedUser){
                setUser(storedUser);
            }
        };
        loadUser();

        // Animaciones al cargar
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        navigation.replace('Login');
    };

    const MenuCard = ({ icon, title, onPress, color = '#FF6B6B' }) => (
        <TouchableOpacity 
            style={styles.menuCard}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
                <MaterialCommunityIcons name={icon} size={28} color="#FFFFFF" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.menuTitle}>{title}</Text>
                <MaterialCommunityIcons 
                    name="chevron-right" 
                    size={20} 
                    color="#8A8D9F" 
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcome}>¡Hola,</Text>
                    <Text style={styles.username}>{user}!</Text>
                </View>
                <Text style={styles.subtitle}>Tu colección de películas te espera</Text>
            </View>

            {/* Contenido principal */}
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View 
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    {/* Tarjetas de menú */}
                    <View style={styles.menuGrid}>
                        <MenuCard
                            icon="account"
                            title="Perfil"
                            color="#FF6B6B"
                            onPress={() => navigation.navigate('Profile')}
                        />

                        <MenuCard
                            icon="movie-plus"
                            title="Agregar Película"
                            color="#4ECDC4"
                            onPress={() => navigation.navigate('DataEntryScreen')}
                        />

                        <MenuCard
                            icon="movie-search"
                            title="Ver Películas"
                            color="#45B7D1"
                            onPress={() => navigation.navigate('ListScreen')}
                        />
                    </View>

                    {/* Sección de estadísticas rápidas */}
                    <View style={styles.statsContainer}>
                        <Text style={styles.statsTitle}>Tu Cine</Text>
                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
                                <Text style={styles.statNumber}>0</Text>
                                <Text style={styles.statLabel}>Favoritas</Text>
                            </View>
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="eye" size={24} color="#4ECDC4" />
                                <Text style={styles.statNumber}>0</Text>
                                <Text style={styles.statLabel}>Vistas</Text>
                            </View>
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="clock" size={24} color="#FF6B6B" />
                                <Text style={styles.statNumber}>0</Text>
                                <Text style={styles.statLabel}>Por ver</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0F1C',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 25,
        paddingBottom: 20,
        backgroundColor: '#1A1F2E',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    welcomeContainer: {
        marginBottom: 5,
    },
    welcome: {
        fontSize: 28,
        fontWeight: '300',
        color: '#FFFFFF',
    },
    username: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    subtitle: {
        fontSize: 16,
        color: '#8A8D9F',
        marginTop: 5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    content: {
        padding: 20,
    },
    menuGrid: {
        marginBottom: 30,
    },
    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1F2E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#2A2F3E',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    statsContainer: {
        backgroundColor: '#1A1F2E',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    statsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginVertical: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#8A8D9F',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#0A0F1C',
        borderTopWidth: 1,
        borderTopColor: '#2A2F3E',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B6B',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#FF6B6B',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default HomeScreen;