'use client';

type Option = { value: string; title: string; description?: string };

type Props = {
  options: Option[];
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
  cardStyle?: boolean; // renders bigger cards with title+description instead of small pills
};

// Single/multi-select pill (or card) group. No equivalent primitive existed
// in the codebase before the /project-estimator feature — Iso27001's chips
// were single-select-only and hand-rolled inline.
const ChipSelect = ({ options, value, onChange, multiple, ariaLabel, disabled, cardStyle }: Props) => {
  const toggle = (optionValue: string) => {
    if (disabled) return;
    if (multiple) {
      onChange(
        value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue],
      );
    } else {
      onChange([optionValue]);
    }
  };

  return (
    <div
      className={cardStyle ? 'gs-card-select' : 'gs-chip-row'}
      role={multiple ? 'group' : 'radiogroup'}
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const active = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={active}
            className={cardStyle ? `gs-card-option${active ? ' is-active' : ''}` : `gs-chip${active ? ' is-active' : ''}`}
            onClick={() => toggle(opt.value)}
            disabled={disabled}
          >
            {cardStyle ? (
              <>
                <span className="gs-card-option-title">{opt.title}</span>
                {opt.description && <span className="gs-card-option-desc">{opt.description}</span>}
              </>
            ) : (
              opt.title
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ChipSelect;
