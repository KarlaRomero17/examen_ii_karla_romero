import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSQLiteContext } from 'expo-sqlite';

const HomeScreen = ({ isDarkTheme }) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const db = useSQLiteContext();
    const [user, setUser] = useState('');
    const [movieStats, setMovieStats] = useState({
        total: 0,
        watched: 0,
        unwatched: 0,
        favorites: 0
    });

    const scaleAnim = useState(new Animated.Value(0.8))[0];
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                setUser(storedUser);
            }
        };
        loadUser();
        loadMovieStats();

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

    useEffect(() => {
        if (isFocused) {
            loadMovieStats();
        }
    }, [isFocused]);

    const loadMovieStats = async () => {
        try {
            const totalResult = await db.getAllAsync("SELECT COUNT(*) as count FROM movies");
            const watchedResult = await db.getAllAsync("SELECT COUNT(*) as count FROM movies WHERE watched = 1");
            const unwatchedResult = await db.getAllAsync("SELECT COUNT(*) as count FROM movies WHERE watched = 0");
            const favoritesResult = await db.getAllAsync("SELECT COUNT(*) as count FROM movies WHERE rating >= 8");

            setMovieStats({
                total: totalResult[0].count,
                watched: watchedResult[0].count,
                unwatched: unwatchedResult[0].count,
                favorites: favoritesResult[0].count
            });
        } catch (error) {
            console.error('Error loading movie stats:', error);
        }
    };

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
        <View style={[styles.container, { backgroundColor: isDarkTheme ? '#0A0F1C' : '#F5F5F5' }]}>
            <View style={[styles.header, { backgroundColor: isDarkTheme ? '#1A1F2E' : '#FFFFFF' }]}>
                <View style={styles.welcomeContainer}>
                    <Text style={[styles.welcome, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>¡Hola,</Text>
                    <Text style={[styles.username, { color: '#FF6B6B' }]}>{user}!</Text>
                </View>
                <Text style={[styles.subtitle, { color: isDarkTheme ? '#8A8D9F' : '#666666' }]}>
                    Tu colección de películas te espera
                </Text>
            </View>

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
                    <View style={styles.menuGrid}>
                        <MenuCard
                            icon="account"
                            title="Perfil"
                            color="#FF6B6B"
                            onPress={() => navigation.navigate('Perfil')}
                        />

                        <MenuCard
                            icon="movie-plus"
                            title="Agregar Película"
                            color="#4ECDC4"
                            onPress={() => navigation.navigate('Películas', {
                                screen: 'AgregarPelicula'
                            })}
                        />

                        <MenuCard
                            icon="movie-search"
                            title="Ver Películas"
                            color="#45B7D1"
                            onPress={() => navigation.navigate('Películas', {
                                screen: 'ListaPeliculas'
                            })}
                        />
                    </View>

                    <View style={[styles.statsContainer, { backgroundColor: isDarkTheme ? '#1A1F2E' : '#FFFFFF' }]}>
                        <Text style={[styles.statsTitle, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>Tu Cine</Text>
                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
                                <Text style={[styles.statNumber, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>{movieStats.favorites}</Text>
                                <Text style={[styles.statLabel, { color: isDarkTheme ? '#8A8D9F' : '#666666' }]}>Favoritas</Text>
                            </View>
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="eye" size={24} color="#4ECDC4" />
                                <Text style={[styles.statNumber, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>{movieStats.watched}</Text>
                                <Text style={[styles.statLabel, { color: isDarkTheme ? '#8A8D9F' : '#666666' }]}>Vistas</Text>
                            </View>
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="clock" size={24} color="#FF6B6B" />
                                <Text style={[styles.statNumber, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>{movieStats.unwatched}</Text>
                                <Text style={[styles.statLabel, { color: isDarkTheme ? '#8A8D9F' : '#666666' }]}>Por ver</Text>
                            </View>
                        </View>
                        <View style={[styles.totalContainer, { borderTopColor: isDarkTheme ? '#2A2F3E' : '#E0E0E0' }]}>
                            <Text style={[styles.totalText, { color: '#FF6B6B' }]}>Total: {movieStats.total} películas</Text>
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
        paddingTop: 15,
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
    totalContainer: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#2A2F3E',
        alignItems: 'center',
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
});

export default HomeScreen;