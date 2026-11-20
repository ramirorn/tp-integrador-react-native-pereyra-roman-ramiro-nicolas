import { useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { AppState, Linking } from 'react-native';

import { calcularEstadoPermiso } from '../lib/permisos';
import type { EstadoPermiso, Recurso } from '../types';
import { usePermisosNotificaciones } from './usePermisosNotificaciones';

type Permiso = {
  estado: EstadoPermiso;
  pedir: () => Promise<boolean>;
  abrirAjustes: () => Promise<void>;
};

export function usePermiso(recurso: Recurso): Permiso {
  // Los dos hooks se llaman siempre (reglas de los hooks), pero solo el del
  // recurso pedido consulta al sistema al montarse.
  const camara = useCameraPermissions({ get: recurso === 'camara' });
  const notificaciones = usePermisosNotificaciones({ get: recurso === 'notificaciones' });
  const [respuesta, pedirNativo, obtener] = recurso === 'camara' ? camara : notificaciones;

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
