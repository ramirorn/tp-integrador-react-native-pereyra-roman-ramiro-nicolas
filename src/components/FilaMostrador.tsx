import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MENSAJES } from '../constants/mensajes';
import { colores, espaciado, tamanios } from '../constants/tema';
import type { Cola } from '../estructuras/Cola';
import { buscarLibroPorIsbn } from '../lib/catalogo';
import { Boton } from './Boton';

type Props = {
  isbn: string;
  cola: Cola<string>;
  onEntregar: (isbn: string) => Promise<string | null>;
};

export function FilaMostrador({ isbn, cola, onEntregar }: Props) {
  const [entregando, setEntregando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const titulo = buscarLibroPorIsbn(isbn)?.titulo ?? isbn;
  const frente = cola.frente();

  async function entregar() {
    setEntregando(true);
    const persona = await onEntregar(isbn);
    setMensaje(persona ? `Entregado a ${persona}.` : MENSAJES.esperaVacia);
    setEntregando(false);
  }

  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.texto}>
        {frente ? `Al frente: ${frente}` : MENSAJES.esperaVacia}
      </Text>
      <Text style={estilos.texto}>Esperando: {cola.tamanio}</Text>
      {mensaje && <Text style={estilos.mensaje}>{mensaje}</Text>}
      <Boton
        titulo="Entregar al siguiente"
        onPress={entregar}
        deshabilitado={entregando || cola.estaVacia()}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: espaciado.sm,
    marginHorizontal: espaciado.lg,
    marginBottom: espaciado.md,
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radio,
    borderWidth: tamanios.borde,
    borderColor: colores.borde,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    fontWeight: '600',
  },
  texto: {
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
  },
  mensaje: {
    color: colores.exito,
    fontSize: tamanios.texto,
  },
});
