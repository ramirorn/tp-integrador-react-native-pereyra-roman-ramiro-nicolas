import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DIAS_PRESTAMO } from '../constants/biblioteca';
import { MENSAJES } from '../constants/mensajes';
import { colores, espaciado, sombras, tamanios, tipografia } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { formatearFecha, sumarDias } from '../lib/fechas';
import type { Libro } from '../types';
import { Boton } from './Boton';
import { Portada } from './Portada';

type Props = {
  libro: Libro;
};

export function ConfirmacionReserva({ libro }: Props) {
  const { disponibles, esperas, posicionDe, prestamoDe, reservar } = useBiblioteca();
  const [rechazo, setRechazo] = useState<string | null>(null);
  // Evita que, mientras el modal se cierra, se vea el aviso de "ya reservado".
  const [confirmado, setConfirmado] = useState(false);

  const yaReservado = prestamoDe(libro.isbn) !== undefined || posicionDe(libro.isbn) !== null;
  const hayEjemplares = disponibles(libro) > 0;
  const posicionFutura = (esperas[libro.isbn]?.tamanio ?? 0) + 1;
  const devolucion = formatearFecha(sumarDias(new Date(), DIAS_PRESTAMO).toISOString());

  function confirmar() {
    const resultado = reservar(libro.isbn);
    if (resultado.tipo === 'rechazada') {
      setRechazo(resultado.motivo);
      return;
    }
    setConfirmado(true);
    // Se cierra el modal y se va a /reservas: "atrás" ya no vuelve acá.
    router.dismiss();
    router.navigate('/reservas');
  }

  if (yaReservado && !confirmado) {
    return (
      <View style={estilos.contenedor}>
        <Text style={estilos.titulo}>{libro.titulo}</Text>
        <Text style={estilos.aviso} accessibilityRole="alert">
          {MENSAJES.yaReservado}
        </Text>
        <Boton titulo="Volver" variante="secundario" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.resumen}>
        <Portada libro={libro} tamanio="chica" />
        <View style={estilos.textos}>
          <Text style={estilos.titulo} accessibilityRole="header">
            {libro.titulo}
          </Text>
          <Text style={estilos.autor}>{libro.autor}</Text>
        </View>
      </View>
      <View style={[estilos.condicion, !hayEjemplares && estilos.condicionEspera]}>
        <Text style={estilos.etiqueta}>{hayEjemplares ? 'Préstamo' : 'Lista de espera'}</Text>
        <Text style={estilos.cifra}>
          {hayEjemplares ? `${DIAS_PRESTAMO} días` : `Posición ${posicionFutura}`}
        </Text>
        <Text style={estilos.texto}>
          {hayEjemplares
            ? `Hay ejemplares disponibles. Lo devolvés el ${devolucion}.`
            : 'No quedan ejemplares. Te avisamos cuando te toque retirarlo.'}
        </Text>
      </View>
      {rechazo && (
        <Text style={estilos.aviso} accessibilityRole="alert">
          {rechazo}
        </Text>
      )}
      <Boton
        titulo={hayEjemplares ? 'Confirmar préstamo' : 'Anotarme en la lista'}
        icono="checkmark"
        onPress={confirmar}
      />
      <Boton titulo="Cancelar" variante="secundario" onPress={() => router.back()} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    gap: espaciado.lg,
    padding: espaciado.xl,
    backgroundColor: colores.fondo,
  },
  resumen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.lg,
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radioTarjeta,
    boxShadow: sombras.tarjeta,
  },
  textos: {
    flex: 1,
    gap: espaciado.xs,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.titulo,
    fontWeight: tipografia.pesoTitular,
    letterSpacing: tipografia.interletraTitular,
  },
  autor: {
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
  },
  condicion: {
    gap: espaciado.xs,
    padding: espaciado.xl,
    borderRadius: tamanios.radioTarjeta,
    backgroundColor: colores.bosque,
  },
  condicionEspera: {
    backgroundColor: colores.bosqueProfundo,
  },
  etiqueta: {
    color: colores.textoSobreBosqueSuave,
    fontSize: tamanios.textoChico,
  },
  cifra: {
    color: colores.menta,
    fontSize: tamanios.cifra,
    fontWeight: tipografia.pesoTitular,
  },
  texto: {
    color: colores.textoSobreBosque,
    fontSize: tamanios.texto,
  },
  aviso: {
    color: colores.aviso,
    fontSize: tamanios.texto,
    padding: espaciado.lg,
    overflow: 'hidden',
    backgroundColor: colores.avisoSuave,
    borderRadius: tamanios.radioTarjeta,
  },
});
