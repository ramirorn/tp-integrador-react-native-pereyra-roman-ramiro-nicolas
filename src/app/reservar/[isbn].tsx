import { useLocalSearchParams } from 'expo-router';

import { ConfirmacionReserva } from '../../components/ConfirmacionReserva';
import { MensajeConEnlace } from '../../components/MensajeConEnlace';
import { MENSAJES } from '../../constants/mensajes';
import { buscarLibroPorIsbn, esIsbnValido } from '../../lib/catalogo';

export default function Reservar() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const libro = esIsbnValido(isbn) ? buscarLibroPorIsbn(isbn) : undefined;

  if (!libro) {
    return (
      <MensajeConEnlace
        titulo="No se puede reservar"
        mensaje={MENSAJES.libroInexistente}
        textoEnlace="Volver al catálogo"
        destino="/"
      />
    );
  }

  return <ConfirmacionReserva libro={libro} />;
}
