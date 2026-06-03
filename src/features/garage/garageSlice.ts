import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { garageApi, winnersApi } from '../../api';
import { DEFAULT_CAR_COLOR, FIRST_PAGE, GARAGE_PAGE_LIMIT } from '../../shared/constants';
import type { Car, CarPayload } from '../../shared/types';
import { randomCarPayloads } from './utils/randomCar';

type CarForm = { name: string; color: string };

type GarageState = {
  cars: Car[];
  totalCount: number;
  page: number;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  createForm: CarForm;
  editForm: CarForm & { id: number | null };
};

const emptyForm: CarForm = { name: '', color: DEFAULT_CAR_COLOR };

const initialState: GarageState = {
  cars: [],
  totalCount: 0,
  page: FIRST_PAGE,
  status: 'idle',
  error: null,
  createForm: { ...emptyForm },
  editForm: { id: null, ...emptyForm },
};

export const loadCars = createAsyncThunk('garage/load', (page: number) =>
  garageApi.fetchCars(page, GARAGE_PAGE_LIMIT),
);

export const addCar = createAsyncThunk('garage/add', (payload: CarPayload) =>
  garageApi.createCar(payload),
);

export const editCar = createAsyncThunk(
  'garage/edit',
  (args: { id: number; payload: CarPayload }) => garageApi.updateCar(args.id, args.payload),
);

export const removeCar = createAsyncThunk('garage/remove', async (id: number) => {
  await garageApi.deleteCar(id);
  await winnersApi.deleteWinner(id);
  return id;
});

export const generateCars = createAsyncThunk('garage/generate', async () => {
  const payloads = randomCarPayloads(100);
  await Promise.all(payloads.map((payload) => garageApi.createCar(payload)));
});

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setCreateForm(state, action: PayloadAction<Partial<CarForm>>) {
      state.createForm = { ...state.createForm, ...action.payload };
    },
    resetCreateForm(state) {
      state.createForm = { ...emptyForm };
    },
    selectCarForEdit(state, action: PayloadAction<Car>) {
      state.editForm = {
        id: action.payload.id,
        name: action.payload.name,
        color: action.payload.color,
      };
    },
    setEditForm(state, action: PayloadAction<Partial<CarForm>>) {
      state.editForm = { ...state.editForm, ...action.payload };
    },
    clearEditForm(state) {
      state.editForm = { id: null, ...emptyForm };
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCars.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadCars.fulfilled, (state, action) => {
        state.status = 'success';
        state.cars = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(loadCars.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Failed to load cars';
      })
      .addCase(editCar.fulfilled, (state, action) => {
        const idx = state.cars.findIndex((car) => car.id === action.payload.id);
        if (idx !== -1) state.cars[idx] = action.payload;
        state.editForm = { id: null, ...emptyForm };
      })
      .addCase(removeCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter((car) => car.id !== action.payload);
        state.totalCount = Math.max(0, state.totalCount - 1);
        if (state.editForm.id === action.payload) {
          state.editForm = { id: null, ...emptyForm };
        }
      });
  },
});

export const {
  setPage,
  setCreateForm,
  resetCreateForm,
  selectCarForEdit,
  setEditForm,
  clearEditForm,
  clearError,
} = garageSlice.actions;

export default garageSlice.reducer;
