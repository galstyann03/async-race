import type { Car, CarPayload } from '../shared/types';
import { http } from './http';

export async function fetchCars(page: number, limit: number) {
  const { data, totalCount } = await http<Car[]>('/garage', {
    query: { _page: page, _limit: limit },
  });
  return { items: data, totalCount };
}

export async function fetchCar(id: number) {
  const { data } = await http<Car>(`/garage/${id}`);
  return data;
}

export async function createCar(payload: CarPayload) {
  const { data } = await http<Car>('/garage', { method: 'POST', body: payload });
  return data;
}

export async function updateCar(id: number, payload: CarPayload) {
  const { data } = await http<Car>(`/garage/${id}`, { method: 'PUT', body: payload });
  return data;
}

export async function deleteCar(id: number) {
  await http<unknown>(`/garage/${id}`, { method: 'DELETE' });
}