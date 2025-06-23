
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


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

export default function ClienteDetalhes() {
  const navigation = useNavigation();
  const route = useRoute();
  const { clienteId }: any = route.params;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [novaCompra, setNovaCompra] = useState("");
  const [novoPagamento, setNovoPagamento] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");

  useEffect(() => {
    atualizarCliente();
  }, []);

  const atualizarCliente = async () => {
    const ref = doc(db, "clientes", clienteId);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      const dados = docSnap.data();
      setCliente({
        id: clienteId,
        nome: dados.nome,
        endereco: dados.endereco,
        telefone: dados.telefone,
        cidade: dados.cidade,
        totalDivida: dados.totalDivida,
        totalPago: dados.totalPago,
        historico: dados.historico || [],
      });
    }
  };

  const adicionarCompra = async () => {
    const valor = parseFloat(novaCompra);
    if (!isNaN(valor) && nomeProduto.trim() !== "" && cliente) {
      Alert.alert(
        "Confirmar compra",
        `Você está adicionando uma compra de R$ ${valor.toFixed(2)} para o produto "${nomeProduto}".\n\nDeseja confirmar?`,
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Confirmar",
            onPress: async () => {
              const ref = doc(db, "clientes", cliente.id);
              await updateDoc(ref, {
                totalDivida: cliente.totalDivida + valor,
                historico: arrayUnion({
                  tipo: "compra",
                  valor,
                  produto: nomeProduto,
                  data: new Date().toISOString().split("T")[0],
                }),
              });
              setNovaCompra("");
              setNomeProduto("");
              atualizarCliente();
            },
          },
        ]
      );
    }
  };

  const adicionarPagamento = async () => {
    const valor = parseFloat(novoPagamento);
    if (!isNaN(valor) && cliente) {
      Alert.alert(
        "Confirmar pagamento",
        `Você está adicionando um pagamento de R$ ${valor.toFixed(2)}.\n\nDeseja confirmar?`,
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Confirmar",
            onPress: async () => {
              const ref = doc(db, "clientes", cliente.id);
              await updateDoc(ref, {
                totalPago: cliente.totalPago + valor,
                historico: arrayUnion({
                  tipo: "pagamento",
                  valor,
                  data: new Date().toISOString().split("T")[0],
                }),
              });
              setNovoPagamento("");
              atualizarCliente();
            },
          },
        ]
      );
    }
  };

  if (!cliente) {
    return (
      <View style={styles.container}>
        <Text>Carregando dados do cliente...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.nome}>{cliente.nome}</Text>
      <Text>Endereço: {cliente.endereco}</Text>
      <Text>Telefone: {cliente.telefone}</Text>
      <Text>Cidade: {cliente.cidade}</Text>
      <Text>Total Dívida: R$ {cliente.totalDivida.toFixed(2)}</Text>
      <Text>Total Pago: R$ {cliente.totalPago.toFixed(2)}</Text>

      <Text style={styles.section}>Nova Compra</Text>
      <TextInput
        style={styles.input}
        value={nomeProduto}
        onChangeText={setNomeProduto}
        placeholder="Nome do produto"
      />
      <TextInput
        style={styles.input}
        value={novaCompra}
        onChangeText={setNovaCompra}
        placeholder="Valor da compra"
        keyboardType="numeric"
      />
      <Button title="Adicionar Compra" onPress={adicionarCompra} />

      <Text style={styles.section}>Novo Pagamento</Text>
      <TextInput
        style={styles.input}
        value={novoPagamento}
        onChangeText={setNovoPagamento}
        placeholder="Valor do pagamento"
        keyboardType="numeric"
      />
      <Button title="Adicionar Pagamento" onPress={adicionarPagamento} />

      <Text style={styles.section}>Histórico</Text>
      {cliente.historico.slice().reverse().map((item, index) => (
        <View key={index} style={styles.historicoItem}>
          <Text>
            {item.data} - {item.tipo === "compra" ? "Compra" : "Pagamento"} - R$ {item.valor.toFixed(2)}{" "}
            {item.produto ? `(${item.produto})` : ""}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  nome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  section: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  historicoItem: {
    marginVertical: 5,
    padding: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
});
