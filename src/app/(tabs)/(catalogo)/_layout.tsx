import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { EnlacePersonal } from '../../../components/EnlacePersonal';
import { colores, tamanios, tipografia } from '../../../constants/tema';

// Un deep link a /libro/[isbn] deja el Catálogo debajo.
export const unstable_settings = {
  anchor: 'index',
};

export default function CatalogoLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: estilos.encabezado,
        headerShadowVisible: false,
        headerTintColor: colores.bosque,
        headerTitleStyle: estilos.tituloEncabezado,
        contentStyle: estilos.contenido,
      }}>
      <Stack.Screen
        name="index"
        options={{ title: 'Biblioteca IPF', headerRight: EnlacePersonal }}
      />
      <Stack.Screen name="libro/[isbn]" options={{ title: '' }} />
      <Stack.Screen name="escanear" options={{ title: 'Escanear libro' }} />
    </Stack>
  );
}

const estilos = StyleSheet.create({
  encabezado: {
    backgroundColor: colores.fondo,
  },
  tituloEncabezado: {
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    fontWeight: tipografia.pesoTitular,
  },
  contenido: {
    backgroundColor: colores.fondo,
  },
});
