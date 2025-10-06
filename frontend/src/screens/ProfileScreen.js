import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/UserContext';
import { useSQLiteContext } from 'expo-sqlite';

const ProfileScreen = ({ isDarkTheme }) => {
    const navigation = useNavigation();
    const db = useSQLiteContext();
    const { user, setUser } = useContext(UserContext);

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        joinDate: '',
        movieStats: {
            total: 0,
            watched: 0,
            favorites: 0,
            recentlyAdded: 0
        }
    });

    const [recentMovies, setRecentMovies] = useState([]);

    useEffect(() => {
        loadUserData();
        loadMovieStats();
        loadRecentMovies();
    }, []);

    const loadUserData = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            const storedEmail = await AsyncStorage.getItem('userEmail') || 'cinéfilo@ejemplo.com';
            const joinDate = await AsyncStorage.getItem('userJoinDate') || new Date().toLocaleDateString();

            setUserData(prev => ({
                ...prev,
                username: storedUser || 'Cinéfilo',
                email: storedEmail,
                joinDate: joinDate
            }));
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const loadMovieStats = async () => {
        try {
            const totalResult = await db.getAllAsync("SELECT COUNT(*) as count FROM movies");
            const watchedResult = await db.getAllAsync("SELECT COUNT(*) as count FROM movies WHERE watched = 1");
            const favoritesResult = await db.getAllAsync("SELECT COUNT(*) as count FROM movies WHERE rating >= 8");
            const recentResult = await db.getAllAsync("SELECT COUNT(*) as count FROM movies WHERE created_at >= date('now', '-7 days')");

            setUserData(prev => ({
                ...prev,
                movieStats: {
                    total: totalResult[0].count,
                    watched: watchedResult[0].count,
                    favorites: favoritesResult[0].count,
                    recentlyAdded: recentResult[0].count
                }
            }));
        } catch (error) {
            console.error('Error loading movie stats:', error);
        }
    };

    const loadRecentMovies = async () => {
        try {
            const result = await db.getAllAsync(
                "SELECT * FROM movies ORDER BY created_at DESC LIMIT 3"
            );
            setRecentMovies(result);
        } catch (error) {
            console.error('Error loading recent movies:', error);
        }
    };

    const handleEditProfile = () => {
        Alert.alert(
            "Editar Perfil",
            "Esta funcionalidad estará disponible pronto",
            [{ text: "OK" }]
        );
    };

    const handleClearData = () => {
        Alert.alert(
            "Limpiar Datos",
            "¿Estás seguro de que quieres eliminar todas tus películas?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await db.execAsync("DELETE FROM movies");
                            loadMovieStats();
                            loadRecentMovies();
                            Alert.alert("✅ Éxito", "Todas las películas han sido eliminadas");
                        } catch (error) {
                            Alert.alert("❌ Error", "No se pudieron eliminar las películas");
                        }
                    }
                }
            ]
        );
    };

    const getMemberLevel = () => {
        const total = userData.movieStats.total;
        if (total >= 50) return { level: "Crítico Profesional", color: "#FFD700" };
        if (total >= 25) return { level: "Cinéfilo Avanzado", color: "#C0C0C0" };
        if (total >= 10) return { level: "Amante del Cine", color: "#CD7F32" };
        return { level: "Aficionado", color: "#8A8D9F" };
    };

    const memberLevel = getMemberLevel();

    return (
        <View style={[styles.container, { backgroundColor: isDarkTheme ? '#0A0F1C' : '#F5F5F5' }]}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Header del perfil */}
                <View style={[styles.header, { backgroundColor: isDarkTheme ? '#1A1F2E' : '#FFFFFF' }]}>
                    <View style={styles.avatarContainer}>
                        <MaterialCommunityIcons
                            name="account"
                            size={60}
                            color="#FF6B6B"
                        />
                        <View style={[styles.levelBadge, { backgroundColor: memberLevel.color }]}>
                            <Text style={styles.levelText}>{memberLevel.level}</Text>
                        </View>
                    </View>
                    <Text style={[styles.username, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>{userData.username}</Text>
                    <Text style={[styles.email, { color: isDarkTheme ? '#8A8D9F' : '#666666' }]}>{userData.email}</Text>
                    <Text style={[styles.joinDate, { color: isDarkTheme ? '#8A8D9F' : '#666666' }]}>
                        🎬 Miembro desde: {userData.joinDate}
                    </Text>
                </View>

                {/* Estadísticas principales */}
                <View style={[styles.statsContainer, { backgroundColor: isDarkTheme ? '#1A1F2E' : '#FFFFFF' }]}>
                    <Text style={[styles.statsTitle, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>Mi Colección</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="movie" size={24} color="#FF6B6B" />
                            <Text style={[styles.statNumber, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>{userData.movieStats.total}</Text>
                            <Text style={[styles.statLabel, { color: isDarkTheme ? '#8A8D9F' : '#666666' }]}>Total</Text>
                        </View>
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="eye-check" size={24} color="#4ECDC4" />
                            <Text style={[styles.statNumber, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>{userData.movieStats.watched}</Text>
                            <Text style={[styles.statLabel, { color: isDarkTheme ? '#8A8D9F' : '#666666' }]}>Vistas</Text>
                        </View>
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
                            <Text style={[styles.statNumber, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>{userData.movieStats.favorites}</Text>
                            <Text style={[styles.statLabel, { color: isDarkTheme ? '#8A8D9F' : '#666666' }]}>Favoritas</Text>
                        </View>
                    </View>
                </View>

                {/* Estadísticas secundarias */}
                <View style={styles.secondaryStats}>
                    <View style={[styles.secondaryStat, { backgroundColor: isDarkTheme ? '#1A1F2E' : '#FFFFFF' }]}>
                        <MaterialCommunityIcons name="calendar-plus" size={20} color="#45B7D1" />
                        <Text style={[styles.secondaryStatText, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>
                            {userData.movieStats.recentlyAdded} agregadas esta semana
                        </Text>
                    </View>
                    <View style={[styles.secondaryStat, { backgroundColor: isDarkTheme ? '#1A1F2E' : '#FFFFFF' }]}>
                        <MaterialCommunityIcons name="progress-clock" size={20} color="#FF6B6B" />
                        <Text style={[styles.secondaryStatText, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>
                            {userData.movieStats.total - userData.movieStats.watched} por ver
                        </Text>
                    </View>
                </View>

                {/* Películas recientes */}
                {recentMovies.length > 0 && (
                    <View style={[styles.recentMoviesContainer, { backgroundColor: isDarkTheme ? '#1A1F2E' : '#FFFFFF' }]}>
                        <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>Películas Recientes</Text>
                        {recentMovies.map((movie, index) => (
                            <View key={movie.id} style={[styles.recentMovieCard, { backgroundColor: isDarkTheme ? '#2A2F3E' : '#F8F9FA' }]}>
                                <View style={styles.movieInfo}>
                                    <Text style={[styles.movieTitle, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]} numberOfLines={1}>
                                        {movie.title}
                                    </Text>
                                    <Text style={[styles.movieDetails, { color: isDarkTheme ? '#8A8D9F' : '#666666' }]}>
                                        {movie.year} • {movie.genre}
                                        {movie.rating && ` • ⭐${movie.rating}`}
                                    </Text>
                                </View>
                                <MaterialCommunityIcons
                                    name={movie.watched === 1 ? "eye-check" : "eye-off"}
                                    size={20}
                                    color={movie.watched === 1 ? "#4ECDC4" : "#8A8D9F"}
                                />
                            </View>
                        ))}
                    </View>
                )}

                {/* Acciones */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
                        <MaterialCommunityIcons name="account-edit" size={20} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Editar Perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => navigation.navigate('Películas', { screen: 'AgregarPelicula' })}
                    >
                        <MaterialCommunityIcons name="movie-plus" size={20} color="#4ECDC4" />
                        <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                            Agregar Película
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.dangerButton]}
                        onPress={handleClearData}
                    >
                        <MaterialCommunityIcons name="delete-sweep" size={20} color="#DC3545" />
                        <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
                            Limpiar Colección
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Logros */}
                <View style={[styles.achievementsContainer, { backgroundColor: isDarkTheme ? '#1A1F2E' : '#FFFFFF' }]}>
                    <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#FFFFFF' : '#333333' }]}>Logros Cinéfilos</Text>
                    <View style={styles.achievementsGrid}>
                        <View style={styles.achievement}>
                            <MaterialCommunityIcons
                                name="trophy"
                                size={24}
                                color={userData.movieStats.total >= 10 ? "#FFD700" : "#8A8D9F"}
                            />
                            <Text style={[styles.achievementText, { color: isDarkTheme ? '#8A8D9F' : '#666666' }]}>Primeras 10</Text>
                        </View>
                        <View style={styles.achievement}>
                            <MaterialCommunityIcons
                                name="trophy-award"
                                size={24}
                                color={userData.movieStats.total >= 25 ? "#C0C0C0" : "#8A8D9F"}
                            />
                            <Text style={[styles.achievementText, { color: isDarkTheme ? '#8A8D9F' : '#666666' }]}>Coleccionista</Text>
                        </View>
                        <View style={styles.achievement}>
                            <MaterialCommunityIcons
                                name="crown"
                                size={24}
                                color={userData.movieStats.total >= 50 ? "#FF6B6B" : "#8A8D9F"}
                            />
                            <Text style={[styles.achievementText, { color: isDarkTheme ? '#8A8D9F' : '#666666' }]}>Expert@</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0F1C',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 30,
        paddingTop: 60,
        backgroundColor: '#1A1F2E',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    levelBadge: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    levelText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
        textAlign: 'center',
    },
    email: {
        fontSize: 16,
        color: '#8A8D9F',
        marginBottom: 10,
        textAlign: 'center',
    },
    joinDate: {
        fontSize: 14,
        color: '#8A8D9F',
        textAlign: 'center',
    },
    statsContainer: {
        backgroundColor: '#1A1F2E',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 16,
        padding: 20,
    },
    statsTitle: {
        fontSize: 18,
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
    secondaryStats: {
        marginHorizontal: 20,
        marginTop: 15,
        gap: 10,
    },
    secondaryStat: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1F2E',
        padding: 15,
        borderRadius: 12,
        gap: 12,
    },
    secondaryStatText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    recentMoviesContainer: {
        backgroundColor: '#1A1F2E',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 16,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
    },
    recentMovieCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2A2F3E',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    movieInfo: {
        flex: 1,
        marginRight: 10,
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    movieDetails: {
        fontSize: 12,
        color: '#8A8D9F',
    },
    actionsContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 12,
        gap: 10,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#2A2F3E',
    },
    dangerButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#DC3545',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#4ECDC4',
    },
    dangerButtonText: {
        color: '#DC3545',
    },
    achievementsContainer: {
        backgroundColor: '#1A1F2E',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 30,
        borderRadius: 16,
        padding: 20,
    },
    achievementsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    achievement: {
        alignItems: 'center',
        gap: 8,
    },
    achievementText: {
        fontSize: 12,
        color: '#8A8D9F',
        textAlign: 'center',
    },
});

export default ProfileScreen;