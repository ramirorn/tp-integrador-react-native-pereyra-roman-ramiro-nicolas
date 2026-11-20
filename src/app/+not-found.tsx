import { usePathname } from 'expo-router';

import { MensajeConEnlace } from '../components/MensajeConEnlace';

export default function NoEncontrada() {
  const ruta = usePathname();

  return (
    <MensajeConEnlace
      titulo="Página no encontrada"
      mensaje={`La dirección "${ruta}" no existe en Biblioteca IPF.`}
      textoEnlace="Ir al catálogo"
      destino="/"
    />
  );
}
