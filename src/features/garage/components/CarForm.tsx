import { useId, type FormEvent } from 'react';

type CarFormProps = {
  name: string;
  color: string;
  submitLabel: string;
  disabled?: boolean;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onSubmit: (name: string, color: string) => void;
  onCancel?: () => void;
};

function CarForm({
  name,
  color,
  submitLabel,
  disabled = false,
  onNameChange,
  onColorChange,
  onSubmit,
  onCancel,
}: CarFormProps) {
  const nameId = useId();
  const colorId = useId();
  const trimmed = name.trim();
  const isValid = trimmed.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid || disabled) return;
    onSubmit(trimmed, color);
  }

  return (
    <form className="car-form" onSubmit={handleSubmit}>
      <label htmlFor={nameId} className="car-form__label sr-only">
        Car name
      </label>
      <input
        id={nameId}
        className="car-form__name"
        type="text"
        placeholder="Car name"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        disabled={disabled}
      />

      <label htmlFor={colorId} className="car-form__label sr-only">
        Car color
      </label>
      <input
        id={colorId}
        className="car-form__color"
        type="color"
        value={color}
        onChange={(event) => onColorChange(event.target.value)}
        disabled={disabled}
      />

      <button type="submit" className="car-form__submit" disabled={!isValid || disabled}>
        {submitLabel}
      </button>

      {onCancel && (
        <button type="button" className="car-form__cancel" onClick={onCancel} disabled={disabled}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default CarForm;
