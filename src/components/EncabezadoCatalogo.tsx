import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios, tipografia } from '../constants/tema';
import type { FiltroCatalogo } from '../types';
import { FiltrosCatalogo } from './FiltrosCatalogo';
import { HeroCatalogo } from './HeroCatalogo';
import { VistosRecientes } from './VistosRecientes';

type Props = {
  filtro: FiltroCatalogo;
  onCambiarFiltro: (filtro: FiltroCatalogo) => void;
  cantidad: number | null;
};

export function EncabezadoCatalogo({ filtro, onCambiarFiltro, cantidad }: Props) {
  return (
    <View style={estilos.contenedor}>
      <HeroCatalogo />
      <FiltrosCatalogo filtro={filtro} onCambiar={onCambiarFiltro} />
      <VistosRecientes />
      <View style={estilos.seccion}>
        <Text style={estilos.titulo} accessibilityRole="header">
          Todo el catálogo
        </Text>
        {cantidad !== null && (
          <Text style={estilos.cantidad}>
            {cantidad} {cantidad === 1 ? 'libro' : 'libros'}
          </Text>
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espaciado.xl,
    paddingHorizontal: espaciado.lg,
    paddingTop: espaciado.sm,
    paddingBottom: espaciado.xs,
  },
  seccion: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    fontWeight: tipografia.pesoTitular,
  },
  cantidad: {
    color: colores.bosque,
    fontSize: tamanios.textoChico,
    fontWeight: tipografia.pesoFuerte,
  },
});
