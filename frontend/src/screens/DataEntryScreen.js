import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import React from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DataEntryScreen = () => {
    const db = useSQLiteContext();
    const navigation = useNavigation();
    const route = useRoute();

    const movieToEdit = route.params?.movieToEdit;

    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [year, setYear] = useState('');
    const [rating, setRating] = useState('');
    const [director, setDirector] = useState('');
    const [duration, setDuration] = useState('');
    const [watched, setWatched] = useState(false);

    const [isFocused, setIsFocused] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (movieToEdit) {
            console.log('Cargando película para editar:', movieToEdit);
            setTitle(movieToEdit.title || '');
            setGenre(movieToEdit.genre || '');
            setYear(movieToEdit.year ? movieToEdit.year.toString() : '');
            setRating(movieToEdit.rating ? movieToEdit.rating.toString() : '');
            setDirector(movieToEdit.director || '');
            setDuration(movieToEdit.duration || '');
            setWatched(movieToEdit.watched === 1);
            setEditingId(movieToEdit.id);
        } else {

            resetForm();
        }
    }, [movieToEdit]);

    const addMovie = async () => {
        console.log('Validando datos...', { title, genre, year, rating, editingId });


        if (!title.trim()) {
            Alert.alert("Error", "El título es obligatorio");
            return;
        }
        if (!genre.trim()) {
            Alert.alert("Error", "El género es obligatorio");
            return;
        }
        if (!year.trim()) {
            Alert.alert("Error", "El año es obligatorio");
            return;
        }

        // Validar año
        const yearNumber = parseInt(year);
        if (isNaN(yearNumber)) {
            Alert.alert("Error", "El año debe ser un número válido");
            return;
        }
        if (yearNumber < 1900 || yearNumber > 2030) {
            Alert.alert("Error", "El año debe estar entre 1900 y 2030");
            return;
        }

        // Validar rating
        let ratingNumber = null;
        if (rating.trim()) {
            ratingNumber = parseFloat(rating);
            if (isNaN(ratingNumber)) {
                Alert.alert("Error", "El rating debe ser un número válido");
                return;
            }
            if (ratingNumber < 0 || ratingNumber > 10) {
                Alert.alert("Error", "El rating debe estar entre 0 y 10");
                return;
            }
        }

        try {
            const params = [
                title.trim(),
                genre.trim(),
                yearNumber,
                ratingNumber,
                director.trim(),
                duration.trim(),
                watched ? 1 : 0
            ];

            console.log('Parámetros para SQL:', params);

            if (editingId) {
                params.push(editingId);
                await db.runAsync(
                    "UPDATE movies SET title=?, genre=?, year=?, rating=?, director=?, duration=?, watched=? WHERE id=?",
                    params
                );
                Alert.alert("🎬 Éxito", "Película actualizada con éxito");
            } else {
                await db.runAsync(
                    "INSERT INTO movies (title, genre, year, rating, director, duration, watched) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    params
                );
                Alert.alert("🎬 Éxito", "Película agregada con éxito");
            }

            resetForm();

            setTimeout(() => {
                navigation.navigate('Películas', { screen: 'ListaPeliculas' });
            }, 1500);

        } catch (error) {
            console.error('Error guardando película:', error);
            Alert.alert("❌ Error", "No se pudo guardar la película");
        }
    };

    const resetForm = () => {
        setTitle('');
        setGenre('');
        setYear('');
        setRating('');
        setDirector('');
        setDuration('');
        setWatched(false);
        setEditingId(null);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='height'
        >
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <View style={styles.headerIcon}>
                        <MaterialCommunityIcons
                            name={editingId ? "movie-edit" : "movie-plus"}
                            size={32}
                            color="#FF6B6B"
                        />
                    </View>
                    <Text style={styles.title}>
                        {editingId ? 'Editar Película' : 'Agregar Película'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {editingId ? 'Modifica los datos de tu película' : 'Completa la información de tu nueva película'}
                    </Text>

                    {editingId && (
                        <Text style={styles.editingId}>Editando: {title}</Text>
                    )}
                </View>

                <View style={styles.formContainer}>
                    <TextInput
                        style={[styles.input, { borderColor: isFocused ? '#FF6B6B' : '#2A2F3E' }]}
                        placeholder='Título de la película'
                        placeholderTextColor="#8A8D9F"
                        value={title}
                        onChangeText={setTitle}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />

                    <TextInput
                        style={[styles.input, { borderColor: isFocused ? '#FF6B6B' : '#2A2F3E' }]}
                        placeholder='Género (Ej: Drama, Acción, Comedia)'
                        placeholderTextColor="#8A8D9F"
                        value={genre}
                        onChangeText={setGenre}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />

                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.halfInput, { borderColor: isFocused ? '#FF6B6B' : '#2A2F3E' }]}
                            placeholder='Año'
                            placeholderTextColor="#8A8D9F"
                            value={year}
                            onChangeText={(text) => {
                                const numericText = text.replace(/[^0-9]/g, '');
                                setYear(numericText);
                            }}
                            keyboardType="numeric"
                            maxLength={4}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />

                        <TextInput
                            style={[styles.input, styles.halfInput, { borderColor: isFocused ? '#FF6B6B' : '#2A2F3E' }]}
                            placeholder='Rating (0-10)'
                            placeholderTextColor="#8A8D9F"
                            value={rating}
                            onChangeText={(text) => {
                                const numericText = text.replace(/[^0-9.]/g, '');
                                const parts = numericText.split('.');
                                if (parts.length > 2) {
                                    setRating(parts[0] + '.' + parts[1]);
                                } else {
                                    setRating(numericText);
                                }
                            }}
                            keyboardType="decimal-pad"
                            maxLength={4}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    </View>

                    <TextInput
                        style={[styles.input, { borderColor: isFocused ? '#FF6B6B' : '#2A2F3E' }]}
                        placeholder='Director'
                        placeholderTextColor="#8A8D9F"
                        value={director}
                        onChangeText={setDirector}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />

                    <TextInput
                        style={[styles.input, { borderColor: isFocused ? '#FF6B6B' : '#2A2F3E' }]}
                        placeholder='Duración (ej: 120 min)'
                        placeholderTextColor="#8A8D9F"
                        value={duration}
                        onChangeText={setDuration}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setWatched(!watched)}
                    >
                        <View style={[styles.checkbox, watched && styles.checkboxChecked]}>
                            {watched && (
                                <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                            )}
                        </View>
                        <Text style={styles.checkboxLabel}>
                            {watched ? 'Ya vi esta película' : '👀 Marcar como vista'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.formButtons}>
                        <TouchableOpacity
                            style={[styles.primaryButton, editingId && styles.editButton]}
                            onPress={addMovie}
                        >
                            <MaterialCommunityIcons
                                name={editingId ? "content-save" : "plus"}
                                size={20}
                                color="#FFFFFF"
                            />
                            <Text style={styles.primaryButtonText}>
                                {editingId ? "Guardar Cambios" : "Agregar Película"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => {
                                resetForm();
                                navigation.goBack();
                            }}
                        >
                            <MaterialCommunityIcons name="close" size={20} color="#8A8D9F" />
                            <Text style={styles.secondaryButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        padding: 25,
        paddingTop: 40,
    },
    headerIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1A1F2E',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#8A8D9F',
        textAlign: 'center',
    },
    editingId: {
        fontSize: 12,
        color: '#8A8D9F',
        marginTop: 5,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    formContainer: {
        backgroundColor: '#1A1F2E',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 25,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        backgroundColor: '#2A2F3E',
        borderWidth: 2,
        borderRadius: 12,
        marginBottom: 15,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#FFFFFF',
    },
    halfInput: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#8A8D9F',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#FF6B6B',
        borderColor: '#FF6B6B',
    },
    checkboxLabel: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    formButtons: {
        gap: 10,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B6B',
        borderRadius: 12,
        height: 55,
        paddingHorizontal: 20,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#2A2F3E',
        borderRadius: 12,
        height: 50,
        paddingHorizontal: 20,
    },
    secondaryButtonText: {
        color: '#8A8D9F',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default DataEntryScreen;