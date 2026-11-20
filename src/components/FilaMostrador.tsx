import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MENSAJES } from '../constants/mensajes';
import { colores, espaciado, sombras, tamanios, tipografia } from '../constants/tema';
import type { Cola } from '../estructuras/Cola';
import { buscarLibroPorIsbn } from '../lib/catalogo';
import { Boton } from './Boton';
import { Portada } from './Portada';

type Props = {
  isbn: string;
  cola: Cola<string>;
  onEntregar: (isbn: string) => Promise<string | null>;
};

export function FilaMostrador({ isbn, cola, onEntregar }: Props) {
  const [entregando, setEntregando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const libro = buscarLibroPorIsbn(isbn);
  const titulo = libro?.titulo ?? isbn;
  const frente = cola.frente();

  async function entregar() {
    setEntregando(true);
    const persona = await onEntregar(isbn);
    setMensaje(persona ? `Entregado a ${persona}.` : MENSAJES.esperaVacia);
    setEntregando(false);
  }

  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.cabecera}>
        {libro && <Portada libro={libro} tamanio="chica" />}
        <View style={estilos.textos}>
          <Text style={estilos.titulo} numberOfLines={2}>
            {titulo}
          </Text>
          <Text style={estilos.etiqueta}>Al frente</Text>
          <Text style={estilos.frente}>{frente ?? 'Nadie'}</Text>
        </View>
        <View style={estilos.contador} accessible accessibilityLabel={`Esperando: ${cola.tamanio}`}>
          <Text style={estilos.etiquetaContador}>Esperan</Text>
          <Text style={estilos.numero}>{cola.tamanio}</Text>
        </View>
      </View>
      {mensaje && <Text style={estilos.mensaje}>{mensaje}</Text>}
      {cola.estaVacia() && !mensaje && <Text style={estilos.vacio}>{MENSAJES.esperaVacia}</Text>}
      <Boton
        titulo="Entregar al siguiente"
        icono="hand-right-outline"
        onPress={entregar}
        deshabilitado={entregando || cola.estaVacia()}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: espaciado.md,
    marginHorizontal: espaciado.lg,
    marginBottom: espaciado.md,
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radioTarjeta,
    boxShadow: sombras.tarjeta,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.lg,
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
  etiqueta: {
    marginTop: espaciado.xs,
    color: colores.textoSecundario,
    fontSize: tamanios.textoChico,
  },
  frente: {
    color: colores.bosque,
    fontSize: tamanios.texto,
    fontWeight: tipografia.pesoTitular,
  },
  contador: {
    alignItems: 'center',
    minWidth: tamanios.circuloIcono,
    paddingVertical: espaciado.sm,
    borderRadius: tamanios.radioTarjeta - espaciado.sm,
    backgroundColor: colores.placa,
  },
  etiquetaContador: {
    color: colores.textoSecundario,
    fontSize: tamanios.textoMini,
  },
  numero: {
    color: colores.bosque,
    fontSize: tamanios.cifra,
    fontWeight: tipografia.pesoTitular,
    fontVariant: ['tabular-nums'],
  },
  mensaje: {
    color: colores.exito,
    fontSize: tamanios.texto,
    fontWeight: tipografia.pesoMedio,
  },
  vacio: {
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
  },
});
