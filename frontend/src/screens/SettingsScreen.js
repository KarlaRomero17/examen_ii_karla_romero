import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Button, Alert } from 'react-native';

const SettingsScreen = () => {
    const [notificacionesActivadas, setNotificacionesActivadas] = useState(true);
    const [modoOscuro, setModoOscuro] = useState(false);

    const handleCerrarSesion = () => {
        Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente.');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configuración</Text>

            <View style={styles.item}>
                <Text style={styles.label}>Notificaciones</Text>
                <Switch
                    value={notificacionesActivadas}
                    onValueChange={setNotificacionesActivadas}
                />
            </View>

            <View style={styles.item}>
                <Text style={styles.label}>Modo Oscuro</Text>
                <Switch
                    value={modoOscuro}
                    onValueChange={setModoOscuro}
                />
            </View>

            <View style={styles.separador} />

            <Text style={styles.seccion}>Cuenta</Text>

            <View style={styles.botones}>
                <Button title="Cambiar contraseña" onPress={() => Alert.alert('Funcionalidad', 'Aquí cambiarías tu contraseña.')} />
            </View>
            <View style={styles.botones}>
                <Button title="Cerrar sesión" color="#e74c3c" onPress={handleCerrarSesion} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEF4FF',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#2C3E50',
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
});

export default SettingsScreen;
