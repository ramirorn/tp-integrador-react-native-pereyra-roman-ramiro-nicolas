import { FlatList, StyleSheet } from 'react-native';

import { EncabezadoReservas } from '../../components/EncabezadoReservas';
import { EstadoVacio } from '../../components/EstadoVacio';
import { TarjetaEspera } from '../../components/TarjetaEspera';
import { TarjetaPrestamo } from '../../components/TarjetaPrestamo';
import { colores } from '../../constants/tema';
import { useBiblioteca } from '../../hooks/useBiblioteca';
import { posicionEnEspera } from '../../lib/reservas';
import type { Prestamo } from '../../types';

type Item =
  | { tipo: 'prestamo'; isbn: string; prestamo: Prestamo }
  | { tipo: 'espera'; isbn: string; posicion: number };

export default function MisReservas() {
  const { prestamos, esperas } = useBiblioteca();

  // Un libro no puede estar prestado y en espera a la vez: el ISBN es único.
  const items: Item[] = [
    ...prestamos.map((prestamo): Item => ({ tipo: 'prestamo', isbn: prestamo.isbn, prestamo })),
    ...Object.entries(esperas).flatMap(([isbn, cola]): Item[] => {
      const posicion = posicionEnEspera(cola);
      return posicion === null ? [] : [{ tipo: 'espera', isbn, posicion }];
    }),
  ];

  return (
    <FlatList
      style={estilos.lista}
      data={items}
      keyExtractor={(item) => item.isbn}
      renderItem={({ item }) =>
        item.tipo === 'prestamo' ? (
          <TarjetaPrestamo prestamo={item.prestamo} />
        ) : (
          <TarjetaEspera isbn={item.isbn} posicion={item.posicion} />
        )
      }
      ListHeaderComponent={EncabezadoReservas}
      ListEmptyComponent={
        <EstadoVacio mensaje="Todavía no tenés préstamos ni reservas. Buscá un libro en el Catálogo." />
      }
    />
  );
}

const estilos = StyleSheet.create({
  lista: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
});
