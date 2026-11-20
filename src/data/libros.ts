import type { Libro } from '../types';

// Los dos primeros tienen ISBN real (ediciones en papel) para probar el escáner.
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
    isbn: '9788499089515',
    titulo: 'Ficciones',
    autor: 'Jorge Luis Borges',
    anio: 1944,
    ejemplares: 0,
  },
  {
    isbn: '9789500725613',
    titulo: 'El Aleph',
    autor: 'Jorge Luis Borges',
    anio: 1949,
    ejemplares: 3,
  },
  {
    isbn: '9789875668904',
    titulo: 'Rayuela',
    autor: 'Julio Cortázar',
    anio: 1963,
    ejemplares: 0,
  },
  {
    isbn: '9789505112340',
    titulo: 'Bestiario',
    autor: 'Julio Cortázar',
    anio: 1951,
    ejemplares: 2,
  },
  {
    isbn: '9789877380125',
    titulo: 'El túnel',
    autor: 'Ernesto Sabato',
    anio: 1948,
    ejemplares: 1,
  },
  {
    isbn: '9789500443210',
    titulo: 'Martín Fierro',
    autor: 'José Hernández',
    anio: 1872,
    ejemplares: 4,
  },
  {
    isbn: '9788466331005',
    titulo: 'Clean Code',
    autor: 'Robert C. Martin',
    anio: 2008,
    ejemplares: 0,
  },
  {
    isbn: '9789871122455',
    titulo: 'Don Segundo Sombra',
    autor: 'Ricardo Güiraldes',
    anio: 1926,
    ejemplares: 1,
  },
  {
    isbn: '9789507311116',
    titulo: 'Facundo',
    autor: 'Domingo F. Sarmiento',
    anio: 1845,
    ejemplares: 2,
  },
  {
    isbn: '9789875456785',
    titulo: 'Los siete locos',
    autor: 'Roberto Arlt',
    anio: 1929,
    ejemplares: 1,
  },
  {
    isbn: '9789504922223',
    titulo: 'Sobre héroes y tumbas',
    autor: 'Ernesto Sabato',
    anio: 1961,
    ejemplares: 0,
  },
  {
    isbn: '9788437609874',
    titulo: 'Pedro Páramo',
    autor: 'Juan Rulfo',
    anio: 1955,
    ejemplares: 2,
  },
  {
    isbn: '9789876805551',
    titulo: 'Cuentos de la selva',
    autor: 'Horacio Quiroga',
    anio: 1918,
    ejemplares: 3,
  },
  {
    isbn: '9789505813131',
    titulo: 'Operación masacre',
    autor: 'Rodolfo Walsh',
    anio: 1957,
    ejemplares: 1,
  },
];

// Listas de espera al iniciar la app (solo libros sin ejemplares).
export const ESPERAS_INICIALES: Record<string, string[]> = {
  '9788499089515': ['Lucía Gómez', 'Martín Ríos'],
  '9789875668904': ['Sofía Benítez'],
};
