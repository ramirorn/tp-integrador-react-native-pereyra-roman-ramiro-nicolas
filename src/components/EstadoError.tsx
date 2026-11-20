import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios } from '../constants/tema';
import { Boton } from './Boton';

type Props = {
  mensaje: string;
  onReintentar: () => void;
};

export function EstadoError({ mensaje, onReintentar }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Ionicons name="cloud-offline-outline" size={tamanios.iconoGrande} color={colores.error} />
      <Text style={estilos.texto} accessibilityRole="alert">
        {mensaje}
      </Text>
      <Boton titulo="Reintentar" onPress={onReintentar} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.md,
    padding: espaciado.xl,
  },
  texto: {
    color: colores.texto,
    fontSize: tamanios.texto,
    textAlign: 'center',
  },
});
