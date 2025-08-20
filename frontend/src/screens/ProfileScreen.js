import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
                style={styles.avatar}
            />

            <Text style={styles.nombre}>Karla Romero</Text>
            <Text style={styles.dato}>Correo: karla.romero18@itca.edu.sv</Text>
            <Text style={styles.dato}>Teléfono: +503 1111-2235</Text>
            <Text style={styles.dato}>Especialidad: Tecnico Informatico</Text>
            <Text style={styles.dato}>Dirección: San Salvador, El Salvador</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F8FF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 20,
    },
    nombre: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 10,
    },
    dato: {
        fontSize: 16,
        color: '#34495E',
        marginBottom: 6,
    },
});

export default ProfileScreen;
