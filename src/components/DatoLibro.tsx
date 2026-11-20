import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios, tipografia } from '../constants/tema';

type Props = {
  etiqueta: string;
  valor: string;
};

export function DatoLibro({ etiqueta, valor }: Props) {
  return (
    <View style={estilos.fila}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: espaciado.md,
  },
  etiqueta: {
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
  },
  valor: {
    flexShrink: 1,
    color: colores.texto,
    fontSize: tamanios.texto,
    fontWeight: tipografia.pesoFuerte,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
});
