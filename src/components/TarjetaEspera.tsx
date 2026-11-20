import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios } from '../constants/tema';
import { buscarLibroPorIsbn } from '../lib/catalogo';

type Props = {
  isbn: string;
  posicion: number;
};

export function TarjetaEspera({ isbn, posicion }: Props) {
  const titulo = buscarLibroPorIsbn(isbn)?.titulo ?? isbn;

  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.texto}>
        {posicion === 1
          ? 'Sos el próximo en la lista de espera.'
          : `Estás en la posición ${posicion} de la lista de espera.`}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: espaciado.xs,
    marginHorizontal: espaciado.lg,
    marginBottom: espaciado.md,
    padding: espaciado.lg,
    backgroundColor: colores.avisoSuave,
    borderRadius: tamanios.radio,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    fontWeight: '600',
  },
  texto: {
    color: colores.aviso,
    fontSize: tamanios.texto,
  },
});
