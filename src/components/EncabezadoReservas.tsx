import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, tamanios, tipografia } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { usePermiso } from '../hooks/usePermiso';
import { TarjetaAviso } from './TarjetaAviso';

const TEXTO_PERMISO = {
  cargando: 'Consultando el estado de las notificaciones…',
  concedido: 'Notificaciones activadas: te avisamos aunque la app esté cerrada.',
  preguntable: 'Notificaciones sin activar: se piden al encender "Recordarme".',
  bloqueado: 'Notificaciones bloqueadas: los avisos van a aparecer acá, dentro de la app.',
} as const;

type Props = {
  hayItems: boolean;
};

export function EncabezadoReservas({ hayItems }: Props) {
  const { avisos, descartarAviso } = useBiblioteca();
  const { estado } = usePermiso('notificaciones');
  const activas = estado === 'concedido';

  return (
    <View style={estilos.contenedor}>
      <View style={[estilos.permiso, activas && estilos.permisoActivo]}>
        <Ionicons
          name={activas ? 'notifications' : 'notifications-off-outline'}
          size={tamanios.icono}
          color={activas ? colores.exito : colores.aviso}
        />
        <Text style={[estilos.textoPermiso, activas && estilos.textoPermisoActivo]}>
          {TEXTO_PERMISO[estado]}
        </Text>
      </View>
      {avisos.map((aviso) => (
        <TarjetaAviso key={aviso.id} aviso={aviso} onDescartar={descartarAviso} />
      ))}
      {hayItems && (
        <Text style={estilos.titulo} accessibilityRole="header">
          Préstamos y reservas
        </Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espaciado.md,
    padding: espaciado.lg,
  },
  permiso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
    padding: espaciado.md,
    backgroundColor: colores.avisoSuave,
    borderRadius: tamanios.radioTarjeta,
  },
  permisoActivo: {
    backgroundColor: colores.exitoSuave,
  },
  textoPermiso: {
    flex: 1,
    color: colores.aviso,
    fontSize: tamanios.textoChico,
  },
  textoPermisoActivo: {
    color: colores.exito,
  },
  titulo: {
    marginTop: espaciado.sm,
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    fontWeight: tipografia.pesoTitular,
  },
});
