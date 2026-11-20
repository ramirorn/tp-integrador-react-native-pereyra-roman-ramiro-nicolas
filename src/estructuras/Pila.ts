export class Pila<T> {
  #items: T[] = [];

  constructor(iniciales: T[] = []) {
    this.#items = [...iniciales];
  }

  push(item: T): void {
    this.#items.push(item);
  }

  pop(): T | undefined {
    return this.#items.pop();
  }

  verTope(): T | undefined {
    return this.#items[this.#items.length - 1];
  }

  estaVacia(): boolean {
    return this.#items.length === 0;
  }

  get tamanio(): number {
    return this.#items.length;
  }

  // Devuelve una copia ordenada de la base al tope.
  aArray(): T[] {
    return [...this.#items];
  }

  clonar(): Pila<T> {
    return new Pila(this.#items);
  }
}
