import { FlatList, StyleSheet, View } from 'react-native';

import { Boton } from '../components/Boton';
import { EstadoVacio } from '../components/EstadoVacio';
import { FilaMostrador } from '../components/FilaMostrador';
import { colores, espaciado } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';

export default function Mostrador() {
  const { esperas, entregarAlSiguiente, cerrarSesion } = useBiblioteca();
  const libros = Object.keys(esperas);

  return (
    <View style={estilos.contenedor}>
      <FlatList
        data={libros}
        keyExtractor={(isbn) => isbn}
        renderItem={({ item }) => (
          <FilaMostrador isbn={item} cola={esperas[item]} onEntregar={entregarAlSiguiente} />
        )}
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={<EstadoVacio mensaje="No hay libros con lista de espera." />}
      />
      <View style={estilos.pie}>
        {/* Al cerrar sesión, Stack.Protected saca el mostrador del historial. */}
        <Boton titulo="Cerrar sesión" variante="peligro" onPress={cerrarSesion} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  lista: {
    paddingTop: espaciado.lg,
  },
  pie: {
    padding: espaciado.lg,
  },
});
