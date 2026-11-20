import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colores, degradados, espaciado, sombras, tamanios, tipografia } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { usePermiso } from '../hooks/usePermiso';
import type { Recurso } from '../types';
import { Boton } from './Boton';
import { EstadoCarga } from './EstadoCarga';

const CONTENIDO = {
  camara: {
    icono: 'camera',
    titulo: 'Cámara',
    beneficio: 'Usamos tu cámara para leer el código de barras del libro y abrir su ficha al instante.',
  },
  notificaciones: {
    icono: 'notifications',
    titulo: 'Notificaciones',
    beneficio: 'Usamos las notificaciones para recordarte cuándo devolver un libro y avisarte cuando te toca.',
  },
} as const;

type Props = {
  recurso: Recurso;
  isbn?: string;
};

export function PantallaPermiso({ recurso, isbn }: Props) {
  const { estado, pedir, abrirAjustes } = usePermiso(recurso);
  const { activarRecordatorio } = useBiblioteca();
  const [pidiendo, setPidiendo] = useState(false);
  const contenido = CONTENIDO[recurso];

  async function continuar() {
    setPidiendo(true);
    const concedido = await pedir();
    if (concedido && recurso === 'notificaciones' && isbn) {
      await activarRecordatorio(isbn);
    }
    setPidiendo(false);
    router.back();
  }

  if (estado === 'cargando') {
    return <EstadoCarga mensaje="Consultando el permiso…" />;
  }

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.circulo}>
        <Ionicons name={contenido.icono} size={tamanios.iconoGrande} color={colores.menta} />
      </View>
      <Text style={estilos.titulo} accessibilityRole="header">
        {contenido.titulo}
      </Text>
      <Text style={estilos.beneficio}>{contenido.beneficio}</Text>

      {estado === 'concedido' && (
        <>
          <Text style={estilos.nota}>El permiso ya está concedido.</Text>
          <Boton titulo="Volver" variante="secundario" onPress={() => router.back()} />
        </>
      )}
      {estado === 'preguntable' && (
        <Boton titulo="Continuar" icono="arrow-forward" onPress={continuar} deshabilitado={pidiendo} />
      )}
      {estado === 'bloqueado' && (
        <>
          <Text style={estilos.nota}>
            El permiso está bloqueado. Podés habilitarlo desde los Ajustes del teléfono.
          </Text>
          <Boton titulo="Abrir Ajustes" icono="settings-outline" onPress={abrirAjustes} />
        </>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.lg,
    padding: espaciado.xl,
    backgroundImage: degradados.placa,
    backgroundColor: colores.fondo,
  },
  circulo: {
    width: tamanios.circuloIcono + espaciado.xl,
    height: tamanios.circuloIcono + espaciado.xl,
    borderRadius: tamanios.radioPildora,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.bosque,
    boxShadow: sombras.flotante,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.tituloGrande,
    fontWeight: tipografia.pesoTitular,
    letterSpacing: tipografia.interletraTitular,
  },
  beneficio: {
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    textAlign: 'center',
  },
  nota: {
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
    textAlign: 'center',
  },
});
