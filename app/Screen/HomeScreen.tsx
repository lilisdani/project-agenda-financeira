import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

interface Cliente {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  cidade: string;
  totalDivida: number;
  totalPago: number;
  historico: { tipo: string; valor: number; data: string; produto?: string }[];
}

export default function HomeScreen() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const carregarClientes = async () => {
    const snapshot = await getDocs(collection(db, "clientes"));
    const lista: Cliente[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (data.nome) {
        const cliente: Cliente = {
          id: docSnap.id,
          ...data,
        } as Cliente;
        lista.push(cliente);
      }
    }

    setClientes(lista);
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Eco Belle</Text>

      <View style={styles.header}>
        <TextInput
          style={styles.input}
          placeholder="Buscar cliente por nome"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <FlatList
        data={clientesFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              navigation.navigate("ClienteDetalhes", {
                clienteId: item.id,
              });
            }}
          >
            <Text style={styles.nomeCliente}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => navigation.navigate("AdicionarCliente")}
      >
        <Text style={styles.botaoTexto}>+ Adicionar Novo Cliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#3b3326",
  },
  header: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  nomeCliente: {
    fontSize: 18,
    color: "#333",
  },
  botaoAdicionar: {
    backgroundColor: "#6c8262",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
