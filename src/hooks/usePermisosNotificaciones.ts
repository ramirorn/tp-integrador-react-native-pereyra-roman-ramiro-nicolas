import { createPermissionHook } from 'expo';
import { getPermissionsAsync } from 'expo-notifications';

import { pedirPermisoNotificaciones } from '../lib/notificaciones';

// Mismo formato que useCameraPermissions: [respuesta, pedir, obtener].
// Al pedir, primero se crea el canal "prestamos" (Android 13+).
export const usePermisosNotificaciones = createPermissionHook({
  getMethod: getPermissionsAsync,
  requestMethod: pedirPermisoNotificaciones,
});
