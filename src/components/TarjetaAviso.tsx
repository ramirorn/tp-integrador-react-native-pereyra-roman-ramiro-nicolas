import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios } from '../constants/tema';
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
      <Ionicons name="notifications" size={tamanios.icono} color={colores.exito} />
      <Text style={estilos.texto}>{aviso.mensaje}</Text>
      <BotonIcono icono="close" etiqueta="Descartar aviso" onPress={() => onDescartar(aviso.id)} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
    paddingLeft: espaciado.md,
    backgroundColor: colores.exitoSuave,
    borderRadius: tamanios.radio,
  },
  texto: {
    flex: 1,
    color: colores.texto,
    fontSize: tamanios.texto,
  },
});
