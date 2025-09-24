
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, FlatList, TouchableOpacity, Alert } from
    'react-native';

const PatientsScreen = () => {
    const db = useSQLiteContext();
    const [inputText, setInputText] = useState('');
    const [patients, setPatients] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [editingId, setEditingId] = useState(null);

    //mostrar
    useEffect(() => {
        loadPatients();

    }, []);

    const loadPatients = async () => {
        const result = await db.getAllAsync("SELECT * FROM patients");
        setPatients(result);
    }

    const addPatient = async () => {
        if (inputText.trim()) {
            if (editingId) { //editando
                await db.runAsync("UPDATE patients SET name = ? WHERE id = ? ",
                    [inputText, editingId]
                );
                setEditingId(null);
                Alert.alert("Exito", "Paciente actualizado con éxito");
            } else {//agregando
                await db.runAsync("INSERT INTO patients (name) VALUES (?) ",
                    [inputText]
                );

                Alert.alert("Exito", "Paciente agregado con éxito");
            }
            setInputText("");
            loadPatients();

        } else {
            Alert.alert("Error", "El nombre no puede estar vacio");
        }

    }

    const editPatient = (id) => {
        const patientToEdit = patients.find(patient => patient.id === id);
        if (patientToEdit) {
            setInputText(patientToEdit.name);
            setEditingId(id);
        }

    }
    const deletePatient = async (id) => {
        await db.runAsync("DELETE FROM patients WHERE id = ?", [id]);
        loadPatients();

        Alert.alert("Exito", "Paciente eliminado con éxito");
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Gestión de pacientes</Text>
            <TextInput
                style={[styles.input, { borderWidth: isFocused ? 3 : 1 }]}
                placeholder='Nombre del paciente'
                value={inputText}
                onChangeText={setInputText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />

            <TouchableOpacity style={styles.addButton} onPress={addPatient}>
                <Text style={styles.addButtonText} >
                    {editingId ? "Actualizar Paciente" : "Agregar Paciente"}
                </Text>

            </TouchableOpacity>

            <Text style={styles.counter}> Pacientes registrados: {patients.length}
            </Text>

            <FlatList
                data={patients}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ alignItems: 'center', width: '100%' }}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.editButton} onPress={() => editPatient(item.id)}>
                                <Text style={styles.addButtonText} >Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => deletePatient(item.id)}>
                                <Text style={styles.addButtonText} >Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

        </View >
    )
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#fcffff',
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
    },
    addButton: {
        width: '100%',
        backgroundColor: '#005187',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    counter: {
        margin: 15,
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemContainer: {
        padding: 10,
        margin: 10,
        backgroundColor: '#b4b0b0ff',
        borderRadius: 5,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 18,
        margin: 10,
        flexWrap: 'wrap',
        fontWeight: 'bold',
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 10,
    },
    editButton: {
        backgroundColor: '#e4ab02ff',
        padding: 10,
        width: '40%',
        borderRadius: 5,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 10,
        width: '40%',
        borderRadius: 5,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },

});


export default PatientsScreen;