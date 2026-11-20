import { StyleSheet, View } from 'react-native';

import { espaciado } from '../constants/tema';
import type { FiltroCatalogo } from '../types';
import { FiltroCategoria } from './FiltroCategoria';

type Props = {
  filtro: FiltroCatalogo;
  onCambiar: (filtro: FiltroCatalogo) => void;
};

export function FiltrosCatalogo({ filtro, onCambiar }: Props) {
  return (
    <View style={estilos.fila}>
      <FiltroCategoria
        icono="apps"
        titulo="Todos"
        activo={filtro === 'todos'}
        onPress={() => onCambiar('todos')}
      />
      <FiltroCategoria
        icono="checkmark-circle-outline"
        titulo="Disponibles"
        activo={filtro === 'disponibles'}
        onPress={() => onCambiar('disponibles')}
      />
      <FiltroCategoria
        icono="hourglass-outline"
        titulo="En espera"
        activo={filtro === 'espera'}
        onPress={() => onCambiar('espera')}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    gap: espaciado.sm,
  },
});
