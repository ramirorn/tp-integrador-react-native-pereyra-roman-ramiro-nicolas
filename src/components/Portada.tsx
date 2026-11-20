import { useState } from 'react';
import { Image, type ImageStyle, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colores, espaciado, sombras, tamanios, tipografia } from '../constants/tema';
import { indiceColorPortada, urlPortada } from '../lib/portadas';
import type { Libro } from '../types';

type Tamanio = 'chica' | 'tarjeta' | 'heroe' | 'detalle';

type Props = {
  libro: Libro;
  tamanio: Tamanio;
};

// Muestra la portada real; si no carga (sin conexión o sin imagen),
// dibuja una portada tipográfica con el título y el autor.
export function Portada({ libro, tamanio }: Props) {
  const [fallo, setFallo] = useState(false);
  const chica = tamanio === 'chica';

  if (fallo) {
    return (
      <View
        style={[estilos.base, medidas[tamanio], estilos.respaldo, fondos[String(indiceColorPortada(libro.isbn))]]}
        accessibilityLabel={`Portada de ${libro.titulo}`}>
        <Text style={[estilos.tituloRespaldo, chica && estilos.tituloChico]} numberOfLines={4}>
          {libro.titulo}
        </Text>
        {!chica && (
          <Text style={estilos.autorRespaldo} numberOfLines={2}>
            {libro.autor}
          </Text>
        )}
      </View>
    );
  }

  return (
    <Image
      source={{ uri: urlPortada(libro.isbn) }}
      style={[estilos.base, medidas[tamanio]]}
      resizeMode="cover"
      onError={() => setFallo(true)}
      accessibilityLabel={`Portada de ${libro.titulo}`}
    />
  );
}

function medida(alto: number): ImageStyle {
  return { height: alto, width: alto * tamanios.proporcionPortada };
}

const medidas = StyleSheet.create({
  chica: medida(tamanios.portadaChica),
  tarjeta: medida(tamanios.portadaTarjeta),
  heroe: medida(tamanios.portadaHeroe),
  detalle: medida(tamanios.portadaDetalle),
});

const fondos = StyleSheet.create(
  Object.fromEntries(
    colores.portadas.map((color, indice): [string, ViewStyle] => [String(indice), { backgroundColor: color }]),
  ),
);

const estilos = StyleSheet.create({
  base: {
    borderRadius: espaciado.sm,
    backgroundColor: colores.placa,
    boxShadow: sombras.portada,
  },
  respaldo: {
    justifyContent: 'space-between',
    padding: espaciado.sm,
  },
  tituloRespaldo: {
    color: colores.textoSobreBosque,
    fontSize: tamanios.texto,
    fontWeight: tipografia.pesoTitular,
  },
  tituloChico: {
    fontSize: tamanios.textoMicro,
  },
  autorRespaldo: {
    color: colores.textoSobreBosqueSuave,
    fontSize: tamanios.textoMicro,
  },
});
