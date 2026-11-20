import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios } from '../constants/tema';
import { BotonAcceso } from './BotonAcceso';
import { VistosRecientes } from './VistosRecientes';

export function EncabezadoCatalogo() {
  return (
    <View style={estilos.contenedor}>
      <VistosRecientes />
      <View style={estilos.accesos}>
        <BotonAcceso icono="search" titulo="Buscar" onPress={() => router.push('/buscar')} />
        <BotonAcceso icono="barcode-outline" titulo="Escanear" onPress={() => router.push('/escanear')} />
      </View>
      <Text style={estilos.titulo} accessibilityRole="header">
        Todos los libros
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espaciado.lg,
    padding: espaciado.lg,
  },
  accesos: {
    flexDirection: 'row',
    gap: espaciado.md,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    fontWeight: '700',
  },
});
