import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espaciado, opacidad, tamanios } from '../constants/tema';

type Props = {
  icono: ComponentProps<typeof Ionicons>['name'];
  titulo: string;
  onPress: () => void;
};

// Acceso rápido con ícono y texto visible (el texto ya sirve como etiqueta).
export function BotonAcceso({ icono, titulo, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [estilos.boton, pressed && estilos.presionado]}>
      <Ionicons name={icono} size={tamanios.icono} color={colores.primario} />
      <Text style={estilos.texto}>{titulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    flex: 1,
    flexDirection: 'row',
    gap: espaciado.sm,
    minHeight: tamanios.toqueMinimo,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.primarioSuave,
    borderRadius: tamanios.radio,
    paddingHorizontal: espaciado.md,
  },
  presionado: {
    opacity: opacidad.presionado,
  },
  texto: {
    color: colores.primario,
    fontSize: tamanios.texto,
    fontWeight: '600',
  },
});
