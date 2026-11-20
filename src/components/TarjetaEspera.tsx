import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, sombras, tamanios, tipografia } from '../constants/tema';
import { buscarLibroPorIsbn } from '../lib/catalogo';
import { Portada } from './Portada';

type Props = {
  isbn: string;
  posicion: number;
};

export function TarjetaEspera({ isbn, posicion }: Props) {
  const libro = buscarLibroPorIsbn(isbn);
  const titulo = libro?.titulo ?? isbn;

  return (
    <View style={estilos.tarjeta}>
      {libro && <Portada libro={libro} tamanio="chica" />}
      <View style={estilos.textos}>
        <Text style={estilos.titulo} numberOfLines={2}>
          {titulo}
        </Text>
        <Text style={estilos.texto}>
          {posicion === 1 ? 'Sos el próximo en la lista.' : 'Lista de espera en curso.'}
        </Text>
      </View>
      <View style={estilos.posicion} accessible accessibilityLabel={`Posición ${posicion}`}>
        <Text style={estilos.etiquetaPosicion}>Posición</Text>
        <Text style={estilos.numero}>{posicion}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.lg,
    marginHorizontal: espaciado.lg,
    marginBottom: espaciado.md,
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radioTarjeta,
    boxShadow: sombras.tarjeta,
  },
  textos: {
    flex: 1,
    gap: espaciado.xs,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    fontWeight: tipografia.pesoTitular,
  },
  texto: {
    color: colores.textoSecundario,
    fontSize: tamanios.textoChico,
  },
  posicion: {
    alignItems: 'center',
    minWidth: tamanios.circuloIcono,
    paddingVertical: espaciado.sm,
    borderRadius: tamanios.radioTarjeta - espaciado.sm,
    backgroundColor: colores.bosque,
  },
  etiquetaPosicion: {
    color: colores.textoSobreBosqueSuave,
    fontSize: tamanios.textoMicro,
  },
  numero: {
    color: colores.menta,
    fontSize: tamanios.cifra,
    fontWeight: tipografia.pesoTitular,
    fontVariant: ['tabular-nums'],
  },
});
