// Mundo visual: estante verde menta. Las portadas son el producto y se
// apoyan sobre placas menta; el verde bosque marca las acciones.
export const colores = {
  bosque: '#0E4D3A',
  bosqueProfundo: '#0A3328',
  menta: '#3DDC97',
  mentaClara: '#BDF2D7',
  placa: '#DDF6EA',
  fondo: '#F3FCF8',
  superficie: '#FFFFFF',
  texto: '#0D1F19',
  textoSecundario: '#4C6359',
  textoSobreBosque: '#E8F7EF',
  textoSobreBosqueSuave: '#A9D9C2',
  borde: '#D5E7DC',
  exito: '#13704F',
  exitoSuave: '#D6F3E4',
  error: '#B42318',
  errorSuave: '#FDE6E3',
  aviso: '#8A4B0B',
  avisoSuave: '#FCEFD8',
  deshabilitadoFondo: '#E2F1E9',
  camaraFondo: '#000000',
  // Paleta de las portadas de respaldo (cuando la imagen no carga).
  portadas: ['#0E4D3A', '#1F6F5C', '#2D5A7B', '#7A4E2D', '#5B3F7A', '#8C2F39'],
} as const;

export const degradados = {
  heroe: `linear-gradient(135deg, ${colores.bosque} 0%, #1F7A57 55%, ${colores.menta} 100%)`,
  placa: `linear-gradient(160deg, ${colores.superficie} 0%, ${colores.placa} 100%)`,
} as const;

export const sombras = {
  tarjeta: '0px 8px 20px rgba(14, 77, 58, 0.10)',
  flotante: '0px 10px 24px rgba(10, 51, 40, 0.28)',
  portada: '0px 6px 12px rgba(13, 31, 25, 0.25)',
} as const;

export const espaciado = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const tamanios = {
  textoMini: 11,
  textoMicro: 11,
  textoChico: 13,
  texto: 15,
  subtitulo: 17,
  titulo: 22,
  tituloGrande: 28,
  cifra: 34,
  icono: 22,
  iconoGrande: 40,
  toqueMinimo: 48,
  radio: 14,
  radioTarjeta: 24,
  radioPildora: 999,
  borde: 1,
  portadaChica: 72,
  portadaTarjeta: 132,
  portadaHeroe: 150,
  portadaDetalle: 210,
  proporcionPortada: 2 / 3,
  botonCentral: 64,
  elevacionBotonCentral: 22,
  alturaBarra: 68,
  // Espacio libre al final de las listas para que la barra flotante no tape nada.
  espacioBarra: 132,
  alturaCamara: 320,
  marcoEscaner: 220,
  anchoMarcoEscaner: 2,
  circuloIcono: 72,
} as const;

export const tipografia = {
  pesoNormal: '400',
  pesoMedio: '600',
  pesoFuerte: '700',
  pesoTitular: '700',
  interletraTitular: -0.4,
} as const;

export const opacidad = {
  presionado: 0.75,
} as const;
