import { describe, expect, it } from '@jest/globals';

import { Pila } from '../Pila';

describe('Pila', () => {
  it('empieza vacía', () => {
    const pila = new Pila<string>();
    expect(pila.estaVacia()).toBe(true);
    expect(pila.tamanio).toBe(0);
    expect(pila.verTope()).toBeUndefined();
  });

  it('apila y desapila en orden LIFO', () => {
    const pila = new Pila<string>();
    pila.push('a');
    pila.push('b');
    pila.push('c');
    expect(pila.pop()).toBe('c');
    expect(pila.pop()).toBe('b');
    expect(pila.tamanio).toBe(1);
  });

  it('devuelve undefined al desapilar una pila vacía', () => {
    const pila = new Pila<number>();
    expect(pila.pop()).toBeUndefined();
    expect(pila.tamanio).toBe(0);
  });

  it('aArray devuelve una copia de la base al tope', () => {
    const pila = new Pila(['a', 'b']);
    const copia = pila.aArray();
    copia.push('x');
    expect(pila.aArray()).toEqual(['a', 'b']);
  });

  it('clonar no comparte los items con la original', () => {
    const original = new Pila(['a']);
    const clon = original.clonar();
    clon.push('b');
    expect(original.tamanio).toBe(1);
    expect(clon.verTope()).toBe('b');
  });
});
