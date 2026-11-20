import { useContext } from 'react';

import { BibliotecaContext, type ValorBiblioteca } from '../context/BibliotecaContext';

export function useBiblioteca(): ValorBiblioteca {
  const valor = useContext(BibliotecaContext);
  if (!valor) {
    throw new Error('useBiblioteca debe usarse dentro de BibliotecaProvider');
  }
  return valor;
}
