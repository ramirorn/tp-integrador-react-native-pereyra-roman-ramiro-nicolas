import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios, tipografia } from '../constants/tema';
import type { Aviso } from '../types';
import { BotonIcono } from './BotonIcono';

type Props = {
  aviso: Aviso;
  onDescartar: (id: string) => void;
};

// Aviso dentro de la app: reemplaza a la notificación cuando no hay permiso.
export function TarjetaAviso({ aviso, onDescartar }: Props) {
  return (
    <View style={estilos.tarjeta} accessibilityRole="alert">
      <View style={estilos.icono}>
        <Ionicons name="notifications" size={tamanios.icono} color={colores.menta} />
      </View>
      <Text style={estilos.texto}>{aviso.mensaje}</Text>
      <BotonIcono icono="close" etiqueta="Descartar aviso" onPress={() => onDescartar(aviso.id)} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    padding: espaciado.sm,
    paddingLeft: espaciado.md,
    backgroundColor: colores.mentaClara,
    borderRadius: tamanios.radioTarjeta,
  },
  icono: {
    width: tamanios.toqueMinimo - espaciado.sm,
    height: tamanios.toqueMinimo - espaciado.sm,
    borderRadius: tamanios.radioPildora,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.bosque,
  },
  texto: {
    flex: 1,
    color: colores.bosqueProfundo,
    fontSize: tamanios.texto,
    fontWeight: tipografia.pesoMedio,
  },
});
