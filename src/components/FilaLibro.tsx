import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, opacidad, tamanios } from '../constants/tema';
import type { Libro } from '../types';

type Props = {
  libro: Libro;
  disponibles: number;
  onPress: (isbn: string) => void;
};

export function FilaLibro({ libro, disponibles, onPress }: Props) {
  const hayEjemplares = disponibles > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Abre la ficha del libro"
      onPress={() => onPress(libro.isbn)}
      style={({ pressed }) => [estilos.fila, pressed && estilos.presionada]}>
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{libro.titulo}</Text>
        <Text style={estilos.autor}>
          {libro.autor} · {libro.anio}
        </Text>
        <Text style={[estilos.estado, !hayEjemplares && estilos.sinEjemplares]}>
          {hayEjemplares ? `${disponibles} disponible(s)` : 'Sin ejemplares: lista de espera'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={tamanios.icono} color={colores.deshabilitado} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: tamanios.toqueMinimo,
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderBottomWidth: tamanios.borde,
    borderBottomColor: colores.borde,
  },
  presionada: {
    opacity: opacidad.presionado,
  },
  textos: {
    flex: 1,
    gap: espaciado.xs,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    fontWeight: '600',
  },
  autor: {
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
  },
  estado: {
    color: colores.exito,
    fontSize: tamanios.textoChico,
  },
  sinEjemplares: {
    color: colores.aviso,
  },
});
