import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colores, degradados, espaciado, sombras, tamanios, tipografia } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { formatearFecha } from '../lib/fechas';
import type { Libro } from '../types';
import { Boton } from './Boton';
import { CifraLibro } from './CifraLibro';
import { DatoLibro } from './DatoLibro';
import { Portada } from './Portada';

type Props = {
  libro: Libro;
};

export function DetalleLibro({ libro }: Props) {
  const { registrarVisto, disponibles, esperas, posicionDe, prestamoDe } = useBiblioteca();
  const prestamo = prestamoDe(libro.isbn);
  const posicion = posicionDe(libro.isbn);
  const enEspera = esperas[libro.isbn]?.tamanio ?? 0;
  const cantidad = disponibles(libro);

  // Cada vez que se abre un detalle, el libro entra en la pila de recientes.
  useEffect(() => {
    registrarVisto(libro.isbn);
  }, [libro.isbn, registrarVisto]);

  function renderizarEstado() {
    if (prestamo) {
      return (
        <View style={estilos.estado}>
          <Ionicons name="checkmark-circle" size={tamanios.icono} color={colores.bosque} />
          <Text style={estilos.textoEstado}>
            Lo tenés prestado hasta el {formatearFecha(prestamo.vence)}.
          </Text>
        </View>
      );
    }
    if (posicion !== null) {
      return (
        <View style={estilos.estado}>
          <Ionicons name="hourglass" size={tamanios.icono} color={colores.bosque} />
          <Text style={estilos.textoEstado}>Estás en la lista de espera, posición {posicion}.</Text>
        </View>
      );
    }
    return (
      <Boton
        titulo={cantidad > 0 ? 'Reservar' : 'Anotarme en la lista'}
        icono="bookmark-outline"
        onPress={() => router.push({ pathname: '/reservar/[isbn]', params: { isbn: libro.isbn } })}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={estilos.contenedor}>
      <View style={estilos.placa}>
        <Portada libro={libro} tamanio="detalle" />
      </View>

      <View style={estilos.cuerpo}>
        <View style={estilos.encabezado}>
          <Text style={estilos.titulo} accessibilityRole="header">
            {libro.titulo}
          </Text>
          <Text style={estilos.autor}>{libro.autor}</Text>
        </View>

        <View style={estilos.cifras}>
          <CifraLibro etiqueta="Disponibles" valor={cantidad} destacada={cantidad > 0} />
          <CifraLibro etiqueta="En lista de espera" valor={enEspera} destacada={false} />
        </View>

        <View style={estilos.tarjeta}>
          <DatoLibro etiqueta="Año" valor={String(libro.anio)} />
          <DatoLibro etiqueta="ISBN" valor={libro.isbn} />
        </View>

        {renderizarEstado()}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    paddingBottom: tamanios.espacioBarra,
  },
  placa: {
    alignItems: 'center',
    marginHorizontal: espaciado.lg,
    paddingVertical: espaciado.lg,
    borderRadius: tamanios.radioTarjeta + espaciado.sm,
    backgroundImage: degradados.placa,
    backgroundColor: colores.placa,
  },
  cuerpo: {
    gap: espaciado.lg,
    padding: espaciado.lg,
  },
  encabezado: {
    gap: espaciado.xs,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.tituloGrande,
    fontWeight: tipografia.pesoTitular,
    letterSpacing: tipografia.interletraTitular,
  },
  autor: {
    color: colores.textoSecundario,
    fontSize: tamanios.subtitulo,
  },
  cifras: {
    flexDirection: 'row',
    gap: espaciado.md,
  },
  tarjeta: {
    gap: espaciado.md,
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radioTarjeta,
    boxShadow: sombras.tarjeta,
  },
  estado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
    padding: espaciado.lg,
    backgroundColor: colores.mentaClara,
    borderRadius: tamanios.radioTarjeta,
  },
  textoEstado: {
    flex: 1,
    color: colores.bosqueProfundo,
    fontSize: tamanios.texto,
    fontWeight: tipografia.pesoMedio,
  },
});
