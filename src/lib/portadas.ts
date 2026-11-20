import { colores } from '../constants/tema';

// Portadas de Open Library a partir del ISBN. "default=false" hace que la
// API responda 404 si no hay imagen, y la app muestra la portada de respaldo.
export function urlPortada(isbn: string): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`;
}

// Índice de color estable para la portada de respaldo: siempre el mismo por libro.
export function indiceColorPortada(isbn: string): number {
  const suma = isbn.split('').reduce((total, digito) => total + Number(digito), 0);
  return suma % colores.portadas.length;
}
