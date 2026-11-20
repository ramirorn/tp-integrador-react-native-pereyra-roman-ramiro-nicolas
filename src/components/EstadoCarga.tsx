import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios } from '../constants/tema';

type Props = {
  mensaje: string;
};

export function EstadoCarga({ mensaje }: Props) {
  return (
    <View style={estilos.contenedor} accessibilityRole="progressbar" accessibilityLabel={mensaje}>
      <ActivityIndicator size="large" color={colores.bosque} />
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
  texto: {
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
  },
});
