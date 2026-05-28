import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { winnersApi } from '../../api';
import { FIRST_PAGE, WINNERS_PAGE_LIMIT } from '../../shared/constants';
import type { SortOrder, Winner, WinnerSortField } from '../../shared/types';

type WinnersState = {
  items: Winner[];
  totalCount: number;
  page: number;
  sortField: WinnerSortField | null;
  sortOrder: SortOrder | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
};

const initialState: WinnersState = {
  items: [],
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

export const loadWinners = createAsyncThunk(
  'winners/load',
  ({ page, sortField, sortOrder }: LoadArgs) =>
    winnersApi.fetchWinners({
      page,
      limit: WINNERS_PAGE_LIMIT,
      sort: sortField ?? undefined,
      order: sortOrder ?? undefined,
    }),
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
    },
    clearSort(state) {
      state.sortField = null;
      state.sortOrder = null;
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
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(loadWinners.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Failed to load winners';
      });
  },
});

export const { setPage, setSort, clearSort } = winnersSlice.actions;
export default winnersSlice.reducer;
