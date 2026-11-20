import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { LARGO_ISBN } from '../constants/biblioteca';
import { colores, espaciado, sombras, tamanios, tipografia } from '../constants/tema';
import { Boton } from './Boton';

type Props = {
  // Devuelve un mensaje de error para mostrar, o null si el ISBN se abrió.
  onIsbn: (isbn: string) => string | null;
};

// Alternativa siempre disponible: funciona aunque la cámara esté bloqueada.
export function IngresoIsbn({ onIsbn }: Props) {
  const [texto, setTexto] = useState('');
  const [error, setError] = useState<string | null>(null);

  function buscar() {
    setError(onIsbn(texto));
  }

  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.titulo}>¿No podés escanear?</Text>
      <Text style={estilos.texto}>Escribí los 13 números del ISBN.</Text>
      <View style={[estilos.campo, error !== null && estilos.campoError]}>
        <Ionicons name="keypad-outline" size={tamanios.icono} color={colores.textoSecundario} />
        <TextInput
          style={estilos.entrada}
          value={texto}
          onChangeText={(valor) => {
            setTexto(valor);
            setError(null);
          }}
          placeholder="Ej.: 9788499089515"
          placeholderTextColor={colores.textoSecundario}
          selectionColor={colores.bosque}
          keyboardType="number-pad"
          maxLength={LARGO_ISBN + 4}
          accessibilityLabel="ISBN del libro"
          onSubmitEditing={buscar}
        />
      </View>
      {error && (
        <Text style={estilos.error} accessibilityRole="alert">
          {error}
        </Text>
      )}
      <Boton
        titulo="Abrir libro"
        icono="arrow-forward"
        onPress={buscar}
        deshabilitado={texto.trim() === ''}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: espaciado.md,
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radioTarjeta,
    boxShadow: sombras.tarjeta,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    fontWeight: tipografia.pesoTitular,
  },
  texto: {
    color: colores.textoSecundario,
    fontSize: tamanios.textoChico,
  },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
    paddingHorizontal: espaciado.lg,
    minHeight: tamanios.toqueMinimo + espaciado.sm,
    borderRadius: tamanios.radioPildora,
    borderWidth: tamanios.borde,
    borderColor: colores.borde,
    backgroundColor: colores.fondo,
  },
  campoError: {
    borderColor: colores.error,
  },
  entrada: {
    flex: 1,
    minHeight: tamanios.toqueMinimo,
    fontSize: tamanios.subtitulo,
    color: colores.texto,
    fontVariant: ['tabular-nums'],
  },
  error: {
    color: colores.error,
    fontSize: tamanios.texto,
  },
});
