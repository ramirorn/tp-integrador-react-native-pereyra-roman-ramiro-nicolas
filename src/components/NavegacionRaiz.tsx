import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { colores, tamanios, tipografia } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';

// Vive dentro del provider para poder leer la sesión y proteger rutas.
export function NavegacionRaiz() {
  const { sesion } = useBiblioteca();

  return (
    <Stack
      screenOptions={{
        headerStyle: estilos.encabezado,
        headerShadowVisible: false,
        headerTintColor: colores.bosque,
        headerTitleStyle: estilos.tituloEncabezado,
        contentStyle: estilos.contenido,
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="buscar" options={{ title: 'Buscar' }} />
      <Stack.Screen
        name="reservar/[isbn]"
        options={{ title: 'Confirmar reserva', presentation: 'modal' }}
      />
      <Stack.Screen name="permisos/[recurso]" options={{ title: 'Permiso', presentation: 'modal' }} />
      <Stack.Screen name="reserva" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: 'Página no encontrada' }} />

      <Stack.Protected guard={!sesion}>
        <Stack.Screen name="login" options={{ title: 'Ingreso del personal', presentation: 'modal' }} />
      </Stack.Protected>

      <Stack.Protected guard={sesion}>
        <Stack.Screen name="mostrador" options={{ title: 'Mostrador' }} />
      </Stack.Protected>
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
