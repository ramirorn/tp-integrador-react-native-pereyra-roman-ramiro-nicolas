import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MAX_RECIENTES } from '../constants/biblioteca';
import { colores, espaciado, opacidad, sombras, tamanios, tipografia } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { buscarLibroPorIsbn } from '../lib/catalogo';
import { ultimosVistos } from '../lib/recientes';
import type { Libro } from '../types';
import { Portada } from './Portada';

export function VistosRecientes() {
  const { recientes } = useBiblioteca();
  const libros = ultimosVistos(recientes, MAX_RECIENTES)
    .map((isbn) => buscarLibroPorIsbn(isbn))
    .filter((libro): libro is Libro => libro !== undefined);

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo} accessibilityRole="header">
        Vistos recientemente
      </Text>
      {libros.length === 0 ? (
        <Text style={estilos.vacio}>Los libros que abras van a aparecer acá.</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.fila}>
          {libros.map((libro) => (
            <Pressable
              key={libro.isbn}
              accessibilityRole="button"
              accessibilityLabel={`Abrir ${libro.titulo}`}
              onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } })}
              style={({ pressed }) => [estilos.item, pressed && estilos.presionado]}>
              <Portada libro={libro} tamanio="chica" />
              <View style={estilos.textos}>
                <Text style={estilos.tituloItem} numberOfLines={2}>
                  {libro.titulo}
                </Text>
                <Text style={estilos.autor} numberOfLines={1}>
                  {libro.autor}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espaciado.md,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    fontWeight: tipografia.pesoTitular,
  },
  vacio: {
    color: colores.textoSecundario,
    fontSize: tamanios.textoChico,
  },
  fila: {
    gap: espaciado.md,
    paddingRight: espaciado.lg,
    paddingBottom: espaciado.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    width: tamanios.portadaHeroe + tamanios.portadaChica,
    padding: espaciado.sm,
    borderRadius: tamanios.radioTarjeta - espaciado.sm,
    backgroundColor: colores.superficie,
    boxShadow: sombras.tarjeta,
  },
  presionado: {
    opacity: opacidad.presionado,
  },
  textos: {
    flex: 1,
    gap: espaciado.xs,
  },
  tituloItem: {
    color: colores.texto,
    fontSize: tamanios.textoChico,
    fontWeight: tipografia.pesoFuerte,
  },
  autor: {
    color: colores.textoSecundario,
    fontSize: tamanios.textoMicro,
  },
});
