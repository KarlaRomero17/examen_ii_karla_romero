import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';

const AppointmentScreen = () => {
    const [appointments, setAppointments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // Campos del formulario
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [paciente, setPaciente] = useState('');
    const [motivo, setMotivo] = useState('');

    const addAppointment = () => {
        if (!fecha || !hora || !paciente || !motivo) {
            alert('Por favor, complete todos los campos');  
            return;
        }
        const nuevaCita = {
            id: Date.now().toString(),
            fecha,
            hora,
            paciente,
            motivo,
        };
        setAppointments([...appointments, nuevaCita]);
        setModalVisible(false); 
        setFecha('');
        setHora('');
        setPaciente('');
        setMotivo('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Citas Programadas</Text>

            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ width: '100%' }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardText}><Text style={styles.bold}>Fecha:</Text> {item.fecha}</Text>
                        <Text style={styles.cardText}><Text style={styles.bold}>Hora:</Text> {item.hora}</Text>
                        <Text style={styles.cardText}><Text style={styles.bold}>Paciente:</Text> {item.paciente}</Text>
                        <Text style={styles.cardText}><Text style={styles.bold}>Motivo:</Text> {item.motivo}</Text>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Nueva Cita</Text>
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Agregar Nueva Cita</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={fecha}
                            onChangeText={setFecha}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="HH:MM AM/PM"
                            value={hora}
                            onChangeText={setHora}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Paciente"
                            value={paciente}
                            onChangeText={setPaciente}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Motivo"
                            value={motivo}
                            onChangeText={setMotivo}
                        />

                        <View style={styles.modalButtons}>

                            <TouchableOpacity style={styles.addButtonApp} onPress={() => setModalVisible(addAppointment)}>
                                <Text style={styles.addButtonText}>Agregar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.cancelButtonApp} onPress={() => setModalVisible(false)}>
                                <Text style={styles.addButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 30,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#005187',
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 4,
        color: '#333',
    },
    bold: {
        fontWeight: 'bold',
    },
    addButton: {
        width: '100%',
        backgroundColor: '#6a0dad',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#6a0dad',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    cancelButtonApp: {
        width: '40%',
        backgroundColor: '#6a0dad',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonApp: {
        width: '40%',
        backgroundColor: '#6a0dad',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
});

export default AppointmentScreen;
