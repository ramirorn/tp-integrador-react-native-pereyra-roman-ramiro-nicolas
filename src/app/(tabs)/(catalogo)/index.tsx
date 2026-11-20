import { router } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';

import { EncabezadoCatalogo } from '../../../components/EncabezadoCatalogo';
import { EstadoCarga } from '../../../components/EstadoCarga';
import { EstadoError } from '../../../components/EstadoError';
import { EstadoVacio } from '../../../components/EstadoVacio';
import { FilaLibro } from '../../../components/FilaLibro';
import { MENSAJES } from '../../../constants/mensajes';
import { colores } from '../../../constants/tema';
import { useBiblioteca } from '../../../hooks/useBiblioteca';
import { useLibros } from '../../../hooks/useLibros';

function abrirLibro(isbn: string) {
  router.push({ pathname: '/libro/[isbn]', params: { isbn } });
}

export default function Catalogo() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { disponibles } = useBiblioteca();

  function renderizarVacio() {
    if (cargando) {
      return <EstadoCarga mensaje="Cargando el catálogo…" />;
    }
    if (error) {
      return <EstadoError mensaje={error} onReintentar={reintentar} />;
    }
    return <EstadoVacio mensaje={MENSAJES.catalogoVacio} />;
  }

  return (
    <FlatList
      style={estilos.lista}
      data={cargando || error ? [] : libros}
      keyExtractor={(libro) => libro.isbn}
      renderItem={({ item }) => (
        <FilaLibro libro={item} disponibles={disponibles(item)} onPress={abrirLibro} />
      )}
      ListHeaderComponent={EncabezadoCatalogo}
      ListEmptyComponent={renderizarVacio()}
    />
  );
}

const estilos = StyleSheet.create({
  lista: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
});
