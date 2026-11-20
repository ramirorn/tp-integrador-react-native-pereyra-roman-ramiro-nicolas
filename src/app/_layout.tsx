import { StatusBar } from 'expo-status-bar';

import { NavegacionRaiz } from '../components/NavegacionRaiz';
import { BibliotecaProvider } from '../context/BibliotecaProvider';
import { configurarNotificaciones } from '../lib/notificaciones';

// Un deep link a /buscar deja las pestañas debajo en la pila.
export const unstable_settings = {
  anchor: '(tabs)',
};

configurarNotificaciones();

export default function RootLayout() {
  return (
    <BibliotecaProvider>
      <StatusBar style="dark" />
      <NavegacionRaiz />
    </BibliotecaProvider>
  );
}
