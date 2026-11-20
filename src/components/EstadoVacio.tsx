import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios } from '../constants/tema';

type Props = {
  mensaje: string;
};

export function EstadoVacio({ mensaje }: Props) {
  return (
    <View style={estilos.contenedor}>
      <View style={estilos.circulo}>
        <Ionicons name="library-outline" size={tamanios.iconoGrande} color={colores.bosque} />
      </View>
      <Text style={estilos.texto}>{mensaje}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.md,
    padding: espaciado.xxl,
  },
  circulo: {
    width: tamanios.circuloIcono,
    height: tamanios.circuloIcono,
    borderRadius: tamanios.radioPildora,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.placa,
  },
  texto: {
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
    textAlign: 'center',
  },
});
