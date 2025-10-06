import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Animated,
    Dimensions,
    Alert
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isFocused3, setIsFocused3] = useState(false);
    const [isFocused4, setIsFocused4] = useState(false);
    const { setUser } = useContext(UserContext);
    const navigation = useNavigation();

    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(50))[0];

    React.useEffect(() => {
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

    const handleRegister = async () => {
        if (!username || !password || !confirmPassword || !email) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }
        
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Error', 'Por favor ingresa un email válido');
            return;
        }

        try {
            await AsyncStorage.setItem('user', username);
            await AsyncStorage.setItem('userEmail', email);
            await AsyncStorage.setItem('userJoinDate', new Date().toLocaleDateString());
            await AsyncStorage.setItem('token', 'faketoken12345');
            
            setUser({ username, email });

            Alert.alert(
                '¡Registro Exitoso!',
                `Bienvenido a CineApp, ${username}`,
                [
                    {
                        text: 'Comenzar',
                        onPress: () => navigation.replace('Main')
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'No se pudo completar el registro');
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const navigateToLogin = () => {
        navigation.navigate('Login');
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
                    <Text style={styles.subtitle}>Únete a nuestra comunidad cinéfila</Text>

                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Crear Cuenta</Text>

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
                                placeholder="Crea tu nombre de usuario"
                                placeholderTextColor="#999"
                                onFocus={() => setIsFocused1(true)}
                                onBlur={() => setIsFocused1(false)}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        borderColor: isFocused2 ? '#FF6B6B' : '#E0E0E0',
                                        backgroundColor: isFocused2 ? '#FFF' : '#F8F9FA'
                                    }
                                ]}
                                onChangeText={setEmail}
                                value={email}
                                placeholder="tu@email.com"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onFocus={() => setIsFocused2(true)}
                                onBlur={() => setIsFocused2(false)}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Contraseña</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        borderColor: isFocused3 ? '#FF6B6B' : '#E0E0E0',
                                        backgroundColor: isFocused3 ? '#FFF' : '#F8F9FA'
                                    }
                                ]}
                                placeholder="Mínimo 6 caracteres"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                onFocus={() => setIsFocused3(true)}
                                onBlur={() => setIsFocused3(false)}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Confirmar Contraseña</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        borderColor: isFocused4 ? '#FF6B6B' : '#E0E0E0',
                                        backgroundColor: isFocused4 ? '#FFF' : '#F8F9FA'
                                    }
                                ]}
                                placeholder="Repite tu contraseña"
                                placeholderTextColor="#999"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                onFocus={() => setIsFocused4(true)}
                                onBlur={() => setIsFocused4(false)}
                            />
                        </View>

                        {password.length > 0 && (
                            <View style={styles.passwordStrength}>
                                <Text style={styles.strengthLabel}>
                                    Fortaleza: {
                                        password.length < 6 ? 'Débil' :
                                        password.length < 8 ? 'Media' : 'Fuerte'
                                    }
                                </Text>
                                <View style={styles.strengthBar}>
                                    <View style={[
                                        styles.strengthFill,
                                        {
                                            width: `${Math.min((password.length / 12) * 100, 100)}%`,
                                            backgroundColor: 
                                                password.length < 6 ? '#FF6B6B' :
                                                password.length < 8 ? '#FFD166' : '#4ECDC4'
                                        }
                                    ]} />
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.button, (!username || !password || !confirmPassword || !email) && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={!username || !password || !confirmPassword || !email}
                        >
                            <MaterialCommunityIcons name="account-plus" size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Crear Cuenta</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginLink}
                            onPress={navigateToLogin}
                        >
                            <Text style={styles.loginText}>
                                ¿Ya tienes cuenta?{' '}
                                <Text style={styles.loginHighlight}>Inicia sesión aquí</Text>
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
        borderColor: '#4ECDC4',
        opacity: 0.5,
        transform: [
            { translateX: -70 },
            { translateY: -70 }
        ]
    },
    logo: {
        width: 70,
        height: 70,
        tintColor: '#4ECDC4',
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
        elevation: 8,
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
        elevation: 3,
    },
    passwordStrength: {
        marginBottom: 20,
    },
    strengthLabel: {
        fontSize: 14,
        color: '#8A8D9F',
        marginBottom: 5,
        textAlign: 'center',
    },
    strengthBar: {
        height: 4,
        backgroundColor: '#2A2F3E',
        borderRadius: 2,
        overflow: 'hidden',
    },
    strengthFill: {
        height: '100%',
        borderRadius: 2,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#4ECDC4',
        borderRadius: 12,
        height: 55,
        marginTop: 10,
        elevation: 6,
        gap: 8,
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
    loginLink: {
        marginTop: 20,
    },
    loginText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#8A8D9F',
    },
    loginHighlight: {
        color: '#4ECDC4',
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
        backgroundColor: '#4ECDC4',
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

export default RegisterScreen;