import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, sombras, tamanios, tipografia } from '../constants/tema';

type Props = {
  etiqueta: string;
  valor: number;
  destacada: boolean;
};

// Cifra grande del detalle (ejemplares, personas en espera).
export function CifraLibro({ etiqueta, valor, destacada }: Props) {
  return (
    <View
      style={[estilos.tarjeta, destacada && estilos.destacada]}
      accessible
      accessibilityLabel={`${etiqueta}: ${valor}`}>
      <Text style={[estilos.etiqueta, destacada && estilos.etiquetaDestacada]}>{etiqueta}</Text>
      <Text style={[estilos.valor, destacada && estilos.valorDestacado]}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flex: 1,
    gap: espaciado.xs,
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radioTarjeta,
    boxShadow: sombras.tarjeta,
  },
  destacada: {
    backgroundColor: colores.bosque,
  },
  etiqueta: {
    color: colores.textoSecundario,
    fontSize: tamanios.textoChico,
  },
  etiquetaDestacada: {
    color: colores.textoSobreBosqueSuave,
  },
  valor: {
    color: colores.texto,
    fontSize: tamanios.cifra,
    fontWeight: tipografia.pesoTitular,
    fontVariant: ['tabular-nums'],
  },
  valorDestacado: {
    color: colores.menta,
  },
});
