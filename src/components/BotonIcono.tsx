import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colores, opacidad, sombras, tamanios } from '../constants/tema';

type Props = {
  icono: ComponentProps<typeof Ionicons>['name'];
  etiqueta: string;
  onPress: () => void;
  relleno?: boolean;
};

// Botón solo con ícono: la etiqueta es obligatoria para lectores de pantalla.
export function BotonIcono({ icono, etiqueta, onPress, relleno = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.boton,
        relleno && estilos.relleno,
        pressed && estilos.presionado,
      ]}>
      <Ionicons
        name={icono}
        size={tamanios.icono}
        color={relleno ? colores.textoSobreBosque : colores.textoSecundario}
      />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    width: tamanios.toqueMinimo,
    height: tamanios.toqueMinimo,
    borderRadius: tamanios.radioPildora,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relleno: {
    backgroundColor: colores.bosque,
    boxShadow: sombras.tarjeta,
  },
  presionado: {
    opacity: opacidad.presionado,
  },
});
