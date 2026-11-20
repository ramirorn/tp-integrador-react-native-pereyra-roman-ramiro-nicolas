import { Stack, useLocalSearchParams } from 'expo-router';

import { DetalleLibro } from '../../../../components/DetalleLibro';
import { MensajeConEnlace } from '../../../../components/MensajeConEnlace';
import { MENSAJES } from '../../../../constants/mensajes';
import { buscarLibroPorIsbn, esIsbnValido } from '../../../../lib/catalogo';

export default function PantallaLibro() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();

  if (!esIsbnValido(isbn)) {
    return (
      <>
        <Stack.Screen options={{ title: 'ISBN inválido' }} />
        <MensajeConEnlace
          titulo="ISBN inválido"
          mensaje={MENSAJES.isbnInvalido}
          textoEnlace="Volver al catálogo"
          destino="/"
        />
      </>
    );
  }

  const libro = buscarLibroPorIsbn(isbn);

  if (!libro) {
    return (
      <>
        <Stack.Screen options={{ title: 'Libro no encontrado' }} />
        <MensajeConEnlace
          titulo="Libro no encontrado"
          mensaje={MENSAJES.libroInexistente}
          textoEnlace="Volver al catálogo"
          destino="/"
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: libro.titulo }} />
      <DetalleLibro libro={libro} />
    </>
  );
}
