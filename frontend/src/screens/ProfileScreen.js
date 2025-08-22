import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ProfileScreen = () => {

    // const rolActual = 'Administrador'; 
    // const rolActual = 'Usuario';
    const rolActual = 'Paciente';

    return (
        <View style={[
            styles.container, 
            rolActual === 'Paciente' && styles.containerPaciente
        ]}>
            <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
                style={styles.avatar}
            />

            <Text style={[
                styles.title,
                rolActual === 'Paciente' && { color: '#C2185B' }
            ]}>
                Perfil del {rolActual}
            </Text>


            {rolActual === 'Administrador' && (
                <>
                    <View style={styles.card}>
                        <Icon name="user" size={16} color="#005187" style={styles.icon} />
                        <Text style={styles.cardText}>Nombre: Lissette Romero</Text>
                    </View>
                    <View style={styles.card}>
                        <Icon name="briefcase" size={16} color="#005187" style={styles.icon} />
                        <Text style={styles.cardText}>Rol: Administrador</Text>
                    </View>
                    <View style={styles.card}>
                        <Icon name="envelope" size={16} color="#005187" style={styles.icon} />
                        <Text style={styles.cardText}>Correo: karla.romero18@itca.edu.sv</Text>
                    </View>
                </>
            )}

            {rolActual === 'Usuario' && (
                <>
                    <View style={styles.card}>
                        <Icon name="user" size={16} color="#005187" style={styles.icon} />
                        <Text style={styles.cardText}>Nombre: Karla Romero</Text>
                    </View>
                    <View style={styles.card}>
                        <Icon name="graduation-cap" size={16} color="#005187" style={styles.icon} />
                        <Text style={styles.cardText}>Especialidad: Técnico Informático</Text>
                    </View>
                    <View style={styles.card}>
                        <Icon name="envelope" size={16} color="#005187" style={styles.icon} />
                        <Text style={styles.cardText}>Correo: karla.romero18@itca.edu.sv</Text>
                    </View>
                </>
            )}

            {rolActual === 'Paciente' && (
                <>
                    {/* Aquí diseño diferente */}
                    <View style={[styles.card, styles.cardPaciente]}>
                        <Icon name="user-injured" size={16} color="#C2185B" style={styles.icon} />
                        <Text style={styles.cardText}>Nombre: Karla Abelino</Text>
                    </View>
                    <View style={[styles.card, styles.cardPaciente]}>
                        <Icon name="calendar" size={16} color="#C2185B" style={styles.icon} />
                        <Text style={styles.cardText}>Edad: 25 años</Text>
                    </View>
                    <View style={[styles.card, styles.cardPaciente]}>
                        <Icon name="heartbeat" size={16} color="#C2185B" style={styles.icon} />
                        <Text style={styles.cardText}>Condición: Asma</Text>
                    </View>

                    <Text style={[
                        styles.title, 
                        { color: '#C2185B', marginTop: 20 }
                    ]}>
                        Información del Responsable
                    </Text>

                    <View style={[styles.card, styles.cardPaciente]}>
                        <Icon name="user" size={16} color="#C2185B" style={styles.icon} />
                        <Text style={styles.cardText}>Nombre: Dalia Abelino</Text>
                    </View>
                    <View style={[styles.card, styles.cardPaciente]}>
                        <Icon name="phone" size={16} color="#C2185B" style={styles.icon} />
                        <Text style={styles.cardText}>Teléfono: +503 6215-7777</Text>
                    </View>
                    <View style={[styles.card, styles.cardPaciente]}>
                        <Icon name="heart" size={16} color="#C2185B" style={styles.icon} />
                        <Text style={styles.cardText}>Relación: Madre</Text>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFF0FF',
        alignItems: 'center',
        padding: 20,
    },
    containerPaciente: {
        backgroundColor: '#FCE4EC',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginTop: 40,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#005187',
        marginBottom: 25,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    cardPaciente: {
        borderLeftWidth: 5,
        borderLeftColor: '#C2185B',
    },
    icon: {
        marginRight: 10,
    },
    cardText: {
        fontSize: 16,
        color: '#34495E',
    },
});

export default ProfileScreen;
