import { useCallback, useEffect, useState } from 'react';

import { MENSAJES } from '../constants/mensajes';
import { buscarLibros } from '../lib/api';
import type { Libro } from '../types';

type Resultado = {
  consulta: string;
  intento: number;
  libros: Libro[];
  error: string | null;
};

type EstadoBusqueda = {
  libros: Libro[];
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
};

export function useBusqueda(q: string): EstadoBusqueda {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [intento, setIntento] = useState(0);
  const consulta = q.trim();

  useEffect(() => {
    if (!consulta) {
      return;
    }
    // Cada búsqueda tiene su propio "activo". Cuando q cambia, la limpieza
    // apaga el de la búsqueda anterior y su respuesta se descarta al llegar.
    let activo = true;

    buscarLibros(consulta)
      .then((libros) => {
        if (activo) {
          setResultado({ consulta, intento, libros, error: null });
        }
      })
      .catch(() => {
        if (activo) {
          setResultado({ consulta, intento, libros: [], error: MENSAJES.errorBusqueda });
        }
      });

    return () => {
      activo = false;
    };
  }, [consulta, intento]);

  const reintentar = useCallback(() => setIntento((previo) => previo + 1), []);

  // El resultado solo vale si corresponde a la consulta actual.
  const vigente =
    resultado !== null && resultado.consulta === consulta && resultado.intento === intento;

  return {
    libros: consulta && vigente ? resultado.libros : [],
    cargando: consulta !== '' && !vigente,
    error: consulta && vigente ? resultado.error : null,
    reintentar,
  };
}
