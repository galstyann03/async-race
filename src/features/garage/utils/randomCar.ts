import type { CarPayload } from '../../../shared/types';

const BRANDS = [
  'Tesla',
  'Ford',
  'Toyota',
  'BMW',
  'Mercedes',
  'Audi',
  'Honda',
  'Mazda',
  'Porsche',
  'Hyundai',
  'Volvo',
  'Subaru',
];

const MODELS = [
  'Model S',
  'Mustang',
  'Corolla',
  'M3',
  'C-Class',
  'A4',
  'Civic',
  'MX-5',
  '911',
  'Elantra',
  'XC60',
  'Impreza',
];

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomHexColor(): string {
  const value = Math.floor(Math.random() * 0xffffff);
  return `#${value.toString(16).padStart(6, '0')}`;
}

export function randomCarPayload(): CarPayload {
  return {
    name: `${pick(BRANDS)} ${pick(MODELS)}`,
    color: randomHexColor(),
  };
}

export function randomCarPayloads(count: number): CarPayload[] {
  return Array.from({ length: count }, () => randomCarPayload());
}
