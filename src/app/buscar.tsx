import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';

import { EstadoCarga } from '../components/EstadoCarga';
import { EstadoError } from '../components/EstadoError';
import { EstadoVacio } from '../components/EstadoVacio';
import { TarjetaLibro } from '../components/TarjetaLibro';
import { DEMORA_BUSQUEDA_MS } from '../constants/biblioteca';
import { MENSAJES } from '../constants/mensajes';
import { colores, espaciado, sombras, tamanios } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { useBusqueda } from '../hooks/useBusqueda';
import { useDebounce } from '../hooks/useDebounce';

export default function Buscar() {
  // La búsqueda vive en la URL: /buscar?q=borges
  const { q = '' } = useLocalSearchParams<{ q?: string }>();
  const [texto, setTexto] = useState(q);
  const textoDemorado = useDebounce(texto, DEMORA_BUSQUEDA_MS);
  const { libros, cargando, error, reintentar } = useBusqueda(q);
  const { disponibles, posicionDe, prestamoDe } = useBiblioteca();

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
      <View style={estilos.campo}>
        <Ionicons name="search" size={tamanios.icono} color={colores.textoSecundario} />
        <TextInput
          style={estilos.entrada}
          value={texto}
          onChangeText={setTexto}
          placeholder="Título o autor"
          placeholderTextColor={colores.textoSecundario}
          selectionColor={colores.bosque}
          accessibilityLabel="Buscar por título o autor"
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>
      <FlatList
        data={cargando ? [] : libros}
        keyExtractor={(libro) => libro.isbn}
        numColumns={2}
        columnWrapperStyle={estilos.fila}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => (
          <View style={estilos.celda}>
            <TarjetaLibro
              libro={item}
              disponibles={disponibles(item)}
              reservado={prestamoDe(item.isbn) !== undefined || posicionDe(item.isbn) !== null}
            />
          </View>
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
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
    margin: espaciado.lg,
    paddingHorizontal: espaciado.lg,
    minHeight: tamanios.toqueMinimo + espaciado.sm,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radioPildora,
    boxShadow: sombras.tarjeta,
  },
  entrada: {
    flex: 1,
    minHeight: tamanios.toqueMinimo,
    fontSize: tamanios.subtitulo,
    color: colores.texto,
  },
  lista: {
    paddingBottom: espaciado.xxl,
  },
  fila: {
    paddingHorizontal: espaciado.sm,
  },
  celda: {
    width: '50%',
    padding: espaciado.sm,
  },
});
