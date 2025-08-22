import { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const ClinicalHistoryScreen = () => {
  const [history, setHistory] = useState([
    {
      id: "1",
      fecha: "2024-08-01",
      diagnostico: "Fiebre",
      tratamiento: "Paracetamol",
      notas: "Revisión en una semana",
    },
    {
      id: "2",
      fecha: "2024-07-15",
      diagnostico: "Gripe",
      tratamiento: "Reposo e hidratación",
      notas: "Tomar líquidos abundantes",
    },
    {
      id: "3",
      fecha: "2024-06-10",
      diagnostico: "Alergia",
      tratamiento: "Antihistamínicos",
      notas: "Evitar alérgenos conocidos",
    },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historia Clínica</Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ width: "100%" }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardDate}>{item.fecha}</Text>
            <Text style={styles.cardText}>
              <Text style={styles.bold}>Diagnóstico: </Text>
              {item.diagnostico}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.bold}>Tratamiento: </Text>
              {item.tratamiento}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.bold}>Notas: </Text>
              {item.notas}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#EDEDED",
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    width: "100%",
  },
  cardDate: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  cardText: {
    fontSize: 15,
    marginBottom: 4,
    color: "#444",
  },
  bold: {
    fontWeight: "bold",
  },
});

export default ClinicalHistoryScreen;
