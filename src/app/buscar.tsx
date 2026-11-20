import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';

import { EstadoCarga } from '../components/EstadoCarga';
import { EstadoError } from '../components/EstadoError';
import { EstadoVacio } from '../components/EstadoVacio';
import { FilaLibro } from '../components/FilaLibro';
import { DEMORA_BUSQUEDA_MS } from '../constants/biblioteca';
import { MENSAJES } from '../constants/mensajes';
import { colores, espaciado, tamanios } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { useBusqueda } from '../hooks/useBusqueda';
import { useDebounce } from '../hooks/useDebounce';

function abrirLibro(isbn: string) {
  router.push({ pathname: '/libro/[isbn]', params: { isbn } });
}

export default function Buscar() {
  // La búsqueda vive en la URL: /buscar?q=borges
  const { q = '' } = useLocalSearchParams<{ q?: string }>();
  const [texto, setTexto] = useState(q);
  const textoDemorado = useDebounce(texto, DEMORA_BUSQUEDA_MS);
  const { libros, cargando, error, reintentar } = useBusqueda(q);
  const { disponibles } = useBiblioteca();

  // setParams reemplaza el parámetro sin apilar otra pantalla.
  useEffect(() => {
    if (textoDemorado !== q) {
      router.setParams({ q: textoDemorado });
    }
  }, [textoDemorado, q]);

  function renderizarVacio() {
    if (!q.trim()) {
      return <EstadoVacio mensaje={MENSAJES.busquedaInicial} />;
    }
    if (cargando) {
      return <EstadoCarga mensaje="Buscando…" />;
    }
    if (error) {
      return <EstadoError mensaje={error} onReintentar={reintentar} />;
    }
    return <EstadoVacio mensaje={MENSAJES.busquedaVacia} />;
  }

  return (
    <View style={estilos.contenedor}>
      <TextInput
        style={estilos.entrada}
        value={texto}
        onChangeText={setTexto}
        placeholder="Título o autor"
        placeholderTextColor={colores.textoSecundario}
        accessibilityLabel="Buscar por título o autor"
        autoFocus
        autoCorrect={false}
        returnKeyType="search"
      />
      <FlatList
        data={cargando ? [] : libros}
        keyExtractor={(libro) => libro.isbn}
        renderItem={({ item }) => (
          <FilaLibro libro={item} disponibles={disponibles(item)} onPress={abrirLibro} />
        )}
        ListEmptyComponent={renderizarVacio()}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  entrada: {
    minHeight: tamanios.toqueMinimo,
    margin: espaciado.lg,
    paddingHorizontal: espaciado.md,
    fontSize: tamanios.texto,
    color: colores.texto,
    backgroundColor: colores.superficie,
    borderWidth: tamanios.borde,
    borderColor: colores.borde,
    borderRadius: tamanios.radio,
  },
});
