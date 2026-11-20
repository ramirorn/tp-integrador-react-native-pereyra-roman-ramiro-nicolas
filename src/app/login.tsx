import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Boton } from '../components/Boton';
import { MENSAJES } from '../constants/mensajes';
import { colores, espaciado, tamanios } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';

export default function Login() {
  const { iniciarSesion } = useBiblioteca();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Si la sesión se inicia, Stack.Protected quita esta pantalla sola.
  function ingresar() {
    if (!iniciarSesion(usuario, clave)) {
      setError(MENSAJES.loginIncorrecto);
    }
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.texto}>Ingresá con el usuario del personal de la biblioteca.</Text>
      <TextInput
        style={estilos.entrada}
        value={usuario}
        onChangeText={setUsuario}
        placeholder="Usuario"
        placeholderTextColor={colores.textoSecundario}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Usuario"
      />
      <TextInput
        style={estilos.entrada}
        value={clave}
        onChangeText={setClave}
        placeholder="Clave"
        placeholderTextColor={colores.textoSecundario}
        secureTextEntry
        accessibilityLabel="Clave"
        onSubmitEditing={ingresar}
      />
      {error && (
        <Text style={estilos.error} accessibilityRole="alert">
          {error}
        </Text>
      )}
      <Boton titulo="Ingresar" onPress={ingresar} deshabilitado={!usuario || !clave} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    gap: espaciado.md,
    padding: espaciado.xl,
    backgroundColor: colores.fondo,
  },
  texto: {
    color: colores.texto,
    fontSize: tamanios.texto,
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
