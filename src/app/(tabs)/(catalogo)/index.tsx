import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { EncabezadoCatalogo } from '../../../components/EncabezadoCatalogo';
import { EstadoCarga } from '../../../components/EstadoCarga';
import { EstadoError } from '../../../components/EstadoError';
import { EstadoVacio } from '../../../components/EstadoVacio';
import { TarjetaLibro } from '../../../components/TarjetaLibro';
import { MENSAJES } from '../../../constants/mensajes';
import { espaciado, tamanios } from '../../../constants/tema';
import { useBiblioteca } from '../../../hooks/useBiblioteca';
import { useLibros } from '../../../hooks/useLibros';
import type { FiltroCatalogo } from '../../../types';

export default function Catalogo() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { disponibles, posicionDe, prestamoDe } = useBiblioteca();
  const [filtro, setFiltro] = useState<FiltroCatalogo>('todos');

  const visibles = libros.filter((libro) => {
    if (filtro === 'disponibles') {
      return disponibles(libro) > 0;
    }
    if (filtro === 'espera') {
      return disponibles(libro) === 0;
    }
    return true;
  });
  const listo = !cargando && !error;

  function renderizarVacio() {
    if (cargando) {
      return <EstadoCarga mensaje="Cargando el catálogo…" />;
    }
    if (error) {
      return <EstadoError mensaje={error} onReintentar={reintentar} />;
    }
    return <EstadoVacio mensaje={filtro === 'todos' ? MENSAJES.catalogoVacio : MENSAJES.filtroVacio} />;
  }

  return (
    <FlatList
      data={listo ? visibles : []}
      keyExtractor={(libro) => libro.isbn}
      numColumns={2}
      columnWrapperStyle={estilos.fila}
      contentContainerStyle={estilos.contenido}
      renderItem={({ item }) => (
        <View style={estilos.celda}>
          <TarjetaLibro
            libro={item}
            disponibles={disponibles(item)}
            reservado={prestamoDe(item.isbn) !== undefined || posicionDe(item.isbn) !== null}
          />
        </View>
      )}
      ListHeaderComponent={
        <EncabezadoCatalogo
          filtro={filtro}
          onCambiarFiltro={setFiltro}
          cantidad={listo ? visibles.length : null}
        />
      }
      ListEmptyComponent={renderizarVacio()}
    />
  );
}

const estilos = StyleSheet.create({
  contenido: {
    paddingBottom: tamanios.espacioBarra,
  },
  fila: {
    paddingHorizontal: espaciado.sm,
  },
  celda: {
    width: '50%',
    padding: espaciado.sm,
  },
});
