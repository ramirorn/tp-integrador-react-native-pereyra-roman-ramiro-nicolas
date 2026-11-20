// Cola FIFO sin shift(): usa dos índices para que desencolar sea O(1).
export class Cola<T> {
  #items: Record<number, T> = {};
  #inicio = 0;
  #fin = 0;

  constructor(iniciales: T[] = []) {
    iniciales.forEach((item) => this.encolar(item));
  }

  encolar(item: T): void {
    this.#items[this.#fin] = item;
    this.#fin += 1;
  }

  desencolar(): T | undefined {
    if (this.estaVacia()) {
      return undefined;
    }
    const item = this.#items[this.#inicio];
    delete this.#items[this.#inicio];
    this.#inicio += 1;
    return item;
  }

  frente(): T | undefined {
    return this.estaVacia() ? undefined : this.#items[this.#inicio];
  }

  estaVacia(): boolean {
    return this.tamanio === 0;
  }

  get tamanio(): number {
    return this.#fin - this.#inicio;
  }

  // Devuelve una copia ordenada del frente al final.
  aArray(): T[] {
    const resultado: T[] = [];
    for (let i = this.#inicio; i < this.#fin; i += 1) {
      resultado.push(this.#items[i]);
    }
    return resultado;
  }

  clonar(): Cola<T> {
    return new Cola(this.aArray());
  }
}
