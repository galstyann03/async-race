import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type EnginePhase = 'idle' | 'starting' | 'driving' | 'broken' | 'finished' | 'stopped';

export type EngineEntry = {
  phase: EnginePhase;
  velocity: number;
  distance: number;
  durationMs: number;
};

export type WinnerBanner = {
  carId: number;
  name: string;
  timeSeconds: number;
};

type RaceState = {
  engines: Record<number, EngineEntry>;
  isRaceRunning: boolean;
  winnerBanner: WinnerBanner | null;
};

const blankEngine: EngineEntry = {
  phase: 'idle',
  velocity: 0,
  distance: 0,
  durationMs: 0,
};

const initialState: RaceState = {
  engines: {},
  isRaceRunning: false,
  winnerBanner: null,
};

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    setEnginePhase(state, action: PayloadAction<{ carId: number; phase: EnginePhase }>) {
      const current = state.engines[action.payload.carId] ?? { ...blankEngine };
      state.engines[action.payload.carId] = { ...current, phase: action.payload.phase };
    },
    setEngineMotion(
      state,
      action: PayloadAction<{
        carId: number;
        velocity: number;
        distance: number;
        durationMs: number;
      }>,
    ) {
      const { carId, velocity, distance, durationMs } = action.payload;
      const current = state.engines[carId] ?? { ...blankEngine };
      state.engines[carId] = { ...current, velocity, distance, durationMs };
    },
    resetEngine(state, action: PayloadAction<number>) {
      state.engines[action.payload] = { ...blankEngine };
    },
    startRace(state) {
      state.isRaceRunning = true;
      state.winnerBanner = null;
    },
    finishRace(state) {
      state.isRaceRunning = false;
    },
    setWinnerBanner(state, action: PayloadAction<WinnerBanner>) {
      state.winnerBanner = action.payload;
    },
    clearWinnerBanner(state) {
      state.winnerBanner = null;
    },
  },
});

export const {
  setEnginePhase,
  setEngineMotion,
  resetEngine,
  startRace,
  finishRace,
  setWinnerBanner,
  clearWinnerBanner,
} = raceSlice.actions;

export default raceSlice.reducer;
