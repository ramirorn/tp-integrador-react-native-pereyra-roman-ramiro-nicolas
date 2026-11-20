import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espaciado, opacidad, sombras, tamanios, tipografia } from '../constants/tema';

type Variante = 'primario' | 'secundario' | 'claro' | 'peligro';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  icono?: ComponentProps<typeof Ionicons>['name'];
  deshabilitado?: boolean;
  pista?: string;
};

const COLOR_TEXTO: Record<Variante, string> = {
  primario: colores.textoSobreBosque,
  secundario: colores.bosque,
  claro: colores.bosque,
  peligro: colores.superficie,
};

export function Boton({
  titulo,
  onPress,
  variante = 'primario',
  icono,
  deshabilitado = false,
  pista,
}: Props) {
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
      {icono && (
        <Ionicons
          name={icono}
          size={tamanios.icono}
          color={deshabilitado ? colores.textoSecundario : COLOR_TEXTO[variante]}
        />
      )}
      <Text
        style={[
          estilos.texto,
          estilos[`texto_${variante}`],
          deshabilitado && estilos.textoDeshabilitado,
        ]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    flexDirection: 'row',
    gap: espaciado.sm,
    minHeight: tamanios.toqueMinimo + espaciado.sm,
    minWidth: tamanios.toqueMinimo,
    paddingHorizontal: espaciado.xl,
    borderRadius: tamanios.radioPildora,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: {
    backgroundColor: colores.bosque,
    boxShadow: sombras.tarjeta,
  },
  secundario: {
    backgroundColor: colores.superficie,
    borderWidth: tamanios.borde,
    borderColor: colores.borde,
  },
  claro: {
    backgroundColor: colores.superficie,
  },
  peligro: {
    backgroundColor: colores.error,
  },
  presionado: {
    opacity: opacidad.presionado,
  },
  deshabilitado: {
    backgroundColor: colores.deshabilitadoFondo,
    borderColor: colores.deshabilitadoFondo,
    boxShadow: 'none',
  },
  texto: {
    fontSize: tamanios.subtitulo,
    fontWeight: tipografia.pesoFuerte,
  },
  texto_primario: {
    color: colores.textoSobreBosque,
  },
  texto_secundario: {
    color: colores.bosque,
  },
  texto_claro: {
    color: colores.bosque,
  },
  texto_peligro: {
    color: colores.superficie,
  },
  textoDeshabilitado: {
    color: colores.textoSecundario,
  },
});
