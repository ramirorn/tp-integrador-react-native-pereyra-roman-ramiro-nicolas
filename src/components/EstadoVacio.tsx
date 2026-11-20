import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios } from '../constants/tema';

type Props = {
  mensaje: string;
};

export function EstadoVacio({ mensaje }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Ionicons name="library-outline" size={tamanios.iconoGrande} color={colores.deshabilitado} />
      <Text style={estilos.texto}>{mensaje}</Text>
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
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
    textAlign: 'center',
  },
});
