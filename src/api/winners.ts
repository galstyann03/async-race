import type { SortOrder, Winner, WinnerPayload, WinnerSortField } from '../shared/types';
import { http, HttpError } from './http';

type FetchWinnersArgs = {
  page: number;
  limit: number;
  sort?: WinnerSortField;
  order?: SortOrder;
};

export async function fetchWinners({ page, limit, sort, order }: FetchWinnersArgs) {
  const { data, totalCount } = await http<Winner[]>('/winners', {
    query: { _page: page, _limit: limit, _sort: sort, _order: order },
  });
  return { items: data, totalCount };
}

export async function fetchWinner(id: number): Promise<Winner | null> {
  try {
    const { data } = await http<Winner>(`/winners/${id}`);
    return data;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null;
    throw error;
  }
}

export async function createWinner(id: number, payload: WinnerPayload) {
  const { data } = await http<Winner>('/winners', {
    method: 'POST',
    body: { id, ...payload },
  });
  return data;
}

export async function updateWinner(id: number, payload: WinnerPayload) {
  const { data } = await http<Winner>(`/winners/${id}`, {
    method: 'PUT',
    body: payload,
  });
  return data;
}

export async function deleteWinner(id: number) {
  try {
    await http<unknown>(`/winners/${id}`, { method: 'DELETE' });
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return;
    throw error;
  }
}
