import Ionicons from '@expo/vector-icons/Ionicons';
import { type Href, Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, sombras, tamanios, tipografia } from '../constants/tema';

type Props = {
  titulo: string;
  mensaje: string;
  textoEnlace: string;
  destino: Href;
};

export function MensajeConEnlace({ titulo, mensaje, textoEnlace, destino }: Props) {
  return (
    <View style={estilos.contenedor}>
      <View style={estilos.tarjeta}>
        <View style={estilos.circulo}>
          <Ionicons name="book-outline" size={tamanios.iconoGrande} color={colores.bosque} />
        </View>
        <Text style={estilos.titulo} accessibilityRole="header">
          {titulo}
        </Text>
        <Text style={estilos.mensaje}>{mensaje}</Text>
        <Link href={destino} replace accessibilityRole="button" style={estilos.enlace}>
          {textoEnlace}
        </Link>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    padding: espaciado.lg,
    backgroundColor: colores.fondo,
  },
  tarjeta: {
    alignItems: 'center',
    gap: espaciado.md,
    padding: espaciado.xl,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radioTarjeta,
    boxShadow: sombras.tarjeta,
  },
  circulo: {
    width: tamanios.circuloIcono,
    height: tamanios.circuloIcono,
    borderRadius: tamanios.radioPildora,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.placa,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.titulo,
    fontWeight: tipografia.pesoTitular,
    letterSpacing: tipografia.interletraTitular,
    textAlign: 'center',
  },
  mensaje: {
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
    textAlign: 'center',
  },
  enlace: {
    marginTop: espaciado.sm,
    minHeight: tamanios.toqueMinimo,
    paddingHorizontal: espaciado.xl,
    paddingVertical: espaciado.md,
    overflow: 'hidden',
    borderRadius: tamanios.radioPildora,
    backgroundColor: colores.bosque,
    color: colores.textoSobreBosque,
    fontSize: tamanios.texto,
    fontWeight: tipografia.pesoFuerte,
    textAlign: 'center',
  },
});
