import { useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { AppState, Linking } from 'react-native';

import { calcularEstadoPermiso } from '../lib/permisos';
import type { EstadoPermiso, Recurso } from '../types';
import { usePermisosNotificaciones } from './usePermisosNotificaciones';

const HOOKS_NATIVOS = {
  camara: useCameraPermissions,
  notificaciones: usePermisosNotificaciones,
} as const;

type Permiso = {
  estado: EstadoPermiso;
  pedir: () => Promise<boolean>;
  abrirAjustes: () => Promise<void>;
};

// El recurso no debe cambiar durante la vida del componente: decide qué
// hook nativo se llama. Las pantallas usan key={recurso} para garantizarlo.
export function usePermiso(recurso: Recurso): Permiso {
  const usePermisoNativo = HOOKS_NATIVOS[recurso];
  const [respuesta, pedirNativo, obtener] = usePermisoNativo();

  // Volver de Ajustes: la app pasa de segundo plano a "active".
  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') {
        obtener();
      }
    });
    return () => suscripcion.remove();
  }, [obtener]);

  // Volver a esta pantalla desde otra pestaña o pantalla.
  useFocusEffect(
    useCallback(() => {
      obtener();
    }, [obtener]),
  );

  const pedir = useCallback(async () => {
    const nueva = await pedirNativo();
    return nueva.granted;
  }, [pedirNativo]);

  const abrirAjustes = useCallback(() => Linking.openSettings(), []);

  return { estado: calcularEstadoPermiso(respuesta), pedir, abrirAjustes };
}
