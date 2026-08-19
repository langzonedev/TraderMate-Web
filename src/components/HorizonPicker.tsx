import { HORIZONS } from "../config";
import type { Horizon } from "../types";

interface HorizonPickerProps {
  selected: Horizon;
  onSelect: (horizon: Horizon) => void;
}

export function HorizonPicker({ selected, onSelect }: HorizonPickerProps) {
  return (
    <fieldset className="horizon-picker" aria-label="Choose time horizon">
      <legend>Time horizon</legend>
      {HORIZONS.map((option) => {
        const active = option.id === selected;
        return (
          <button
            className={`horizon-option${active ? " is-selected" : ""}`}
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(option.id)}
          >
            {option.label}
          </button>
        );
      })}
    </fieldset>
  );
}
