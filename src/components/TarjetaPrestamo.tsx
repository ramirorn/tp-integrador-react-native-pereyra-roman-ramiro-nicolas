import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { SEGUNDOS_RECORDATORIO } from '../constants/biblioteca';
import { colores, espaciado, sombras, tamanios, tipografia } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { buscarLibroPorIsbn } from '../lib/catalogo';
import { formatearFecha } from '../lib/fechas';
import type { Prestamo } from '../types';
import { Boton } from './Boton';
import { Portada } from './Portada';

type Props = {
  prestamo: Prestamo;
};

export function TarjetaPrestamo({ prestamo }: Props) {
  const { activarRecordatorio, desactivarRecordatorio, devolver } = useBiblioteca();
  const [procesando, setProcesando] = useState(false);
  const libro = buscarLibroPorIsbn(prestamo.isbn);
  const titulo = libro?.titulo ?? prestamo.isbn;
  const recordatorioActivo = prestamo.notificacionId !== null;

  // El permiso de notificaciones se pide únicamente desde este interruptor.
  async function cambiarRecordatorio(activar: boolean) {
    setProcesando(true);
    try {
      if (!activar) {
        await desactivarRecordatorio(prestamo.isbn);
        return;
      }
      const resultado = await activarRecordatorio(prestamo.isbn);
      if (resultado === 'sin-permiso') {
        router.push({
          pathname: '/permisos/[recurso]',
          params: { recurso: 'notificaciones', isbn: prestamo.isbn },
        });
      }
    } finally {
      setProcesando(false);
    }
  }

  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.cabecera}>
        {libro && <Portada libro={libro} tamanio="chica" />}
        <View style={estilos.textos}>
          <Text style={estilos.titulo} numberOfLines={2}>
            {titulo}
          </Text>
          <Text style={estilos.etiqueta}>Devolver el</Text>
          <Text style={estilos.fecha}>{formatearFecha(prestamo.vence)}</Text>
        </View>
      </View>
      <View style={estilos.fila}>
        <View style={estilos.textoInterruptor}>
          <Text style={estilos.texto}>Recordarme</Text>
          <Text style={estilos.pista}>Modo demo: aviso a los {SEGUNDOS_RECORDATORIO} segundos.</Text>
        </View>
        <Switch
          value={recordatorioActivo}
          onValueChange={cambiarRecordatorio}
          disabled={procesando}
          accessibilityLabel={`Recordarme devolver ${titulo}`}
          trackColor={{ true: colores.bosque, false: colores.borde }}
          thumbColor={colores.superficie}
        />
      </View>
      <Boton
        titulo="Devolver"
        icono="return-down-back"
        variante="secundario"
        onPress={() => devolver(prestamo.isbn)}
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
  fecha: {
    color: colores.bosque,
    fontSize: tamanios.subtitulo,
    fontWeight: tipografia.pesoTitular,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaciado.md,
    minHeight: tamanios.toqueMinimo,
    paddingHorizontal: espaciado.md,
    borderRadius: tamanios.radio,
    backgroundColor: colores.fondo,
  },
  textoInterruptor: {
    flex: 1,
  },
  texto: {
    color: colores.texto,
    fontSize: tamanios.texto,
    fontWeight: tipografia.pesoMedio,
  },
  pista: {
    color: colores.textoSecundario,
    fontSize: tamanios.textoMicro,
  },
});
