import { type ReactNode, useCallback, useMemo, useRef, useState } from 'react';

import { DIAS_PRESTAMO, MI_NOMBRE } from '../constants/biblioteca';
import { MENSAJES } from '../constants/mensajes';
import { CLAVE_PERSONAL, USUARIO_PERSONAL } from '../constants/personal';
import { ESPERAS_INICIALES } from '../data/libros';
import { Cola } from '../estructuras/Cola';
import { Pila } from '../estructuras/Pila';
import { buscarLibroPorIsbn } from '../lib/catalogo';
import { sumarDias } from '../lib/fechas';
import {
  cancelarRecordatorio,
  notificacionesPermitidas,
  notificarLibroListo,
  programarRecordatorio,
} from '../lib/notificaciones';
import { calcularDisponibles, posicionEnEspera } from '../lib/reservas';
import type { Aviso, Libro, Prestamo, ResultadoRecordatorio, ResultadoReserva } from '../types';
import { BibliotecaContext, type ValorBiblioteca } from './BibliotecaContext';

type Props = {
  children: ReactNode;
};

function crearEsperasIniciales(): Record<string, Cola<string>> {
  const esperas: Record<string, Cola<string>> = {};
  Object.entries(ESPERAS_INICIALES).forEach(([isbn, personas]) => {
    esperas[isbn] = new Cola(personas);
  });
  return esperas;
}

function crearPrestamo(isbn: string, origen: Prestamo['origen']): Prestamo {
  return {
    isbn,
    vence: sumarDias(new Date(), DIAS_PRESTAMO).toISOString(),
    origen,
    notificacionId: null,
  };
}

export function BibliotecaProvider({ children }: Props) {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [esperas, setEsperas] = useState(crearEsperasIniciales);
  const [recientes, setRecientes] = useState(() => new Pila<string>());
  const [sesion, setSesion] = useState(false);
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  // Copia sincrónica de las colas: evita entregar dos veces a la misma
  // persona si se toca "Entregar al siguiente" muy rápido.
  const esperasRef = useRef(esperas);

  // Nunca se muta una estructura que ya está en el estado: se clona,
  // se modifica la copia y se guarda una referencia nueva.
  const reemplazarCola = useCallback((isbn: string, cola: Cola<string>) => {
    esperasRef.current = { ...esperasRef.current, [isbn]: cola };
    setEsperas(esperasRef.current);
  }, []);

  const agregarAviso = useCallback((mensaje: string) => {
    setAvisos((previos) => [...previos, { id: `${Date.now()}-${previos.length}`, mensaje }]);
  }, []);

  const registrarVisto = useCallback((isbn: string) => {
    setRecientes((previa) => {
      if (previa.verTope() === isbn) {
        return previa;
      }
      const nueva = previa.clonar();
      nueva.push(isbn);
      return nueva;
    });
  }, []);

  const disponibles = useCallback(
    (libro: Libro) => calcularDisponibles(libro, prestamos),
    [prestamos],
  );

  const posicionDe = useCallback((isbn: string) => posicionEnEspera(esperas[isbn]), [esperas]);

  const prestamoDe = useCallback(
    (isbn: string) => prestamos.find((p) => p.isbn === isbn),
    [prestamos],
  );

  const reservar = useCallback(
    (isbn: string): ResultadoReserva => {
      const libro = buscarLibroPorIsbn(isbn);
      if (!libro) {
        return { tipo: 'rechazada', motivo: MENSAJES.libroInexistente };
      }
      if (prestamoDe(isbn) || posicionDe(isbn) !== null) {
        return { tipo: 'rechazada', motivo: MENSAJES.yaReservado };
      }
      if (disponibles(libro) > 0) {
        const prestamo = crearPrestamo(isbn, 'estante');
        setPrestamos((previos) => [...previos, prestamo]);
        return { tipo: 'prestamo', vence: prestamo.vence };
      }
      const cola = (esperasRef.current[isbn] ?? new Cola<string>()).clonar();
      cola.encolar(MI_NOMBRE);
      reemplazarCola(isbn, cola);
      return { tipo: 'espera', posicion: cola.tamanio };
    },
    [disponibles, posicionDe, prestamoDe, reemplazarCola],
  );

  const devolver = useCallback(
    async (isbn: string) => {
      const prestamo = prestamoDe(isbn);
      setPrestamos((previos) => previos.filter((p) => p.isbn !== isbn));
      if (prestamo?.notificacionId) {
        await cancelarRecordatorio(prestamo.notificacionId);
      }
    },
    [prestamoDe],
  );

  const activarRecordatorio = useCallback(
    async (isbn: string): Promise<ResultadoRecordatorio> => {
      const libro = buscarLibroPorIsbn(isbn);
      if (!libro || !(await notificacionesPermitidas())) {
        return 'sin-permiso';
      }
      const id = await programarRecordatorio(libro.titulo);
      setPrestamos((previos) =>
        previos.map((p) => (p.isbn === isbn ? { ...p, notificacionId: id } : p)),
      );
      return 'activado';
    },
    [],
  );

  const desactivarRecordatorio = useCallback(
    async (isbn: string) => {
      const id = prestamoDe(isbn)?.notificacionId;
      setPrestamos((previos) =>
        previos.map((p) => (p.isbn === isbn ? { ...p, notificacionId: null } : p)),
      );
      if (id) {
        await cancelarRecordatorio(id);
      }
    },
    [prestamoDe],
  );

  const entregarAlSiguiente = useCallback(
    async (isbn: string): Promise<string | null> => {
      const actual = esperasRef.current[isbn];
      if (!actual || actual.estaVacia()) {
        return null;
      }
      const cola = actual.clonar();
      const persona = cola.desencolar() ?? null;
      reemplazarCola(isbn, cola);

      if (persona === MI_NOMBRE) {
        const titulo = buscarLibroPorIsbn(isbn)?.titulo ?? 'tu libro';
        setPrestamos((previos) => [...previos, crearPrestamo(isbn, 'espera')]);
        if (await notificacionesPermitidas()) {
          await notificarLibroListo(titulo);
        } else {
          agregarAviso(`"${titulo}" ya está listo. Pasá a retirarlo por el mostrador.`);
        }
      }
      return persona;
    },
    [agregarAviso, reemplazarCola],
  );

  const iniciarSesion = useCallback((usuario: string, clave: string) => {
    const valida = usuario.trim() === USUARIO_PERSONAL && clave === CLAVE_PERSONAL;
    if (valida) {
      setSesion(true);
    }
    return valida;
  }, []);

  const cerrarSesion = useCallback(() => setSesion(false), []);

  const descartarAviso = useCallback((id: string) => {
    setAvisos((previos) => previos.filter((aviso) => aviso.id !== id));
  }, []);

  const valor = useMemo<ValorBiblioteca>(
    () => ({
      prestamos,
      esperas,
      recientes,
      sesion,
      avisos,
      registrarVisto,
      disponibles,
      posicionDe,
      prestamoDe,
      reservar,
      devolver,
      activarRecordatorio,
      desactivarRecordatorio,
      entregarAlSiguiente,
      iniciarSesion,
      cerrarSesion,
      descartarAviso,
    }),
    [
      prestamos,
      esperas,
      recientes,
      sesion,
      avisos,
      registrarVisto,
      disponibles,
      posicionDe,
      prestamoDe,
      reservar,
      devolver,
      activarRecordatorio,
      desactivarRecordatorio,
      entregarAlSiguiente,
      iniciarSesion,
      cerrarSesion,
      descartarAviso,
    ],
  );

  return <BibliotecaContext.Provider value={valor}>{children}</BibliotecaContext.Provider>;
}
