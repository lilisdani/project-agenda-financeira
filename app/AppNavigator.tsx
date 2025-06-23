// app/AppNavigator.tsx ou app/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './Screen/HomeScreen';
import ClienteDetalhes from './Screen/ClienteDetalhes';
import AdicionarCliente from './Screen/AdicionarCliente';



// app/AppNavigator.tsx

export type RootStackParamList = {
  Home: undefined;
  ClienteDetalhes: { clienteId: string };
  AdicionarCliente: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Eco Belle' }} />
        <Stack.Screen name="ClienteDetalhes" component={ClienteDetalhes} options={{ title: 'Detalhes do Cliente' }} />
        <Stack.Screen name="AdicionarCliente" component={AdicionarCliente} options={{ title: 'Novo Cliente' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// app/AppNavigator.tsx


