'use client';

type Props = {
  value: number | '';
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  ariaLabel?: string;
  /** Whole numbers only (e.g. a headcount) — rounds and uses a numeric keyboard instead of decimal. */
  integer?: boolean;
};

// +/- numeric stepper (hourly rate, months, user counts). No equivalent
// existed in the codebase — every numeric input elsewhere is a plain
// <input type="number">.
const NumericStepper = ({
  value,
  onChange,
  min = 0,
  max = 999999,
  step = 1,
  suffix,
  ariaLabel,
  integer,
}: Props) => {
  const numeric = typeof value === 'number' ? value : 0;
  const clamp = (n: number) => {
    const bounded = Math.min(max, Math.max(min, n));
    return integer ? Math.round(bounded) : bounded;
  };

  return (
    <div className="gs-numeric-stepper">
      <input
        type="number"
        inputMode={integer ? 'numeric' : 'decimal'}
        aria-label={ariaLabel}
        value={value}
        min={min}
        max={max}
        step={integer ? Math.round(step) || 1 : step}
        onChange={(e) => {
          const parsed = e.target.value === '' ? Number.NaN : Number(e.target.value);
          onChange(Number.isFinite(parsed) ? clamp(parsed) : 0);
        }}
      />
      {suffix && <span className="gs-numeric-stepper-suffix">{suffix}</span>}
      <button type="button" aria-label="decrease" onClick={() => onChange(clamp(numeric - step))}>
        −
      </button>
      <button type="button" aria-label="increase" onClick={() => onChange(clamp(numeric + step))}>
        +
      </button>
    </div>
  );
};

export default NumericStepper;
