import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, sombras, tamanios, tipografia } from '../constants/tema';
import { Boton } from './Boton';

type Props = {
  mensaje: string;
  onReintentar: () => void;
};

export function EstadoError({ mensaje, onReintentar }: Props) {
  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.circulo}>
        <Ionicons name="cloud-offline-outline" size={tamanios.iconoGrande} color={colores.error} />
      </View>
      <Text style={estilos.titulo}>Algo salió mal</Text>
      <Text style={estilos.texto} accessibilityRole="alert">
        {mensaje}
      </Text>
      <Boton titulo="Reintentar" icono="refresh" onPress={onReintentar} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    alignItems: 'center',
    gap: espaciado.md,
    margin: espaciado.lg,
    padding: espaciado.xl,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radioTarjeta,
    boxShadow: sombras.tarjeta,
  },
  circulo: {
    width: tamanios.circuloIcono,
    height: tamanios.circuloIcono,
    borderRadius: tamanios.radioPildora,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.errorSuave,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    fontWeight: tipografia.pesoTitular,
  },
  texto: {
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
    textAlign: 'center',
  },
});
