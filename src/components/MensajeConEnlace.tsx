import { type Href, Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios } from '../constants/tema';

type Props = {
  titulo: string;
  mensaje: string;
  textoEnlace: string;
  destino: Href;
};

export function MensajeConEnlace({ titulo, mensaje, textoEnlace, destino }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      <Text style={estilos.mensaje}>{mensaje}</Text>
      <Link href={destino} replace style={estilos.enlace}>
        {textoEnlace}
      </Link>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.md,
    padding: espaciado.xl,
    backgroundColor: colores.fondo,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.titulo,
    fontWeight: '700',
    textAlign: 'center',
  },
  mensaje: {
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
    textAlign: 'center',
  },
  enlace: {
    minHeight: tamanios.toqueMinimo,
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.lg,
    color: colores.primario,
    fontSize: tamanios.texto,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
