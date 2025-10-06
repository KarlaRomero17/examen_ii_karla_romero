import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState, useCallback, useRef } from 'react';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    RefreshControl,
    Animated,
    TextInput,
    Modal,
    Dimensions
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ListScreen = () => {
    const db = useSQLiteContext();
    const navigation = useNavigation();

    const [movies, setMovies] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [stats, setStats] = useState({ total: 0, watched: 0, unwatched: 0, averageRating: 0 });

    const searchTimeoutRef = useRef(null);

    // Cargar películas cuando cambian los filtros o búsqueda
    useFocusEffect(
        useCallback(() => {
            loadMovies();
        }, [filter, sortBy])
    );

    // Búsqueda con debounce
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            loadMovies();
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const loadMovies = async () => {
        try {
            let query = "SELECT * FROM movies";
            const params = [];

            if (filter === 'watched') {
                query += " WHERE watched = 1";
            } else if (filter === 'unwatched') {
                query += " WHERE watched = 0";
            }

            if (searchQuery.trim()) {
                query += filter !== 'all' ? " AND" : " WHERE";
                query += " (title LIKE ? OR genre LIKE ? OR director LIKE ?)";
                params.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
            }

            switch (sortBy) {
                case 'title':
                    query += " ORDER BY title ASC";
                    break;
                case 'year':
                    query += " ORDER BY year DESC";
                    break;
                case 'rating':
                    query += " ORDER BY rating DESC";
                    break;
                default:
                    query += " ORDER BY created_at DESC";
            }

            const result = await db.getAllAsync(query, params);
            setMovies(result);
            calculateStats(result);
        } catch (error) {
            console.error('Error cargando películas:', error);
        }
    };

    const calculateStats = (moviesList) => {
        const total = moviesList.length;
        const watched = moviesList.filter(m => m.watched === 1).length;
        const unwatched = total - watched;
        const ratings = moviesList.filter(m => m.rating);
        const averageRating = ratings.length > 0
            ? ratings.reduce((acc, m) => acc + m.rating, 0) / ratings.length
            : 0;

        setStats({ total, watched, unwatched, averageRating });
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadMovies();
        setRefreshing(false);
    }, []);

    const deleteMovie = async (id, title) => {
        Alert.alert(
            "Eliminar Película",
            `¿Estás seguro de que quieres eliminar "${title}"?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await db.runAsync("DELETE FROM movies WHERE id = ?", [id]);
                            loadMovies();
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar la película");
                        }
                    }
                }
            ]
        );
    };

    const toggleWatched = async (id, currentStatus, title) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            await db.runAsync("UPDATE movies SET watched = ? WHERE id = ?", [newStatus, id]);
            loadMovies();
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el estado");
        }
    };

    const getGenreColor = (genre) => {
        const genreColors = {
            'Acción': '#FF6B6B',
            'Drama': '#4ECDC4',
            'Comedia': '#FFD166',
            'Ciencia Ficción': '#45B7D1',
            'Terror': '#9B59B6',
            'Romance': '#E91E63',
            'Aventura': '#2ECC71',
            'Animación': '#F39C12',
            'Suspenso': '#34495E',
            'Fantasía': '#8E44AD',
            'Documental': '#95A5A6',
            'Musical': '#D35400'
        };
        return genreColors[genre] || '#8A8D9F';
    };

    const navigateToAddMovie = () => {
        navigation.navigate('Películas', { screen: 'AgregarPelicula' });
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const applyFilters = () => {
        setShowFiltersModal(false);
        loadMovies();
    };

    const MovieCard = ({ movie, index }) => {
        const fadeAnim = useState(new Animated.Value(0))[0];
        const slideAnim = useState(new Animated.Value(50))[0];

        useEffect(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    delay: index * 80,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    delay: index * 80,
                    useNativeDriver: true,
                })
            ]).start();
        }, []);

        return (
            <Animated.View
                style={[
                    styles.movieCard,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.titleSection}>
                        <Text style={styles.movieTitle} numberOfLines={2}>
                            {movie.title}
                        </Text>
                        <View style={styles.yearRating}>
                            <View style={styles.yearBadge}>
                                <Text style={styles.yearText}>{movie.year}</Text>
                            </View>
                            {movie.rating && (
                                <View style={styles.ratingBadge}>
                                    <MaterialCommunityIcons name="star" size={12} color="#FFD700" />
                                    <Text style={styles.ratingText}>{movie.rating}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.watchedButton, movie.watched === 1 && styles.watchedActive]}
                    >
                        <MaterialCommunityIcons
                            name={movie.watched === 1 ? "eye-check" : "eye-off"}
                            size={18}
                            color={movie.watched === 1 ? "#4ECDC4" : "#8A8D9F"}
                        />
                    </TouchableOpacity>
                </View>

                <View style={[styles.genreBadge, { backgroundColor: getGenreColor(movie.genre) }]}>
                    <Text style={styles.genreText}>{movie.genre}</Text>
                </View>

                <View style={styles.movieDetails}>
                    {movie.director && (
                        <View style={styles.detailRow}>
                            <MaterialCommunityIcons name="account" size={14} color="#8A8D9F" />
                            <Text style={styles.detailText} numberOfLines={1}>
                                {movie.director}
                            </Text>
                        </View>
                    )}

                    {movie.duration && (
                        <View style={styles.detailRow}>
                            <MaterialCommunityIcons name="clock-outline" size={14} color="#8A8D9F" />
                            <Text style={styles.detailText}>{movie.duration}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => navigation.navigate('Películas', {
                            screen: 'AgregarPelicula',
                            params: {
                                movieToEdit: movie // Pasamos toda la película como parámetro
                            }
                        })}
                    >
                        <MaterialCommunityIcons name="pencil" size={14} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => deleteMovie(movie.id, movie.title)}
                    >
                        <MaterialCommunityIcons name="delete" size={14} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header Compacto */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.headerLeft}>
                        <MaterialCommunityIcons name="movie-search" size={24} color="#FF6B6B" />
                        <Text style={styles.headerTitle}>Mi Biblioteca</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={navigateToAddMovie}
                    >
                        <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
                        <Text style={styles.addButtonText}>Crear</Text>
                    </TouchableOpacity>
                </View>

                {/* Barra de búsqueda integrada en header */}
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={18} color="#8A8D9F" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar películas..."
                        placeholderTextColor="#8A8D9F"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={clearSearch}>
                            <MaterialCommunityIcons name="close" size={18} color="#8A8D9F" />
                        </TouchableOpacity>
                    ) : null}
                </View>

                {/* Filtros rápidos en header */}
                <View style={styles.quickFilters}>
                    <TouchableOpacity
                        style={[styles.quickFilter, filter === 'all' && styles.quickFilterActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.quickFilterText, filter === 'all' && styles.quickFilterTextActive]}>
                            Todas
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.quickFilter, filter === 'watched' && styles.quickFilterActive]}
                        onPress={() => setFilter('watched')}
                    >
                        <MaterialCommunityIcons
                            name="eye-check"
                            size={14}
                            color={filter === 'watched' ? "#FFFFFF" : "#8A8D9F"}
                        />
                        <Text style={[styles.quickFilterText, filter === 'watched' && styles.quickFilterTextActive]}>
                            Vistas
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.quickFilter, filter === 'unwatched' && styles.quickFilterActive]}
                        onPress={() => setFilter('unwatched')}
                    >
                        <MaterialCommunityIcons
                            name="eye-off"
                            size={14}
                            color={filter === 'unwatched' ? "#FFFFFF" : "#8A8D9F"}
                        />
                        <Text style={[styles.quickFilterText, filter === 'unwatched' && styles.quickFilterTextActive]}>
                            Por ver
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.moreFiltersButton}
                        onPress={() => setShowFiltersModal(true)}
                    >
                        <MaterialCommunityIcons name="filter" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Estadísticas compactas */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.total}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.watched}</Text>
                    <Text style={styles.statLabel}>Vistas</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.unwatched}</Text>
                    <Text style={styles.statLabel}>Por ver</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                    </Text>
                    <Text style={styles.statLabel}>Rating</Text>
                </View>
            </View>

            {/* Lista de películas */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#FF6B6B']}
                        tintColor="#FF6B6B"
                    />
                }
                contentContainerStyle={[
                    styles.moviesGrid,
                    movies.length === 0 && styles.emptyContainer
                ]}
            >
                {movies.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="movie-off" size={60} color="#8A8D9F" />
                        <Text style={styles.emptyTitle}>
                            {searchQuery || filter !== 'all' ? 'No se encontraron películas' : 'Tu biblioteca está vacía'}
                        </Text>
                        <Text style={styles.emptyText}>
                            {searchQuery || filter !== 'all'
                                ? 'Intenta con otros términos de búsqueda o ajusta los filtros'
                                : 'Comienza agregando tu primera película a la colección'
                            }
                        </Text>
                        {!searchQuery && filter === 'all' && (
                            <TouchableOpacity
                                style={styles.addFirstButton}
                                onPress={navigateToAddMovie}
                            >
                                <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
                                <Text style={styles.addFirstButtonText}>Agregar Primera Película</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    movies.map((movie, index) => (
                        <MovieCard key={movie.id} movie={movie} index={index} />
                    ))
                )}
            </ScrollView>

            {/* Modal de filtros avanzados */}
            <Modal
                visible={showFiltersModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFiltersModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filtros y Ordenamiento</Text>
                            <TouchableOpacity onPress={() => setShowFiltersModal(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#8A8D9F" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalSection}>
                            <Text style={styles.modalSectionTitle}>Ordenar por</Text>
                            {['recent', 'title', 'year', 'rating'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.modalOption, sortBy === option && styles.modalOptionActive]}
                                    onPress={() => setSortBy(option)}
                                >
                                    <MaterialCommunityIcons
                                        name={
                                            option === 'recent' ? 'clock' :
                                                option === 'title' ? 'sort-alphabetical-ascending' :
                                                    option === 'year' ? 'calendar' : 'star'
                                        }
                                        size={20}
                                        color={sortBy === option ? "#FF6B6B" : "#8A8D9F"}
                                    />
                                    <Text style={[styles.modalOptionText, sortBy === option && styles.modalOptionTextActive]}>
                                        {option === 'recent' ? 'Más recientes' :
                                            option === 'title' ? 'Por título' :
                                                option === 'year' ? 'Por año' : 'Por rating'}
                                    </Text>
                                    {sortBy === option && (
                                        <MaterialCommunityIcons name="check" size={20} color="#FF6B6B" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                            <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0F1C',
    },
    header: {
        backgroundColor: '#1A1F2E',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 10,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 4,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2F3E',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 40,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
        marginLeft: 8,
        marginRight: 8,
    },
    quickFilters: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    quickFilter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2F3E',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    quickFilterActive: {
        backgroundColor: '#FF6B6B',
    },
    quickFilterText: {
        color: '#8A8D9F',
        fontSize: 12,
        fontWeight: '600',
    },
    quickFilterTextActive: {
        color: '#FFFFFF',
    },
    moreFiltersButton: {
        backgroundColor: '#2A2F3E',
        padding: 6,
        borderRadius: 8,
        marginLeft: 'auto',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#1A1F2E',
        marginHorizontal: 20,
        marginVertical: 15,
        borderRadius: 12,
        padding: 15,
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 10,
        color: '#8A8D9F',
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    moviesGrid: {
        paddingHorizontal: 15,
        paddingBottom: 20,
        gap: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyState: {
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 15,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 12,
        color: '#8A8D9F',
        textAlign: 'center',
        lineHeight: 16,
        marginBottom: 20,
    },
    addFirstButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        gap: 6,
    },
    addFirstButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    movieCard: {
        backgroundColor: '#1A1F2E',
        borderRadius: 12,
        padding: 15,
        borderLeftWidth: 3,
        borderLeftColor: '#FF6B6B',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    titleSection: {
        flex: 1,
        marginRight: 10,
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 6,
        lineHeight: 20,
    },
    yearRating: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    yearBadge: {
        backgroundColor: '#2A2F3E',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    yearText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FF6B6B',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2F3E',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 2,
    },
    ratingText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FFD700',
    },
    watchedButton: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: '#2A2F3E',
    },
    watchedActive: {
        backgroundColor: 'rgba(78, 205, 196, 0.2)',
    },
    genreBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 10,
    },
    genreText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    movieDetails: {
        gap: 6,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 12,
        color: '#8A8D9F',
        marginLeft: 6,
        flex: 1,
    },
    cardActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 8,
        borderRadius: 6,
        gap: 4,
    },
    editButton: {
        backgroundColor: '#4ECDC4',
    },
    deleteButton: {
        backgroundColor: '#DC3545',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1A1F2E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    modalSection: {
        marginBottom: 20,
    },
    modalSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#2A2F3E',
        marginBottom: 8,
    },
    modalOptionActive: {
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        borderColor: '#FF6B6B',
        borderWidth: 1,
    },
    modalOptionText: {
        flex: 1,
        fontSize: 14,
        color: '#8A8D9F',
        marginLeft: 12,
    },
    modalOptionTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    applyButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ListScreen;