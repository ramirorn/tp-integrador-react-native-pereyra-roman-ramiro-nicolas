import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios } from '../constants/tema';
import { Boton } from './Boton';

type Props = {
  bloqueada: boolean;
  // Preguntable: abre la pantalla previa. Bloqueada: abre Ajustes.
  onAccion: () => void;
};

// Lo que se ve en lugar de la cámara cuando todavía no hay permiso.
export function SolicitudCamara({ bloqueada, onAccion }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Ionicons name="camera-outline" size={tamanios.iconoGrande} color={colores.primario} />
      <Text style={estilos.texto}>
        {bloqueada
          ? 'La cámara está bloqueada para esta app. Podés habilitarla en Ajustes o escribir el ISBN abajo.'
          : 'Para escanear necesitamos usar la cámara. También podés escribir el ISBN abajo.'}
      </Text>
      <Boton titulo={bloqueada ? 'Abrir Ajustes' : 'Activar cámara'} onPress={onAccion} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    gap: espaciado.md,
    padding: espaciado.xl,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radio,
    borderWidth: tamanios.borde,
    borderColor: colores.borde,
  },
  texto: {
    color: colores.texto,
    fontSize: tamanios.texto,
    textAlign: 'center',
  },
});
