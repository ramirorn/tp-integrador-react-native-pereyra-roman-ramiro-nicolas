import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { EnlacePersonal } from '../../../components/EnlacePersonal';
import { colores } from '../../../constants/tema';

// Un deep link a /libro/[isbn] deja el Catálogo debajo.
export const unstable_settings = {
  anchor: 'index',
};

export default function CatalogoLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colores.primario,
        contentStyle: estilos.contenido,
      }}>
      <Stack.Screen name="index" options={{ title: 'Catálogo', headerRight: EnlacePersonal }} />
      <Stack.Screen name="libro/[isbn]" options={{ title: 'Libro' }} />
      <Stack.Screen name="escanear" options={{ title: 'Escanear libro' }} />
    </Stack>
  );
}

const estilos = StyleSheet.create({
  contenido: {
    backgroundColor: colores.fondo,
  },
});
