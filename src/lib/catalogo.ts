import { LARGO_ISBN } from '../constants/biblioteca';
import { LIBROS } from '../data/libros';
import type { Libro } from '../types';

const PATRON_ISBN = new RegExp(`^\\d{${LARGO_ISBN}}$`);

export function esIsbnValido(valor: string): boolean {
  return PATRON_ISBN.test(valor);
}

export function limpiarIsbn(valor: string): string {
  return valor.replace(/[\s-]/g, '');
}

export function buscarLibroPorIsbn(isbn: string): Libro | undefined {
  return LIBROS.find((libro) => libro.isbn === isbn);
}
