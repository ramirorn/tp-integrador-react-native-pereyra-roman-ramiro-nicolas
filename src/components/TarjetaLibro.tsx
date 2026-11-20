import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, degradados, espaciado, opacidad, sombras, tamanios, tipografia } from '../constants/tema';
import type { Libro } from '../types';
import { Portada } from './Portada';

type Props = {
  libro: Libro;
  disponibles: number;
  reservado: boolean;
};

// La portada es el producto: va sobre una placa menta, como en una vidriera.
export function TarjetaLibro({ libro, disponibles, reservado }: Props) {
  const hayEjemplares = disponibles > 0;

  return (
    <View style={estilos.tarjeta}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${libro.titulo}, de ${libro.autor}`}
        accessibilityHint="Abre la ficha del libro"
        onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } })}
        style={({ pressed }) => pressed && estilos.presionada}>
        <View style={estilos.placa}>
          <Portada libro={libro} tamanio="tarjeta" />
        </View>
        <View style={estilos.cuerpo}>
          <Text style={estilos.titulo} numberOfLines={2}>
            {libro.titulo}
          </Text>
          <Text style={estilos.autor} numberOfLines={1}>
            {libro.autor}
          </Text>
        </View>
      </Pressable>
      <View style={estilos.pie}>
        <Text style={[estilos.estado, !hayEjemplares && estilos.estadoEspera]} numberOfLines={1}>
          {hayEjemplares ? `${disponibles} ${disponibles > 1 ? 'libres' : 'libre'}` : 'En espera'}
        </Text>
        {reservado ? (
          <View style={[estilos.accion, estilos.accionHecha]} accessible accessibilityLabel="Ya lo reservaste">
            <Ionicons name="checkmark" size={tamanios.icono} color={colores.bosque} />
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Reservar ${libro.titulo}`}
            onPress={() => router.push({ pathname: '/reservar/[isbn]', params: { isbn: libro.isbn } })}
            style={({ pressed }) => [estilos.accion, pressed && estilos.presionada]}>
            <Ionicons name="add" size={tamanios.icono} color={colores.textoSobreBosque} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: tamanios.radioTarjeta,
    backgroundColor: colores.superficie,
    boxShadow: sombras.tarjeta,
  },
  presionada: {
    opacity: opacidad.presionado,
  },
  placa: {
    alignItems: 'center',
    paddingVertical: espaciado.lg,
    backgroundImage: degradados.placa,
    backgroundColor: colores.placa,
  },
  cuerpo: {
    gap: espaciado.xs,
    paddingHorizontal: espaciado.md,
    paddingTop: espaciado.md,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.texto,
    fontWeight: tipografia.pesoTitular,
  },
  autor: {
    color: colores.textoSecundario,
    fontSize: tamanios.textoChico,
  },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaciado.xs,
    padding: espaciado.md,
    paddingTop: espaciado.sm,
  },
  estado: {
    flexShrink: 1,
    color: colores.exito,
    fontSize: tamanios.texto,
    fontWeight: tipografia.pesoTitular,
  },
  estadoEspera: {
    color: colores.aviso,
  },
  accion: {
    width: tamanios.toqueMinimo,
    height: tamanios.toqueMinimo,
    borderRadius: tamanios.radioPildora,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.bosque,
  },
  accionHecha: {
    backgroundColor: colores.mentaClara,
  },
});
