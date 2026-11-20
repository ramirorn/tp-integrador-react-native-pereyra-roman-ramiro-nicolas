import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, degradados, espaciado, sombras, tamanios, tipografia } from '../constants/tema';
import { Boton } from './Boton';

type Props = {
  bloqueada: boolean;
  // Preguntable: abre la pantalla previa. Bloqueada: abre Ajustes.
  onAccion: () => void;
};

// Lo que se ve en lugar de la cámara cuando todavía no hay permiso.
export function SolicitudCamara({ bloqueada, onAccion }: Props) {
  return (
    <View style={estilos.placa}>
      <View style={estilos.circulo}>
        <Ionicons
          name={bloqueada ? 'lock-closed-outline' : 'barcode-outline'}
          size={tamanios.iconoGrande}
          color={colores.bosque}
        />
      </View>
      <Text style={estilos.titulo}>{bloqueada ? 'Cámara bloqueada' : 'Escaneá la contratapa'}</Text>
      <Text style={estilos.texto}>
        {bloqueada
          ? 'Podés habilitarla en Ajustes o escribir el ISBN abajo.'
          : 'Para leer el código de barras necesitamos la cámara. También podés escribir el ISBN abajo.'}
      </Text>
      <Boton
        titulo={bloqueada ? 'Abrir Ajustes' : 'Activar cámara'}
        icono={bloqueada ? 'settings-outline' : 'camera-outline'}
        onPress={onAccion}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  placa: {
    alignItems: 'center',
    gap: espaciado.md,
    padding: espaciado.xl,
    borderRadius: tamanios.radioTarjeta,
    backgroundImage: degradados.placa,
    backgroundColor: colores.placa,
    boxShadow: sombras.tarjeta,
  },
  circulo: {
    width: tamanios.circuloIcono,
    height: tamanios.circuloIcono,
    borderRadius: tamanios.radioPildora,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.superficie,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.titulo,
    fontWeight: tipografia.pesoTitular,
    letterSpacing: tipografia.interletraTitular,
  },
  texto: {
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
    textAlign: 'center',
  },
});
