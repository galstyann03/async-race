import type { Car } from '../../../shared/types';

type CarItemProps = {
  car: Car;
  selected: boolean;
  disabled?: boolean;
  onSelect: (car: Car) => void;
  onDelete: (id: number) => void;
};

function CarItem({ car, selected, disabled = false, onSelect, onDelete }: CarItemProps) {
  return (
    <li className={`car-item${selected ? ' car-item--selected' : ''}`}>
      <div className="car-item__controls">
        <button
          type="button"
          className="car-item__select"
          onClick={() => onSelect(car)}
          disabled={disabled}
        >
          Select
        </button>
        <button
          type="button"
          className="car-item__delete"
          onClick={() => onDelete(car.id)}
          disabled={disabled}
        >
          Delete
        </button>
      </div>

      <span
        className="car-item__swatch"
        style={{ backgroundColor: car.color }}
        aria-hidden="true"
      />

      <span className="car-item__name">{car.name}</span>

      {/* Race track + engine controls land here on Day 4 */}
    </li>
  );
}

export default CarItem;
