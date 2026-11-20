import { createContext } from 'react';

import type { Cola } from '../estructuras/Cola';
import type { Pila } from '../estructuras/Pila';
import type {
  Aviso,
  Libro,
  Prestamo,
  ResultadoRecordatorio,
  ResultadoReserva,
} from '../types';

export type ValorBiblioteca = {
  prestamos: Prestamo[];
  esperas: Record<string, Cola<string>>;
  recientes: Pila<string>;
  sesion: boolean;
  avisos: Aviso[];
  registrarVisto: (isbn: string) => void;
  disponibles: (libro: Libro) => number;
  posicionDe: (isbn: string) => number | null;
  prestamoDe: (isbn: string) => Prestamo | undefined;
  reservar: (isbn: string) => ResultadoReserva;
  devolver: (isbn: string) => Promise<void>;
  activarRecordatorio: (isbn: string) => Promise<ResultadoRecordatorio>;
  desactivarRecordatorio: (isbn: string) => Promise<void>;
  entregarAlSiguiente: (isbn: string) => Promise<string | null>;
  iniciarSesion: (usuario: string, clave: string) => boolean;
  cerrarSesion: () => void;
  descartarAviso: (id: string) => void;
};

export const BibliotecaContext = createContext<ValorBiblioteca | null>(null);
