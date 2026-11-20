import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { SEGUNDOS_RECORDATORIO } from '../constants/biblioteca';
import { colores, espaciado, tamanios } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { buscarLibroPorIsbn } from '../lib/catalogo';
import { formatearFecha } from '../lib/fechas';
import type { Prestamo } from '../types';
import { Boton } from './Boton';

type Props = {
  prestamo: Prestamo;
};

export function TarjetaPrestamo({ prestamo }: Props) {
  const { activarRecordatorio, desactivarRecordatorio, devolver } = useBiblioteca();
  const [procesando, setProcesando] = useState(false);
  const titulo = buscarLibroPorIsbn(prestamo.isbn)?.titulo ?? prestamo.isbn;
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
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.texto}>Devolución: {formatearFecha(prestamo.vence)}</Text>
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
          trackColor={{ true: colores.primario, false: colores.borde }}
        />
      </View>
      <Boton titulo="Devolver" variante="secundario" onPress={() => devolver(prestamo.isbn)} />
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
    color: colores.texto,
    fontSize: tamanios.texto,
  },
  pista: {
    color: colores.textoSecundario,
    fontSize: tamanios.textoChico,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: tamanios.toqueMinimo,
  },
  textoInterruptor: {
    flex: 1,
  },
});
