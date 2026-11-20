import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { EscanerCamara } from '../../../components/EscanerCamara';
import { EstadoCarga } from '../../../components/EstadoCarga';
import { IngresoIsbn } from '../../../components/IngresoIsbn';
import { SolicitudCamara } from '../../../components/SolicitudCamara';
import { MENSAJES } from '../../../constants/mensajes';
import { colores, espaciado, tamanios } from '../../../constants/tema';
import { usePermiso } from '../../../hooks/usePermiso';
import { buscarLibroPorIsbn, esIsbnValido, limpiarIsbn } from '../../../lib/catalogo';

// replace: al tocar "atrás" en el detalle se vuelve al Catálogo, no al escáner.
function abrirDetalle(isbn: string) {
  router.replace({ pathname: '/libro/[isbn]', params: { isbn } });
}

export default function Escanear() {
  const { estado, abrirAjustes } = usePermiso('camara');
  const [aviso, setAviso] = useState<string | null>(null);
  // useRef y no useState: el cambio se ve en el acto, sin esperar un render,
  // así los siguientes onBarcodeScanned del mismo segundo se descartan.
  const navegandoRef = useRef(false);
  const ultimoDesconocidoRef = useRef<string | null>(null);

  function alLeerCodigo(codigo: string) {
    if (navegandoRef.current) {
      return;
    }
    const isbn = limpiarIsbn(codigo);
    if (!esIsbnValido(isbn)) {
      return;
    }
    if (buscarLibroPorIsbn(isbn)) {
      navegandoRef.current = true;
      abrirDetalle(isbn);
      return;
    }
    // El mismo código desconocido no repite el aviso.
    if (ultimoDesconocidoRef.current !== isbn) {
      ultimoDesconocidoRef.current = isbn;
      setAviso(`${MENSAJES.escaneoDesconocido} (ISBN ${isbn})`);
    }
  }

  function alIngresarIsbn(texto: string): string | null {
    const isbn = limpiarIsbn(texto);
    if (!esIsbnValido(isbn)) {
      return MENSAJES.isbnInvalido;
    }
    if (!buscarLibroPorIsbn(isbn)) {
      return MENSAJES.libroInexistente;
    }
    abrirDetalle(isbn);
    return null;
  }

  function renderizarCamara() {
    switch (estado) {
      case 'cargando':
        return <EstadoCarga mensaje="Consultando el permiso de cámara…" />;
      case 'concedido':
        return <EscanerCamara onCodigo={alLeerCodigo} />;
      case 'preguntable':
        return (
          <SolicitudCamara
            bloqueada={false}
            onAccion={() => router.push({ pathname: '/permisos/[recurso]', params: { recurso: 'camara' } })}
          />
        );
      case 'bloqueado':
        return <SolicitudCamara bloqueada onAccion={abrirAjustes} />;
    }
  }

  return (
    <ScrollView contentContainerStyle={estilos.contenedor} keyboardShouldPersistTaps="handled">
      {renderizarCamara()}
      {aviso && (
        <Text style={estilos.aviso} accessibilityRole="alert">
          {aviso}
        </Text>
      )}
      <IngresoIsbn onIsbn={alIngresarIsbn} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espaciado.lg,
    padding: espaciado.lg,
    paddingBottom: tamanios.espacioBarra,
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
