import { MI_NOMBRE } from '../constants/biblioteca';
import type { Cola } from '../estructuras/Cola';
import type { Libro, Prestamo } from '../types';

// Los ejemplares disponibles se calculan: nunca se guardan en el estado.
export function calcularDisponibles(libro: Libro, prestamos: Prestamo[]): number {
  const prestadosDelEstante = prestamos.filter(
    (p) => p.isbn === libro.isbn && p.origen === 'estante',
  ).length;
  return Math.max(libro.ejemplares - prestadosDelEstante, 0);
}

// Devuelve la posición (desde 1) de la persona en la cola, o null si no está.
export function posicionEnEspera(
  cola: Cola<string> | undefined,
  nombre: string = MI_NOMBRE,
): number | null {
  if (!cola) {
    return null;
  }
  const indice = cola.aArray().indexOf(nombre);
  return indice === -1 ? null : indice + 1;
}
