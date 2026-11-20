import { type BarcodeScanningResult, CameraView } from 'expo-camera';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios } from '../constants/tema';

type Props = {
  onCodigo: (codigo: string) => void;
};

export function EscanerCamara({ onCodigo }: Props) {
  function alEscanear(resultado: BarcodeScanningResult) {
    onCodigo(resultado.data);
  }

  return (
    <View style={estilos.contenedor}>
      <CameraView
        style={estilos.camara}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
        onBarcodeScanned={alEscanear}
        accessibilityLabel="Vista de la cámara para escanear el código de barras"
      />
      <View style={estilos.marco} pointerEvents="none" />
      <Text style={estilos.ayuda}>Apuntá al código de barras de la contratapa.</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    height: tamanios.alturaCamara,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: tamanios.radio,
    backgroundColor: colores.camaraFondo,
  },
  camara: {
    ...StyleSheet.absoluteFillObject,
  },
  marco: {
    width: tamanios.marcoEscaner,
    height: tamanios.marcoEscaner / 2,
    borderWidth: tamanios.anchoMarcoEscaner,
    borderColor: colores.textoInverso,
    borderRadius: tamanios.radio,
  },
  ayuda: {
    position: 'absolute',
    bottom: espaciado.md,
    color: colores.textoInverso,
    fontSize: tamanios.textoChico,
  },
});
