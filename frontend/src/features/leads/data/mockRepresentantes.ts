import type { Representante } from '@leadfinder/shared/test';

export const MOCK_REPRESENTANTES: Representante[] = [
  { id: 'r1', name: 'Carlos Méndez',   email: 'carlos@colombo.com', initials: 'CM' },
  { id: 'r2', name: 'Ana Rodríguez',   email: 'ana@colombo.com',    initials: 'AR' },
  { id: 'r3', name: 'Pedro Gómez',     email: 'pedro@colombo.com',  initials: 'PG' },
  { id: 'r4', name: 'Laura Sánchez',   email: 'laura@colombo.com',  initials: 'LS' },
];

export const ZONAS = [
  'Pampa Húmeda',
  'NOA',
  'NEA',
  'Patagonia',
  'Cuyo',
  'Centro',
] as const;

export const ACTIVIDADES = [
  'Cría bovina',
  'Engorde a corral',
  'Cría y engorde',
  'Ganadería mixta',
  'Agricultura y ganadería',
  'Cría extensiva',
] as const;
