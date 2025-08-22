import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { UserContext } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const { setUser } = useContext(UserContext);
    const navigation = useNavigation();

    const handleLogin = () => {
        //si falta algun campo
        if(!username || !password) {
            alert('Completa todos los campos');
            return;
        }

        setUser({username});
        //navegar a la pantalla de inicio
        navigation.navigate('Home');

    };
    return (
        <View style={styles.container}>

            <Image source={require('../../../assets/cat-logo.png')} style={styles.logo} />
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                style={[styles.input, { borderWidth: isFocused1 ? 3 : 1 }]}
                onChangeText={setUsername}
                value={username}
                placeholder="Nombre de usuario"
                onFocus={() => setIsFocused1(true)}
                onBlur={() => setIsFocused1(false)}
            />
            <TextInput
                style={[styles.input, { borderWidth: isFocused2 ? 3 : 1 }]}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setIsFocused2(true)}
                onBlur={() => setIsFocused2(false)}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText} >Ingresar</Text>

            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 150,
        backgroundColor: '#eaeeffff',
    },
    title: {

        fontSize: 30,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#005187',
    },
    input: {
        height: 50,
        borderColor: '#005187',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 10,
        width: '100%',
        fontSize: 18,
        alignSelf: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 50,
        alignSelf: 'center',
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
});
export default LoginScreen;