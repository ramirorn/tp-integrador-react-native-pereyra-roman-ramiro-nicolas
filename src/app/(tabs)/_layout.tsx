import { Tabs } from 'expo-router/tabs';
import { StyleSheet } from 'react-native';

import { BarraPestanias } from '../../components/BarraPestanias';
import { colores, tamanios, tipografia } from '../../constants/tema';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={BarraPestanias}
      screenOptions={{
        headerStyle: estilos.encabezado,
        headerShadowVisible: false,
        headerTintColor: colores.bosque,
        headerTitleStyle: estilos.tituloEncabezado,
        sceneStyle: estilos.escena,
      }}>
      <Tabs.Screen name="(catalogo)" options={{ title: 'Catálogo', headerShown: false }} />
      <Tabs.Screen name="reservas" options={{ title: 'Mis reservas' }} />
    </Tabs>
  );
}

const estilos = StyleSheet.create({
  encabezado: {
    backgroundColor: colores.fondo,
  },
  tituloEncabezado: {
    color: colores.texto,
    fontSize: tamanios.titulo,
    fontWeight: tipografia.pesoTitular,
  },
  escena: {
    backgroundColor: colores.fondo,
  },
});
