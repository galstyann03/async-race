import { useLayoutEffect, useRef } from 'react';
import { useAppSelector } from '../../../app/hooks';
import CarIcon from '../../../shared/components/CarIcon';
import type { Car } from '../../../shared/types';

type CarTrackProps = {
  car: Car;
};

function CarTrack({ car }: CarTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const engine = useAppSelector((state) => state.race.engines[car.id]);

  const phase = engine?.phase ?? 'idle';
  const durationMs = engine?.durationMs ?? 0;

  useLayoutEffect(() => {
    const carEl = carRef.current;
    const trackEl = trackRef.current;
    if (!carEl || !trackEl) return;

    if (phase === 'driving') {
      const finishX = trackEl.clientWidth - carEl.clientWidth - 8;
      carEl.style.transition = 'none';
      carEl.style.transform = 'translateX(0)';
      // Force a reflow so the next transition picks up the new starting point.
      carEl.getBoundingClientRect();
      carEl.style.transition = `transform ${durationMs}ms linear`;
      carEl.style.transform = `translateX(${finishX}px)`;
      return;
    }

    if (phase === 'broken') {
      // Freeze the car at its current mid-animation position.
      const computed = window.getComputedStyle(carEl).transform;
      carEl.style.transition = 'none';
      carEl.style.transform = computed === 'none' ? 'translateX(0)' : computed;
      return;
    }

    if (phase === 'finished') {
      // Driving transition just completed — leave the car at the end.
      return;
    }

    // idle | starting | stopped → snap to start
    carEl.style.transition = 'none';
    carEl.style.transform = 'translateX(0)';
  }, [phase, durationMs]);

  return (
    <div className="car-track" ref={trackRef}>
      <span className="car-track__finish" aria-hidden="true">
        🏁
      </span>
      <div className="car-track__car" ref={carRef}>
        <CarIcon color={car.color} />
      </div>
    </div>
  );
}

export default CarTrack;
