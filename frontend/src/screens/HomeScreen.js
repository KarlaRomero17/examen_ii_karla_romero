//importaciones
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

//nuestro componente principal
const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido a la Clínica
                Pediátrica Karla Romero</Text>

            <TouchableOpacity style={styles.button} onPress={() => { }}>
                <Text style={styles.buttonText} >Perfil</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <TouchableOpacity style={styles.button} onPress={() => { }}>
                <Text style={styles.buttonText} >Configuración</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <TouchableOpacity style={styles.button} onPress={() => { }}>
                <Text style={styles.buttonText} >Citas</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <TouchableOpacity style={styles.button} onPress={() => { }}>
                <Text style={styles.buttonText} >Historial Médico</Text>
            </TouchableOpacity>
            <View style={styles.spacer} />

            <TouchableOpacity style={styles.buttonDanger} onPress={() => { }}>
                <Text style={styles.buttonText} >Cerrar Sesion</Text>
            </TouchableOpacity>
        </View>
    );
};

//constantes de estilo
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 30,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#005187',
    },
    spacer: {
        height: 20,
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
      buttonDanger: {
        width: '100%',
        backgroundColor: '#d9534f',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'center',
    },
});
//exportamos nuestro componente
export default HomeScreen;