import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espaciado, opacidad, sombras, tamanios, tipografia } from '../constants/tema';

type Props = {
  icono: ComponentProps<typeof Ionicons>['name'];
  titulo: string;
  activo: boolean;
  onPress: () => void;
};

export function FiltroCategoria({ icono, titulo, activo, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
      onPress={onPress}
      style={({ pressed }) => [estilos.ficha, activo && estilos.activa, pressed && estilos.presionada]}>
      <Ionicons
        name={icono}
        size={tamanios.icono}
        color={activo ? colores.menta : colores.bosque}
      />
      <Text style={[estilos.texto, activo && estilos.textoActivo]}>{titulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  ficha: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.xs,
    minHeight: tamanios.circuloIcono,
    borderRadius: tamanios.radioTarjeta - espaciado.xs,
    backgroundColor: colores.superficie,
  },
  activa: {
    backgroundColor: colores.bosque,
    boxShadow: sombras.tarjeta,
  },
  presionada: {
    opacity: opacidad.presionado,
  },
  texto: {
    color: colores.texto,
    fontSize: tamanios.textoChico,
    fontWeight: tipografia.pesoMedio,
  },
  textoActivo: {
    color: colores.textoSobreBosque,
  },
});
