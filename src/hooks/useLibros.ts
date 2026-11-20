import { useCallback, useEffect, useState } from 'react';

import { MENSAJES } from '../constants/mensajes';
import { obtenerLibros } from '../lib/api';
import type { Libro } from '../types';

type EstadoLibros = {
  libros: Libro[];
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
};

export function useLibros(): EstadoLibros {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Cambiar este número vuelve a disparar el efecto.
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const datos = await obtenerLibros();
        if (activo) {
          setLibros(datos);
          setError(null);
        }
      } catch {
        if (activo) {
          setError(MENSAJES.errorCatalogo);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargar();

    return () => {
      activo = false;
    };
  }, [intento]);

  const reintentar = useCallback(() => {
    setCargando(true);
    setError(null);
    setIntento((previo) => previo + 1);
  }, []);

  return { libros, cargando, error, reintentar };
}
