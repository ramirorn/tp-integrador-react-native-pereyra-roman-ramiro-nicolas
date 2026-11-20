import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Boton } from '../components/Boton';
import { MENSAJES } from '../constants/mensajes';
import { colores, espaciado, sombras, tamanios, tipografia } from '../constants/tema';
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
      <View style={estilos.circulo}>
        <Ionicons name="storefront" size={tamanios.iconoGrande} color={colores.menta} />
      </View>
      <Text style={estilos.titulo} accessibilityRole="header">
        Mostrador
      </Text>
      <Text style={estilos.texto}>Ingresá con el usuario del personal de la biblioteca.</Text>
      <View style={estilos.tarjeta}>
        <View style={[estilos.campo, error !== null && estilos.campoError]}>
          <Ionicons name="person-outline" size={tamanios.icono} color={colores.textoSecundario} />
          <TextInput
            style={estilos.entrada}
            value={usuario}
            onChangeText={setUsuario}
            placeholder="Usuario"
            placeholderTextColor={colores.textoSecundario}
            selectionColor={colores.bosque}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Usuario"
          />
        </View>
        <View style={[estilos.campo, error !== null && estilos.campoError]}>
          <Ionicons name="lock-closed-outline" size={tamanios.icono} color={colores.textoSecundario} />
          <TextInput
            style={estilos.entrada}
            value={clave}
            onChangeText={setClave}
            placeholder="Clave"
            placeholderTextColor={colores.textoSecundario}
            selectionColor={colores.bosque}
            secureTextEntry
            accessibilityLabel="Clave"
            onSubmitEditing={ingresar}
          />
        </View>
        {error && (
          <Text style={estilos.error} accessibilityRole="alert">
            {error}
          </Text>
        )}
        <Boton titulo="Ingresar" icono="log-in-outline" onPress={ingresar} deshabilitado={!usuario || !clave} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    gap: espaciado.md,
    padding: espaciado.xl,
    backgroundColor: colores.fondo,
  },
  circulo: {
    width: tamanios.circuloIcono,
    height: tamanios.circuloIcono,
    borderRadius: tamanios.radioPildora,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.bosque,
    boxShadow: sombras.flotante,
  },
  titulo: {
    color: colores.texto,
    fontSize: tamanios.tituloGrande,
    fontWeight: tipografia.pesoTitular,
    letterSpacing: tipografia.interletraTitular,
  },
  texto: {
    color: colores.textoSecundario,
    fontSize: tamanios.texto,
    textAlign: 'center',
  },
  tarjeta: {
    alignSelf: 'stretch',
    gap: espaciado.md,
    marginTop: espaciado.md,
    padding: espaciado.lg,
    backgroundColor: colores.superficie,
    borderRadius: tamanios.radioTarjeta,
    boxShadow: sombras.tarjeta,
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
  },
  error: {
    color: colores.error,
    fontSize: tamanios.texto,
  },
});
