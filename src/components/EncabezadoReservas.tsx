import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { usePermiso } from '../hooks/usePermiso';
import { TarjetaAviso } from './TarjetaAviso';

const TEXTO_PERMISO = {
  cargando: 'Consultando el estado de las notificaciones…',
  concedido: 'Notificaciones activadas: te avisamos aunque la app esté cerrada.',
  preguntable: 'Notificaciones sin activar: se piden al encender "Recordarme".',
  bloqueado: 'Notificaciones bloqueadas: los avisos van a aparecer acá, dentro de la app.',
} as const;

export function EncabezadoReservas() {
  const { avisos, descartarAviso } = useBiblioteca();
  const { estado } = usePermiso('notificaciones');

  return (
    <View style={estilos.contenedor}>
      <Text style={[estilos.permiso, estado === 'concedido' && estilos.permisoActivo]}>
        {TEXTO_PERMISO[estado]}
      </Text>
      {avisos.map((aviso) => (
        <TarjetaAviso key={aviso.id} aviso={aviso} onDescartar={descartarAviso} />
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espaciado.md,
    padding: espaciado.lg,
  },
  permiso: {
    color: colores.aviso,
    fontSize: tamanios.textoChico,
    padding: espaciado.md,
    backgroundColor: colores.avisoSuave,
    borderRadius: tamanios.radio,
  },
  permisoActivo: {
    color: colores.exito,
    backgroundColor: colores.exitoSuave,
  },
});
