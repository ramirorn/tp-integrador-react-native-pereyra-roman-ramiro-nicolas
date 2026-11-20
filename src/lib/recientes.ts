import type { Pila } from '../estructuras/Pila';

// Toma los ISBN desde el tope de la pila (más reciente primero), sin repetir,
// para que la key de cada fila siga siendo única.
export function ultimosVistos(pila: Pila<string>, cantidad: number): string[] {
  const resultado: string[] = [];
  const desdeElTope = pila.aArray().reverse();
  for (const isbn of desdeElTope) {
    if (!resultado.includes(isbn)) {
      resultado.push(isbn);
    }
    if (resultado.length === cantidad) {
      break;
    }
  }
  return resultado;
}
