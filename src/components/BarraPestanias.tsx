import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colores, espaciado, opacidad, sombras, tamanios, tipografia } from '../constants/tema';

type NombreIcono = ComponentProps<typeof Ionicons>['name'];

const ICONOS: Record<string, { activo: NombreIcono; inactivo: NombreIcono }> = {
  '(catalogo)': { activo: 'library', inactivo: 'library-outline' },
  reservas: { activo: 'bookmarks', inactivo: 'bookmarks-outline' },
};

// Barra flotante verde bosque: dos pestañas y, en el centro, el botón
// elevado que abre el escáner (es una acción, no una pestaña).
export function BarraPestanias({ state, descriptors, emitter, navigateToTab }: BottomTabBarProps) {
  const [primera, ...resto] = state.routes;

  function renderizarPestania(ruta: (typeof state.routes)[number]) {
    const indice = state.routes.indexOf(ruta);
    const enfocada = state.index === indice;
    const { options } = descriptors[ruta.key];
    const titulo = typeof options.title === 'string' ? options.title : ruta.name;
    const iconos = ICONOS[ruta.name];

    function alPresionar() {
      const evento = emitter.emit({ type: 'tabPress', target: ruta.key, canPreventDefault: true });
      if (!enfocada && !evento.defaultPrevented) {
        navigateToTab(ruta.key);
      }
    }

    return (
      <Pressable
        key={ruta.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: enfocada }}
        accessibilityLabel={titulo}
        onPress={alPresionar}
        style={({ pressed }) => [estilos.pestania, pressed && estilos.presionado]}>
        {iconos && (
          <Ionicons
            name={enfocada ? iconos.activo : iconos.inactivo}
            size={tamanios.icono}
            color={enfocada ? colores.menta : colores.textoSobreBosqueSuave}
          />
        )}
        <Text style={[estilos.etiqueta, enfocada && estilos.etiquetaActiva]}>{titulo}</Text>
      </Pressable>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={estilos.contenedor}>
      <View style={estilos.barra}>
        {primera && renderizarPestania(primera)}
        <View style={estilos.hueco} />
        {resto.map(renderizarPestania)}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Escanear código de barras"
        onPress={() => router.push('/escanear')}
        style={({ pressed }) => [estilos.botonCentral, pressed && estilos.presionado]}>
        <Ionicons name="barcode-outline" size={tamanios.iconoGrande - espaciado.sm} color={colores.bosqueProfundo} />
      </Pressable>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: espaciado.lg,
    alignItems: 'center',
  },
  barra: {
    marginBottom: espaciado.md,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: tamanios.alturaBarra,
    paddingHorizontal: espaciado.lg,
    borderRadius: tamanios.radioTarjeta + espaciado.sm,
    backgroundColor: colores.bosqueProfundo,
    boxShadow: sombras.flotante,
  },
  pestania: {
    flex: 1,
    minHeight: tamanios.toqueMinimo,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.xs,
  },
  hueco: {
    width: tamanios.botonCentral + espaciado.lg,
  },
  etiqueta: {
    color: colores.textoSobreBosqueSuave,
    fontSize: tamanios.textoMicro,
    fontWeight: tipografia.pesoMedio,
  },
  etiquetaActiva: {
    color: colores.menta,
  },
  botonCentral: {
    position: 'absolute',
    top: -tamanios.elevacionBotonCentral,
    width: tamanios.botonCentral,
    height: tamanios.botonCentral,
    borderRadius: tamanios.radioPildora,
    borderWidth: espaciado.xs,
    borderColor: colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.menta,
    boxShadow: sombras.flotante,
  },
  presionado: {
    opacity: opacidad.presionado,
  },
});
