import { Stack, useLocalSearchParams } from 'expo-router';

import { MensajeConEnlace } from '../../components/MensajeConEnlace';
import { PantallaPermiso } from '../../components/PantallaPermiso';
import type { Recurso } from '../../types';

const RECURSOS: readonly Recurso[] = ['camara', 'notificaciones'];

function esRecurso(valor: string): valor is Recurso {
  return (RECURSOS as readonly string[]).includes(valor);
}

export default function Permiso() {
  const { recurso, isbn } = useLocalSearchParams<{ recurso: string; isbn?: string }>();

  if (!esRecurso(recurso)) {
    return (
      <MensajeConEnlace
        titulo="Permiso desconocido"
        mensaje="La app solo usa la cámara y las notificaciones."
        textoEnlace="Volver al catálogo"
        destino="/"
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: recurso === 'camara' ? 'Cámara' : 'Notificaciones' }} />
      {/* key: cada recurso tiene su propia instancia y su propio estado */}
      <PantallaPermiso key={recurso} recurso={recurso} isbn={isbn} />
    </>
  );
}
