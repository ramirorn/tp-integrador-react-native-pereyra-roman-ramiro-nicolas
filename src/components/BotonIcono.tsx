import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colores, opacidad, tamanios } from '../constants/tema';

type Props = {
  icono: ComponentProps<typeof Ionicons>['name'];
  etiqueta: string;
  onPress: () => void;
};

// Botón solo con ícono: la etiqueta es obligatoria para lectores de pantalla.
export function BotonIcono({ icono, etiqueta, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      onPress={onPress}
      style={({ pressed }) => [estilos.boton, pressed && estilos.presionado]}>
      <Ionicons name={icono} size={tamanios.icono} color={colores.textoSecundario} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    width: tamanios.toqueMinimo,
    height: tamanios.toqueMinimo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presionado: {
    opacity: opacidad.presionado,
  },
});
