import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MAX_RECIENTES } from '../constants/biblioteca';
import { colores, espaciado, opacidad, tamanios } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { buscarLibroPorIsbn } from '../lib/catalogo';
import { ultimosVistos } from '../lib/recientes';

export function VistosRecientes() {
  const { recientes } = useBiblioteca();
  const isbns = ultimosVistos(recientes, MAX_RECIENTES);

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo} accessibilityRole="header">
        Vistos recientemente
      </Text>
      {isbns.length === 0 ? (
        <Text style={estilos.vacio}>Los libros que abras van a aparecer acá.</Text>
      ) : (
        isbns.map((isbn) => (
          <Pressable
            key={isbn}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn } })}
            style={({ pressed }) => [estilos.item, pressed && estilos.presionado]}>
            <Text style={estilos.textoItem} numberOfLines={1}>
              {buscarLibroPorIsbn(isbn)?.titulo ?? isbn}
            </Text>
          </Pressable>
        ))
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espaciado.sm,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    fontWeight: '700',
  },
  vacio: {
    color: colores.textoSecundario,
    fontSize: tamanios.textoChico,
  },
  item: {
    minHeight: tamanios.toqueMinimo,
    justifyContent: 'center',
    paddingHorizontal: espaciado.md,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radio,
    borderWidth: tamanios.borde,
    borderColor: colores.borde,
  },
  presionado: {
    opacity: opacidad.presionado,
  },
  textoItem: {
    color: colores.primario,
    fontSize: tamanios.texto,
  },
});
