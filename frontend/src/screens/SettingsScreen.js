import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Button, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SettingsScreen = () => {
    const [darkMode, setDarkMode] = useState(false);

    const handleCerrarSesion = () => {
        Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente.');
    };


    useEffect(() => {
        const loadSetting = async () => {
            const storedDarkMode = await AsyncStorage.getItem('darkMode');
            if (storedDarkMode !== null) {
                setDarkMode(storedDarkMode === 'true');
            }
        }
        loadSetting();

    }, []);

    const toggleDarkMode = async () => {
        const newValue = !darkMode;
        setDarkMode(newValue);
        await AsyncStorage.setItem('darkMode', newValue.toString());

    }
    return (
        <View style={[styles.container, { backgroundColor: darkMode ? '#222' : '#EEF4FF' }]}>

            <Text style={[styles.title, { color: darkMode ? '#fff' : '#2C3E50' }]}>Configuración</Text>


            <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => { }}>
                <Icon name="user" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Editar perfil</Text>
            </TouchableOpacity>


            <View style={styles.spacer} />


            <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => { }}>
                <Icon name="bell" size={18} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>Notificaciones</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 }]} onPress={() => { }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="brush" size={18} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Preferencia de Tema</Text>
                </View>
                <Switch value={darkMode} onValueChange={toggleDarkMode} />
            </TouchableOpacity>

            <View style={styles.spacer} />


            <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => { }}>
                <Icon name="language" size={18} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>Idioma</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => Alert.alert('Funcionalidad', 'Aquí cambiarías tu contraseña.')} >
                <Icon name="lock" size={18} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>Cambiar contraseña</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => { }}>
                <Icon name="info" size={18} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>Acerca de la Aplicación</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignItems: 'center' }]} onPress={handleCerrarSesion}>
                <Icon name="door-open" size={18} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <TouchableOpacity style={[styles.buttonDeleteAcc, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => { }}>
                <Icon name="trash" size={18} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>Eliminar cuenta</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
    },
    label: {
        fontSize: 18,
        color: '#333',
    },
    seccion: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
        color: '#34495E',
    },
    botones: {
        marginBottom: 15,
    },
    separador: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 20,
    },
    button: {
        width: '100%',
        backgroundColor: '#005187',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonDeleteAcc: {
        width: '100%',
        backgroundColor: '#d9534f',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'center',
    },
    spacer: {
        height: 20,
    },
    icon: {
        marginRight: 10,
    },
});

export default SettingsScreen;
