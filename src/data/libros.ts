import type { Libro } from '../types';

// Todos los ISBN son de ediciones reales (verificadas en Open Library),
// así el escáner funciona con un ejemplar en la mano y hay portada.
export const LIBROS: Libro[] = [
  {
    isbn: '9780307474728',
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    anio: 1967,
    ejemplares: 2,
  },
  {
    isbn: '9788498381498',
    titulo: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    anio: 1943,
    ejemplares: 1,
  },
  {
    isbn: '9789500428446',
    titulo: 'Ficciones',
    autor: 'Jorge Luis Borges',
    anio: 1944,
    ejemplares: 0,
  },
  {
    isbn: '9788499089515',
    titulo: 'El Aleph',
    autor: 'Jorge Luis Borges',
    anio: 1949,
    ejemplares: 3,
  },
  {
    isbn: '9788432221552',
    titulo: 'Rayuela',
    autor: 'Julio Cortázar',
    anio: 1963,
    ejemplares: 0,
  },
  {
    isbn: '9789875780804',
    titulo: 'Bestiario',
    autor: 'Julio Cortázar',
    anio: 1951,
    ejemplares: 2,
  },
  {
    isbn: '9786124632181',
    titulo: 'El túnel',
    autor: 'Ernesto Sabato',
    anio: 1948,
    ejemplares: 1,
  },
  {
    isbn: '9788484035701',
    titulo: 'Martín Fierro',
    autor: 'José Hernández',
    anio: 1872,
    ejemplares: 4,
  },
  {
    isbn: '9780132350884',
    titulo: 'Clean Code',
    autor: 'Robert C. Martin',
    anio: 2008,
    ejemplares: 0,
  },
  {
    isbn: '9788470395758',
    titulo: 'Don Segundo Sombra',
    autor: 'Ricardo Güiraldes',
    anio: 1926,
    ejemplares: 1,
  },
  {
    isbn: '9789700768694',
    titulo: 'Facundo',
    autor: 'Domingo F. Sarmiento',
    anio: 1845,
    ejemplares: 2,
  },
  {
    isbn: '9788495994011',
    titulo: 'Los siete locos',
    autor: 'Roberto Arlt',
    anio: 1929,
    ejemplares: 1,
  },
  {
    isbn: '9788495594006',
    titulo: 'Sobre héroes y tumbas',
    autor: 'Ernesto Sabato',
    anio: 1961,
    ejemplares: 0,
  },
  {
    isbn: '9780802133908',
    titulo: 'Pedro Páramo',
    autor: 'Juan Rulfo',
    anio: 1955,
    ejemplares: 2,
  },
  {
    isbn: '9789583004582',
    titulo: 'Cuentos de la selva',
    autor: 'Horacio Quiroga',
    anio: 1918,
    ejemplares: 3,
  },
  {
    isbn: '9788496822511',
    titulo: 'Operación masacre',
    autor: 'Rodolfo Walsh',
    anio: 1957,
    ejemplares: 1,
  },
];

// Listas de espera al iniciar la app (solo libros sin ejemplares).
export const ESPERAS_INICIALES: Record<string, string[]> = {
  '9789500428446': ['Lucía Gómez', 'Martín Ríos'],
  '9788432221552': ['Sofía Benítez'],
};
