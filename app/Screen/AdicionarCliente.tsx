import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { db } from "../config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function AdicionarCliente() {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");

  const navigation = useNavigation();

  const salvarCliente = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "O nome é obrigatório.");
      return;
    }

    await addDoc(collection(db, "clientes"), {
      nome,
      endereco,
      telefone,
      cidade,
      totalDivida: 0,
      totalPago: 0,
      historico: [],
    });

    Alert.alert("Sucesso", "Cliente adicionado!");
    navigation.goBack(); // volta para a tela anterior
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Novo Cliente</Text>

      <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
      <TextInput placeholder="Endereço" style={styles.input} value={endereco} onChangeText={setEndereco} />
      <TextInput placeholder="Telefone" style={styles.input} value={telefone} onChangeText={setTelefone} />
      <TextInput placeholder="Cidade" style={styles.input} value={cidade} onChangeText={setCidade} />

      <Button title="Salvar" onPress={salvarCliente} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
