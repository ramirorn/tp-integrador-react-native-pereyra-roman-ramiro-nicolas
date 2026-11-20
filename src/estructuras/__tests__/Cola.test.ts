import { describe, expect, it } from '@jest/globals';

import { Cola } from '../Cola';

describe('Cola', () => {
  it('encola y desencola en orden FIFO', () => {
    const cola = new Cola<string>();
    cola.encolar('Ana');
    cola.encolar('Beto');
    cola.encolar('Caro');
    expect(cola.desencolar()).toBe('Ana');
    expect(cola.desencolar()).toBe('Beto');
    expect(cola.tamanio).toBe(1);
  });

  it('desencolar una cola vacía devuelve undefined y no rompe el tamaño', () => {
    const cola = new Cola<string>();
    expect(cola.desencolar()).toBeUndefined();
    expect(cola.tamanio).toBe(0);
    cola.encolar('Ana');
    expect(cola.tamanio).toBe(1);
  });

  it('frente muestra el primero sin sacarlo', () => {
    const cola = new Cola(['Ana', 'Beto']);
    expect(cola.frente()).toBe('Ana');
    expect(cola.tamanio).toBe(2);
  });

  it('aArray respeta el orden después de desencolar', () => {
    const cola = new Cola(['Ana', 'Beto', 'Caro']);
    cola.desencolar();
    cola.encolar('Dani');
    expect(cola.aArray()).toEqual(['Beto', 'Caro', 'Dani']);
  });

  it('clonar no comparte los items con la original', () => {
    const original = new Cola(['Ana']);
    const clon = original.clonar();
    clon.encolar('Beto');
    clon.desencolar();
    expect(original.aArray()).toEqual(['Ana']);
    expect(clon.aArray()).toEqual(['Beto']);
  });
});
