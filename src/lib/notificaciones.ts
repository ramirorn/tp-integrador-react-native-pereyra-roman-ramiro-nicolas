import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { CANAL_PRESTAMOS, SEGUNDOS_RECORDATORIO } from '../constants/biblioteca';
import { colores } from '../constants/tema';

// Muestra las notificaciones también cuando la app está abierta.
export function configurarNotificaciones(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// En Android 13+ el canal tiene que existir antes de pedir el permiso.
export async function crearCanalPrestamos(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await Notifications.setNotificationChannelAsync(CANAL_PRESTAMOS, {
    name: 'Préstamos',
    description: 'Recordatorios de devolución y libros listos para retirar.',
    importance: AndroidImportance.HIGH,
    lightColor: colores.primario,
  });
}

export async function pedirPermisoNotificaciones(): Promise<Notifications.NotificationPermissionsStatus> {
  await crearCanalPrestamos();
  return Notifications.requestPermissionsAsync();
}

// Se consulta en el momento: el permiso pudo cambiar desde Ajustes.
export async function notificacionesPermitidas(): Promise<boolean> {
  const { granted } = await Notifications.getPermissionsAsync();
  return granted;
}

export async function programarRecordatorio(titulo: string): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Recordatorio de devolución',
      body: `Acordate de devolver "${titulo}" a la biblioteca.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: SEGUNDOS_RECORDATORIO,
      channelId: CANAL_PRESTAMOS,
    },
  });
}

export async function cancelarRecordatorio(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}

export async function notificarLibroListo(titulo: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¡Tu libro está listo!',
      body: `Ya podés retirar "${titulo}" en el mostrador de la biblioteca.`,
    },
    trigger: { channelId: CANAL_PRESTAMOS },
  });
}
