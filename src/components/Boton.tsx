import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espaciado, opacidad, tamanios } from '../constants/tema';

type Variante = 'primario' | 'secundario' | 'peligro';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  deshabilitado?: boolean;
  pista?: string;
};

export function Boton({ titulo, onPress, variante = 'primario', deshabilitado = false, pista }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={pista}
      accessibilityState={{ disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        estilos[variante],
        pressed && estilos.presionado,
        deshabilitado && estilos.deshabilitado,
      ]}>
      <Text style={[estilos.texto, variante === 'secundario' && estilos.textoSecundario]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: tamanios.toqueMinimo,
    minWidth: tamanios.toqueMinimo,
    paddingHorizontal: espaciado.lg,
    paddingVertical: espaciado.sm,
    borderRadius: tamanios.radio,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: {
    backgroundColor: colores.primario,
  },
  secundario: {
    backgroundColor: colores.superficie,
    borderWidth: tamanios.borde,
    borderColor: colores.primario,
  },
  peligro: {
    backgroundColor: colores.error,
  },
  presionado: {
    opacity: opacidad.presionado,
  },
  deshabilitado: {
    backgroundColor: colores.deshabilitado,
    borderColor: colores.deshabilitado,
  },
  texto: {
    color: colores.textoInverso,
    fontSize: tamanios.texto,
    fontWeight: '600',
  },
  textoSecundario: {
    color: colores.primario,
  },
});
