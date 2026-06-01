import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { Car } from '../../../shared/types';
import { resetRace, runRace } from '../../race/raceController';

type RaceControlsProps = {
  cars: Car[];
};

function RaceControls({ cars }: RaceControlsProps) {
  const dispatch = useAppDispatch();
  const isRaceRunning = useAppSelector((state) => state.race.isRaceRunning);
  const banner = useAppSelector((state) => state.race.winnerBanner);

  function handleRace() {
    dispatch(runRace(cars));
  }

  function handleReset() {
    dispatch(resetRace(cars));
  }

  const hasCars = cars.length > 0;

  return (
    <section className="race-controls" aria-label="Race controls">
      <div className="race-controls__buttons">
        <button
          type="button"
          className="race-controls__race"
          onClick={handleRace}
          disabled={isRaceRunning || !hasCars}
        >
          Race
        </button>
        <button
          type="button"
          className="race-controls__reset"
          onClick={handleReset}
          disabled={!hasCars}
        >
          Reset
        </button>
      </div>

      {banner && (
        <div className="race-controls__banner" role="status">
          🏆 <strong>{banner.name}</strong> won in {banner.timeSeconds.toFixed(2)}s
        </div>
      )}
    </section>
  );
}

export default RaceControls;
