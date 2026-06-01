import { createAsyncThunk } from '@reduxjs/toolkit';
import { engineApi, winnersApi } from '../../api';
import type { RootState } from '../../app/store';
import type { Car } from '../../shared/types';
import {
  clearWinnerBanner,
  finishRace,
  resetEngine,
  setEngineMotion,
  setEnginePhase,
  setWinnerBanner,
  startRace,
} from './raceSlice';

export type FinishResult = { carId: number; timeSeconds: number };

/**
 * Drives one car: start → motion → drive.
 * Resolves with finish time on success; throws on broken engine or external stop.
 */
export const runSingleCar = createAsyncThunk<FinishResult, number, { state: RootState }>(
  'race/runSingleCar',
  async (carId, { dispatch, getState }) => {
    dispatch(setEnginePhase({ carId, phase: 'starting' }));
    const { velocity, distance } = await engineApi.startEngine(carId);

    // Stop arrived while we awaited the API?
    if (getState().race.engines[carId]?.phase !== 'starting') {
      throw new Error('cancelled');
    }

    const durationMs = distance / velocity;
    dispatch(setEngineMotion({ carId, velocity, distance, durationMs }));
    dispatch(setEnginePhase({ carId, phase: 'driving' }));

    const { success } = await engineApi.driveEngine(carId);

    if (getState().race.engines[carId]?.phase !== 'driving') {
      throw new Error('cancelled');
    }

    if (!success) {
      dispatch(setEnginePhase({ carId, phase: 'broken' }));
      throw new Error('broken');
    }

    dispatch(setEnginePhase({ carId, phase: 'finished' }));
    return { carId, timeSeconds: durationMs / 1000 };
  },
);

/**
 * Stop a single car: mark stopped (signals cancellation to a running thunk),
 * call the engine stop API, then reset back to idle.
 */
export const stopSingleCar = createAsyncThunk<void, number>(
  'race/stopSingleCar',
  async (carId, { dispatch }) => {
    dispatch(setEnginePhase({ carId, phase: 'stopped' }));
    await engineApi.stopEngine(carId);
    dispatch(resetEngine(carId));
  },
);

/**
 * Winner upsert: create with wins=1 if missing,
 * otherwise increment wins and keep the lower best time.
 */
async function upsertWinner(carId: number, timeSeconds: number): Promise<void> {
  const existing = await winnersApi.fetchWinner(carId);
  if (existing === null) {
    await winnersApi.createWinner(carId, { wins: 1, time: timeSeconds });
    return;
  }
  await winnersApi.updateWinner(carId, {
    wins: existing.wins + 1,
    time: Math.min(existing.time, timeSeconds),
  });
}

/**
 * Race: run every car in parallel, pick the first to finish cleanly,
 * upsert the winner record, and show the winner banner.
 */
export const runRace = createAsyncThunk<FinishResult | null, Car[], { state: RootState }>(
  'race/runRace',
  async (cars, { dispatch }) => {
    dispatch(startRace());

    const promises = cars.map((car) =>
      dispatch(runSingleCar(car.id))
        .unwrap()
        .then((result) => ({ ...result, name: car.name })),
    );

    try {
      const winner = await Promise.any(promises);
      dispatch(
        setWinnerBanner({
          carId: winner.carId,
          name: winner.name,
          timeSeconds: winner.timeSeconds,
        }),
      );
      await upsertWinner(winner.carId, winner.timeSeconds);
      return { carId: winner.carId, timeSeconds: winner.timeSeconds };
    } catch {
      // AggregateError — every car broke or was cancelled.
      return null;
    } finally {
      dispatch(finishRace());
    }
  },
);

/**
 * Reset: clear winner banner and stop every current-page car.
 */
export const resetRace = createAsyncThunk<void, Car[]>(
  'race/resetRace',
  async (cars, { dispatch }) => {
    dispatch(clearWinnerBanner());
    await Promise.all(cars.map((car) => dispatch(stopSingleCar(car.id)).unwrap()));
  },
);
