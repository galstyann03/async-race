import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { garageApi, HttpError, winnersApi } from '../../api';
import { FIRST_PAGE, WINNERS_PAGE_LIMIT } from '../../shared/constants';
import type { Car, SortOrder, Winner, WinnerSortField } from '../../shared/types';

export type WinnerRow = {
  id: number;
  wins: number;
  time: number;
  car: Car | null;
};

type WinnersState = {
  rows: WinnerRow[];
  totalCount: number;
  page: number;
  sortField: WinnerSortField | null;
  sortOrder: SortOrder | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
};

const initialState: WinnersState = {
  rows: [],
  totalCount: 0,
  page: FIRST_PAGE,
  sortField: null,
  sortOrder: null,
  status: 'idle',
  error: null,
};

type LoadArgs = {
  page: number;
  sortField: WinnerSortField | null;
  sortOrder: SortOrder | null;
};

async function fetchCarSafe(id: number): Promise<Car | null> {
  try {
    return await garageApi.fetchCar(id);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null;
    throw error;
  }
}

export const loadWinners = createAsyncThunk(
  'winners/load',
  async ({ page, sortField, sortOrder }: LoadArgs) => {
    const { items, totalCount } = await winnersApi.fetchWinners({
      page,
      limit: WINNERS_PAGE_LIMIT,
      sort: sortField ?? undefined,
      order: sortOrder ?? undefined,
    });

    const cars = await Promise.all(items.map((winner: Winner) => fetchCarSafe(winner.id)));

    const rows: WinnerRow[] = items.map((winner, idx) => ({
      id: winner.id,
      wins: winner.wins,
      time: winner.time,
      car: cars[idx],
    }));

    return { rows, totalCount };
  },
);

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSort(state, action: PayloadAction<{ field: WinnerSortField; order: SortOrder }>) {
      state.sortField = action.payload.field;
      state.sortOrder = action.payload.order;
      state.page = FIRST_PAGE;
    },
    clearSort(state) {
      state.sortField = null;
      state.sortOrder = null;
      state.page = FIRST_PAGE;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWinners.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadWinners.fulfilled, (state, action) => {
        state.status = 'success';
        state.rows = action.payload.rows;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(loadWinners.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Failed to load winners';
      });
  },
});

export const { setPage, setSort, clearSort, clearError } = winnersSlice.actions;
export default winnersSlice.reducer;
