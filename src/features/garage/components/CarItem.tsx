import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { Car } from '../../../shared/types';
import { runSingleCar, stopSingleCar } from '../../race/raceController';
import CarTrack from './CarTrack';

type CarItemProps = {
  car: Car;
  selected: boolean;
  disabled?: boolean;
  onSelect: (car: Car) => void;
  onDelete: (id: number) => void;
};

function CarItem({ car, selected, disabled = false, onSelect, onDelete }: CarItemProps) {
  const dispatch = useAppDispatch();
  const phase = useAppSelector((state) => state.race.engines[car.id]?.phase) ?? 'idle';

  const isEngineActive = phase === 'starting' || phase === 'driving';
  const canStart = !disabled && !isEngineActive;
  const canStop = isEngineActive;
  const canEditOrDelete = !disabled && !isEngineActive;

  async function handleStart() {
    try {
      await dispatch(runSingleCar(car.id)).unwrap();
    } catch {
      // 'broken' or 'cancelled' — slice state already reflects the outcome.
    }
  }

  function handleStop() {
    dispatch(stopSingleCar(car.id));
  }

  return (
    <li className={`car-item${selected ? ' car-item--selected' : ''}`}>
      <div className="car-item__row">
        <div className="car-item__controls">
          <button
            type="button"
            className="car-item__select"
            onClick={() => onSelect(car)}
            disabled={!canEditOrDelete}
          >
            Select
          </button>
          <button
            type="button"
            className="car-item__delete"
            onClick={() => onDelete(car.id)}
            disabled={!canEditOrDelete}
          >
            Delete
          </button>
          <button
            type="button"
            className="car-item__start"
            onClick={handleStart}
            disabled={!canStart}
          >
            Start
          </button>
          <button type="button" className="car-item__stop" onClick={handleStop} disabled={!canStop}>
            Stop
          </button>
        </div>

        <span className="car-item__name">{car.name}</span>
      </div>

      <CarTrack car={car} />
    </li>
  );
}

export default CarItem;
