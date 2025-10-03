import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    ScrollView,
    Animated,
    Dimensions
} from 'react-native';
import { UserContext } from '../context/UserContext';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const { setUser } = useContext(UserContext);
    const navigation = useNavigation();

    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(50))[0];

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                navigation.replace('Main');
            }
        };
        checkToken();

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleLogin = async () => {
        if (username && password) {
            await AsyncStorage.setItem('user', username);
            await AsyncStorage.setItem('token', 'faketoken12345');
            setUser({ username });
            navigation.replace('Main');
        } else {
            alert('Debe ingresar usuario y contraseña');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="height"
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoBackground}>
                            <Image
                                source={require('../../../assets/film.png')}
                                style={styles.logo}
                            />
                        </View>
                        <View style={styles.cameraEffect} />
                    </View>

                    <Text style={styles.title}>CineApp</Text>
                    <Text style={styles.subtitle}>Tu cine en el bolsillo</Text>

                    {/* Formulario */}
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Iniciar Sesión</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Usuario</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        borderColor: isFocused1 ? '#FF6B6B' : '#E0E0E0',
                                        backgroundColor: isFocused1 ? '#FFF' : '#F8F9FA'
                                    }
                                ]}
                                onChangeText={setUsername}
                                value={username}
                                placeholder="Ingresa tu usuario"
                                placeholderTextColor="#999"
                                onFocus={() => setIsFocused1(true)}
                                onBlur={() => setIsFocused1(false)}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Contraseña</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        borderColor: isFocused2 ? '#FF6B6B' : '#E0E0E0',
                                        backgroundColor: isFocused2 ? '#FFF' : '#F8F9FA'
                                    }
                                ]}
                                placeholder="Ingresa tu contraseña"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                onFocus={() => setIsFocused2(true)}
                                onBlur={() => setIsFocused2(false)}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, (!username || !password) && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={!username || !password}
                        >
                            <Text style={styles.buttonText}>Ingresar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.registerLink}
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={styles.registerText}>
                                ¿No tienes cuenta?{' '}
                                <Text style={styles.registerHighlight}>Regístrate aquí</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer decorativo */}
                    <View style={styles.footer}>
                        <View style={styles.filmStrip}>
                            <View style={styles.filmHole} />
                            <View style={styles.filmHole} />
                            <View style={styles.filmHole} />
                            <View style={styles.filmHole} />
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0F1C',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 25,
        paddingTop: 30,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center', 
        marginBottom: 20,
        width: '100%',
        height: 150,
        position: 'relative',
    },
    logoBackground: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#1A1F2E',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
    },
    cameraEffect: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: '#FF6B6B',
        opacity: 0.5,
        transform: [
            { translateX: -70 },
            { translateY: -70 }
        ]
    },
    logo: {
        width: 70,
        height: 70,
        tintColor: '#FF6B6B',
    },

    title: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF',
        marginBottom: 5,
        fontFamily: 'sans-serif',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#8A8D9F',
        marginBottom: 40,
        fontWeight: '300',
    },
    formContainer: {
        backgroundColor: '#1A1F2E',
        borderRadius: 20,
        padding: 15,
        elevation: 8, // Android sombra
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 25,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
        marginLeft: 5,
    },
    input: {
        height: 55,
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#333333',
        backgroundColor: '#F8F9FA',
        elevation: 3, // Android sombra
    },
    button: {
        width: '100%',
        backgroundColor: '#FF6B6B',
        borderRadius: 12,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        elevation: 6, // Android sombra
    },
    buttonDisabled: {
        backgroundColor: '#8A8D9F',
        elevation: 0,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    registerLink: {
        marginTop: 20,
    },
    registerText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#8A8D9F',
    },
    registerHighlight: {
        color: '#FF6B6B',
        fontWeight: 'bold',
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
    },
    filmStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.6,
        height: 4,
        backgroundColor: '#FF6B6B',
        borderRadius: 2,
    },
    filmHole: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0A0F1C',
        marginTop: -2,
    },
});

export default LoginScreen;
