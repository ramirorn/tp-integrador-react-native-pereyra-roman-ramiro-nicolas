import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { LARGO_ISBN } from '../constants/biblioteca';
import { colores, espaciado, tamanios } from '../constants/tema';
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
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>¿No podés escanear? Escribí el ISBN</Text>
      <TextInput
        style={estilos.entrada}
        value={texto}
        onChangeText={(valor) => {
          setTexto(valor);
          setError(null);
        }}
        placeholder="Ej.: 9789500725613"
        placeholderTextColor={colores.textoSecundario}
        keyboardType="number-pad"
        maxLength={LARGO_ISBN + 4}
        accessibilityLabel="ISBN del libro"
        onSubmitEditing={buscar}
      />
      {error && (
        <Text style={estilos.error} accessibilityRole="alert">
          {error}
        </Text>
      )}
      <Boton titulo="Abrir libro" onPress={buscar} deshabilitado={texto.trim() === ''} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espaciado.md,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.subtitulo,
    fontWeight: '600',
  },
  entrada: {
    minHeight: tamanios.toqueMinimo,
    paddingHorizontal: espaciado.md,
    fontSize: tamanios.texto,
    color: colores.texto,
    backgroundColor: colores.superficie,
    borderWidth: tamanios.borde,
    borderColor: colores.borde,
    borderRadius: tamanios.radio,
  },
  error: {
    color: colores.error,
    fontSize: tamanios.texto,
  },
});
