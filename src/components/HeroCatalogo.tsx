import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ISBN_PORTADA_CATALOGO } from '../constants/biblioteca';
import { colores, degradados, espaciado, sombras, tamanios, tipografia } from '../constants/tema';
import { buscarLibroPorIsbn } from '../lib/catalogo';
import { Boton } from './Boton';
import { Portada } from './Portada';

export function HeroCatalogo() {
  const libro = buscarLibroPorIsbn(ISBN_PORTADA_CATALOGO);

  return (
    <View style={estilos.placa}>
      <View style={estilos.textos}>
        <Text style={estilos.titulo} accessibilityRole="header">
          Leé más.{'\n'}Reservá fácil.
        </Text>
        <Text style={estilos.bajada}>Buscá por título o autor, o escaneá la contratapa.</Text>
        <View style={estilos.accion}>
          <Boton titulo="Buscar" icono="search" variante="claro" onPress={() => router.push('/buscar')} />
        </View>
      </View>
      {libro && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ver ${libro.titulo}`}
          onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } })}
          style={estilos.portada}>
          <Portada libro={libro} tamanio="heroe" />
        </Pressable>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  placa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    padding: espaciado.xl,
    borderRadius: tamanios.radioTarjeta + espaciado.xs,
    backgroundImage: degradados.heroe,
    backgroundColor: colores.bosque,
    boxShadow: sombras.flotante,
  },
  textos: {
    flex: 1,
    gap: espaciado.sm,
  },
  titulo: {
    color: colores.superficie,
    fontSize: tamanios.tituloGrande,
    lineHeight: tamanios.tituloGrande + espaciado.xs,
    fontWeight: tipografia.pesoTitular,
    letterSpacing: tipografia.interletraTitular,
  },
  bajada: {
    color: colores.textoSobreBosque,
    fontSize: tamanios.textoChico,
  },
  accion: {
    marginTop: espaciado.sm,
    alignSelf: 'flex-start',
  },
  portada: {
    transform: [{ rotate: '6deg' }],
  },
});
