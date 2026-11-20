import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espaciado, opacidad, sombras, tamanios, tipografia } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';

// Con sesión lleva al mostrador; sin sesión, al login.
export function EnlacePersonal() {
  const { sesion } = useBiblioteca();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(sesion ? '/mostrador' : '/login')}
      style={({ pressed }) => [estilos.boton, pressed && estilos.presionado]}>
      <Ionicons
        name={sesion ? 'storefront-outline' : 'person-circle-outline'}
        size={tamanios.icono}
        color={colores.bosque}
      />
      <Text style={estilos.texto}>{sesion ? 'Mostrador' : 'Personal'}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.xs,
    minHeight: tamanios.toqueMinimo,
    paddingHorizontal: espaciado.md,
    marginRight: espaciado.sm,
    borderRadius: tamanios.radioPildora,
    backgroundColor: colores.superficie,
    boxShadow: sombras.tarjeta,
  },
  presionado: {
    opacity: opacidad.presionado,
  },
  texto: {
    color: colores.bosque,
    fontSize: tamanios.texto,
    fontWeight: tipografia.pesoFuerte,
  },
});
