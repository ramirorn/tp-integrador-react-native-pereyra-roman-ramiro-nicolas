import type { PermissionResponse } from 'expo-camera';

import type { EstadoPermiso } from '../types';

// Traduce la respuesta del sistema a los cuatro estados que maneja la app.
// canAskAgain es lo que distingue "preguntable" de "bloqueado".
export function calcularEstadoPermiso(respuesta: PermissionResponse | null): EstadoPermiso {
  if (!respuesta) {
    return 'cargando';
  }
  if (respuesta.granted) {
    return 'concedido';
  }
  return respuesta.canAskAgain ? 'preguntable' : 'bloqueado';
}
