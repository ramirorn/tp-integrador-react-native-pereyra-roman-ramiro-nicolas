import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { formatearFecha } from '../lib/fechas';
import type { Libro } from '../types';
import { Boton } from './Boton';
import { DatoLibro } from './DatoLibro';

type Props = {
  libro: Libro;
};

export function DetalleLibro({ libro }: Props) {
  const { registrarVisto, disponibles, esperas, posicionDe, prestamoDe } = useBiblioteca();
  const prestamo = prestamoDe(libro.isbn);
  const posicion = posicionDe(libro.isbn);
  const enEspera = esperas[libro.isbn]?.tamanio ?? 0;

  // Cada vez que se abre un detalle, el libro entra en la pila de recientes.
  useEffect(() => {
    registrarVisto(libro.isbn);
  }, [libro.isbn, registrarVisto]);

  function renderizarEstado() {
    if (prestamo) {
      return (
        <Text style={estilos.estado}>
          Lo tenés prestado hasta el {formatearFecha(prestamo.vence)}.
        </Text>
      );
    }
    if (posicion !== null) {
      return <Text style={estilos.estado}>Estás en la lista de espera, posición {posicion}.</Text>;
    }
    return (
      <Boton
        titulo="Reservar"
        onPress={() => router.push({ pathname: '/reservar/[isbn]', params: { isbn: libro.isbn } })}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={estilos.contenedor}>
      <Text style={estilos.titulo} accessibilityRole="header">
        {libro.titulo}
      </Text>
      <View style={estilos.tarjeta}>
        <DatoLibro etiqueta="Autor" valor={libro.autor} />
        <DatoLibro etiqueta="Año" valor={String(libro.anio)} />
        <DatoLibro etiqueta="ISBN" valor={libro.isbn} />
        <DatoLibro etiqueta="Ejemplares disponibles" valor={String(disponibles(libro))} />
        <DatoLibro etiqueta="Personas en lista de espera" valor={String(enEspera)} />
      </View>
      {renderizarEstado()}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espaciado.lg,
    padding: espaciado.lg,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.titulo,
    fontWeight: '700',
  },
  tarjeta: {
    gap: espaciado.md,
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radio,
    borderWidth: tamanios.borde,
    borderColor: colores.borde,
  },
  estado: {
    color: colores.primario,
    fontSize: tamanios.texto,
    padding: espaciado.md,
    backgroundColor: colores.primarioSuave,
    borderRadius: tamanios.radio,
  },
});
