import { useEffect, useState } from 'react';

// Devuelve el valor recién cuando dejó de cambiar durante "demora" ms.
export function useDebounce<T>(valor: T, demora: number): T {
  const [demorado, setDemorado] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setDemorado(valor), demora);
    return () => clearTimeout(temporizador);
  }, [valor, demora]);

  return demorado;
}
