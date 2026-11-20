import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { colores, espaciado, tamanios } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';

// Con sesión lleva al mostrador; sin sesión, al login.
export function EnlacePersonal() {
  const { sesion } = useBiblioteca();

  return (
    <Link
      href={sesion ? '/mostrador' : '/login'}
      accessibilityRole="button"
      style={estilos.enlace}>
      {sesion ? 'Mostrador' : 'Personal'}
    </Link>
  );
}

const estilos = StyleSheet.create({
  enlace: {
    minHeight: tamanios.toqueMinimo,
    paddingHorizontal: espaciado.sm,
    paddingVertical: espaciado.md,
    color: colores.primario,
    fontSize: tamanios.texto,
    fontWeight: '600',
  },
});
