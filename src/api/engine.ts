import type { DriveResponse, EngineStartResponse } from '../shared/types';
import { http, HttpError } from './http';

export async function startEngine(id: number) {
  const { data } = await http<EngineStartResponse>('/engine', {
    method: 'PATCH',
    query: { id, status: 'started' },
  });
  return data;
}

export async function stopEngine(id: number) {
  const { data } = await http<EngineStartResponse>('/engine', {
    method: 'PATCH',
    query: { id, status: 'stopped' },
  });
  return data;
}

export async function driveEngine(id: number): Promise<DriveResponse> {
  try {
    const { data } = await http<DriveResponse>('/engine', {
      method: 'PATCH',
      query: { id, status: 'drive' },
    });
    return data;
  } catch (error) {
    if (error instanceof HttpError && error.status === 500) {
      return { success: false };
    }
    throw error;
  }
}